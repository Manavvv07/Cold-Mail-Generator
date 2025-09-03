import React, { useState } from 'react';
import { Edit3, Save, X } from 'lucide-react';
import { JobData } from '../types';

interface JobDetailsProps {
  jobData: JobData;
  onUpdate: (data: JobData) => void;
  onNext: () => void;
}

export const JobDetails: React.FC<JobDetailsProps> = ({ jobData, onUpdate, onNext }) => {
  const [editableData, setEditableData] = useState(jobData);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdate(editableData);
    setIsEditing(false);
  };

  const addSkill = (skill: string) => {
    if (skill && !editableData.skills.includes(skill)) {
      setEditableData({
        ...editableData,
        skills: [...editableData.skills, skill]
      });
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setEditableData({
      ...editableData,
      skills: editableData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">Job Details</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-zinc-300 font-medium mb-2">Job Title</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editableData.role}
                  onChange={(e) => setEditableData({...editableData, role: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-zinc-100 focus:border-purple-500 focus:outline-none"
                />
              ) : (
                <p className="text-zinc-100 bg-black/30 px-4 py-3 rounded-lg">{editableData.role}</p>
              )}
            </div>
            
            <div>
              <label className="block text-zinc-300 font-medium mb-2">Company</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editableData.company}
                  onChange={(e) => setEditableData({...editableData, company: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-zinc-100 focus:border-purple-500 focus:outline-none"
                />
              ) : (
                <p className="text-zinc-100 bg-black/30 px-4 py-3 rounded-lg">{editableData.company}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-2">Location</label>
            {isEditing ? (
              <input
                type="text"
                value={editableData.location}
                onChange={(e) => setEditableData({...editableData, location: e.target.value})}
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-zinc-100 focus:border-purple-500 focus:outline-none"
              />
            ) : (
              <p className="text-zinc-100 bg-black/30 px-4 py-3 rounded-lg">{editableData.location}</p>
            )}
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-2">Required Skills</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {editableData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm flex items-center gap-2"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => removeSkill(skill)}
                      className="text-purple-300 hover:text-purple-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
            {isEditing && (
              <input
                type="text"
                placeholder="Add a skill and press Enter"
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-zinc-100 focus:border-purple-500 focus:outline-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addSkill(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            )}
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-2">Job Description</label>
            {isEditing ? (
              <textarea
                value={editableData.description}
                onChange={(e) => setEditableData({...editableData, description: e.target.value})}
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-zinc-100 focus:border-purple-500 focus:outline-none h-32 resize-none"
              />
            ) : (
              <div className="text-zinc-100 bg-black/30 px-4 py-3 rounded-lg whitespace-pre-wrap max-h-40 overflow-y-auto">{editableData.description}</div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 sm:px-6 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-purple-900/30 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          ) : (
            <button
              onClick={onNext}
              className="flex-1 px-4 py-3 sm:px-6 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-purple-900/30 transition-all duration-200 hover:scale-[1.02]"
            >
              Continue to Personal Info
            </button>
          )}
        </div>
      </div>
    </div>
  );
};