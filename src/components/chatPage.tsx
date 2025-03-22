'use client';

import React, { useEffect, useRef } from "react";
import { Navbar } from "./navbar";
import { AnswerPage } from "./answerPage";
import { useRouter, useSearchParams } from "next/navigation";
import { Document } from "@langchain/core/documents";
import Error from "next/error";
import { useSession } from "next-auth/react";
import { SignUp } from "./signup";
import { RateLimitReachedComponent } from "./rateLimitReached";
import { useWebSocketStore } from "@/store/webSocketStore";
import { useChatStore } from "@/store/chatStore";
import { Message } from "@/types/dataTypes";
import { createSendMessageFunction } from "@/lib/sendMessage";

// this is just to skip error of type until we dont add chats API
type Msg = {
  messageId: string;
  content: string;
  metaData: {
    sources: Document[]
  }
}

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


export const ChatPage = ({ chatId }: { chatId: string }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    isReady,
    isLimit,
    timeLeft,
    messages,
    loading,
    messageAppeared,
    isMessagesLoaded,
    notFound,
    waitingForFirstResponse,

    setIsReady,
  } = useChatStore();

  const chatStore = useChatStore.getState();

  const { isWsReady, hasError, useAster, ws, asterWs, toggleWebSocket } = useWebSocketStore();
  const messagesRef = useRef(messages);

  const sendMessage = createSendMessageFunction(messagesRef);

  useEffect(() => {
    const loadChat = async () => {
      
      // Only load from DB if it's not a new chat
      if (chatId && !chatStore.newChatCreated && !chatStore.isMessagesLoaded && messages.length === 0) {
        try {
          chatStore.setIsMessagesLoaded(false);
          await loadMessages(chatId);
          chatStore.setChatId(chatId);
        } catch (error) {
          console.error("Chat load error:", error);
          chatStore.setNotFound(true);
          router.replace('/');
        }
      } else if (chatId) {
        // For new chats, just set mark as ready
        chatStore.setIsMessagesLoaded(true);
      }
    };
  
    loadChat();
  
    return () => {
      // Only reset if it's not a new chat
      if (!chatStore.newChatCreated) {
        chatStore.resetChat();
      }
    };
  }, []);

  // Add this useEffect to handle new chat completion
  useEffect(() => {
    if (chatStore.newChatCreated && chatId && messages.length>1) {
      // Mark chat as no longer new after first load
      chatStore.setNewChatCreated(false);
    }
  }, [chatId]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (isMessagesLoaded && isWsReady) {
      setIsReady(true);
    }
  }, [isMessagesLoaded, isWsReady]);

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="dark:text-charcoal text-charcoal text-sm">
          Failed to connect to the server. Please try again later.
        </p>
      </div>
    );
  }

  if (!isReady) {
    return (
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
    );
  }

  return (
    <div className="relative">
      {notFound ? (
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
                  {(messages.length > 0 || waitingForFirstResponse || chatStore.newChatCreated) ? ( //Latest
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
                    <div className="flex items-center justify-center h-screen">
                      <p>No messages found. Redirecting...</p>
                    </div>
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
      )}
    </div>
  );
};