import React, { useState, useEffect, MutableRefObject } from "react";
import { Message } from "./mainPage";
import { cn } from "@/lib/utils";
import { Ellipsis, Layers3, Link, Plus } from "lucide-react";
// import { useSpeech } from 'react-text-to-speech';
import Markdown from 'markdown-to-jsx';
import { AnswerSources } from "./answerSources";
import { ImageResults } from "./imageResults";
import { VideoResults } from "./videoResults";
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';



export const ResultBox = ({
    message,
    messageIndex,
    history,
    loading,
    dividerRef,
    isLast,
    sendMessage
}: {
    message: Message;
    messageIndex: number;
    history: Message[];
    loading: boolean;
    dividerRef?: MutableRefObject<HTMLDivElement | null>;
    isLast: boolean;
    sendMessage: (message: string) => void;
}) => {

    const [parsedMessage, setParsedMessage] = useState(message.content);
    const [speechMessage, setSpeechMessage] = useState(message.content);

    useEffect(() => {
        const regex = /\[(\d+)\]/g;

        if (message.role === 'assistant' && message?.sources && message.sources.length > 0) {
            return setParsedMessage(
                message.content.replace(
                    regex,
                    (_, number) =>
                        `<a href="${message.sources?.[number - 1]?.metadata?.url}" target="_blank" className="bg-black dark:bg-black px-1 rounded ml-1 no-underline text-xs text-white/70 dark:text-white/70 relative">${number}</a>`,
                ),
            );
        }

        setSpeechMessage(message.content.replace(regex, ''));
        setParsedMessage(message.content);
    }, [message.content, message.sources, message.role]);

    // const { speechStatus, start, stop } = useSpeech({ text: speechMessage });

        const previousUserMessage = messageIndex > 0 ? history[messageIndex - 1] : null;

        return (
            <div className="w-full flex">
              <div className="w-[60%] pr-4">

                {/* Query */}
                {message.role === 'user' && (
                  <div className={cn("w-full", messageIndex === 0 ? 'pt-12' : 'pt-4')}>
                    <h2 className="text-white text-3xl text-left">
                      {message.content}
                    </h2>
                  </div>
                )}
        
                {message.role === 'assistant' && (
                  <div className="flex flex-col space-y-4">
                    <div ref={dividerRef} className="flex flex-col space-y-4 w-full">

                    {/* Answers */}
                      <div className="flex flex-col space-y-2 bg-black rounded-lg p-4">
                        <div className="flex flex-row items-center space-x-2 mb-3">
                          <Ellipsis
                            className={cn(
                              'text-white',
                              isLast && loading ? 'animate-pulse' : 'animate-none',
                            )}
                            size={24}
                          />
                          <h3 className="text-custom-white-greay-grad font-medium text-2xl">Answer</h3>
                        </div>
                        <Markdown
                          className={cn(
                            'prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0',
                            'prose-ul:list-disc prose-ol:list-decimal',
                            'prose-ul:pl-5 prose-ol:pl-5',
                            'max-w-none break-words text-black dark:text-white text-sm md:text-base font-medium'
                          )}
                        >
                          {parsedMessage}
                        </Markdown>
                        

                        {/* Sources */}
                        {message.sources && message.sources.length > 0 && (
                        <div className="pt-9 pb-3">
                          <div className="flex flex-row items-center space-x-2 mb-3">
                            <Link className="text-white" size={24} />
                            <h3 className="text-custom-white-greay-grad font-medium text-2xl">Sources</h3>
                          </div>
                          <AnswerSources sources={message.sources} />
                        </div>
                      )}

                        {/* Suggestions */}
                        {isLast && message.suggestions && message.suggestions.length > 0 && !loading && (
                          <div className="mt-10 pt-10 border-t border-borderColour1 border-opacity-20 backdrop-blur-lg">
                            <div className="flex flex-row items-center space-x-2 mb-2">
                              <Layers3 size={24} className="text-white" />
                              <h3 className="text-white text-2xl font-medium">Related</h3>
                            </div>
                            <div className="flex flex-col space-y-2">
                              {message.suggestions.map((suggestion, i) => (
                                <div
                                  key={i}
                                  onClick={() => sendMessage(suggestion)}
                                  className="cursor-pointer flex flex-row justify-between items-center bg-custom-bg-1 hover:bg-custom-bg-2 rounded-lg p-2 transition duration-200"
                                >
                                  <p className="text-white text-sm font-medium">{suggestion}</p>
                                  <Plus size={18} className="text-[linear-gradient(to_bottom,rgba(255,255,255,1)0%,rgba(104,104,104,1)100%)] flex-shrink-0" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="w-[40%]">
              {message.role === 'assistant' && previousUserMessage && previousUserMessage.role === 'user' && (
                    <>  
                        <ImageResults
                            query={previousUserMessage.content}
                            chat_history={history.slice(0, messageIndex - 1)}
                        />
                        <VideoResults
                            query={previousUserMessage.content}
                            chat_history={history.slice(0, messageIndex - 1)}
                        />
                    </>
                )}
              </div>
            </div>
          );
}