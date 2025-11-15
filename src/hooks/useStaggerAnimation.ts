// src/hooks/useStaggerAnimation.ts
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Stagger animation hook - animates multiple children with a delay between each
 */
export const useStaggerAnimation = (
  stagger: number = 0.1,
  delay: number = 0,
  from: gsap.TweenVars = { opacity: 0, y: 50 },
  to: gsap.TweenVars = { opacity: 1, y: 0 }
) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return;

    const element = ref.current;
    const children = Array.from(element.children) as HTMLElement[];

    if (children.length === 0) return;

    gsap.fromTo(
      children,
      from,
      {
        ...to,
        duration: 0.8,
        delay: delay,
        stagger: stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
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
  }, [stagger, delay, from, to]);

  return ref;
};

