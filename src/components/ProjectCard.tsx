// src/components/ProjectCard.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

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
  imageSrc: string;
  githubLink: string;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  title, 
  description, 
  tags, 
  image, 
  link,
  index,
  imageSrc,
  githubLink 
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
 className="group relative overflow-hidden border-2 border-black dark:border-gray-500 bg-white dark:bg-gray-800 pixel-shadow"
 >

 {/* GÖRSEL ALANI VE GİTHUB LİNKİ */}
 <Link 
href={githubLink} // GitHub linki burada
target="_blank" 
rel="noopener noreferrer"
className="block relative overflow-hidden w-full h-48 md:h-56 lg:h-64" // Genişlik ve Yükseklik ayarı
 >
 {imageSrc ? (
 <img
    src={imageSrc}
    alt={`${title} Proje Önizlemesi`}
    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
    style={{ imageRendering: 'pixelated' }} 
 />
 ) : (
 // imageSrc boş ise gösterilecek yer tutucu
<div className="w-full h-full bg-gradient-to-br from-pink-300 to-indigo-300 flex items-center justify-center">
<span className="text-white font-mono p text-lg">No Image</span>
 </div>
 )}

 {/*  GitHub */}
<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">

 <span className="text-white font-mono text-sm">GitHub</span>
 </div>
 </Link>

 {/* Card Info (Açıklama alanı) */}
 <div className="p-3 bg-white dark:bg-gray-800 border-t-2 border-black dark:border-gray-500">
 <h3 className="font-mono text-2xl text-black dark:text-white mb-2 **truncate**">{title}</h3>
<p className="text-lg text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">{description}</p>
 <div className="flex flex-wrap gap-1">
 {tags.map((tag, i) => {
 const colors = ['bg-indigo-300','bg-purple-300','bg-green-300' ];
const color = colors[i % colors.length];
 return (
<span
 key={i}
 className={`text-xs font-bold ${color} text-black px-2 py-0.5 border border-black pixel-shadow-sm`}
>
 {tag}
 </span>
 );
 })}
 </div>
    
        {link && link !== '#' && (
            <Link 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-3 block text-center font-mono text-sm bg-indigo-500 text-white p-1 border-2 border-black pixel-shadow hover:bg-indigo-600"
            >
                Canlı Demo 
            </Link>
        )}
 </div>
</div>
 );
};

export default ProjectCard;

