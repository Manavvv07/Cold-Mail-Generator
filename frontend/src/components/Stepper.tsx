import React from 'react';
import { Link, Edit3, User, Mail, CheckCircle } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  totalSteps?: number;
}

interface Step {
  id: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, totalSteps = 4 }) => {
  const steps: Step[] = [
    { 
      id: 1, 
      label: 'URL', 
      icon: Link, 
      description: 'Enter job posting URL' 
    },
    { 
      id: 2, 
      label: 'Job Details', 
      icon: Edit3, 
      description: 'Review extracted details' 
    },
    { 
      id: 3, 
      label: 'Your Info', 
      icon: User, 
      description: 'Personal information' 
    },
    { 
      id: 4, 
      label: 'Generate Email', 
      icon: Mail, 
      description: 'AI-generated cold email' 
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 px-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isAccessible = currentStep >= step.id;
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center min-w-0 flex-1">
                {/* Step Circle */}
                <div
                  className={`
                    relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 group
                    ${isActive 
                      ? 'bg-purple-600 border-purple-600 shadow-lg shadow-purple-900/30 scale-110' 
                      : isCompleted 
                        ? 'bg-green-600 border-green-600 shadow-lg shadow-green-900/20' 
                        : isAccessible
                          ? 'bg-zinc-700 border-zinc-600 hover:border-purple-500'
                          : 'bg-zinc-800 border-zinc-700'
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  ) : (
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive || isAccessible ? 'text-white' : 'text-zinc-500'}`} />
                  )}
                  
                  {/* Pulse animation for active step */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-purple-600 animate-ping opacity-20" />
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-2 sm:mt-3 text-center min-h-0">
                  <span className={`text-xs sm:text-sm font-medium block ${
                    isActive ? 'text-purple-400' : isCompleted ? 'text-green-400' : 'text-zinc-500'
                  }`}>
                    {step.label}
                  </span>
                  <span className={`text-xs text-center mt-1 hidden sm:block ${
                    isActive ? 'text-purple-300' : 'text-zinc-600'
                  }`}>
                    {step.description}
                  </span>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-shrink-0 mx-2 sm:mx-4">
                  <div
                    className={`
                      w-12 sm:w-16 h-0.5 transition-all duration-300 relative overflow-hidden
                      ${currentStep > step.id ? 'bg-green-500' : 'bg-zinc-700'}
                    `}
                  >
                    {/* Progress animation */}
                    {currentStep === step.id + 1 && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-green-500 animate-pulse" />
                    )}
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-6 sm:mt-8">
        <div className="w-full bg-zinc-800 rounded-full h-1.5 sm:h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-600 to-pink-600 h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-zinc-500">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
      </div>
    </div>
  );}