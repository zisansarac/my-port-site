// src/components/SkillCard.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

type SkillCardProps = {
  skill: string;
  level: number;
  icon?: string;
  color?: string;
};

const SkillCard: React.FC<SkillCardProps> = ({ skill, level, icon = '💻', color = 'pink' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !cardRef.current) return;

    const card = cardRef.current;

    const handleMouseEnter = () => {
      gsap.to(card, {
        scale: 1.05,
        y: -10,
        rotation: 2,
        duration: 0.3,
        ease: 'back.out(1.7)',
      });

      if (progressRef.current) {
        gsap.to(progressRef.current, {
          width: `${level}%`,
          duration: 0.8,
          ease: 'power2.out',
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        scale: 1,
        y: 0,
        rotation: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    // Animate progress bar on mount
    if (progressRef.current) {
      gsap.fromTo(
        progressRef.current,
        { width: '0%' },
        {
          width: `${level}%`,
          duration: 1.5,
          delay: 0.2,
          ease: 'power2.out',
        }
      );
    }

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [level]);

  const colorClasses = {
    pink: 'bg-pink-400 border-pink-400',
    indigo: 'bg-indigo-400 border-indigo-400',
    purple: 'bg-purple-400 border-purple-400',
  };

  return (
    <div
      ref={cardRef}
      className={`p-6 rounded-3xl border-2 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.pink} 
                  bg-white/50 backdrop-blur-sm shadow-lg transition-all duration-300 cursor-pointer
                  hover:shadow-2xl`}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">{icon}</span>
        <h3 className="text-2xl font-pixel text-text-accent">{skill}</h3>
      </div>
      <div className="w-full bg-white/50 rounded-full h-4 overflow-hidden">
        <div
          ref={progressRef}
          className={`h-full ${colorClasses[color as keyof typeof colorClasses] || colorClasses.pink} 
                      rounded-full transition-all duration-500`}
          style={{ width: '0%' }}
        />
      </div>
      <p className="text-sm mt-2 text-text-default font-sans">{level}%</p>
    </div>
  );
};

export default SkillCard;
