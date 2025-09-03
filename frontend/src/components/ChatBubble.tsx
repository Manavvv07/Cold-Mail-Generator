import React, { useState, useEffect } from 'react';
import { Bot, MessageCircle } from 'lucide-react';

interface ChatBubbleProps {
  onClick: () => void;
  hasNewMessage?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ onClick, hasNewMessage = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);

  useEffect(() => {
    // Stop pulsing after 10 seconds
    const timer = setTimeout(() => {
      setIsPulsing(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          group relative w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 
          text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center z-50 
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
          ${isHovered ? 'scale-110 shadow-xl' : 'hover:scale-105'}
          ${isPulsing ? 'animate-pulse' : ''}
        `}
        aria-label="Open AI Assistant Chat"
        aria-expanded="false"
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
        
        {/* Icon */}
        <div className="relative z-10">
          {isHovered ? (
            <MessageCircle className="w-6 h-6 transition-transform duration-200" />
          ) : (
            <Bot className="w-6 h-6 transition-transform duration-200" />
          )}
        </div>

        {/* Notification dot */}
        {hasNewMessage && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-bounce">
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping" />
          </div>
        )}

        {/* Ripple effect on click */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150" />
      </button>

      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-zinc-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap transform transition-all duration-200 opacity-0 animate-fade-in">
          <div className="relative">
            Chat with AI Assistant
            {/* Tooltip arrow */}
            <div className="absolute top-full right-4 border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-900" />
          </div>
        </div>
      )}
    </div>
  );
};