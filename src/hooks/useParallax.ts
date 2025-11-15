// src/hooks/useParallax.ts
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Parallax efekti için hook
 * Scroll sırasında elementin farklı hızlarda hareket etmesini sağlar
 */
export const useParallax = (speed: number = 0.5) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return;

    const element = ref.current;

    gsap.to(element, {
      y: () => {
        return window.innerHeight * speed;
      },
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [speed]);

  return ref;
};

