import React, { useState, useCallback } from 'react';
import { Link, Loader, ExternalLink, AlertCircle, Sparkles } from 'lucide-react';

interface URLInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export const URLInput: React.FC<URLInputProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [suggestions] = useState([
    'https://www.linkedin.com/jobs/view/senior-frontend-developer-1234567890',
    'https://jobs.lever.co/company/software-engineer',
    'https://boards.greenhouse.io/company/jobs/1234567'
  ]);

  const validateURL = useCallback((inputUrl: string): boolean => {
    try {
      const urlObj = new URL(inputUrl);
      const supportedDomains = [
        'linkedin.com',
        'indeed.com',
        'glassdoor.com',
        'lever.co',
        'greenhouse.io',
        'workday.com',
        'bamboohr.com',
        'careers.google.com',
        'jobs.apple.com',
        'amazon.jobs'
      ];
      
      const isSupported = supportedDomains.some(domain => 
        urlObj.hostname.includes(domain)
      );

      if (!isSupported) {
        setError('This job board is not yet supported. Try LinkedIn, Indeed, or company career pages.');
        return false;
      }

      setError(null);
      return true;
    } catch {
      setError('Please enter a valid URL starting with https://');
      return false;
    }
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = url.trim();
    
    if (!trimmedUrl) {
      setError('Please enter a job URL');
      return;
    }

    if (validateURL(trimmedUrl)) {
      onSubmit(trimmedUrl);
    }
  }, [url, validateURL, onSubmit]);

  const handleURLChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    
    // Clear error when user starts typing
    if (error && newUrl.trim()) {
      setError(null);
    }
  }, [error]);

  const handleSuggestionClick = useCallback((suggestedUrl: string) => {
    setUrl(suggestedUrl);
    setError(null);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full">
              <Link className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-2">
            Enter Job URL
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-md mx-auto">
            Paste the link to any job posting you're interested in. Our AI will extract all the important details.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <label htmlFor="job-url" className="block text-sm font-medium text-zinc-300">
              Job Posting URL
            </label>
            <div className="relative">
              <input
                id="job-url"
                type="url"
                value={url}
                onChange={handleURLChange}
                placeholder="https://www.linkedin.com/jobs/view/..."
                className={`
                  w-full px-4 py-3 pl-12 bg-black/50 border rounded-lg text-zinc-100 placeholder-zinc-500 
                  focus:outline-none transition-all duration-200
                  ${error 
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                    : 'border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                  }
                `}
                required
                disabled={isLoading}
                aria-describedby={error ? 'url-error' : undefined}
              />
              <ExternalLink className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
            </div>
            
            {error && (
              <div id="url-error" className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Supported Platforms */}
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Supported Job Boards
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-purple-200">
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-purple-400 rounded-full" />
                LinkedIn Jobs
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-purple-400 rounded-full" />
                Indeed
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-purple-400 rounded-full" />
                Glassdoor
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-purple-400 rounded-full" />
                Lever
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-purple-400 rounded-full" />
                Greenhouse
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-purple-400 rounded-full" />
                Company Sites
              </div>
            </div>
          </div>

          {/* Example URLs */}
          {!url && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-zinc-300">Try these examples:</h3>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left p-3 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-purple-500/50 rounded-lg transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-purple-400" />
                      <span className="text-xs text-zinc-400 group-hover:text-zinc-300 truncate">
                        {suggestion}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !url.trim() || !!error}
            className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span className="text-sm sm:text-base">Extracting Job Details...</span>
              </>
            ) : (
              <>
                <Link className="w-5 h-5" />
                <span className="text-sm sm:text-base">Extract Job Details</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};