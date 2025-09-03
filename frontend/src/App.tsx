import React, { useState, useCallback, useMemo } from 'react';
import { BrainCircuit, Bot } from 'lucide-react';
import { BackgroundAnimation } from './components/BackgroundAnimation';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AboutSection } from './components/AboutSection';
import { Stepper } from './components/Stepper';
import { URLInput } from './components/URLInput';
import { JobDetails } from './components/JobDetails';
import { PersonalInfo } from './components/PersonalInfo';
import { EmailOutput } from './components/EmailOutput';
import { EnhancedChatbot } from "./components/chat/EnhancedChatbot";
import { ChatBubble } from './components/ChatBubble';
import { Toast } from './components/Toast';
import { useLocalStorage } from './hooks/useLocalStorage';
import { extractJobData, generateEmail } from './services/api';
import { JobData, PersonalInfo as PersonalInfoType, GeneratedEmail, ToastMessage } from './types';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [jobData, setJobData] = useState<JobData>({
    role: '',
    company: '',
    description: '',
    skills: [],
    experience: '',
    location: ''
  });
  
  const [personalInfo, setPersonalInfo] = useLocalStorage<PersonalInfoType>('outreach-ai-personal-info', {
    name: '',
    email: '',
    skills: '',
    portfolio: ''
  });

  const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmail>({
    subject: '',
    content: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast management
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Handlers
  const handleURLSubmit = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await extractJobData(url);
      setJobData(data);
      setCurrentStep(2);
      showToast('Job details extracted successfully!');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to extract job details. Please check the URL and try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const handleJobDataUpdate = useCallback((data: JobData) => {
    setJobData(data);
    showToast('Job details updated successfully!');
  }, [showToast]);

  const handlePersonalInfoSubmit = useCallback(async (info: PersonalInfoType) => {
    setPersonalInfo(info);
    setIsLoading(true);
    setCurrentStep(4);
    
    try {
      const data = await generateEmail(jobData, info);
      setGeneratedEmail(data);
      showToast('Personalized email generated!');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate email. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      
      // Fallback email
      setGeneratedEmail({
        subject: `Interest in ${jobData.role} Position`,
        content: `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${jobData.role} position at ${jobData.company}.\n\n${info.skills}\n\nI would love to discuss how my experience aligns with your needs.\n\nBest regards,\n${info.name}`
      });
    } finally {
      setIsLoading(false);
    }
  }, [jobData, setPersonalInfo, showToast]);

  const handleRestart = useCallback(() => {
    setCurrentStep(1);
    setJobData({
      role: '',
      company: '',
      description: '',
      skills: [],
      experience: '',
      location: ''
    });
    setGeneratedEmail({
      subject: '',
      content: ''
    });
    setError(null);
  }, []);

  const handleChatToggle = useCallback(() => {
    setChatbotOpen(prev => !prev);
  }, []);

  // Memoized current step component
  const currentStepComponent = useMemo(() => {
    switch (currentStep) {
      case 1:
        return <URLInput onSubmit={handleURLSubmit} isLoading={isLoading} />;
      case 2:
        return (
          <JobDetails
            jobData={jobData}
            onUpdate={handleJobDataUpdate}
            onNext={() => setCurrentStep(3)}
          />
        );
      case 3:
        return (
          <PersonalInfo
            initialData={personalInfo}
            onSubmit={handlePersonalInfoSubmit}
          />
        );
      case 4:
        return (
          <EmailOutput
            generatedEmail={generatedEmail}
            onUpdate={setGeneratedEmail}
            onRestart={handleRestart}
            isLoading={isLoading}
            showToast={showToast}
          />
        );
      default:
        return null;
    }
  }, [currentStep, handleURLSubmit, isLoading, jobData, handleJobDataUpdate, personalInfo, handlePersonalInfoSubmit, generatedEmail, handleRestart, showToast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black relative">
      <BackgroundAnimation />
      <Header onAboutClick={() => setAboutOpen(true)} />
      
      <main className="px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Stepper currentStep={currentStep} />
          
          <div className="transition-all duration-500 ease-in-out">
            {currentStepComponent}
          </div>
        </div>
      </main>

      <Footer />

      {/* Fixed UI Elements */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatBubble onClick={handleChatToggle} />
        <EnhancedChatbot
          isOpen={chatbotOpen}
          onClose={() => setChatbotOpen(false)}
          currentStep={currentStep}
          jobData={jobData}
          personalInfo={personalInfo}
        />
      </div>
      
      <AboutSection isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default App;