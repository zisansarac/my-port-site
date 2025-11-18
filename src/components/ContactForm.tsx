// src/components/ContactForm.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import emailjs from '@emailjs/browser';
import { useRouter } from 'next/navigation';

// Ortam değişkenlerini al
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

type ModalContent = {
    title: string;
    message: string;
    isSuccess: boolean;
};

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Temizlenmiş State Tanımlamaları
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState<ModalContent>({
        title: '',
        message: '',
        isSuccess: false,
    });
    
    const router = useRouter();
 
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

    // Modal Açma Fonksiyonu
    const openModal = (content: ModalContent) => {
        setModalContent(content);
        setShowModal(true);
        // Modal animasyonu
        gsap.fromTo('.pixel-modal', 
            { opacity: 0, scale: 0.5, y: -50 }, 
            { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
        );
    };

    // Modal Kapatma Fonksiyonu
    const closeModal = () => {
        gsap.to('.pixel-modal', {
            opacity: 0, 
            scale: 0.8, 
            duration: 0.3, 
            ease: 'power2.in',
            onComplete: () => setShowModal(false)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
            openModal({
                title: 'Configuration Error! ❌',
                message: 'EmailJS kimlikleri (.env.local) dosyasında eksik. E-posta gönderimi yapılamıyor.',
                isSuccess: false,
            });
            setIsSubmitting(false);
            return;
        }
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

        try {
            const result = await emailjs.send(
                SERVICE_ID,
                TEMPLATE_ID,
                {
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                },
                PUBLIC_KEY
            );

            if (result.status === 200) {
                openModal({
                    title: 'Success! ✅',
                    message: 'Your message sent successfully! I will get back to you as soon as possible. Refreshing...',
                    isSuccess: true,
                });
                setFormData({ name: '', email: '', message: '' });

                // Başarı animasyonu (formun kendisi için)
                if (formRef.current) {
                    gsap.fromTo(
                        formRef.current,
                        { scale: 1 },
                        { scale: 1.05, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.inOut' }
                    );
                }

                setTimeout(() => {
                    router.push('/', { scroll: true });
                    window.location.reload(); 
                }, 1500);
            } else {
                openModal({
                    title: `Error (${result.status}) 🛑`,
                    message: `E-posta gönderimi başarısız oldu. EmailJS tarafında bir sorun olabilir. Lütfen console'u kontrol edin.`,
                    isSuccess: false,
                });
                console.error('EmailJS Error:', result);
            }

        } catch (error) {
            openModal({
                title: 'Connection Error! 🌐',
                message: 'Ağ hatası veya sunucu problemi oluştu. Lütfen daha sonra tekrar deneyin.',
                isSuccess: false,
            });
            console.error('Submission error:', error);
        } finally {
      
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            {/* 1. İLETİŞİM FORMU */}
            <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-6 max-w-2xl mx-auto"
            >
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-white font-mono text-lg mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-md border-2 border-black dark:border-gray-500 bg-white/90 dark:bg-gray-700 pixel-shadow-inset focus:border-pink-500 focus:outline-none font-sans text-black dark:text-white"
                            placeholder="Your name"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-white font-mono text-lg mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-md border-2 border-black dark:border-gray-500 bg-white/90 dark:bg-gray-700 pixel-shadow-inset focus:border-pink-500 focus:outline-none font-sans text-black dark:text-white"
                            placeholder="email@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-white font-mono text-lg mb-2">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={6}
                            className="w-full px-4 py-3 rounded-md border-2 border-black dark:border-gray-500 bg-white/90 dark:bg-gray-700 pixel-shadow-inset focus:border-pink-500 focus:outline-none font-sans text-black dark:text-white resize-none"
                            placeholder="Write your message here..."
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-pink-300 border-2 border-black dark:border-gray-500 pixel-shadow text-black font-mono text-xl hover:bg-pink-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Sending... ✨' : 'Send 💌'}
                </button>
            </form>

            {/* 2. PİXEL STİLİNDE MODAL POP-UP */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={closeModal}>
                    <div 
                        className="pixel-modal w-11/12 max-w-md bg-white dark:bg-gray-800 border-4 border-black dark:border-gray-500 pixel-shadow-lg overflow-hidden transform"
                        onClick={(e) => e.stopPropagation()} 
                    >
                        {/* Modal Header (Window Bar) */}
                        <header className={`flex items-center justify-between p-2 font-mono text-sm text-white ${modalContent.isSuccess ? 'bg-green-600' : 'bg-red-600'}`}>
                            <div>
                                {modalContent.isSuccess ? '✅ SUCCESS.exe' : '🛑 ERROR.exe'}
                            </div>
                            <button onClick={closeModal} className="w-6 h-6 bg-white dark:bg-gray-700 border-2 border-black dark:border-gray-500 flex items-center justify-center pixel-shadow-sm hover:bg-gray-200">
                                <span className="text-black dark:text-white text-xs font-bold">X</span>
                            </button>
                        </header>

                        {/* Modal Content */}
                        <div className="p-4 sm:p-6 text-center">
                            <h3 className={`font-mono text-2xl mb-3 ${modalContent.isSuccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {modalContent.title}
                            </h3>
                            <p className="font-sans text-black dark:text-white mb-6">
                                {modalContent.message}
                            </p>
                            <button 
                                onClick={closeModal}
                                className="px-6 py-2 bg-indigo-300 border-2 border-black pixel-shadow text-black font-mono hover:bg-indigo-400 transition-all"
                            >
                                {modalContent.isSuccess ? 'Awesome!' : 'Try Again'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ContactForm;