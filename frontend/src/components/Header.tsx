import React from 'react';
import { BrainCircuit, Info, Menu } from 'lucide-react';

interface HeaderProps {
  onAboutClick: () => void;
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAboutClick, onMenuClick }) => {
  return (
    <header className="w-full bg-black/50 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-lg">
              <BrainCircuit className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">
                OutReach AI
              </h1>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Intelligent Cold Email Generator
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={onAboutClick}
              className="flex items-center gap-1 px-3 py-2 text-zinc-400 hover:text-purple-400 transition-colors text-sm rounded-lg hover:bg-white/5"
              aria-label="About OutReach AI"
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">About</span>
            </button>
            
            {onMenuClick && (
              <button 
                onClick={onMenuClick}
                className="flex items-center gap-1 px-3 py-2 text-zinc-400 hover:text-purple-400 transition-colors text-sm rounded-lg hover:bg-white/5 sm:hidden"
                aria-label="Open menu"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};