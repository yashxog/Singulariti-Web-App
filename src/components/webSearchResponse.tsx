import React, { useState, useEffect, MutableRefObject } from "react";
import { Message } from "@/types/dataTypes";
import { cn } from "@/lib/utils";
import { Ellipsis, Layers3, Link, Plus } from "lucide-react";
import Markdown from 'markdown-to-jsx';
import { AnswerSources } from "./answerSources";
import { ImageResults } from "./imageResults";
import { VideoResults } from "./videoResults";

export const WebSearchResponse = ({
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
    const previousUserMessage = messageIndex > 0 ? history[messageIndex - 1] : null;

    useEffect(() => {
        const regex = /\[(\d+)\]/g;

        if ("sources" in message) {
            if (message.role === 'assistant' && message?.sources && message?.sources.length > 0) {
                return setParsedMessage(
                    message.content.replace(
                        regex,
                        (_, number) =>
                            `<a href="${message.sources?.[number - 1]?.metadata?.url}" target="_blank" className="bg-black dark:bg-black px-1 rounded ml-1 no-underline text-xs text-white/70 dark:text-white/70 relative">${number}</a>`,
                    ),
                );
            }
        }

        setParsedMessage(message.content);
    }, [message.content, message.sources, message.role]);

    return (
        <div className="flex flex-col space-y-4">
            <div ref={dividerRef} className="flex flex-col space-y-4 w-full">
                {/* Answers */}
                <div className="flex flex-col space-y-2 bg-paper rounded-lg p-4">
                    <div className="flex flex-row items-center space-x-2 mb-3">
                        <Ellipsis
                            className={cn(
                                'text-charcoal',
                                isLast && loading ? 'animate-pulse' : 'animate-none',
                            )}
                            size={24}
                        />
                        <h3 className="text-charcoal font-medium text-2xl">Answer</h3>
                    </div>

                    {/* ImageResults after Answer heading */}
                    {previousUserMessage && previousUserMessage.role === 'user' && (
                        <div className="pb-5">
                            <ImageResults
                                query={previousUserMessage.content}
                                chat_history={history.slice(0, messageIndex - 1)}
                            />
                        </div>
                    )}

                    {/* Response content */}
                    <Markdown
                        className={cn(
                            'prose prose-p:leading-relaxed prose-pre:p-0',
                            'prose-ul:list-disc prose-ol:list-decimal',
                            'prose-ul:pl-5 prose-ol:pl-5',
                            'max-w-none break-words text-charcoal dark:text-charcoal text-sm md:text-base font-medium'
                        )}
                    >
                        {parsedMessage}
                    </Markdown>

                    {/* Sources */}
                    {message.sources && message.sources.length > 0 && (
                        <div className="pt-9 pb-3">
                            <div className="flex flex-row items-center space-x-2 mb-3">
                                <Link className="text-charcoal" size={24} />
                                <h3 className="text-charcoal font-medium text-2xl">Sources</h3>
                            </div>
                            <AnswerSources sources={message.sources} />
                        </div>
                    )}

                    {/* VideoResults placed at the end, before suggestions */}
                    {previousUserMessage && previousUserMessage.role === 'user' && (
                        <div className="pt-9 pb-5">
                            <VideoResults
                                query={previousUserMessage.content}
                                chat_history={history.slice(0, messageIndex - 1)}
                            />
                        </div>
                    )}

                    {/* Suggestions */}
                    {isLast && message.suggestions && message.suggestions.length > 0 && !loading && (
                        <div className="mt-10 pt-10 border-t border-charccoal border-opacity-20 backdrop-blur-lg">
                            <div className="flex flex-row items-center space-x-2 mb-2">
                                <Layers3 size={24} className="text-charcoal" />
                                <h3 className="text-charcoal text-2xl font-medium">Related</h3>
                            </div>
                            <div className="flex flex-col space-y-2">
                                {message.suggestions.map((suggestion, i) => (
                                    <div
                                        key={i}
                                        onClick={() => sendMessage(suggestion)}
                                        className="cursor-pointer flex flex-row justify-between items-center bg-paper-2 hover:bg-card-hover-2 rounded-lg p-2 transition duration-200"
                                    >
                                        <p className="text-charcoal text-sm font-medium">{suggestion}</p>
                                        <Plus size={18} className="text-charcoal flex-shrink-0" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};