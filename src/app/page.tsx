// src/app/page.tsx
import Header from '@/components/Header';
import SectionContainer from '@/components/SectionContainer';
// Ekleyeceğimiz diğer bileşenler (HeroContent, ProjectList vb.)

export default function Home() {
  return (
    <main className="relative">
      {/* Header tüm sayfalarda üstte sabit kalır */}
      <Header />
      
      {/* 1. GİRİŞ/HERO Bölümü */}
      <SectionContainer id="hero">
        <h2 className="text-7xl md:text-9xl text-center mb-4">
          Selam! Ben Zişan!
        </h2>
        <p className="text-xl md:text-3xl text-center text-text-default font-sans">
          Full-Stack Web / Mobile Developer
        </p>
        {/* Buraya sevimli, animasyonlu bir çıkartma veya GIF ekleyebilirsiniz */}
      </SectionContainer>
      
      {/* 2. HAKKIMDA Bölümü */}
      <SectionContainer id="about">
        <h2 className="text-5xl mb-6">
          Hakkımda 💖
        </h2>
        <p className="text-lg text-text-default">
          Merhaba! Ben bu dijital dünyanın yeni yaratıcısıyım. 2000lerin estetiği, parlak renkler ve yüksek interaktifliği birleştirerek özgün deneyimler tasarlamayı seviyorum.
        </p>
        {/* Daha sonra bu kısma interaktif beceri kartları ekleyeceğiz. */}
      </SectionContainer>

      {/* 3. PROJELER Bölümü */}
      <SectionContainer id="projects">
        <h2 className="text-5xl mb-6">
          Projeler 💾
        </h2>
        <p className="text-lg text-text-default">
          Yuvarlak hatlı modüller ve bol animasyonlu projelerime göz atın!
        </p>
        {/* Buraya ProjectCard bileşenleri gelecek. */}
      </SectionContainer>
      
      {/* 4. İLETİŞİM Bölümü */}
      <SectionContainer id="contact">
        <h2 className="text-5xl mb-6">
          İletişim Kur! 💌
        </h2>
        {/* Buraya interaktif iletişim formu gelecek. */}
      </SectionContainer>

    </main>
  );
}