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
      className="group relative overflow-hidden border-2 border-black dark:border-gray-500 bg-white dark:bg-gray-800 pixel-shadow hover:-translate-y-1 hover:-translate-x-1 transition-transform duration-150 active:translate-y-0 active:translate-x-0 active:shadow-none"
    >
      {/* Image Area */}
      <div className="aspect-square bg-cover bg-center bg-gradient-to-br from-pink-300 to-indigo-300 flex items-center justify-center overflow-hidden" style={{ imageRendering: 'pixelated' }}>
        <div className="text-6xl">📱</div>
      </div>

      {/* Card Info */}
      <div className="p-3 bg-white dark:bg-gray-800 border-t-2 border-black dark:border-gray-500">
        <h3 className="font-mono text-sm text-black dark:text-white mb-2">{title}</h3>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, i) => {
            const colors = ['bg-pink-300', 'bg-green-300', 'bg-blue-300', 'bg-yellow-300'];
            const color = colors[i % colors.length];
            return (
              <span
                key={i}
                className={`text-xs font-bold ${color} text-black px-2 py-0.5 border border-black`}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-pink-300/80 dark:bg-indigo-300/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="font-mono text-2xl text-black">Görüntüle</p>
      </div>
    </div>
  );
};

export default ProjectCard;

