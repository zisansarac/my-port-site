
// src/components/SectionContainer.tsx
'use client';
import React, { ReactNode, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type SectionProps = {
  children: ReactNode;
  id: string;
  className?: string; 
};

/**
 * Tam ekran yüksekliğe ve yuvarlak hatlı içerik kutusuna sahip ana bölüm bileşeni.
 * Scroll-triggered animasyonlar ile geliştirilmiş.
 */
const SectionContainer: React.FC<SectionProps> = ({ children, id, className = '' }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current || !contentRef.current) return;

    const section = sectionRef.current;
    const content = contentRef.current;

    // Section entrance animation
    gsap.fromTo(
      content,
      {
        opacity: 0,
        y: 100,
        scale: 0.9,
        rotationX: 15,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Parallax effect for background
    gsap.to(section, {
      backgroundPosition: '50% 100%',
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === section || trigger.vars.trigger === content) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id={id} 
      className={`min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 relative snap-start ${className}`}
    >
      {/* Yuvarlak, şeffaf, gölgeli içerik kutusu (Stitch Referansı) */}
      <div 
        ref={contentRef}
        className="max-w-7xl w-full p-8 md:p-12 
                   bg-white/70 backdrop-blur-sm 
                   rounded-[3rem] shadow-xl transition-all duration-300
                   hover:shadow-2xl hover:scale-[1.02]"
      >
        {children}
      </div>
    </section>
  );
};

export default SectionContainer;