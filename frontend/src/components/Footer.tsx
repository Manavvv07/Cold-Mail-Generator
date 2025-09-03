import React from 'react';
import { Heart, Github, BookOpen, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black/30 backdrop-blur-sm border-t border-white/5 py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-100">OutReach AI</h3>
            <p className="text-sm text-zinc-400 max-w-sm">
              Empowering job seekers with AI-generated personalized cold emails that get responses and land interviews.
            </p>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <span>by <span className="text-purple-400 font-medium">Manav Singh</span></span>
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-zinc-200 uppercase tracking-wide">Resources</h4>
            <nav className="flex flex-col space-y-3">
              <a 
                href="#" 
                className="text-sm text-zinc-400 hover:text-purple-400 transition-colors flex items-center gap-2"
                aria-label="Documentation"
              >
                <BookOpen className="w-4 h-4" />
                Documentation
              </a>
              <a 
                href="#" 
                className="text-sm text-zinc-400 hover:text-purple-400 transition-colors flex items-center gap-2"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a 
                href="mailto:contact@outreachai.com" 
                className="text-sm text-zinc-400 hover:text-purple-400 transition-colors flex items-center gap-2"
                aria-label="Contact Support"
              >
                <Mail className="w-4 h-4" />
                Support
              </a>
            </nav>
          </div>

          {/* Stats/Info Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-zinc-200 uppercase tracking-wide">Impact</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-purple-900/20 rounded-lg border border-purple-500/20">
                <div className="text-lg font-bold text-purple-300">1000+</div>
                <div className="text-xs text-zinc-400">Emails Generated</div>
              </div>
              <div className="text-center p-3 bg-pink-900/20 rounded-lg border border-pink-500/20">
                <div className="text-lg font-bold text-pink-300">85%</div>
                <div className="text-xs text-zinc-400">Response Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zinc-500">
              © {currentYear} OutReach AI. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-zinc-500">
              <a href="#" className="hover:text-zinc-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-zinc-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-zinc-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};