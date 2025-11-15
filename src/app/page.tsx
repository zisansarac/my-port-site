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

  return (
    <main className="relative overflow-hidden" ref={containerRef as any}>
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Header tüm sayfalarda üstte sabit kalır */}
      <Header />
      
      {/* 1. GİRİŞ/HERO Bölümü */}
      <SectionContainer id="hero" className="snap-section">
        <div className="text-center">
          <h2 
            ref={heroTitleRef}
            className="text-7xl md:text-9xl mb-4 font-pixel"
          >
            Selam! Ben Zişan!
          </h2>
          <p 
            ref={heroSubtitleRef}
            className="text-xl md:text-3xl text-center text-text-default font-sans"
          >
            Full-Stack Web / Mobile Developer
          </p>
          <div 
            ref={emojiRef as React.RefObject<HTMLDivElement>}
            className="text-6xl mt-8 inline-block"
            style={{ display: 'inline-block' }}
          >
            ✨
          </div>
        </div>
      </SectionContainer>
      
      {/* 2. HAKKIMDA Bölümü */}
      <SectionContainer id="about" className='snap-section'>
        <h2 
          ref={aboutTitleRef}
          className="text-5xl mb-6"
        >
          Hakkımda 💖
        </h2>
        <p 
          ref={aboutTextRef as any}
          className="text-lg text-text-default mb-8"
        >
          Merhaba! Ben bu dijital dünyanın yeni yaratıcısıyım. 2000lerin estetiği, parlak renkler ve yüksek interaktifliği birleştirerek özgün deneyimler tasarlamayı seviyorum.
        </p>
        
        {/* Skill Cards */}
        <div 
          ref={skillsContainerRef as any}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
        >
          <SkillCard skill="React/Next.js" level={90} icon="⚛️" color="pink" />
          <SkillCard skill="TypeScript" level={90} icon="📘" color="indigo" />
          <SkillCard skill="Tailwind & GSAP Animations" level={80} icon="🎨" color="purple" />
          <SkillCard skill=".NET" level={70} icon="💅" color="pink" />
          <SkillCard skill="Node.js" level={75} icon="🟢" color="indigo" />
          <SkillCard skill="Mobile Dev" level={40} icon="📱" color="purple" />
        </div>
      </SectionContainer>

      {/* 3. PROJELER Bölümü */}
      <SectionContainer id="projects" className='snap-section'>
        <h2 
          ref={projectsTitleRef}
          className="text-5xl mb-6"
        >
          Projeler 💾
        </h2>
        <p 
          ref={projectsTextRef as any}
          className="text-lg text-text-default mb-8"
        >
          Yuvarlak hatlı modüller ve bol animasyonlu projelerime göz atın!
        </p>
        
        {/* Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
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
      </SectionContainer>
      
      {/* 4. İLETİŞİM Bölümü */}
      <SectionContainer id="contact" className='snap-section'>
        <h2 
          ref={contactTitleRef}
          className="text-5xl mb-6"
        >
          İletişim Kur! 💌
        </h2>
        <p className="text-lg text-text-default mb-8 text-center">
          Bir proje üzerinde çalışmak ister misiniz? Bana ulaşın!
        </p>
        <ContactForm />
      </SectionContainer>

    </main>
  );
}