"use client"

import React, { useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"

const buttonTexts = [
  "most beautiful places in the world to visit in 2024  😍", "top 10 most expensive watches  ⌚", "what is the share price of apple  🍎",
  "what is langchain  🔗", "what are hot topics in AI  ✨", "status on Israel war  💣", "top 10 most watched videos on internet  🌐"
]

export function ScrollingButtonsComponent() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (!scrollElement) return

    const scrollWidth = scrollElement.scrollWidth
    const animationDuration = scrollWidth / 70 // Adjust speed here

    const keyframes = `
      @keyframes scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-${scrollWidth / 2}px); }
      }
    `

    const styleElement = document.createElement('style')
    styleElement.innerHTML = keyframes
    document.head.appendChild(styleElement)

    scrollElement.style.animation = `scroll ${animationDuration}s linear infinite`

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  return (
    <div className="w-full overflow-hidden relative bg-black">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10" />
      <div 
        ref={scrollRef} 
        className="flex whitespace-nowrap py-4"
        style={{ width: 'fit-content' }}
      >
        {[...buttonTexts, ...buttonTexts].map((text, index) => (
          <Button 
            key={index} 
            variant="outline" 
            className="mx-2 whitespace-nowrap bg-custom-bg-1 hover:bg-custom-bg-2 border  border-borderColour1 border-opacity-30"
          >
            {text}
          </Button>
        ))}
      </div>
    </div>
  )
}