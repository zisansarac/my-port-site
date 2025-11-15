// tailwind.config.ts
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme'; 

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 1. Kawaii Renk Paleti (Yuvarlak, yumuşak tonlar)
      colors: {
        'kawaii-pink': '#FFC0CB',        // Pastel Pembe (Ana Vurgu)
        'retro-neon': '#39FF14',         // Parlak Neon Yeşil (Arayüz Vurgusu)
        'bg-primary': '#F7F3FF',         // Açık Mor-Gri Arka Plan (Referans sitenin temiz zeminine benzer)
        'text-accent': '#7E22CE',        // Mor (Pixel ve Önemli Metin Vurgusu)
        'text-default': '#333333',       // Koyu Gri Metin
      },

      // 2. Pixel & Retro Fontlar
      fontFamily: {
        pixel: ['Pixel-Kawaii', ...defaultTheme.fontFamily.sans],
        retro: ['Retro-Digital', ...defaultTheme.fontFamily.sans],
        sans: ['Inter', ...defaultTheme.fontFamily.sans], // Gövde metni
      },

      // 3. 2000'ler Tarzı Gölge ve Yumuşak Hatlar
      boxShadow: {
        // Kalın blok gölge (Pixel estetiği)
        '2000s': '8px 8px 0px 0px theme(colors.text-accent)', 
        // Yumuşak neon parlama (UI vurgusu)
        'neon': '0 0 10px theme(colors.retro-neon), 0 0 20px theme(colors.retro-neon)',
      },
    },
  },
  plugins: [],
};

export default config;