'use client';

import React, { useState, useEffect, useRef, Fragment } from "react";
import { Message } from "./mainPage";
import { ResultBox } from "./resultBox";
import { ResultBoxLoading } from "./resultBoxLoading";
import { SearchBox } from "./searchBox";

export const AnswerPage = ({
    loading,
    messages,
    sendMessage,
    messageAppeared,
    toggleWebSocket,
  }: {
    loading: boolean;
    messages: Message[];
    sendMessage: (message: string) => void;
    messageAppeared: boolean;
    toggleWebSocket: ()=> void;
}) => {
    const [dividerWidth, setDividerWidth] = useState(0);
    const dividerRef = useRef<HTMLDivElement | null>(null);
    const messageEnd = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const updateDividerWidth = () => {
          if (dividerRef.current) {
            setDividerWidth(dividerRef.current.scrollWidth);
          }
        };
      
        updateDividerWidth();
    
        window.addEventListener('resize', updateDividerWidth);
    
        return () => {
          window.removeEventListener('resize', updateDividerWidth);
        };
    });
    
    useEffect(() => {
        messageEnd.current?.scrollIntoView({ behavior: 'smooth' });
    
        if (messages.length === 1) {
          document.title = `${messages[0].content.substring(0, 30)} - Singulariti`;
        }
      }, [messages]);

    return (
        <div className="flex justify-center min-h-screen bg-light-primary bg-black">
          <div className="w-full max-w-full px-4">
            <div className="flex flex-col space-y-6 pt-8 pb-44 lg:pb-32">
              {messages.map((msg, i) => {
                const isLast = i === messages.length - 1;
                return (
                  <Fragment key={msg.messageId}>
                    <ResultBox
                      key={i}
                      message={msg}
                      messageIndex={i}
                      history={messages}
                      loading={loading}
                      dividerRef={isLast ? dividerRef : undefined}
                      isLast={isLast}
                      sendMessage={sendMessage}
                    />
                    {!isLast && msg.role === 'assistant' && (
                      <div className="h-px w-full bg-gray-900 dark:bg-dark-secondary" />
                    )}
                  </Fragment>
                );
              })}
              {loading && !messageAppeared && <ResultBoxLoading />}
              <div ref={messageEnd} className="h-0" />
            </div>
            {dividerWidth > 0 && (
              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-[70%]">
                <SearchBox loading={loading} sendMessage={sendMessage} toggleWebSocket={toggleWebSocket}/>
              </div>
            )}
          </div>
        </div>
      );
};