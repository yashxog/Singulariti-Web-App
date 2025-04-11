import { ArrowUp } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { ScrollingButtonsComponent } from './scrollingButtons';
import asterCursor from '../assets/aster_cursor.png'

export const NewChatSearchBox = ({
  sendMessage,
  toggleWebSocket,
}: {
  sendMessage: (message: string) => void;
  toggleWebSocket: () => void;
}) => {
  const [message, setMessage] = useState('');
  const [isAsterActive, setIsAsterActive] = useState(false);
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

  const handleAsterToggle = () => {
    toggleWebSocket();
    setIsAsterActive((prev) => !prev);
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
          className="mx-auto bg-paper rounded-2xl shadow-lg border border-charcoal relative"
        >
          <div className="flex flex-col">
            {/* Text area with padding to make space for buttons below */}
            <div className="p-3 pb-16">
              <TextareaAutosize
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                minRows={1}
                maxRows={5}
                className="w-full bg-transparent text-subtext text-lg placeholder:text-subtext resize-none focus:outline-none"
                placeholder="Search or Command Here"
              />
            </div>

            {/* Fixed button area at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-paper py-3 px-3 flex items-center justify-between rounded-b-2xl">
              {/* Aster button on the left */}
              <button
                onClick={handleAsterToggle}
                type="button"
                className={`flex items-center justify-center gap-2 px-3 py-1 rounded-[10px] transition-colors duration-200 ${
                  isAsterActive ? 'bg-brand-orange text-white' : 'bg-paper-2 text-charcoal'
                }`}
              >
                <img
                  src={asterCursor.src}
                  alt="Aster icon"
                  className="w-5 h-6"
                />
                <span className="font-small">Aster</span>
              </button>

              {/* Arrow button on the right */}
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