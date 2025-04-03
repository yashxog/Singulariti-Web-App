import React, { MutableRefObject, useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Message } from "@/types/dataTypes";
import { useChatStore } from "@/store/chatStore";
import { ShimmerText } from "@/components/ui/shimmerText";

export const AsterResponse = ({ message, dividerRef }: { message: Message, dividerRef?: MutableRefObject<HTMLDivElement | null>; }) => {
  const chatStore = useChatStore.getState();
  const [isReasoning, setIsReasoning] = useState(true);

  // Extract latest reasoning
  const latestStepKey = message.asterResponse ? Object.keys(message.asterResponse).pop() : null;
  const latestReasoning = latestStepKey && message.asterResponse && Object.keys(message.asterResponse).length > 0
    ? message.asterResponse[latestStepKey]?.current_state?.reasoning || "Aster is analyzing"
    : "Aster is analyzing....";

  // Check if the final result is available in the action array
  const actions = latestStepKey && message.asterResponse?.[latestStepKey]?.action;
  const doneAction = Array.isArray(actions)
    ? actions.find(action => action && typeof action === 'object' && 'done' in action)
    : null;

  const isDone = !!doneAction?.done;

  // Safely extract text with proper type checking
  const finalResultText = isDone &&
    typeof doneAction.done === 'object' &&
    doneAction.done !== null &&
    'text' in doneAction.done ?
    String(doneAction.done.text) : "";

  useEffect(() => {
    // Update isReasoning based on isDone instead of loading state
    if (isDone) {
      setIsReasoning(false);
    } else {
      setIsReasoning(true);
    }
  }, [isDone]);

  return (
    <div className="flex flex-col space-y-4">
      <div ref={dividerRef} className="flex flex-col space-y-4 w-full">
        {/* Big Box - iFrame for Streaming */}
        <div className="w-full h-[400px] border rounded-lg shadow-lg overflow-hidden">
          <iframe
            src={message.browserUrl || "about:blank"} // Default if no browser URL
            className="w-full h-full border-none"
            allowFullScreen
          ></iframe>
        </div>

        {/* Small Box - Reasoning Text */}
        <div className="w-full bg-paper-2 rounded-lg p-4 shadow flex flex-col items-start">
          {isReasoning ? (
            <ShimmerText className="font-bold mb-2">Reasoning</ShimmerText>
          ) : (
            <h4 className="font-bold mb-2 text-charcoal">Reasoning</h4>
          )}
          <p className="text-charcoal font-medium text-left">{latestReasoning}</p>
        </div>

        {/* Final Result Section - Only shows when done */}
        {isDone && (
          <div className="w-full rounded-lg flex flex-col items-start">
            <h3 className="text-charcoal font-medium text-2xl mb-4">Answer</h3>
            <p className="text-charcoal font-medium text-left">{finalResultText}</p>
          </div>
        )}
      </div>
    </div>
  );
};