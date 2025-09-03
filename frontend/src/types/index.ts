// Core application types
export interface JobData {
  role: string;
  company: string;
  description: string;
  skills: string[];
  experience: string;
  location: string;
  salary?: string;
  remote?: boolean;
  jobType?: 'full-time' | 'part-time' | 'contract' | 'freelance';
}

export interface PersonalInfo {
  name: string;
  email: string;
  skills: string;
  portfolio?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  experience?: string;
  location?: string;
}

export interface GeneratedEmail {
  subject: string;
  content: string;
  confidence_score?: number;
  suggestions?: string[];
  personalization_level?: 'low' | 'medium' | 'high';
}

// Chat and messaging types
export interface Message {
  id: number;
  role: 'ai' | 'user';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  type?: 'text' | 'system' | 'error';
}

export interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  jobData?: JobData;
  personalInfo?: PersonalInfo;
}

// UI component types
export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface StepperProps {
  currentStep: number;
  totalSteps?: number;
}

export interface ProgressBarProps {
  progress: number;
  color?: string;
  showPercentage?: boolean;
}

// API types
export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface ExtractJobDataResponse extends APIResponse<JobData> {
  extraction_confidence?: number;
  detected_skills?: string[];
}

export interface GenerateEmailResponse extends APIResponse<GeneratedEmail> {
  processing_time?: number;
  model_version?: string;
}

// Form and validation types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'url' | 'textarea' | 'select';
  required?: boolean;
  placeholder?: string;
  validation?: (value: string) => string | null;
  options?: { value: string; label: string }[];
}

export interface ValidationError {
  field: string;
  message: string;
}

// Configuration and settings types
export interface AppConfig {
  apiUrl: string;
  enableAnalytics: boolean;
  maxFileSize: number;
  supportedFileTypes: string[];
  features: {
    chatbot: boolean;
    emailTemplates: boolean;
    jobMatching: boolean;
    analytics: boolean;
  };
}

// Analytics and tracking types
export interface AnalyticsEvent {
  eventName: string;
  properties: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

// Error handling types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  userId?: string;
}

// Template and customization types
export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  content: string;
  category: 'formal' | 'casual' | 'creative' | 'technical';
  variables: string[];
}

export interface CustomizationOptions {
  theme: 'light' | 'dark';
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  animations: boolean;
}

// Feature flags and experiments
export interface FeatureFlag {
  name: string;
  enabled: boolean;
  description?: string;
  rolloutPercentage?: number;
}

// Export utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};