import React, { useState, useEffect, useCallback } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  direction: number;
  opacity: number;
}

export const BackgroundAnimation: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Mouse tracking for interactive effects
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100
    });
  }, []);

  useEffect(() => {
    if (isReducedMotion) return;
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove, isReducedMotion]);

  // Initialize particles
  useEffect(() => {
    if (isReducedMotion) return;

    const particleCount = window.innerWidth < 768 ? 8 : 15;
    const initialParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 30,
      speed: Math.random() * 1.5 + 0.5,
      direction: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.3 + 0.1
    }));
    setParticles(initialParticles);
  }, [isReducedMotion]);

  // Animate particles
  useEffect(() => {
    if (isReducedMotion || particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => {
        let newX = particle.x + Math.cos(particle.direction) * particle.speed * 0.03;
        let newY = particle.y + Math.sin(particle.direction) * particle.speed * 0.03;
        let newDirection = particle.direction;

        // Bounce off edges with some randomness
        if (newX <= 0 || newX >= 100) {
          newDirection = Math.PI - particle.direction + (Math.random() - 0.5) * 0.2;
          newX = Math.max(0, Math.min(100, newX));
        }
        if (newY <= 0 || newY >= 100) {
          newDirection = -particle.direction + (Math.random() - 0.5) * 0.2;
          newY = Math.max(0, Math.min(100, newY));
        }

        // Subtle interaction with mouse
        const distanceToMouse = Math.sqrt(
          Math.pow(newX - mousePosition.x, 2) + Math.pow(newY - mousePosition.y, 2)
        );
        const influence = Math.max(0, 20 - distanceToMouse) / 20;
        const mouseInfluence = influence * 0.1;

        return {
          ...particle,
          x: newX + mouseInfluence * Math.cos(newDirection),
          y: newY + mouseInfluence * Math.sin(newDirection),
          direction: newDirection,
          opacity: particle.opacity + influence * 0.1
        };
      }));
    }, 60);

    return () => clearInterval(interval);
  }, [isReducedMotion, particles.length, mousePosition]);

  // Don't render animations if reduced motion is preferred
  if (isReducedMotion) {
    return (
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-purple-900/5 to-zinc-900" />
        <div className="absolute inset-0 bg-gradient-radial from-purple-900/10 via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-purple-900/10 to-zinc-900"
        style={{
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 15s ease infinite'
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full blur-xl transition-all duration-1000 ease-out"
            style={{
              top: `${particle.y}%`,
              left: `${particle.x}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: `radial-gradient(circle, rgba(147, 51, 234, ${particle.opacity}) 0%, rgba(236, 72, 153, ${particle.opacity * 0.7}) 50%, transparent 100%)`,
              transform: 'translate(-50%, -50%)',
              willChange: 'transform, opacity'
            }}
          />
        ))}
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, black 70%, transparent 110%)'
          }}
        />
      </div>

      {/* Dynamic gradient overlays */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse at ${mousePosition.x}% ${mousePosition.y}%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)`
        }}
      />
      
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-radial from-purple-500/5 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-radial from-pink-500/5 to-transparent blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-gradient-radial from-purple-500/3 to-transparent blur-3xl animate-pulse" />
      </div>
    </div>
  );
};