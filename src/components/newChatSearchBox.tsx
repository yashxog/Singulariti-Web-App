import { ArrowUp } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
// import Focus from './messageInputActions/focus';
import { ScrollingButtonsComponent } from './scrollingButtons';

export const NewChatSearchBox = ({
  sendMessage,
  toggleWebSocket,
  // focusMode,
  // setFocusMode
}: {
  sendMessage: (message: string) => void;
  toggleWebSocket: () => void;
  // focusMode: string,
  // setFocusMode: (mode: string) => void;
}) => {
  const [message, setMessage] = useState('');
  const [isWebSocketOne, setIsWebSocketOne] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputFocused = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA' || activeElement?.hasAttribute('contenteditable');

      if (e.key === '/' && !isInputFocused) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleWebSocketToggle = () => {
    toggleWebSocket();
    setIsWebSocketOne((prev) => !prev);
  };
  
  return (
    <div className="w-full max-w-2xl">
      {/* Glow effect container */}
      <div className="relative">
        {/* Refined glow effect - just visible around the borders */}
        <div className="absolute -inset-1 bg-blur-orange blur-md rounded-3xl opacity-50 -z-10 animate-pulse"></div>
        
        {/* Subtle secondary glow for border emphasis */}
        <div 
          className="absolute -inset-0 rounded-2xl -z-5"
          style={{
            boxShadow: "0 0 8px 2px #FF9500, 0 0 12px 4px rgba(255, 149, 0, 0.4)",
          }}
        ></div>
        
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(message);
            setMessage('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage(message);
              setMessage('');
            }
          }}
          className="mx-auto bg-paper rounded-2xl shadow-lg border border-charcoal h-28 relative"
        >
          <div className="h-full p-3 flex flex-col">
            <div className="pt-2 pl-4 flex-grow overflow-auto">
              <TextareaAutosize
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                minRows={1}
                maxRows={3}
                className="w-full bg-transparent text-subtext text-lg placeholder:text-subtext resize-none focus:outline-none"
                placeholder="Search or Command Here"
              />
            </div>
            
            {/* Fixed position buttons at the bottom */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
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
                disabled={message.trim().length === 0}
                className="bg-mudbrown text-white disabled:text-white hover:bg-card-hover-2 transition duration-100 rounded-full p-2"
                type="submit"
              >
                <ArrowUp size={20} />
              </button>
            </div>
          </div>
        </form>
      </div>
      
      <div className="pt-5">
        <ScrollingButtonsComponent />
      </div>
    </div>
  );
}