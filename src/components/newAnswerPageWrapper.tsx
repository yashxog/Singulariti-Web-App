'use client';

import React, { useEffect, useRef } from "react";
import { NewAnswerPage } from "./newAnswerPage";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SignUp } from "./signup";
import { useWebSocketStore } from "@/store/webSocketStore";
import { useChatStore } from "@/store/chatStore";
import { createSendMessageFunction } from "@/lib/sendMessage";


export const NewAnswerPageWrapper = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const { isWsReady, hasError, toggleWebSocket } = useWebSocketStore();
  const {
    focusMode,
    isReady,
    messages,
    chatId,

    setFocusMode,
    initializeNewChat,
    setIsReady,
  } = useChatStore();


  const messagesRef = useRef(messages);

  // Update the ref when messages change
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Create the sendMessage function using our utility
  const sendMessageUtil = createSendMessageFunction(messagesRef);

  const sendMessage = async (message: string) => {
    // For new chats, initialize a new chat
    if (!chatId) {
      initializeNewChat();
    }
    
    // Call the utility function with isNewChat=true
    const newChatId = await sendMessageUtil(message, true);
    
    // Redirect to the chat page
    if (newChatId) {
      router.push(`/chat/${newChatId}?q=${encodeURIComponent(message)}`);
    }
  };

  useEffect(() => {
    if (isWsReady) {
      setIsReady(true);
    }
  }, [isWsReady, setIsReady]);

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
      {!session && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <SignUp />
        </div>
      )}
      <div className={`${!session ? 'blur-sm' : ''}`}>
        <div className="flex justify-center min-h-screen bg-paper">
          <div className="w-full max-w-screen px-4">
            <NewAnswerPage
              sendMessage={sendMessage}
              toggleWebSocket={toggleWebSocket}
              focusMode={focusMode}
              setFocusMode={setFocusMode}
              userName={session?.user?.name ?? null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewAnswerPageWrapper;