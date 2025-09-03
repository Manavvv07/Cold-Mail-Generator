import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  onClose, 
  duration = 3000 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (duration / 50));
        return newProgress <= 0 ? 0 : newProgress;
      });
    }, 50);

    // Auto dismiss
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [duration, onClose]);

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-gradient-to-r from-green-900/90 to-emerald-900/90',
          borderColor: 'border-green-500/30',
          textColor: 'text-green-100',
          iconColor: 'text-green-400',
          progressColor: 'bg-green-400'
        };
      case 'error':
        return {
          icon: AlertCircle,
          bgColor: 'bg-gradient-to-r from-red-900/90 to-rose-900/90',
          borderColor: 'border-red-500/30',
          textColor: 'text-red-100',
          iconColor: 'text-red-400',
          progressColor: 'bg-red-400'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-gradient-to-r from-yellow-900/90 to-orange-900/90',
          borderColor: 'border-yellow-500/30',
          textColor: 'text-yellow-100',
          iconColor: 'text-yellow-400',
          progressColor: 'bg-yellow-400'
        };
      case 'info':
      default:
        return {
          icon: Info,
          bgColor: 'bg-gradient-to-r from-blue-900/90 to-cyan-900/90',
          borderColor: 'border-blue-500/30',
          textColor: 'text-blue-100',
          iconColor: 'text-blue-400',
          progressColor: 'bg-blue-400'
        };
    }
  };

  const config = getToastConfig();
  const Icon = config.icon;

  return (
    <div
      className={`
        relative overflow-hidden max-w-sm w-full backdrop-blur-md border rounded-lg shadow-lg transition-all duration-300 transform
        ${config.bgColor} ${config.borderColor}
        ${isVisible 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
        }
      `}
      role="alert"
      aria-live="polite"
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-1 bg-white/10 w-full">
        <div
          className={`h-full transition-all duration-75 ease-linear ${config.progressColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${config.textColor}`}>
              {message}
            </p>
          </div>
          
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className={`flex-shrink-0 p-1 rounded-md hover:bg-white/10 transition-colors ${config.textColor}`}
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};