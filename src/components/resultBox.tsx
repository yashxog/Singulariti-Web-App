import React, { MutableRefObject } from "react";
import { Message } from "@/types/dataTypes";
import { cn } from "@/lib/utils";
import { WebSearchResponse } from "./webSearchResponse";
import { AsterResponse } from "./asterResponse";



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

    // const [parsedMessage, setParsedMessage] = useState(message.content);
    // const [speechMessage, setSpeechMessage] = useState(message.content);

    // useEffect(() => {
    //     const regex = /\[(\d+)\]/g;

    //     if("sources" in message) {
    //       if (message.role === 'assistant' && message?.sources && message?.sources.length > 0) {
    //         return setParsedMessage(
    //             message.content.replace(
    //                 regex,
    //                 (_, number) =>
    //                     `<a href="${message.sources?.[number - 1]?.metadata?.url}" target="_blank" className="bg-black dark:bg-black px-1 rounded ml-1 no-underline text-xs text-white/70 dark:text-white/70 relative">${number}</a>`,
    //             ),
    //         );
    //       }
    //     }

    //     // setSpeechMessage(message.content.replace(regex, ''));
    //     setParsedMessage(message.content);
    // }, [message.content, message.sources, message.role]);

    // const { speechStatus, start, stop } = useSpeech({ text: speechMessage });

        // const previousUserMessage = messageIndex > 0 ? history[messageIndex - 1] : null;

        return (
          <div className="w-full flex flex-col items-center">
            <div className="w-[70%] mx-auto">
              {/* Query */}
              {message.role === 'user' && (
                <div className={cn("w-full", messageIndex === 0 ? 'pt-12' : 'pt-4')}>
                  <h2 className="text-charcoal text-3xl text-left">
                    {message.content}
                  </h2>
                </div>
              )}
              
              {message.role === 'assistant' &&  message.messageType === 'search' && (
                <WebSearchResponse
                  key={message.messageId}
                  message={message}
                  messageIndex={messageIndex}
                  history={history}
                  loading={loading}
                  dividerRef={dividerRef}
                  isLast={isLast}
                  sendMessage={sendMessage}
                />
              )}

              {message.role === 'assistant' &&  message.messageType === 'aster_browse' && (
                <AsterResponse message={message} dividerRef={dividerRef}/>
              )}
            </div>
          </div>
        );
}