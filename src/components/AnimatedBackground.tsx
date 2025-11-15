// src/components/AnimatedBackground.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Animated background with floating particles/shapes
 * Inspired by Stitch portfolio aesthetics
 */
const AnimatedBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const container = containerRef.current;
    const particles: HTMLDivElement[] = [];
    const particleCount = 20;

    // Create floating particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 60 + 20;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      particle.style.position = 'absolute';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.borderRadius = '50%';
      particle.style.background = `radial-gradient(circle, rgba(255, 192, 203, ${0.1 + Math.random() * 0.2}) 0%, rgba(147, 51, 234, ${0.1 + Math.random() * 0.2}) 100%)`;
      particle.style.left = `${x}%`;
      particle.style.top = `${y}%`;
      particle.style.pointerEvents = 'none';
      particle.style.filter = 'blur(20px)';
      
      container.appendChild(particle);
      particles.push(particle);

      // Animate each particle
      gsap.to(particle, {
        x: `+=${(Math.random() - 0.5) * 200}`,
        y: `+=${(Math.random() - 0.5) * 200}`,
        duration: Math.random() * 10 + 10,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      gsap.to(particle, {
        scale: 0.8 + Math.random() * 0.4,
        duration: Math.random() * 3 + 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    }

    return () => {
      particles.forEach(particle => particle.remove());
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden opacity-30"
      aria-hidden="true"
    />
  );
};

export default AnimatedBackground;

