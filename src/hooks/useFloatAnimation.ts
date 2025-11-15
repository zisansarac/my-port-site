// src/hooks/useFloatAnimation.ts
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Sürekli yukarı-aşağı yüzen animasyon efekti
 */
export const useFloatAnimation = (
  duration: number = 3,
  y: number = 20
) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return;

    const element = ref.current;

    gsap.to(element, {
      y: y,
      duration: duration,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    });

    return () => {
      gsap.killTweensOf(element);
    };
  }, [duration, y]);

  return ref;
};

