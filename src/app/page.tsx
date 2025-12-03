/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/page.tsx
'use client';
import { useEffect, useRef } from 'react';
import Header from '@/components/Header';
import SectionContainer from '@/components/SectionContainer';
import { useScrollSnap } from '@/hooks/useScrollSnap';
import { useFadeIn } from '@/hooks/useFadeIn';
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
  const contactTitleRef = useRef<HTMLHeadingElement>(null);
  const emojiRef = useFloatAnimation(2, 15);
  const catRef = useRef<HTMLDivElement>(null);
  const isBubbleShowing = useRef(false); // Track if bubble is showing
  const messageIndex = useRef(0); // Track which message to show next
  const skillsContainerRef = useStaggerAnimation(0.15, 0.2, { opacity: 0, y: 50, scale: 1 }, { opacity: 1, y: 0, scale: 1 });
  
  //  Enable mouse trail effect (set to false to disable)
  useMouseTrail(true);

  useEffect(() => {
        if (typeof window !== 'undefined') {
           
            if (window.location.hash) {
                
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
            
            
            window.scrollTo(0, 0); 
        }
    }, []); 

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
   
      <AnimatedBackground />
      
      <Header />
      
      {/* 1. GİRİŞ/HERO Bölümü */}
      <SectionContainer id="hero" className="snap-section no-rounded-bg">
        <div className="w-full flex justify-center items-center mt-16 md:mt-24 px-2 sm:px-4">
          <div className="w-full max-w-5xl mx-auto border-2 border-black dark:border-gray-500 bg-white/90 dark:bg-gray-800 pixel-shadow overflow-hidden">
            {/* Window Header */}
            <header className="flex items-center justify-between bg-indigo-600 dark:bg-gray-700 p-1.5 sm:p-2 text-white font-mono text-[10px] sm:text-xs">
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <span className="text-lg sm:text-base shrink-0">🎵</span>
                <p className="truncate text-lg">Merhaba.exe   °❀⋆.ೃ࿔*:･°❀⋆.ೃ࿔*:･</p>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
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
                    className="text-5xl sm:text-5xl md:text-6xl lg:text-8xl mb-2 sm:mb-4 font-mono wrap-break-word"
                  >
                    Hi! I&apos;m Zişan!
                  </h2>
                  <p 
                    ref={heroSubtitleRef}
                    className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl text-center text-black dark:text-white font-mono mb-4 sm:mb-8 px-2 wrap-break-word"
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
                        zIndex: 20,
                        
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
                <span className="text-sm sm:text-base shrink-0">📁</span>
                <span className="truncate text-lg">aboutMe.txt</span>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
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
                  className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 font-mono text-black dark:text-white wrap-break-word"
                >
                  About Me ⋆˚˖°
                </h2>
                <p 
                  ref={aboutTextRef as any}
                  className="text-xl sm:text-base md:text-2xl text-black dark:text-white mb-4 sm:mb-8 font-mono wrap-break-word"
                >
                  I have a bachelor&apos;s degree in Computer Engineering from Suleyman Demirel University. I live in Konya, Turkiye.  During my education, I was particularly interested in web development and user interface design. My interest in design and art supports my problem-solving and creative thinking skills. I aim to improve my competencies in the software field by learning new technologies and contributing to teamwork.
                </p>
                
                
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>

      <SectionContainer id="tech" className='snap-section no-rounded-bg'>
        <div className="w-full flex justify-center items-center px-2 sm:px-4">
          <div className="w-full max-w-5xl mx-auto border-2 border-black dark:border-gray-500 bg-white/90 dark:bg-gray-800 pixel-shadow overflow-hidden">
            {/* Window Header */}
            <header className="flex items-center justify-between bg-indigo-600 dark:bg-gray-700 p-1.5 sm:p-2 text-white font-mono text-[10px] sm:text-xs">
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <span className="text-sm sm:text-base shrink-0">📁</span>
                <span className="truncate text-lg">myTechStacks.txt</span>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
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
                  className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 font-mono text-black dark:text-white wrap-break-word"
                >
                  My Tech Stacks ✮⋆˙
                </h2>
                <p 
                  ref={aboutTextRef as any}
                  className="text-lg sm:text-base md:text-xl text-black dark:text-white mb-4 sm:mb-8 font-mono wrap-break-word"
                >
                  the technologies I use most
                </p>
                
                {/* Skill Cards */}
                <div 
                  ref={skillsContainerRef as any}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-8"
                >
                  <SkillCard skill="React/Next.js" level={90} icon="" color="pink" />
                  <SkillCard skill="TypeScript" level={90} icon="" color="indigo" />
                  <SkillCard skill="Tailwind & GSAP" level={80} icon="" color="purple" />
                  <SkillCard skill=".NET" level={70} icon="" color="pink" />
                  <SkillCard skill="Node.js" level={75} icon="" color="indigo" />
                  <SkillCard skill="Mobile Dev" level={40} icon="" color="purple" />
                  
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
                <span className="text-sm sm:text-base shrink-0">📁</span>
                <span className="truncate text-lg">myProjects.exe</span>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
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
                  className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 font-mono text-black dark:text-white wrap-break-word"
                >
                  My Projects ⋆˚꩜｡⋆
                </h2>
               
                

                {/* Project Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <ProjectCard
                    index={0}
                    title="dahlia's"
                    description="a modern and efficient order tracking application built to empower women entrepreneurs."
                    tags={['Flutter', 'Node.js', 'Express', 'MySQL']}
                    link="#" imageSrc={'/images/dahlias.jpg'} githubLink={'https://github.com/zisansarac/dahliasApp'}                  />
                  <ProjectCard
                    index={1}
                    title="Portfolio Sites"
                    description="a full-stack portfolio blog site."
                    tags={['React', '.NET', 'SQLite']}
                    link="#" imageSrc={''} githubLink={'https://github.com/zisansarac/PortfolioSites'}                  />
                  <ProjectCard
                    index={2}
                    title="GlowSphere"
                    description="a sleek and modern platform designed to illuminate your digital presence with creativity and innovation."
                    tags={['React', 'TypeScript', 'Tailwind CSS', 'Node.js','MongoDB']}
                    link="#" imageSrc={'/images/glowsphere.png'} githubLink={'https://github.com/zisansarac/GlowSphere_2.0'}                  />
                    <ProjectCard
                    index={3}
                    title="3D Web Portfolio"
                    description="a interactive 3D Dev Portfolio a modern, animated and fully responsive experience built using React, Three.js, and GSAP."
                    tags={['React', 'Three.js', 'GSAP']}
                    link="#" imageSrc={'/images/3d.png'} githubLink={'https://github.com/zisansarac/3D-Web-Portfolio'}                  />
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
                <span className="text-sm sm:text-base shrink-0">💌</span>
                <span className="truncate text-lg">contactMe.exe</span>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
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
                  className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 font-mono text-black dark:text-white text-center wrap-break-word"
                >
                  Contact Me! 💌
                </h2>
                <p className="text-lg sm:text-lg md:text-2xl text-black dark:text-white mb-4 sm:mb-8 text-center font-mono wrap-break-word px-2">
                  Interested in working on a project? Contact me!
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>


 <footer 
 className="w-full py-4 sm:py-8  dark:bg-gray-700  text-center 
 border-t-4 border-pink-400"
 >
 <div className="max-w-7xl mx-auto px-8 sm:px-6 lg:px-9">
 
 <p className="text-white text-lg sm:text-base font-retro tracking-wider pixel-shadow-sm inline-block px-2 py-0.5 bg-black/10">
 © {new Date().getFullYear()} Zişan Saraç. ALL RIGHTS RESERVED.
 </p>
 
 {/* Sosyal Medya Linkleri */}
 <div className="flex justify-center space-x-4 mt-4">
 {/* GitHub Linki */}
 <Link 
 href="https://github.com/zisansarac" 
 target="_blank" 
className="text-white hover:text-pink-400 transition-colors duration-200 
 pixel-shadow-sm p-1.5 rounded-md bg-black/20 hover:bg-black/30 transform hover:scale-110"
 aria-label="GitHub Profile"
 >
<svg className="w-7 h-7 inline-block" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
 <path 
 fillRule="evenodd" 
 d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.111.82-.258.82-.577 0-.285-.011-1.04-.017-2.04-3.344.726-4.042-1.61-4.042-1.61-.546-1.387-1.332-1.758-1.332-1.758-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.493.998.108-.776.419-1.305.762-1.605-2.665-.304-5.467-1.333-5.467-5.932 0-1.31.465-2.38.123-3.22-.123-.314-.533-1.523.123-3.176 0 0 1.008-.322 3.3-.319 1.025-.283 2.115-.425 3.206-.425.008 0 .016 0 .023 0 1.09.008 2.18.15 3.207.425 2.29-.003 3.298.319 3.298.319.656 1.653.246 2.862.123 3.176-.343.84-.123 1.91.123 3.22 0 4.609-2.807 5.624-5.479 5.922.429.37.818 1.092.818 2.203 0 1.604-.014 2.895-.014 3.284 0 .323.218.69.829.575C20.562 21.802 24 17.302 24 12c0-6.627-5.373-12-12-12z"
 />
 </svg>
 </Link>
 

 <Link 
 href="https://www.linkedin.com/in/zisansarac" 
target="_blank" 
className="text-white hover:text-pink-400 transition-colors duration-200 
 pixel-shadow-sm p-1.5 rounded-md bg-black/20 hover:bg-black/30 transform hover:scale-110"
aria-label="LinkedIn Profile"
 >
 <svg className="w-7 h-7 inline-block" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
 <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.364-4-3.359-4 0v5.604h-3v-11h3v1.765c1.395-2.544 7-2.358 7 3.543v5.692z"/>
 </svg>
 </Link>

 <Link 
 href="https://www.instagram.com/zisansarac" 
target="_blank" 
 className="text-white hover:text-pink-400 transition-colors duration-200 
 pixel-shadow-sm p-1.5 rounded-md bg-black/20 hover:bg-black/30 transform hover:scale-110"
 aria-label="Instagram Profile"
 >
 <svg className="w-7 h-7 inline-block" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
 <path d="M12 2.163c3.204 0 3.584.013 4.85.07c3.27.14 4.807 1.644 4.947 4.947.057 1.266.07 1.646.07 4.85s-.013 3.584-.07 4.85c-.14 3.27-1.644 4.807-4.947 4.947-1.266.057-1.646.07-4.85.07s-3.584-.013-4.85-.07c-3.27-.14-4.807-1.644-4.947-4.947-.057-1.266-.07-1.646-.07-4.85s.013-3.584.07-4.85c.14-3.27 1.644-4.807 4.947-4.947 1.266-.057 1.646-.07 4.85-.07zm0 2.138c-3.14 0-3.486.012-4.72.067-2.61.11-3.693 1.193-3.803 3.803-.055 1.234-.067 1.58-.067 4.72s.012 3.486.067 4.72c.11 2.61 1.193 3.693 3.803 3.803 1.234.055 1.58.067 4.72.067s3.486-.012 4.72-.067c2.61-.11 3.693-1.193 3.803-3.803.055-1.234.067-1.58.067-4.72s-.012-3.486-.067-4.72c-.11-2.61-1.193-3.693-3.803-3.803-1.234-.055-1.58-.067-4.72-.067zm0 1.815a5.5 5.5 0 100 11 5.5 5.5 0 000-11zm0 2.138a3.362 3.362 0 110 6.724 3.362 3.362 0 010-6.724zm6.096-3.883a1.272 1.272 0 100 2.544 1.272 1.272 0 000-2.544z"/>
 </svg>
 </Link>
 </div>
 </div>
 </footer>
 </main>
 );
}
       