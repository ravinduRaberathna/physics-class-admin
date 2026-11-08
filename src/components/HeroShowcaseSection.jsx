import React from 'react';
import RevealOnScroll from './RevealOnScroll';
import { TiltedGridHero } from './ui/tilted-grid-hero';
import { MessageSquare, BookOpen } from 'lucide-react';

const DEFAULT_SHOWCASE_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
    alt: 'Physics Laboratory Research and Experiments',
  },
  {
    src: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=1200&q=80',
    alt: 'Quantum & Theoretical Physics Wave Models',
  },
  {
    src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    alt: 'Digital Learning & Modern Classroom Technology',
  },
  {
    src: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80',
    alt: 'Optics & Laser Light Refraction in Physics',
  },
  {
    src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    alt: 'Astrophysics, Cosmic Gravity and Universe Dimensions',
  },
  {
    src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    alt: 'Data Analysis and Problem Solving',
  },
  {
    src: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1200&q=80',
    alt: 'Advanced Mechanical and Electrical Science',
  },
  {
    src: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=1200&q=80',
    alt: 'Mathematical Equations and Pure Physics Foundations',
  },
];

const HeroShowcaseSection = ({ images = [], teacher = null }) => {
  // Use images configured by admin in MongoDB, or fallback to default curated images
  const validAdminImages = Array.isArray(images)
    ? images
        .map((img) => (typeof img === 'string' ? { src: img } : img))
        .filter((img) => img && typeof img.src === 'string' && img.src.trim() !== '' && img.alt !== '__COVER_IMAGE__')
    : [];

  const displayImages =
    validAdminImages.length > 0 ? validAdminImages : DEFAULT_SHOWCASE_IMAGES;

  const rawWp = teacher?.contactInfo?.whatsapp || import.meta.env.VITE_WHATSAPP_NUMBER || '94771234567';
  const cleanDigits = String(rawWp).replace(/[^0-9]/g, '');
  const formattedWp = cleanDigits.startsWith('0') ? `94${cleanDigits.slice(1)}` : cleanDigits || '94771234567';
  const whatsappUrl = `https://wa.me/${formattedWp}?text=${encodeURIComponent(
    `Hello ${teacher?.name || 'Sir'}, I would like to get more information about the A/L Physics classes.`
  )}`;

  return (
    <section className="relative my-10 sm:my-16 font-['Poppins']">
      <RevealOnScroll delay={80}>
        <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden border border-slate-200/80 dark:border-indigo-500/30 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-[#060914] dark:via-[#090e21] dark:to-[#04060f] shadow-2xl shadow-indigo-950/10 dark:shadow-black/50">
          {/* Ambient Lighting Accents */}
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl pointer-events-none" />

          {/* Curved Cylindrical 3D Tilted Grid Hero */}
          <TiltedGridHero
            images={displayImages}
            speed={4.5}
            tileHeight={28}
            aspectRatio={16 / 9}
            gap={6}
            axis={52}
            curve={78}
            fade={14}
            className="h-[500px] sm:h-[550px] md:h-[600px] w-full"
          >
            {/* Overlay Content Above Cylindrical Band */}
            <div className="relative z-10 flex h-full flex-col items-center justify-between py-8 sm:py-10 px-4 text-center pointer-events-none">
              
              {/* Top Title Group */}
              <div className="pointer-events-auto max-w-3xl mx-auto space-y-3">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.2] drop-shadow-sm">
                  Every Concept,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-cyan-500 to-indigo-500 dark:from-cyan-400 dark:via-indigo-300 dark:to-fuchsia-400">
                    Brought into Sharp Focus.
                  </span>
                </h2>
              </div>

              {/* Bottom Quick Action CTAs (Vertical Stack) */}
              <div className="pointer-events-auto max-w-xl mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center justify-center gap-2.5 w-full max-w-[250px]">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white text-xs font-bold tracking-wide shadow-md shadow-indigo-500/25 transition hover:scale-[1.02] active:scale-95"
                  >
                    <MessageSquare size={13} />
                    <span>Chat via WhatsApp</span>
                  </a>

                  <a
                    href="#classes"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white/95 dark:bg-slate-900/95 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-white border border-slate-200/80 dark:border-white/20 text-xs font-bold shadow-xs transition hover:scale-[1.02] active:scale-95"
                  >
                    <BookOpen size={13} className="text-indigo-600 dark:text-cyan-400" />
                    <span>Explore Batches</span>
                  </a>
                </div>
              </div>

            </div>
          </TiltedGridHero>
        </div>
      </RevealOnScroll>
    </section>
  );
};

export default HeroShowcaseSection;

