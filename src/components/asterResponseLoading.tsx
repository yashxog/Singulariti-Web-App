import React from 'react';
import { ShimmerText } from './ui/shimmerText';

export const AsterResponseLoading = () => {
  return (
    <div className="w-full">
      <div className="w-[70%] mx-auto h-[80px] bg-paper-2 rounded-lg">
            <ShimmerText className="text-lg text-charcoal font-xl p-5">
              Aster Is Thinking
            </ShimmerText>
      </div>
    </div>
  );
};
