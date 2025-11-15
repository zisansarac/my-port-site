
// src/components/Header.tsx
'use client'; 
import { useState } from 'react';
import Link from 'next/link';
import { HiMenu, HiX } from 'react-icons/hi'; // react-icons kurulu olmalı

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Hakkımda', href: '#about' },
    { name: 'Projeler', href: '#projects' },
    { name: 'İletişim', href: '#contact' },
  ];

  return (
    // 'fixed' ve 'z-50' ile üste sabitlenir. 'backdrop-blur' referans siteye benzer şeffaflık verir.
    <header className="fixed top-0 left-0 w-full z-50 p-4 backdrop-blur-sm bg-bg-primary/80 border-b border-white/50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        
        {/* Logo/Başlık */}
        <Link href="/" className="font-mono text-text-accent text-3xl tracking-wider hover:text-kawaii-pink transition-colors duration-300">
          <h2 className="hover:bg-pink-200">Zişan Saraç</h2>
        </Link>
        
        {/* Masaüstü Menüsü (Yuvarlak butonlar ekleyebiliriz) */}
        <nav className="hidden md:flex space-x-4">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className="px-4 py-2 bg-pink-300 text-white rounded-full 
                         hover:bg-indigo-300 transition-all duration-300 font-mono shadow-md"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobil Hamburger Butonu */}
        <button className="md:hidden text-text-accent" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <HiX className='bg-indigo-400' size={30} /> : <HiMenu className='bg-indigo-400' size={30} />}
        </button>
      </div>

      {/* Mobil Açılır Menü */}
      <nav 
        className={`md:hidden absolute top-full left-0 w-full bg-bg-primary transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100 p-4' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <ul className="flex flex-col space-y-3">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href} onClick={() => setIsOpen(false)} className="block text-text-default hover:text-text-accent text-xl py-2 px-4 rounded-lg bg-indigo-200">
                <p>{item.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;