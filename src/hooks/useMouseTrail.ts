// src/hooks/useMouseTrail.ts
'use client';

import { useEffect } from 'react';
import gsap from 'gsap';

/**
 * Mouse trail effect - creates a subtle cursor trail animation
 */
export const useMouseTrail = (enabled: boolean = true) => {
  useEffect(() => {
    if (typeof window === 'undefined' || !enabled) return;

    const trail: HTMLDivElement[] = [];
    const trailLength = 5;

    // Create trail elements
    for (let i = 0; i < trailLength; i++) {
      const dot = document.createElement('div');
      dot.style.position = 'fixed';
      dot.style.width = '8px';
      dot.style.height = '8px';
      dot.style.borderRadius = '50%';
      dot.style.backgroundColor = 'rgba(255, 192, 203, 0.5)';
      dot.style.pointerEvents = 'none';
      dot.style.zIndex = '9999';
      dot.style.opacity = '0';
      dot.style.transition = 'opacity 0.3s';
      document.body.appendChild(dot);
      trail.push(dot);
    }

    let mouseX = 0;
    let mouseY = 0;
    let trailX = Array(trailLength).fill(0);
    let trailY = Array(trailLength).fill(0);

    const updateTrail = () => {
      for (let i = 0; i < trailLength; i++) {
        const prevX = i === 0 ? mouseX : trailX[i - 1];
        const prevY = i === 0 ? mouseY : trailY[i - 1];
        
        trailX[i] += (prevX - trailX[i]) * 0.3;
        trailY[i] += (prevY - trailY[i]) * 0.3;

        gsap.to(trail[i], {
          x: trailX[i] - 4,
          y: trailY[i] - 4,
          duration: 0.3,
          ease: 'power2.out',
        });

        const opacity = (trailLength - i) / trailLength * 0.5;
        trail[i].style.opacity = opacity.toString();
      }
      requestAnimationFrame(updateTrail);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    updateTrail();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      trail.forEach(dot => dot.remove());
    };
  }, [enabled]);
};

