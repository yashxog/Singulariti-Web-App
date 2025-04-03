import React, {  } from 'react';

export const ShimmerText = ({ children, className = "" }:
    {children: React.ReactNode, className?: string}
) => {
  return (
    <span 
      className={`inline-block bg-clip-text text-transparent bg-gradient-to-r from-charcoal via-brand-orange to-charcoal bg-size-200 animate-shimmer-rtl ${className}`}
    >
      {children}
      
      <style jsx>{`
        .bg-size-200 {
          background-size: 200% auto;
        }
        
        @keyframes shimmer-rtl {
          0% {
            background-position: 100% center;
          }
          100% {
            background-position: -100% center;
          }
        }
        
        .animate-shimmer-rtl {
          animation: shimmer-rtl 2s linear infinite;
        }
      `}</style>
    </span>
  );
};