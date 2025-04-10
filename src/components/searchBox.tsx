import React, { useState, useEffect } from "react";
import TextareaAutosize from 'react-textarea-autosize';
import { ArrowUp } from 'lucide-react'
import { cn } from "../lib/utils";
import { useWebSocketStore } from "@/store/webSocketStore";
import { useChatStore } from "@/store/chatStore";
import asterCursor from "@/assets/AsterCursor.png"

export const SearchBox = ({
  sendMessage,
  loading,
  toggleWebSocket
}: {
  sendMessage: (message: string) => void;
  loading: boolean;
  toggleWebSocket: () => void;
}) => {
  const [message, setMessage] = useState<string>('');
  const [textareaRows, setTextareaRows] = useState(1);
  const [mode, setMode] = useState<'multi' | 'single'>('single');
  
  // Use the store hooks to get real-time values
  const chatStore = useChatStore();
  const webSocketStore = useWebSocketStore();
  
  // Track the previous loading state to detect when a message is sent
  const [prevLoading, setPrevLoading] = useState(false);
  
  useEffect(() => {
    if (textareaRows >= 2 && message && mode === 'single') {
      setMode('multi');
    } else if (!message && mode === 'multi') {
      setMode('single');
    }
  }, [textareaRows, mode, message]);
  
  // Detect when loading finishes (message was sent and processed)
  useEffect(() => {
    // If was loading but is no longer loading, it means a message was processed
    if (prevLoading && !chatStore.loading && webSocketStore.useAster) {
      // Reset useAster to false by toggling it if it's currently true
      webSocketStore.toggleWebSocket();
    }
    setPrevLoading(chatStore.loading);
  }, [chatStore.loading, prevLoading, webSocketStore]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if(message && message.trim().length > 0) {
      // Store the current useAster state before sending
      sendMessage(message);
      setMessage('');
      // Reset to single line mode and textareaRows after sending
      setMode('single');
      setTextareaRows(1);
    }
  }
  
  const handleAsterToggle = () => {
    toggleWebSocket();
  };
  
  const AsterButton = () => (
    <button
      onClick={handleAsterToggle}
      type="button"
      className={`flex items-center justify-center gap-2 px-3 py-1 rounded-[10px] transition-colors duration-200 ${
        webSocketStore.useAster ? 'bg-brand-orange text-white' : 'bg-paper-2 text-charcoal'
      }`}
    >
      {/* Replace with actual image source */}
      <img
        src={asterCursor.src}
        alt="Aster icon"
        className="w-5 h-6"
      />
      <span className="font-small">Aster</span>
    </button>
  );
  
  const SendButton = () => (
    <button
      disabled={message.trim().length === 0 || loading}
      className="bg-mudbrown text-white disabled:text-white hover:bg-card-hover-2 transition duration-100 rounded-full p-2"
    >
      <ArrowUp size={20} />
    </button>
  );
  
  return (
    <div className="fixed bottom-1 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-[70%]">
      <form
        onSubmit={(e) => {
          if (loading) return;
          e.preventDefault();
          handleSubmit(e);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !loading) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        className={cn(
          'mx-auto bg-paper dark:bg-paper p-2 overflow-hidden border border-charcoal dark:border-charcoal',
          mode === 'multi' ? 'rounded-lg' : 'rounded-xl'
        )}
      >
        <div className={cn(
          "flex",
          mode === 'multi' ? 'flex-col' : 'flex-row items-center'
        )}>
          {/* In single-line mode, show Aster button first */}
          {mode === 'single' && (
            <div className="flex-shrink-0 mr-2">
              <AsterButton />
            </div>
          )}
          
          {/* Textarea is always rendered with the same element instance */}
          <div className={cn(
            "w-full",
            mode === 'multi' ? 'order-first mb-2' : 'order-none'
          )}>
            <TextareaAutosize
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onHeightChange={(height, props) => {
                setTextareaRows(Math.ceil(height / props.rowHeight));
              }}
              className="transition bg-transparent placeholder:text-subtext placeholder:text-lg text-lg text-subtext dark:text-subtext resize-none focus:outline-none w-full px-4 max-h-24 lg:max-h-36 xl:max-h-48"
              placeholder="Ask anything"
            />
          </div>
          
          {/* In multi-line mode, show buttons row at bottom */}
          {mode === 'multi' ? (
            <div className="flex items-center w-full">
              <AsterButton />
              <div className="flex-grow"></div>
              <SendButton />
            </div>
          ) : (
            <div className="flex-shrink-0 ml-2">
              <SendButton />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}