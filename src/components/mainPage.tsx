'use client';

import React, { useEffect, useState, useRef } from "react";
import { Navbar } from "./navbar";
import { AnswerPage } from "./answerPage";
import { NewAnswerPage } from "./newAnswerPage";
import crypto from "crypto";
import { toast } from "sonner";
import { Document } from "@langchain/core/documents";
import { useSearchParams, useRouter } from "next/navigation";
import { getSuggestions } from "@/lib/action";
import Error from "next/error";
import { useSession } from "next-auth/react";
import { SignUp } from "./signup";
import { RateLimitReachedComponent } from "./rateLimitReached"
import { useWebSocketStore } from "@/store/webSocketStore";
import { useChatStore } from "@/store/chatStore";
import { Message, Session } from "@/types/dataTypes";

// this is just to skip error of type until we dont add chats API
type Msg = {
  messageId: string;
  content: string;
  metaData: {
    sources: Document[]
  }
}

// const wsURL = process.env.NEXT_PUBLIC_WEB_SOCKET_URL;
// const wsBrowseURL = process.env.NEXT_PUBLIC_ASTER_BROWSE_URL;
// const backendAPI = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const loadMessages = async (chatId: string) => {
  const chatStore = useChatStore.getState();

  chatStore.setIsMessagesLoaded(false);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/chats/${chatId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  if (res.status === 404) {
    chatStore.setNotFound(true);
    chatStore.setIsMessagesLoaded(true);
    return;
  }

  const data = await res.json();

  const messages = data.messages.map((msg: Msg) => {
    if (msg.metaData) {
    }
    return {
      ...msg,
      ...(typeof msg.metaData === 'string' ? JSON.parse(msg.metaData) : msg.metaData),
    };
  }) as Message[];

  useChatStore.setState({
    messages,
    chatHistory: messages.map(msg => [msg.role, msg.content]),
    focusMode: data.chat?.focusMode || 'webSearch',
    chatId,
    isMessagesLoaded: true,
    notFound: false
  });

  const history = messages.map((msg) => {
    return [msg.role, msg.content];
  }) as [string, string][];


  console.log('[DEBUG] messages loaded');

  document.title = messages[0].content;

  chatStore.setChatHistory(history);
  chatStore.setFocusMode(data.chat.focusMode);
  chatStore.setIsMessagesLoaded(true);
};


