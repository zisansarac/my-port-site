/* eslint-disable @typescript-eslint/no-namespace */

// src/components/Header.tsx
'use client'; 
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { HiMenu, HiX } from 'react-icons/hi';
import gsap from 'gsap';

const CV_TR_PATH = "/Zisan_Sarac_CV_TR.pdf";
const CV_EN_PATH = "/Zisan_Sarac_CV_EN.pdf";


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const menuItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menuItems = [
    { name: 'About Me', href: '#about' },
    { name: 'My Tech Stacks', href: '#tech' },
    { name: 'My Projects', href: '#projects' },
    { name: 'Contact Me', href: '#contact' },
  ];

  // Header slide down animation on mount
  useEffect(() => {
    if (typeof window === 'undefined' || !headerRef.current) return;

    gsap.fromTo(
      headerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );
  }, []);

  // Logo animation
  useEffect(() => {
    if (typeof window === 'undefined' || !logoRef.current) return;

    const logo = logoRef.current;
    
    const handleMouseEnter = () => {
      gsap.to(logo, {
        scale: 1.0,
        rotation: 1,
        duration: 0.3,
        ease: 'back.out(1.7)'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(logo, {
        scale: 1,
        rotation: 0,
        duration: 0.6,
        ease: 'elastic.out(5, 0.5)'
        
      });
    };

    logo.addEventListener('mouseenter', handleMouseEnter);
    logo.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      logo.removeEventListener('mouseenter', handleMouseEnter);
      logo.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Menu items stagger animation
  useEffect(() => {
    if (typeof window === 'undefined' || !navRef.current) return;

    const items = menuItemsRef.current.filter(Boolean);
    if (items.length === 0) return;

    gsap.fromTo(
      items,
      {
        opacity: 0,
        y: -20,
        scale: 0.8
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.3,
        ease: 'back.out(1.7)'
      }
    );
  }, []);

  // Mobile menu animation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mobileNav = document.querySelector('.mobile-nav');
    if (!mobileNav) return;

    if (isOpen) {
      gsap.fromTo(
        mobileNav,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' }
      );

      const menuLinks = mobileNav.querySelectorAll('li');
      gsap.fromTo(
        menuLinks,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, stagger: 0.1, delay: 0.2, ease: 'power2.out' }
      );
    } else {
      gsap.to(mobileNav, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      });
    }
  }, [isOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    const link = menuItemsRef.current[index];
    if (link) {
      gsap.to(link, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      });
    }
  };

  return (
    <header 
      ref={headerRef}
      className="fixed top-0 left-0 w-full z-50 p-4 backdrop-blur-sm bg-bg-primary/80 border-b border-white/50"
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo/Başlık */}
        <div className="flex items-center gap-3">
          <Link 
            ref={logoRef}
            href="/" 
            className=" text-text-accent text-3xl tracking-wider hover:text-pink-400 transition-colors duration-300 cursor-pointer"
          >
            <h2>Zişan Saraç</h2>
          </Link>
         
        </div>
        
        {/* Masaüstü Menüsü */}
        <nav ref={navRef} className="hidden md:flex space-x-4">
          {menuItems.map((item, index) => (
            <Link 
              key={item.name} 
              ref={(el) => { menuItemsRef.current[index] = el; }}
              href={item.href}
              onClick={(e) => handleNavClick(e, index)}
              className="px-4 py-2 bg-pink-400 text-white rounded-full 
                         hover:bg-indigo-300 transition-all duration-300 shadow-md
                         relative overflow-hidden group"
                                       
            >
              <span className="relative z-10 text-xl text-white">{item.name}</span>
              <span className="absolute inset-0 bg-linear-to-r from-pink-400 to-indigo-300 
                             transform scale-x-0 group-hover:scale-x-100 transition-transform 
                             duration-300 origin-left rounded-full"></span>
            </Link>
          ))}
        </nav>

        <div 
            className="hidden md:block relative pt-2" 
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
        >
            <button 
                className="px-6 py-2 bg-text-accent text-white font-pixel rounded-full text-xl 
                           shadow-md border-2 border-white/50 pixel-shadow 
                           hover:bg-indigo-600 transition-all duration-150 ease-in-out"
                aria-label="Download CV Options"
            >
                Download my CV
            </button>

            {isDropdownOpen && (
                <div 
                    className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 
                               pixel-shadow border-2 border-black dark:border-gray-500 
                               rounded-md overflow-hidden z-50"
                >
                    <Link
                        href={CV_TR_PATH}
                        download
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-text-default dark:text-gray-200 
                                   font-pixel text-lg hover:bg-pink-400 hover:text-white transition-colors"
                    >
                        TR
                    </Link>
                    <Link
                        href={CV_EN_PATH}
                        download
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-text-default dark:text-gray-200 
                                   font-pixel text-lg hover:bg-pink-400 hover:text-white transition-colors border-t border-gray-300 dark:border-gray-700"
      
                    >
                         ENG
                    </Link>
                </div>
            )}
        </div>

        

        {/* Mobil Hamburger Butonu */}
        <button 
          className="md:hidden text-text-accent p-1 rounded-md shadow-2000s 
                     hover:scale-110 transition-transform duration-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <HiX className='bg-indigo-400' size={30} />
          ) : (
            <HiMenu className='bg-indigo-400' size={30} />
          )}
        </button>
      </div>

      {/* Mobil Açılır Menü */}
      <nav 
        className="mobile-nav md:hidden absolute top-full left-0 w-full bg-transparent overflow-hidden"
        style={{ maxHeight: isOpen ? '500px' : '0' }}
      >
        <ul className="flex flex-col space-y-3 p-4">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link 
                href={item.href} 
                onClick={() => setIsOpen(false)} 
                className="block text-text-default hover:text-text-accent text-xl py-2 px-4 
                           rounded-lg bg-indigo-200 hover:bg-indigo-300 transition-colors 
                           duration-300 transform hover:scale-105"
              >
                <p className='text-xl text-pink-500'>{item.name}</p>
              </Link>
            </li>
          ))}
          <li className="pt-4 flex flex-col space-y-2">
            <p className="block text-text-default hover:text-text-accent text-xl py-2 px-4 
                          rounded-lg bg-indigo-200 text-pink-500 font-pixel">
                 Download CV 📄
            </p>

  
            <Link
                href={CV_TR_PATH}
                download 
                onClick={() => setIsOpen(false)} 
                className="block text-text-default hover:text-text-accent text-xl py-2 px-4 ml-4 
                           rounded-lg bg-indigo-100 hover:bg-indigo-300 transition-colors 
                           duration-300 transform hover:scale-105"
            >
                <p className='text-xl text-pink-500'>TR</p>
            </Link>

            <Link
                href={CV_EN_PATH}
                download 
                onClick={() => setIsOpen(false)} 
         
                className="block text-text-default hover:text-text-accent text-xl py-2 px-4 ml-4 
                           rounded-lg bg-indigo-100 hover:bg-indigo-300 transition-colors 
                           duration-300 transform hover:scale-105"
            >
                <p className='text-xl text-pink-500'>ENG</p>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;