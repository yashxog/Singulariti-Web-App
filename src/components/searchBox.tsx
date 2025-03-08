import React, { useState, useEffect } from "react";
import TextareaAutosize from 'react-textarea-autosize';
import { ArrowUp } from 'lucide-react'
import { cn } from "../lib/utils";


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
    const [isWebSocketOne, setIsWebSocketOne] = useState(true);
    const [mode, setMode] = useState<'multi' | 'single'>('single');

    useEffect(() => {
      if (textareaRows >= 2 && message && mode === 'single') {
        setMode('multi');
      } else if (!message && mode === 'multi') {
        setMode('single');
      }
    }, [textareaRows, mode, message]);



    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if(message && message.trim().length > 0) {
        sendMessage(message);
        setMessage('');
      }
    }

    const handleWebSocketToggle = () => {
      toggleWebSocket();
      setIsWebSocketOne((prev) => !prev);
    };

    return (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-[70%]">
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
              'bg-black dark:bg-black p-2 flex items-center overflow-hidden border border-borderColour1 dark:border-borderColour1',
              mode === 'multi' ? 'flex-col rounded-lg' : 'flex-row rounded-full'
            )}
          >
            <TextareaAutosize
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onHeightChange={(height, props) => {
                setTextareaRows(Math.ceil(height / props.rowHeight));
              }}
              className="transition bg-transparent placeholder:text-white placeholder:text-lg text-lg text-white dark:text-white resize-none focus:outline-none w-full px-4 max-h-24 lg:max-h-36 xl:max-h-48 flex-grow flex-shrink"
              placeholder="Ask anything"
            />
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!isWebSocketOne}
                onChange={handleWebSocketToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[linear-gradient(to_bottom,rgba(84,84,84,0.25)0%,rgba(186,186,186,0.25)100%)] peer-focus:ring-4 peer-focus:ring-white rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/20"></div>
            </label>
            <button
              disabled={message.trim().length === 0 || loading}
              className="bg-[linear-gradient(to_bottom,rgba(84,84,84,0.25)0%,rgba(186,186,186,0.25)100%)] text-white disabled:text-white hover:bg-white/20 transition duration-100 rounded-full p-2"
            >
              <ArrowUp size={20} />
            </button>
          </form>
        </div>
      );
}