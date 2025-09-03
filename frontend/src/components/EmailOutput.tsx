import React, { useState, useEffect } from 'react';
import { Copy, Download, RefreshCw, Loader } from 'lucide-react';
import { GeneratedEmail } from '../types';

interface EmailOutputProps {
  generatedEmail: GeneratedEmail;
  onUpdate: (email: GeneratedEmail) => void;
  onRestart: () => void;
  isLoading: boolean;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export const EmailOutput: React.FC<EmailOutputProps> = ({ 
  generatedEmail, 
  onUpdate, 
  onRestart, 
  isLoading,
  showToast
}) => {
  const [editableEmail, setEditableEmail] = useState(generatedEmail);

  useEffect(() => {
    setEditableEmail(generatedEmail);
  }, [generatedEmail]);

  const copyToClipboard = async () => {
    const fullEmail = `Subject: ${editableEmail.subject}\n\n${editableEmail.content}`;
    await navigator.clipboard.writeText(fullEmail);
    showToast('Email copied to clipboard!');
  };

  const downloadTxt = () => {
    const fullEmail = `Subject: ${editableEmail.subject}\n\n${editableEmail.content}`;
    const blob = new Blob([fullEmail], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cold-email.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Email downloaded!');
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-xl p-8 sm:p-12 shadow-xl text-center hover:shadow-2xl transition-all duration-300">
          <Loader className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-2">Generating Your Email</h2>
          <p className="text-zinc-400">AI is crafting a personalized cold email for you...</p>
          <div className="mt-6 w-full bg-zinc-800 rounded-full h-2.5">
            <div className="bg-purple-600 h-2.5 rounded-full w-3/4 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-2">Your Personalized Email</h2>
          <p className="text-zinc-400 text-sm sm:text-base">Review and customize your cold email before sending</p>
          {generatedEmail.confidence_score && (
            <div className="mt-2 inline-flex items-center px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm">
              Confidence: {(generatedEmail.confidence_score * 100).toFixed(0)}%
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-zinc-300 font-medium mb-2">Subject Line</label>
            <input
              type="text"
              value={editableEmail.subject}
              onChange={(e) => {
                const updated = {...editableEmail, subject: e.target.value};
                setEditableEmail(updated);
                onUpdate(updated);
              }}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-zinc-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-2">Email Content</label>
            <textarea
              value={editableEmail.content}
              onChange={(e) => {
                const updated = {...editableEmail, content: e.target.value};
                setEditableEmail(updated);
                onUpdate(updated);
              }}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-zinc-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-200 h-64 sm:h-80 resize-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <button
            onClick={copyToClipboard}
            className="px-4 py-3 sm:px-6 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-purple-900/30 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <Copy className="w-5 h-5" />
            <span className="text-sm sm:text-base">Copy</span>
          </button>
          
          <button
            onClick={downloadTxt}
            className="px-4 py-3 sm:px-6 sm:py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg shadow-lg shadow-pink-900/30 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <Download className="w-5 h-5" />
            <span className="text-sm sm:text-base">Download</span>
          </button>
          
          <button
            onClick={onRestart}
            className="px-4 py-3 sm:px-6 sm:py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <RefreshCw className="w-5 h-5" />
            <span className="text-sm sm:text-base">Start Over</span>
          </button>
        </div>
      </div>
    </div>
  );
};