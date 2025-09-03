import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { PersonalInfo as PersonalInfoType } from '../types';

interface PersonalInfoProps {
  initialData: PersonalInfoType;
  onSubmit: (info: PersonalInfoType) => void;
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ initialData, onSubmit }) => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoType>(initialData);

  useEffect(() => {
    setPersonalInfo(initialData);
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(personalInfo);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-2">Your Information</h2>
          <p className="text-zinc-400 text-sm sm:text-base">Tell us about yourself to personalize the email</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-zinc-300 font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={personalInfo.name}
              onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={personalInfo.email}
              onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-2">Portfolio/LinkedIn URL (Optional)</label>
            <input
              type="url"
              value={personalInfo.portfolio || ''}
              onChange={(e) => setPersonalInfo({...personalInfo, portfolio: e.target.value})}
              placeholder="https://www.linkedin.com/in/yourname"
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-2">Skills & Experience Summary</label>
            <textarea
              value={personalInfo.skills}
              onChange={(e) => setPersonalInfo({...personalInfo, skills: e.target.value})}
              placeholder="Describe your relevant skills, experience, and what makes you a great fit..."
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-200 h-32 sm:h-40 resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 sm:px-6 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-purple-900/30 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <User className="w-5 h-5" />
            <span className="text-sm sm:text-base">Generate Personalized Email</span>
          </button>
        </form>
      </div>
    </div>
  );
};