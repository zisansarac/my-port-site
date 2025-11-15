// src/components/ProjectCard.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type ProjectCardProps = {
  title: string;
  description: string;
  tags: string[];
  image?: string;
  link?: string;
  index: number;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  title, 
  description, 
  tags, 
  image, 
  link,
  index 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !cardRef.current) return;

    const card = cardRef.current;

    // Scroll-triggered entrance animation
    gsap.fromTo(
      card,
      {
        opacity: 0,
        y: 50,
        scale: 0.9,
        rotationY: -15,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationY: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Hover animation
    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -15,
        scale: 1.03,
        rotationY: 5,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        rotationY: 0,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === card) {
          trigger.kill();
        }
      });
    };
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="group relative bg-white/70 backdrop-blur-sm rounded-3xl p-6 
                 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden
                 border-2 border-transparent hover:border-kawaii-pink"
    >
      {/* Decorative gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-kawaii-pink/20 to-indigo-300/20 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {image && (
          <div className="w-full h-48 bg-gradient-to-br from-kawaii-pink to-indigo-300 
                          rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
            <div className="text-6xl">📱</div>
          </div>
        )}
        
        <h3 className="text-3xl font-pixel text-text-accent mb-3">{title}</h3>
        <p className="text-text-default mb-4 font-sans">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-kawaii-pink/30 rounded-full text-sm font-sans 
                         text-text-accent border border-kawaii-pink/50"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 bg-kawaii-pink text-white rounded-full 
                       font-mono hover:bg-indigo-300 transition-colors duration-300
                       transform hover:scale-105"
          >
            View Project →
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;

