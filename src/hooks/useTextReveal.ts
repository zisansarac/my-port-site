// src/hooks/useTextReveal.ts
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Metin karakterlerini tek tek veya kelime kelime reveal animasyonu
 */
export const useTextReveal = (
  splitBy: 'chars' | 'words' = 'chars',
  delay: number = 0
) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return;

    const element = ref.current;
    const text = element.textContent || '';
    
    // Mevcut metni temizle
    element.textContent = '';

    let splitText: string[];
    if (splitBy === 'chars') {
      splitText = text.split('');
    } else {
      splitText = text.split(' ');
    }

    // Her karakter/kelime için span oluştur
    splitText.forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = splitBy === 'chars' ? (char === ' ' ? '\u00A0' : char) : char + ' ';
      span.style.display = splitBy === 'chars' ? 'inline-block' : 'inline';
      span.style.opacity = '0';
      span.style.transform = 'translateY(20px)';
      element.appendChild(span);

      gsap.to(span, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: delay + index * 0.03,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [splitBy, delay]);

  return ref;
};

