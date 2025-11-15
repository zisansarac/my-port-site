// src/hooks/useFadeIn.ts
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Fade-in animasyonu için hook
 * Element scroll ile görünür olduğunda fade-in efekti uygular
 */
export const useFadeIn = (
  delay: number = 0,
  duration: number = 1,
  y: number = 50
) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return;

    const element = ref.current;

    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: y,
      },
      {
        opacity: 1,
        y: 0,
        duration: duration,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [delay, duration, y]);

  return ref;
};

