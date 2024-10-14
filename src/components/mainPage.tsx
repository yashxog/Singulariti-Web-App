'use client';

import React, { useEffect, useState, useRef } from "react";
import { Navbar } from "./navbar";
import { AnswerPage } from "./answerPage";
import { NewAnswerPage } from "./newAnswerPage";
import crypto from "crypto";
import { toast } from "sonner";
import { Document } from "@langchain/core/documents";
import { useSearchParams } from "next/navigation";
import { getSuggestions } from "@/lib/action";
import Error from "next/error";
import { useSession } from "next-auth/react";
import { SignUp } from "./signup";

export type Message = {
    messageId: string;
    chatId: string;
    createdAt: Date;
    content: string;
    role: 'user' | 'assistant';
    suggestions?: string[];
    sources?: Document[];
  }
  
  const wsURL = process.env.WEB_SOCKET_URL || "ws://localhost:8200";
  const backendAPI = process.env.BACKEND_API_URL || "http://localhost:8200/singulariti";

  const useSocket = (url: string, setIsWsReady: (ready: boolean) => void, setError: (error: boolean) => void) => {
  const [ws,setWs] =  useState<WebSocket | null>(null);
  
    useEffect(() => {
      if(!ws) {
        const connectWs = async () => {
  
          let chatModelProvider = localStorage.getItem('chatModelProvider');
          let embeddingModelProvider = localStorage.getItem('embeddingModelProvider')
          let chatModel = localStorage.getItem('chatModel');
          let embeddingModel = localStorage.getItem('embeddingModel');
  
          if(
            !chatModelProvider ||
            !embeddingModelProvider ||
            !chatModel ||
            !embeddingModel
          ) {
            const providers = await fetch(
              `${backendAPI}/models`,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            ).then(async (res) => await res.json());
  
            const chatModelProviders = providers.chatModelProviders;
            const embeddingModelProviders = providers.embeddingModelProviders;
  
            chatModelProvider = Object.keys(providers.chatModelProviders)[0];
            chatModel = Object.keys(providers.chatModelProviders[chatModelProvider])[0];
  
            embeddingModelProvider = Object.keys(embeddingModelProviders)[0];
            embeddingModel = Object.keys(embeddingModelProviders[embeddingModelProvider])[0];
  
            localStorage.setItem('chatModel', chatModel!);
            localStorage.setItem('chatModelProvider', chatModelProvider);
            localStorage.setItem('embeddingModel', embeddingModel!);
            localStorage.setItem('embeddingModelProvider',embeddingModelProvider);
          }
  
          const wsURL = new URL(url);
          const searchParams = new URLSearchParams({});
  
          searchParams.append('chatModel', chatModel!);
          searchParams.append('chatModelProvider', chatModelProvider);
  
          if (chatModelProvider === 'custom_openai') {
            searchParams.append(
              'openAIApiKey',
              localStorage.getItem('openAIApiKey')!,
            );
            searchParams.append(
              'openAIBaseURL',
              localStorage.getItem('openAIBaseURL')!,
            );
          }
  
          searchParams.append('embeddingModel', embeddingModel);
          searchParams.append('embeddingModelProvider', embeddingModelProvider);
  
          wsURL.search = searchParams.toString();
  
          const ws = new WebSocket(wsURL.toString());
  
          const timeoutId = setTimeout(() => {
            if (ws.readyState !== 1) {
              toast.error(
                'Failed to connect to the server. Please try again later.',
              );
            }
          }, 10000);
          
          ws.onopen = () => {
            console.log('web socket connection open');
            clearTimeout(timeoutId);
            setIsWsReady(true);
          };
  
          ws.onerror = () => {
            clearTimeout(timeoutId);
            setError(true);
            toast.error('WebSocket connection error.');
          };
  
          ws.onclose = () => {
            clearTimeout(timeoutId);
            setError(true);
            console.log('web socket connection closed');
          };
  
          ws.addEventListener('message', (e) => {
            const parsedData = JSON.parse(e.data);
            if (parsedData.type === 'error') {
                toast.error(parsedData.data);
              }
            });
          
          setWs(ws);
        };
  
        connectWs();
      }
    }, [ws, url, setIsWsReady, setError]);
  
    return ws;
  }
  
  const loadMessages = async (
    chatId: string,
    setMessages: (messages: Message[]) => void,
    setIsMessagesLoaded: (loaded: boolean) => void,
    setChatHistory: (history: [string, string][]) => void,
    setFocusMode: (mode: string) => void,
    setNotFound: (notFound: boolean) => void,
  ) => {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/chats/${chatId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  
    if (res.status === 404) {
      setNotFound(true);
      setIsMessagesLoaded(true);
      return;
    }
  
    const data = await res.json();
  
    const messages = data.messages.map((msg: any) => {
      return {
        ...msg,
        ...JSON.parse(msg.metadata),
      };
    }) as Message[];
  
    setMessages(messages);
  
    const history = messages.map((msg) => {
      return [msg.role, msg.content];
    }) as [string, string][];
  
  
    console.log('[DEBUG] messages loaded');
  
    document.title = messages[0].content;
  
    setChatHistory(history);
    setFocusMode(data.chat.focusMode);
    setIsMessagesLoaded(true);
  };

  export const MainPage = ({id}: {id: string}) => {

    const searchParams = useSearchParams();
    const initialMessage = searchParams.get('q');
    const { data: session } = useSession()
  
    const [chatId, setChatId] = useState<string | undefined>(id);
    const [newChatCreated, setNewChatCreated] = useState(false);
    const [hasError, setHasError] = useState(false);
  
    const [isReady, setIsReady] = useState(false);
  
    const [isWSReady, setIsWsReady] = useState(false);
    const ws= useSocket(wsURL!, setIsWsReady, setHasError);
  
    const [chatHistory, setChatHistory] = useState<[string, string][]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
  
    const [loading, setLoading] = useState(false);
    const [messageAppeared, setMessageAppeared] = useState(false);
    const [focusMode, setFocusMode] = useState('webSearch');
  
    const [isMessagesLoaded, setIsMessagesLoaded] = useState(false);
    const [notFound, setNotFound] = useState(false);
  
  
    useEffect(() => {
      if (
         chatId &&
         !newChatCreated &&
         !isMessagesLoaded &&
         messages.length === 0
        ) {
          loadMessages(
            chatId,
            setMessages,
            setIsMessagesLoaded,
            setChatHistory,
            setFocusMode,
            setNotFound,
          );
        } else if (!chatId) {
          setNewChatCreated(true);
          setIsMessagesLoaded(true);
          setChatId(crypto.randomBytes(20).toString('hex'));
        }
        }, []);
    
    useEffect(() => {
      return () => {
        if (ws?.readyState === 1) {
          ws.close();
          console.log('[DEBUG] closed');
        }
      };
    }, []);
  
    const messagesRef = useRef<Message[]>([]);
  
    useEffect(() => {
      messagesRef.current = messages;
    }, [messages]);
  
    useEffect(() => {
      if (isMessagesLoaded && isWSReady) {
        setIsReady(true);
      }
    }, [isMessagesLoaded, isWSReady]);
  
    const sendMessage = async (message: string) => {
      if (loading) return;
      setLoading(true);
      setMessageAppeared(false);
  
      let sources: Document[] | undefined = undefined;
      let recievedMessage = '';
      let added = false;
  
      const messageId = crypto.randomBytes(7).toString('hex');
  
      ws?.send(
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
  
      setMessages((prevMessages) => [...prevMessages,
        {
          content: message,
          messageId: messageId,
          chatId: chatId!,
          role: 'user',
          createdAt: new Date(),
        },
      ]);
  
      const messageHandler = async (e: MessageEvent) => {
        const data = JSON.parse(e.data);
  
        if (data.type === "error") {
          setLoading(false);
          toast.error(data.data);
          return
        }
  
        if (data.type === 'sources') {
          sources = data.data;
          if(!added) {
            setMessages((prevMessages) => [...prevMessages,
              {
                content: '',
                messageId: data.messageId,
                chatId: chatId!,
                role: 'assistant',
                sources: sources,
                createdAt: new Date(),
              },
            ]);
            added = true;
          }
          setMessageAppeared(true);
        }
  
        if (data.type === 'message') {
          if (!added) {
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                content: data.data,
                messageId: data.messageId,
                chatId: chatId!,
                role: 'assistant',
                sources: sources,
                createdAt: new Date(),
              },
            ]);
            added = true;
          }
  
          setMessages((prev) =>
            prev.map((message) => {
              if (message.messageId === data.messageId) {
                return { ...message, content: message.content + data.data };
              }
  
              return message;
            }),
          );
  
          recievedMessage += data.data;
          setMessageAppeared(true);
      }
  
      if (data.type === 'messageEnd') {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          ['human', message],
          ['assistant', recievedMessage],
        ]);
  
        ws?.removeEventListener('message', messageHandler);
        setLoading(false);
  
        const lastMsg = messagesRef.current[messagesRef.current.length - 1];
  
        if (
          lastMsg.role === 'assistant' &&
          lastMsg.sources &&
          lastMsg.sources.length > 0 &&
          !lastMsg.suggestions
        ) {
          const suggestions = await getSuggestions(messagesRef.current);
          
          setMessages((prev) => 
            prev.map((message) => {
              if (message.messageId === lastMsg.messageId) {
                return {...message, suggestions: suggestions };
              }
              return message; 
            }),
           );
         }
       }
     };
  
      ws?.addEventListener('message', messageHandler);
    };
  
  
    // const rewrite = (messageId: string) => {
    //   const index = messages.findIndex((msg) => msg.id === messageId);
  
    //   if (index === -1) return;
  
    //   const message = messages[index - 1];
  
    //   setMessages((prev) => {
    //     return [...prev.slice(0, messages.length > 2 ? index - 1 : 0)];
    //   });
    //   setChatHistory((prev) => {
    //     return [...prev.slice(0, messages.length > 2 ? index - 1 : 0)];
    //   });
  
    //   sendMessage(message.content);
    // }
  
    useEffect(() => {
      if (isReady && initialMessage) {
        sendMessage(initialMessage);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isReady, initialMessage]);
  
    if (hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="dark:text-white/70 text-black/70 text-sm">
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
              <div className={`${!session ? 'blur-sm' : ''}`}>
                <div className="flex justify-center min-h-screen bg-light-primary bg-black">
                  <div className="w-full max-w-screen px-4">
                    {messages.length > 0 ? (
                      <>
                        <Navbar messages={messages} />
                        <AnswerPage
                          loading={loading}
                          messages={messages}
                          sendMessage={sendMessage}
                          messageAppeared={messageAppeared}
                        />
                      </>
                    ) : (
                      <NewAnswerPage
                        sendMessage={sendMessage}
                        focusMode={focusMode}
                        setFocusMode={setFocusMode}
                      />
                    )}
                  </div>
                </div>
              </div>
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
