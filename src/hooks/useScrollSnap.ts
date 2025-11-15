/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useScrollSnap.ts
'use client'; 

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ScrollTrigger eklentisini GSAP'e kaydediyoruz
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Tam ekran bölümler arasında akıcı kaydırma kitleme (snap) efekti sağlar.
 * Bu, referans aldığınız sitenin temel etkileşimini oluşturur.
 * @param containerSelector - Kaydırma hareketinin gerçekleştiği ana kapsayıcı element.
 * @param sectionSelector - Tam ekran yüksekliğine sahip olan bölümler (SectionContainer).
 */
export const useScrollSnap = (
  containerSelector: string,
  sectionSelector: string
) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // 1. Next.js'te Server Side Rendering (SSR) için window kontrolü
    if (typeof window === 'undefined') return;

    // ScrollTrigger'ı yeniden hesapla
    ScrollTrigger.refresh();

    const container = document.querySelector(containerSelector);
    if (!container) return;

    const sections = gsap.utils.toArray<HTMLElement>(document.querySelectorAll(sectionSelector));
    
    // Yetersiz bölüm varsa çalıştırma
    if (sections.length < 2) return;

    // Her bölüm için ayrı snap noktası oluştur
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        snap: {
          snapTo: 1 / (sections.length - 1) || 1,
          duration: { min: 0.3, max: 0.7 },
          ease: "power2.inOut",
          delay: 0.1,
          inertia: false
        }
      });
    });

    // Clean up function (Bileşen sayfadan ayrıldığında ScrollTrigger'ı temizler)
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        const triggerElement = trigger.vars.trigger;
        if (triggerElement === container || sections.includes(triggerElement as HTMLElement)) {
          trigger.kill();
        }
      });
      ScrollTrigger.refresh();
    };
  }, [containerSelector, sectionSelector]);

  return containerRef;
};