export const MainPage = ({ id }: { id?: string }) => {

  const chatStore = useChatStore()
  const {
    chatId,
    isReady,
    isLimit,
    timeLeft,
    chatHistory,
    messages,
    loading,
    messageAppeared,
    focusMode,
    isMessagesLoaded,
    notFound,

    setChatId,
    setIsLimit,
    setTimeLeft,
    setLoading,
    setMessageAppeared,
    setFocusMode,
    setNotFound,
    appendMessage,
    updateMessageContent,
    addToChatHistory,
    updateMessageSuggestions,
    setIsReady,
    resetChat,
    initializeNewChat
  } = useChatStore();

  const { isWsReady, hasError, useAster, ws, asterWs, toggleWebSocket } = useWebSocketStore();

  const searchParams = useSearchParams();
  const router = useRouter();
  const initialMessage = searchParams.get('q');
  const { data: session } = useSession();
  const messagesRef = useRef(messages);

  // Handle Chat Initialization
  useEffect(() => {
    const loadChat = async () => {
      if (id) {
        if (id !== chatId) {
          resetChat();
          //## resetError();
          try {
            await loadMessages(id);
            setChatId(id);
          } catch (error) {
            setNotFound(true);
            router.replace('/');
          }
        }
      } else {
        initializeNewChat();
      }
    };

    loadChat()

    return () => {
      resetChat()
    }
  }, [id]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (isMessagesLoaded && isWsReady) {
      setIsReady(true);
    }
  }, [isMessagesLoaded, isWsReady]);


  const sendMessage = async (message: string) => {
    if (loading) return;
    setLoading(true);
    setMessageAppeared(false);

    let sources: Document[] | undefined = undefined;
    let recievedMessage = '';
    let added = false;

    const messageId = crypto.randomBytes(7).toString('hex');

    const selectedWs = useAster ? asterWs : ws;

    if (!selectedWs || selectedWs.readyState !== WebSocket.OPEN) {
      toast.error("Connection not ready");
      setLoading(false);
      return;
    }

    if (useAster) {
      selectedWs?.send(
        JSON.stringify({
          type: 'aster_browse',
          message: {
            chatId: chatId,
            content: message,
          },
        }
        ))
    } else {
      (await selectedWs)?.send(
        JSON.stringify({
          type: 'message',
          message: {
            chatId: chatId,
            content: message,
          },
          focusMode: focusMode,
          history: [...chatHistory, ['human', message]],
        }),
      );
    };

    appendMessage({
      content: message,
      messageId: messageId,
      chatId: chatId!,
      role: 'user',
      createdAt: new Date(),
    });

    const messageHandler = async (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      if (data.type === "error") {
        setLoading(false);
        toast.error(data.data);
        return
      }

      if (data.type === "rateLimit") {
        setLoading(false);
        setIsLimit(false);
        setTimeLeft(data.resetAfter);
        return
      }

      if (data.type === 'sources') {
        sources = data.data;
        if (!added) {
          appendMessage({
            content: '',
            messageId: data.messageId,
            chatId: chatId!,
            role: 'assistant',
            sources: sources,
            createdAt: new Date(),
          });
          added = true;
        }
        setMessageAppeared(true);
      }

      if (data.type === 'message') {
        if (!added) {
          appendMessage({
            content: data.data,
            messageId: data.messageId,
            chatId: chatId!,
            role: 'assistant',
            sources: sources,
            createdAt: new Date(),
          });
          added = true;
        }

        updateMessageContent(data.messageId, data.data);

        recievedMessage += data.data;
        setMessageAppeared(true);
      }

      if (data.type === 'messageEnd') {
        addToChatHistory(message, recievedMessage);

        (await selectedWs)?.removeEventListener('message', messageHandler);
        setLoading(false);

        const lastMsg = messagesRef.current[messagesRef.current.length - 1];

        if (
          lastMsg.role === 'assistant' &&
          lastMsg.sources &&
          lastMsg.sources.length > 0 &&
          !lastMsg.suggestions
        ) {
          const suggestions = await getSuggestions(messagesRef.current);

          updateMessageSuggestions(lastMsg.messageId, suggestions);
        }
      }
    };

    (await selectedWs)?.addEventListener('message', messageHandler);
  };

  useEffect(() => {
    if (isReady && initialMessage) {
      sendMessage(initialMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, initialMessage]);

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="dark:text-charcoal text-charcoal text-sm">
          Failed to connect to the server. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {isReady ? (
        notFound ? (
          <Error statusCode={404} />
        ) : (
          <div className="relative">
            {!session && (
              <div className="absolute inset-0 flex items-center justify-center z-50">
                <SignUp />
              </div>
            )}
            {isLimit ? (
              <div className={`${!session ? 'blur-sm' : ''}`}>
                <div className="flex justify-center min-h-screen bg-paper">
                  <div className="w-full max-w-screen px-4">
                    {messages.length > 0 ? (
                      <>
                        <Navbar messages={messages} />
                        <AnswerPage
                          loading={loading}
                          messages={messages}
                          sendMessage={sendMessage}
                          messageAppeared={messageAppeared}
                          toggleWebSocket={toggleWebSocket}
                        />
                      </>
                    ) : (
                      <NewAnswerPage
                        sendMessage={sendMessage}
                        toggleWebSocket={toggleWebSocket}
                        focusMode={focusMode}
                        setFocusMode={setFocusMode}
                        userName={session?.user?.name ?? null}
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <RateLimitReachedComponent
                timeLeft={timeLeft}
              />
            )}

          </div>
        )
      ) : (
        <div className="flex flex-row items-center justify-center min-h-screen">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-light-200 fill-light-secondary dark:text-[#202020] animate-spin dark:fill-[#ffffff3b]"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

export default MainPage;
