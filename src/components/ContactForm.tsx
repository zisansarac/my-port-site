// src/components/ContactForm.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !formRef.current) return;

    const inputs = formRef.current.querySelectorAll('input, textarea');
    
    inputs.forEach((input, index) => {
      gsap.fromTo(
        input,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: index * 0.1,
          ease: 'power2.out',
        }
      );
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Animate button
    const button = formRef.current?.querySelector('button');
    if (button) {
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
      });
    }

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', message: '' });
      
      // Success animation
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { scale: 1 },
          {
            scale: 1.05,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
          }
        );
      }
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-text-accent font-pixel text-lg mb-2">
            İsim
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-2xl border-2 border-kawaii-pink/50 
                     bg-white/70 backdrop-blur-sm focus:border-kawaii-pink focus:outline-none
                     focus:ring-2 focus:ring-kawaii-pink/30 transition-all duration-300
                     font-sans text-text-default"
            placeholder="Adınız"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-text-accent font-pixel text-lg mb-2">
            E-posta
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-2xl border-2 border-kawaii-pink/50 
                     bg-white/70 backdrop-blur-sm focus:border-kawaii-pink focus:outline-none
                     focus:ring-2 focus:ring-kawaii-pink/30 transition-all duration-300
                     font-sans text-text-default"
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-text-accent font-pixel text-lg mb-2">
            Mesaj
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-3 rounded-2xl border-2 border-kawaii-pink/50 
                     bg-white/70 backdrop-blur-sm focus:border-kawaii-pink focus:outline-none
                     focus:ring-2 focus:ring-kawaii-pink/30 transition-all duration-300
                     font-sans text-text-default resize-none"
            placeholder="Mesajınızı buraya yazın..."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-8 py-4 bg-gradient-to-r from-kawaii-pink to-indigo-300 
                   text-white rounded-full font-pixel text-xl shadow-lg
                   hover:shadow-2xl transform hover:scale-105 transition-all duration-300
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Gönderiliyor... ✨' : 'Gönder 💌'}
      </button>
    </form>
  );
};

export default ContactForm;

