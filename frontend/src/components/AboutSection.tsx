import React from 'react';
import { X, Zap, Target, Shield, Lightbulb, Users, Sparkles } from 'lucide-react';

interface AboutSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered',
      description: 'Advanced language models analyze job postings and create personalized emails that match your experience.'
    },
    {
      icon: Target,
      title: 'Highly Targeted',
      description: 'Each email is customized to the specific role, company, and requirements you\'re applying for.'
    },
    {
      icon: Shield,
      title: 'Privacy Focused',
      description: 'Your personal information stays secure and is never shared with third parties.'
    },
    {
      icon: Lightbulb,
      title: 'Smart Suggestions',
      description: 'Get intelligent recommendations to improve your emails and increase response rates.'
    },
    {
      icon: Users,
      title: 'Recruiter Approved',
      description: 'Email formats and structures tested by hiring managers and recruiters.'
    },
    {
      icon: Sparkles,
      title: 'Multiple Styles',
      description: 'Choose from formal, casual, or creative email tones to match company culture.'
    }
  ];

  const steps = [
    'Paste the URL of any job posting from supported platforms',
    'Review and edit the automatically extracted job details', 
    'Provide your personal information and relevant experience',
    'Generate a personalized, professional cold email in seconds',
    'Copy, download, or further customize before sending'
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900/95 border border-white/10 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-md border-b border-white/10 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-zinc-100">About OutReach AI</h2>
            <button 
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close about section"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Introduction */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
              OutReach AI is an intelligent cold email generator that helps job seekers create personalized, 
              professional emails that stand out to hiring managers and increase interview opportunities.
            </p>
          </div>

          {/* Features Grid */}
          <div>
            <h3 className="text-xl font-semibold text-zinc-100 mb-6 text-center">Why Choose OutReach AI?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index}
                    className="p-4 bg-zinc-800/50 rounded-lg border border-white/5 hover:border-purple-500/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-600/20 rounded-lg">
                        <Icon className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-zinc-200 mb-2">{feature.title}</h4>
                        <p className="text-sm text-zinc-400">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How it works */}
          <div>
            <h3 className="text-xl font-semibold text-zinc-100 mb-6 text-center">How It Works</h3>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-zinc-300 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-purple-300 mb-4 text-center">Our Impact</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-300">1000+</div>
                <div className="text-sm text-zinc-400">Emails Generated</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-300">85%</div>
                <div className="text-sm text-zinc-400">Average Response Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-300">500+</div>
                <div className="text-sm text-zinc-400">Happy Users</div>
              </div>
            </div>
          </div>

          {/* Creator */}
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold text-zinc-100">Created By</h3>
            <div className="inline-block p-6 bg-zinc-800/50 rounded-lg border border-white/5">
              <p className="text-zinc-300 mb-2">
                Developed by <span className="text-purple-400 font-semibold">Manav Singh</span>
              </p>
              <p className="text-sm text-zinc-400 max-w-md">
                A passionate developer who understands the challenges of job searching and created this tool 
                to help job seekers improve their outreach efforts and increase their chances of landing interviews.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
            >
              Start Creating Your Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};