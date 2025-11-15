
// src/components/SectionContainer.tsx
import React, { ReactNode } from 'react';

type SectionProps = {
  children: ReactNode;
  id: string;
  className?: string; 
};

/**
 * Tam ekran yüksekliğe ve yuvarlak hatlı içerik kutusuna sahip ana bölüm bileşeni.
 * 'snap-start' GSAP'siz geçişleri akıcı hale getirir.
 */
const SectionContainer: React.FC<SectionProps> = ({ children, id, className = '' }) => {
  return (
    // 'min-h-screen': Tam ekran yükseklik. 'snap-start': Kaydırma kitleme noktası.
    <section 
      id={id} 
      className={`min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 relative snap-start ${className}`}
    >
      {/* Yuvarlak, şeffaf, gölgeli içerik kutusu (Stitch Referansı) */}
      <div 
        className="max-w-7xl w-full p-8 md:p-12 
                   bg-white/70 backdrop-blur-sm 
                   rounded-[3rem] shadow-xl transition-all duration-300"
      >
        {children}
      </div>
    </section>
  );
};

export default SectionContainer;