import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bot, ChevronDown, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message, ChatbotProps } from '../types';

export const EnhancedChatbot: React.FC<ChatbotProps> = ({ 
  isOpen, 
  onClose, 
  currentStep, 
  jobData,
  personalInfo 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Escape key closes chatbot
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Initialize with context-aware welcome message (only once)
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const stepMessages: Record<number, { content: string; suggestions?: string[] }> = {
        1: {
          content: "👋 Welcome to OutReach AI!\n\nPaste a job URL to get started. I work best with pages from LinkedIn, Indeed, and company career sites.\n\n💡 Pro Tip: Make sure the URL is complete and accessible!",
          suggestions: ["What makes a good job URL?", "How do I find the right job?", "Show me an example"]
        },
        2: {
          content: "✅ I've extracted the job details.\n\nReview them carefully and edit if needed. The AI isn't perfect, so double-check the skills and requirements.",
          suggestions: ["How do I edit job details?", "What should I look for in requirements?", "Next step please"]
        },
        3: {
          content: "Now tell me about yourself! 🎯\n\nThe more specific you are about your skills and experience, the better I can personalize your email.",
          suggestions: ["How do I describe my skills?", "What experience is most relevant?", "Help me craft my summary"]
        },
        4: {
          content: "✉️ Your email is ready!\n\nDon’t forget to personalize it further to match your unique voice.",
          suggestions: ["How do I improve the subject?", "What makes a good email body?", "How do I send this?"]
        },
      };

      const initialMessage = stepMessages[currentStep] || {
        content: "Hi there! I'm your AI assistant 🤖. Let's create the perfect cold email together.",
        suggestions: ["Help me write an email", "Improve my job application", "Tips for job searching"]
      };

      const welcomeMessage: Message = {
        id: Date.now(),
        role: 'ai',
        content: initialMessage.content,
        timestamp: new Date(),
        suggestions: initialMessage.suggestions
      };

      setMessages([welcomeMessage]);
    }
  }, [isOpen, currentStep, messages.length]);

  // AI response system
  const generateResponse = useCallback((userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();

    if (currentStep === 1) {
      if (lowerMsg.includes('linkedin') || lowerMsg.includes('indeed') || lowerMsg.includes('career')) {
        return "🔗 I work best with job postings from LinkedIn, Indeed, and company career sites.\n\nLook for URLs that end with:\n- linkedin.com/jobs/view/\n- indeed.com/viewjob?\n- company.com/careers/";
      }
      if (lowerMsg.includes('url') || lowerMsg.includes('link') || lowerMsg.includes('paste')) {
        return "Just paste the full job posting URL here.\n\nExample:\nhttps://www.linkedin.com/jobs/view/senior-frontend-developer-1234567890";
      }
      if (lowerMsg.includes('example')) {
        return "Here’s a sample good job URL:\n\nhttps://www.linkedin.com/jobs/view/senior-frontend-developer-at-techcorp-inc-1234567890\n\nMake sure it’s a direct job posting, not a search page.";
      }
    }

    if (currentStep === 2) {
      if (lowerMsg.includes('edit') || lowerMsg.includes('change')) {
        return "✏️ Use the 'Edit' button to update job details. Key things to verify:\n- Job title\n- Skills\n- Company info\n- Location";
      }
      if (lowerMsg.includes('skill') || lowerMsg.includes('requirement')) {
        return "Review the extracted skills and requirements carefully. Add any that weren’t auto-detected!";
      }
      if (lowerMsg.includes('next')) {
        return "Click **Continue to Personal Info** when ready.";
      }
    }

    if (currentStep === 3) {
      if (lowerMsg.includes('skill') || lowerMsg.includes('experience')) {
        return "When describing your skills, be specific:\n- Mention projects\n- Technologies\n- Achievements\n- Quantifiable results";
      }
      if (lowerMsg.includes('help') || lowerMsg.includes('summary')) {
        return "Template for your summary:\n\n> As a [Your Role] with [X] years of experience, I specialize in [Key Skills]. At [Company], I [Achievement] which resulted in [Result]. I'm excited about [Company] because [Reason].";
      }
    }

    if (currentStep === 4) {
      if (lowerMsg.includes('subject')) {
        return "🎯 A good subject line is short, relevant, and personalized.\n\nExamples:\n- *Experienced Frontend Dev Interested in [Company]*\n- *React Specialist | Perfect Fit for [Role]*";
      }
      if (lowerMsg.includes('email') || lowerMsg.includes('body')) {
        return "An effective email should:\n1. Open with a personalized hook\n2. Show your value in 2-3 sentences\n3. Close with a clear call-to-action";
      }
      if (lowerMsg.includes('send')) {
        return "📧 Steps to send:\n1. Copy your email\n2. Paste into your email client\n3. Address to hiring manager\n4. Send during **business hours** for better response rates.";
      }
    }

    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      return "Hey there! 👋 How can I help you today?";
    }

    if (lowerMsg.includes('thank')) {
      return "You're welcome! 🙌 Anything else you’d like help with?";
    }

    if (lowerMsg.includes('tip') || lowerMsg.includes('advice')) {
      return "💡 Tips:\n- Research the company\n- Tailor your message\n- Highlight achievements\n- Stay professional yet friendly\n- Follow up if needed";
    }

    return "I'm here to help you create the perfect cold email. What would you like to work on?";
  }, [currentStep]);

  const sendMessage = useCallback((messageText?: string) => {
    const text = messageText ?? inputValue;
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const response = generateResponse(text);
    const delay = Math.min(2000, response.length * 30);

    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        role: 'ai',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, delay);
  }, [inputValue, generateResponse]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    sendMessage(suggestion);
  }, [sendMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 sm:right-6 w-full max-w-sm h-[500px] bg-zinc-900/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden animate-float-up">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-purple-900/30 to-pink-900/30">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-zinc-100 font-semibold">AI Assistant</h3>
            <p className="text-xs text-zinc-400">Online • Ready to help</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-200 transition-colors p-1 rounded-full hover:bg-white/10 focus-ring"
          aria-label="Close chat"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-zinc-900/50 to-zinc-900/20">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[90%] p-3 rounded-2xl transition-all duration-300 ${
              message.role === 'ai'
                ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/10 text-purple-100 mr-auto rounded-tl-none'
                : 'bg-gradient-to-br from-pink-600/20 to-purple-600/10 text-pink-100 ml-auto rounded-tr-none'
            }`}
          >
            <div className="flex items-start gap-2">
              {message.role === 'ai' && (
                <div className="mt-0.5 p-1 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full">
                  <Bot className="w-3 h-3 text-white" />
                </div>
              )}
              <div className="text-sm whitespace-pre-line prose prose-invert">
                  <ReactMarkdown>
                    {message.content}
                  </ReactMarkdown>
              </div>
            </div>
            <div className={`text-xs mt-1 ${message.role === 'ai' ? 'text-purple-300/70' : 'text-pink-300/70'} text-right`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            
            {/* Suggestions */}
            {message.suggestions && message.role === 'ai' && (
              <div className="mt-3 flex flex-wrap gap-2">
                {message.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 text-purple-200 rounded-full transition-colors focus-ring"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="max-w-[90%] p-3 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/10 text-purple-100 mr-auto rounded-tl-none">
            <div className="flex items-center gap-2">
              <div className="mt-0.5 p-1 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="flex space-x-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-200">.</span>
                <span className="animate-bounce delay-400">.</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-zinc-900/80">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-zinc-100 text-sm placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
            aria-label="Type your message"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!inputValue.trim()}
            className="px-3 py-2 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-500 text-white rounded-lg transition-all duration-200 flex items-center justify-center focus-ring"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-zinc-500 text-center mt-2">Press Enter to send • Esc to close</p>
      </div>
    </div>
  );
};
