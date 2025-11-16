/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/page.tsx
'use client';
import { useEffect, useRef } from 'react';
import Header from '@/components/Header';
import SectionContainer from '@/components/SectionContainer';
import { useScrollSnap } from '@/hooks/useScrollSnap';
import { useFadeIn } from '@/hooks/useFadeIn';
import { useTextReveal } from '@/hooks/useTextReveal';
import { useFloatAnimation } from '@/hooks/useFloatAnimation';
import { useMouseTrail } from '@/hooks/useMouseTrail';
import { useStaggerAnimation } from '@/hooks/useStaggerAnimation';
import AnimatedBackground from '@/components/AnimatedBackground';
import SkillCard from '@/components/SkillCard';
import ProjectCard from '@/components/ProjectCard';
import ContactForm from '@/components/ContactForm';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const containerRef = useScrollSnap('main', '.snap-section');
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const aboutTitleRef = useRef<HTMLHeadingElement>(null);
  const aboutTextRef = useFadeIn(0.2, 1, 30);
  const projectsTitleRef = useRef<HTMLHeadingElement>(null);
  const projectsTextRef = useFadeIn(0.2, 1, 30);
  const contactTitleRef = useRef<HTMLHeadingElement>(null);
  const emojiRef = useFloatAnimation(2, 15);
  const catRef = useRef<HTMLDivElement>(null);
  const isBubbleShowing = useRef(false); // Track if bubble is showing
  const messageIndex = useRef(0); // Track which message to show next
  const skillsContainerRef = useStaggerAnimation(0.15, 0.2, { opacity: 0, y: 50, scale: 0.8 }, { opacity: 1, y: 0, scale: 1 });
  
  // Optional: Enable mouse trail effect (set to false to disable)
  useMouseTrail(true);

  // Hero section animations
  useEffect(() => {
    if (typeof window === 'undefined' || !heroTitleRef.current || !heroSubtitleRef.current) return;

    const tl = gsap.timeline({ delay: 0.3 });

    // Title animation - split by characters
    const titleText = heroTitleRef.current.textContent || '';
    heroTitleRef.current.textContent = '';
    const titleChars = titleText.split('');

    titleChars.forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(50px) rotateX(90deg)';
      heroTitleRef.current?.appendChild(span);

      tl.to(span, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.5,
        ease: 'back.out(1.7)',
      }, index * 0.05);
    });

    // Subtitle animation
    tl.fromTo(
      heroSubtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    );
  }, []);

  // Section title animations
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const titles = [aboutTitleRef, projectsTitleRef, contactTitleRef].filter(Boolean);

    titles.forEach((titleRef) => {
      if (!titleRef.current) return;

      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          x: -50,
          scale: 0.8,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }, []);

  // Cat click animation - Cute and subtle version
  const handleCatClick = () => {
    if (!catRef.current) return;
    
    // Prevent multiple bubbles - only one at a time
    if (isBubbleShowing.current) return;
    
    const catContainer = catRef.current;
    
    // Remove background color test
    // catContainer.style.backgroundColor = 'rgba(255, 192, 203, 0.3)';
    
    const rect = catContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // List of different messages (3-4 messages)
    const messages = [
      'Meow! 🐱',
      'Hello! 👋',
      'Hi there! 💖',
      'Purr! 😸'
    ];
    
    // Get the current message and cycle to next one
    const currentMessage = messages[messageIndex.current];
    messageIndex.current = (messageIndex.current + 1) % messages.length; // Cycle through messages
    
    // Create small sparkles around the cat
    for (let i = 0; i < 8; i++) {
      const sparkle = document.createElement('div');
      sparkle.style.position = 'fixed';
      sparkle.style.width = '6px';
      sparkle.style.height = '6px';
      sparkle.style.borderRadius = '50%';
      sparkle.style.background = '#ffd700';
      sparkle.style.pointerEvents = 'none';
      sparkle.style.zIndex = '1000';
      sparkle.style.boxShadow = '0 0 8px #ffd700';
      sparkle.style.opacity = '1';
      
      document.body.appendChild(sparkle);
      
      const angle = (Math.PI * 2 * i) / 8;
      const distance = 40 + Math.random() * 30;
      
      gsap.fromTo(sparkle, 
        { 
          x: centerX, 
          y: centerY,
          opacity: 1,
          scale: 1
        },
        {
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          opacity: 0,
          scale: 0,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => sparkle.remove()
        }
      );
    }
    
    // Create talk bubble - always next to the cat (left or right) with MORE random position variation
    const talkBubble = document.createElement('div');
    
    // Mark that bubble is showing
    isBubbleShowing.current = true;
    
    // More varied positioning - can be left, right, or slightly above/below
    const positionType = Math.random();
    let bubbleX, bubbleY, pointerPosition;
    
    if (positionType < 0.4) {
      // Left side of cat (40% chance)
      bubbleX = rect.left - 20 - Math.random() * 30; // More horizontal variation: -20 to -50px
      bubbleY = centerY + (Math.random() - 0.5) * 80; // More vertical variation: -40 to +40px
      pointerPosition = 'right';
    } else if (positionType < 0.8) {
      // Right side of cat (40% chance)
      bubbleX = rect.right + 20 + Math.random() * 30; // More horizontal variation: +20 to +50px
      bubbleY = centerY + (Math.random() - 0.5) * 80; // More vertical variation: -40 to +40px
      pointerPosition = 'left';
    } else {
      // Above cat (20% chance) - but still to the side
      const sideOffset = (Math.random() - 0.5) * 100; // Random horizontal offset
      bubbleX = centerX + sideOffset;
      bubbleY = rect.top - 60 - Math.random() * 40; // Above with variation
      pointerPosition = 'bottom';
    }
    
    talkBubble.style.position = 'fixed';
    talkBubble.style.left = `${bubbleX}px`;
    talkBubble.style.top = `${bubbleY}px`;
    talkBubble.style.transform = pointerPosition === 'bottom' ? 'translateX(-50%)' : 'translateY(-50%)';
    talkBubble.style.background = 'white';
    talkBubble.style.padding = '12px 18px';
    talkBubble.style.borderRadius = '20px';
    talkBubble.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    talkBubble.style.fontFamily = 'Pixel-Kawaii, sans-serif';
    talkBubble.style.fontSize = '18px';
    talkBubble.style.color = '#333';
    talkBubble.style.zIndex = '1001';
    talkBubble.style.pointerEvents = 'none';
    talkBubble.style.opacity = '0';
    talkBubble.style.whiteSpace = 'nowrap';
    talkBubble.textContent = currentMessage;
    
    // Add triangle pointer - position based on bubble location
    const pointer = document.createElement('div');
    pointer.style.position = 'absolute';
    pointer.style.width = '0';
    pointer.style.height = '0';
    pointer.style.pointerEvents = 'none';
    
    if (pointerPosition === 'bottom') {
      // Pointer pointing down (bubble above cat)
      pointer.style.bottom = '-8px';
      pointer.style.left = '50%';
      pointer.style.transform = 'translateX(-50%)';
      pointer.style.borderLeft = '8px solid transparent';
      pointer.style.borderRight = '8px solid transparent';
      pointer.style.borderTop = '8px solid white';
    } else if (pointerPosition === 'left') {
      // Pointer pointing left (bubble to the right)
      pointer.style.left = '-8px';
      pointer.style.top = '50%';
      pointer.style.transform = 'translateY(-50%)';
      pointer.style.borderTop = '8px solid transparent';
      pointer.style.borderBottom = '8px solid transparent';
      pointer.style.borderRight = '8px solid white';
    } else {
      // Pointer pointing right (bubble to the left)
      pointer.style.right = '-8px';
      pointer.style.top = '50%';
      pointer.style.transform = 'translateY(-50%)';
      pointer.style.borderTop = '8px solid transparent';
      pointer.style.borderBottom = '8px solid transparent';
      pointer.style.borderLeft = '8px solid white';
    }
    
    talkBubble.appendChild(pointer);
    
    document.body.appendChild(talkBubble);
    
    // Animate talk bubble
    gsap.fromTo(talkBubble, 
      { 
        opacity: 0,
        y: 10,
        scale: 0.8
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'back.out(1.7)',
        onComplete: () => {
          gsap.to(talkBubble, {
            opacity: 0,
            y: -10,
            scale: 0.9,
            duration: 0.3,
            delay: 1.5,
            ease: 'power2.in',
            onComplete: () => {
              talkBubble.remove();
              isBubbleShowing.current = false; // Reset flag when bubble is removed
            }
          });
        }
      }
    );

    // Subtle jump animation (small bounce)
    gsap.to(catContainer, {
      y: -20,
      scale: 1.1,
      duration: 0.2,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        gsap.set(catContainer, { y: 0, scale: 1 });
      }
    });
  };

  // Set up click handler in useEffect
  useEffect(() => {
    if (typeof window === 'undefined' || !catRef.current) return;

    const catContainer = catRef.current;
    gsap.set(catContainer, { transformOrigin: 'center center' });
    
    catContainer.addEventListener('click', handleCatClick);
    catContainer.style.cursor = 'pointer';

    return () => {
      catContainer.removeEventListener('click', handleCatClick);
    };
  }, []);

  return (
    <main className="relative overflow-hidden" ref={containerRef as any}>
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Header tüm sayfalarda üstte sabit kalır */}
      <Header />
      
      {/* 1. GİRİŞ/HERO Bölümü */}
      <SectionContainer id="hero" className="snap-section no-rounded-bg">
        <div className="w-full flex justify-center items-center mt-16 md:mt-24 px-2 sm:px-4">
          <div className="w-full max-w-5xl mx-auto border-2 border-black dark:border-gray-500 bg-white/90 dark:bg-gray-800 pixel-shadow overflow-hidden">
            {/* Window Header */}
            <header className="flex items-center justify-between bg-indigo-600 dark:bg-gray-700 p-1.5 sm:p-2 text-white font-mono text-[10px] sm:text-xs">
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <span className="text-sm sm:text-base flex-shrink-0">👋</span>
                <span className="truncate">Merhaba.exe</span>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                <button className="w-4 h-4 sm:w-5 sm:h-5 bg-white dark:bg-gray-600 border-2 border-black dark:border-gray-500 flex items-center justify-center pixel-shadow-sm hover:bg-gray-200">
                  <span className="text-black dark:text-white text-[8px] sm:text-xs">−</span>
                </button>
                <button className="w-4 h-4 sm:w-5 sm:h-5 bg-white dark:bg-gray-600 border-2 border-black dark:border-gray-500 flex items-center justify-center pixel-shadow-sm hover:bg-gray-200">
                  <span className="text-black dark:text-white text-[8px] sm:text-xs">□</span>
                </button>
                <button className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 border-2 border-black dark:border-gray-500 flex items-center justify-center pixel-shadow-sm hover:bg-red-600">
                  <span className="text-black text-[8px] sm:text-xs">×</span>
                </button>
              </div>
            </header>

            {/* Content Area */}
            <div className="p-2 sm:p-4">
              <div className="bg-white/70 dark:bg-gray-900 border-2 border-black dark:border-gray-600 p-2 sm:p-4 pixel-shadow-inset overflow-hidden">
                <div className="text-center">
                  <h2 
                    ref={heroTitleRef}
                    className="text-5xl sm:text-5xl md:text-6xl lg:text-8xl mb-2 sm:mb-4 font-mono break-words"
                  >
                    Selam! Ben Zişan!
                  </h2>
                  <p 
                    ref={heroSubtitleRef}
                    className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl text-center text-black dark:text-white font-mono mb-4 sm:mb-8 px-2 break-words"
                  >
                    Full-Stack Web / Mobile Developer
                  </p>
                  <div 
                    ref={emojiRef as React.RefObject<HTMLDivElement>}
                    className="mt-4 sm:mt-8 inline-block"
                    style={{ display: 'inline-block' }}
                  >
                    <div
                      ref={catRef}
                      onClick={handleCatClick}
                      style={{ 
                        display: 'inline-block', 
                        width: '250px', 
                        height: '250px', 
                        cursor: 'pointer', 
                        position: 'relative',
                        zIndex: 20
                      }}
                    >
                      <span
                        style={{ display: 'inline-block', width: '100%', height: '100%', pointerEvents: 'none' }}
                        dangerouslySetInnerHTML={{
                          __html: `<dotlottie-wc 
                            src="https://lottie.host/18e4175c-1e4f-4933-9a71-92b36b3e0e79/lsogQeuU1p.lottie"
                            style="width: 250px; height: 250px; pointer-events: none;"
                            autoplay
                            loop
                          ></dotlottie-wc>`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
      
      {/* 2. HAKKIMDA Bölümü */}
      <SectionContainer id="about" className='snap-section no-rounded-bg'>
        <div className="w-full flex justify-center items-center px-2 sm:px-4">
          <div className="w-full max-w-5xl mx-auto border-2 border-black dark:border-gray-500 bg-white/90 dark:bg-gray-800 pixel-shadow overflow-hidden">
            {/* Window Header */}
            <header className="flex items-center justify-between bg-indigo-600 dark:bg-gray-700 p-1.5 sm:p-2 text-white font-mono text-[10px] sm:text-xs">
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <span className="text-sm sm:text-base flex-shrink-0">💖</span>
                <span className="truncate">Hakkımda.txt</span>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                <button className="w-4 h-4 sm:w-5 sm:h-5 bg-white dark:bg-gray-600 border-2 border-black dark:border-gray-500 flex items-center justify-center pixel-shadow-sm hover:bg-gray-200">
                  <span className="text-black dark:text-white text-[8px] sm:text-xs">−</span>
                </button>
                <button className="w-4 h-4 sm:w-5 sm:h-5 bg-white dark:bg-gray-600 border-2 border-black dark:border-gray-500 flex items-center justify-center pixel-shadow-sm hover:bg-gray-200">
                  <span className="text-black dark:text-white text-[8px] sm:text-xs">□</span>
                </button>
                <button className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 border-2 border-black dark:border-gray-500 flex items-center justify-center pixel-shadow-sm hover:bg-red-600">
                  <span className="text-black text-[8px] sm:text-xs">×</span>
                </button>
              </div>
            </header>

            {/* Content Area */}
            <div className="p-2 sm:p-4">
              <div className="bg-white/70 dark:bg-gray-900 border-2 border-black dark:border-gray-600 p-2 sm:p-4 pixel-shadow-inset overflow-hidden">
                <h2 
                  ref={aboutTitleRef}
                  className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 font-mono text-black dark:text-white break-words"
                >
                  Hakkımda 💖
                </h2>
                <p 
                  ref={aboutTextRef as any}
                  className="text-sm sm:text-base md:text-lg text-black dark:text-white mb-4 sm:mb-8 font-mono break-words"
                >
                  Merhaba! Ben bu dijital dünyanın yeni yaratıcısıyım. 2000lerin estetiği, parlak renkler ve yüksek interaktifliği birleştirerek özgün deneyimler tasarlamayı seviyorum.
                </p>
                
                {/* Skill Cards */}
                <div 
                  ref={skillsContainerRef as any}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-8"
                >
                  <SkillCard skill="React/Next.js" level={90} icon="⚛️" color="pink" />
                  <SkillCard skill="TypeScript" level={90} icon="📘" color="indigo" />
                  <SkillCard skill="Tailwind & GSAP Animations" level={80} icon="🎨" color="purple" />
                  <SkillCard skill=".NET" level={70} icon="💅" color="pink" />
                  <SkillCard skill="Node.js" level={75} icon="🟢" color="indigo" />
                  <SkillCard skill="Mobile Dev" level={40} icon="📱" color="purple" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* 3. PROJELER Bölümü */}
      <SectionContainer id="projects" className='snap-section no-rounded-bg'>
        <div className="w-full flex justify-center items-center px-2 sm:px-4">
          <div className="w-full max-w-5xl mx-auto border-2 border-black dark:border-gray-500 bg-white/90 dark:bg-gray-800 pixel-shadow overflow-hidden">
            {/* Window Header */}
            <header className="flex items-center justify-between bg-indigo-600 dark:bg-gray-700 p-1.5 sm:p-2 text-white font-mono text-[10px] sm:text-xs">
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <span className="text-sm sm:text-base flex-shrink-0">📁</span>
                <span className="truncate">Projelerim.exe</span>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                <button className="w-4 h-4 sm:w-5 sm:h-5 bg-white dark:bg-gray-600 border-2 border-black dark:border-gray-500 flex items-center justify-center pixel-shadow-sm hover:bg-gray-200">
                  <span className="text-black dark:text-white text-[8px] sm:text-xs">−</span>
                </button>
                <button className="w-4 h-4 sm:w-5 sm:h-5 bg-white dark:bg-gray-600 border-2 border-black dark:border-gray-500 flex items-center justify-center pixel-shadow-sm hover:bg-gray-200">
                  <span className="text-black dark:text-white text-[8px] sm:text-xs">□</span>
                </button>
                <button className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 border-2 border-black dark:border-gray-500 flex items-center justify-center pixel-shadow-sm hover:bg-red-600">
                  <span className="text-black text-[8px] sm:text-xs">×</span>
                </button>
              </div>
            </header>

            {/* Content Area */}
            <div className="p-2 sm:p-4">
              <div className="bg-white/70 dark:bg-gray-900 border-2 border-black dark:border-gray-600 p-2 sm:p-4 pixel-shadow-inset overflow-hidden">
                {/* Filter Chips */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6 font-mono text-[10px] sm:text-xs">
                  <button className="h-7 sm:h-8 shrink-0 items-center justify-center gap-x-1 sm:gap-x-2 bg-pink-300 px-2 sm:px-3 text-black border-2 border-black pixel-shadow-sm hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-transform">
                    Tümü
                  </button>
                  <button className="h-7 sm:h-8 shrink-0 items-center justify-center gap-x-1 sm:gap-x-2 bg-indigo-300 px-2 sm:px-3 text-black border-2 border-black pixel-shadow-sm hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-transform">
                    Web Geliştirme
                  </button>
                  <button className="h-7 sm:h-8 shrink-0 items-center justify-center gap-x-1 sm:gap-x-2 bg-purple-300 px-2 sm:px-3 text-black border-2 border-black pixel-shadow-sm hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-transform">
                    Mobile
                  </button>
                  <button className="h-7 sm:h-8 shrink-0 items-center justify-center gap-x-1 sm:gap-x-2 bg-green-300 px-2 sm:px-3 text-black border-2 border-black pixel-shadow-sm hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-transform">
                    UI/UX
                  </button>
                </div>

                {/* Project Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <ProjectCard
                    index={0}
                    title="Portfolio Site"
                    description="Modern ve interaktif portfolyo sitesi. GSAP animasyonları ve responsive tasarım ile geliştirildi."
                    tags={['Next.js', 'GSAP', 'Tailwind', 'TypeScript']}
                    link="#"
                  />
                  <ProjectCard
                    index={1}
                    title="E-Commerce App"
                    description="Full-stack e-ticaret uygulaması. Modern UI/UX ve güvenli ödeme entegrasyonu."
                    tags={['React', 'Node.js', 'MongoDB', 'Stripe']}
                    link="#"
                  />
                  <ProjectCard
                    index={2}
                    title="Mobile App"
                    description="Cross-platform mobil uygulama. React Native ile geliştirildi."
                    tags={['React Native', 'TypeScript', 'Firebase']}
                    link="#"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
      
      {/* 4. İLETİŞİM Bölümü */}
      <SectionContainer id="contact" className='snap-section no-rounded-bg'>
        <div className="w-full flex justify-center items-center px-2 sm:px-4">
          <div className="w-full max-w-5xl mx-auto border-2 border-black dark:border-gray-500 bg-white/90 dark:bg-gray-800 pixel-shadow overflow-hidden">
            {/* Window Header */}
            <header className="flex items-center justify-between bg-indigo-600 dark:bg-gray-700 p-1.5 sm:p-2 text-white font-mono text-[10px] sm:text-xs">
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <span className="text-sm sm:text-base flex-shrink-0">💌</span>
                <span className="truncate">İletişim.exe</span>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                <button className="w-4 h-4 sm:w-5 sm:h-5 bg-white dark:bg-gray-600 border-2 border-black dark:border-gray-500 flex items-center justify-center pixel-shadow-sm hover:bg-gray-200">
                  <span className="text-black dark:text-white text-[8px] sm:text-xs">−</span>
                </button>
                <button className="w-4 h-4 sm:w-5 sm:h-5 bg-white dark:bg-gray-600 border-2 border-black dark:border-gray-500 flex items-center justify-center pixel-shadow-sm hover:bg-gray-200">
                  <span className="text-black dark:text-white text-[8px] sm:text-xs">□</span>
                </button>
                <button className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 border-2 border-black dark:border-gray-500 flex items-center justify-center pixel-shadow-sm hover:bg-red-600">
                  <span className="text-black text-[8px] sm:text-xs">×</span>
                </button>
              </div>
            </header>

            {/* Content Area */}
            <div className="p-2 sm:p-4">
              <div className="bg-white/70 dark:bg-gray-900 border-2 border-black dark:border-gray-600 p-2 sm:p-4 pixel-shadow-inset overflow-hidden">
                <h2 
                  ref={contactTitleRef}
                  className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 font-mono text-black dark:text-white text-center break-words"
                >
                  İletişim Kur! 💌
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-black dark:text-white mb-4 sm:mb-8 text-center font-mono break-words px-2">
                  Bir proje üzerinde çalışmak ister misiniz? Bana ulaşın!
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>

    </main>
  );
}