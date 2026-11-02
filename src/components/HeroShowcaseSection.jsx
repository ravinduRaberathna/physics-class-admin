import React from 'react';
import RevealOnScroll from './RevealOnScroll';
import { TiltedGridHero } from './ui/tilted-grid-hero';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

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

const HeroShowcaseSection = ({ images = [] }) => {
  // Use images configured by admin in MongoDB, or fallback to default curated images
  const validAdminImages = Array.isArray(images)
    ? images
        .map((img) => (typeof img === 'string' ? { src: img } : img))
        .filter((img) => img && typeof img.src === 'string' && img.src.trim() !== '')
    : [];

  const displayImages =
    validAdminImages.length >= 2 ? validAdminImages : DEFAULT_SHOWCASE_IMAGES;

  return (
    <section className="relative my-8 sm:my-14 font-['Poppins']">
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
            axis={54}
            curve={78}
            fade={14}
            className="h-[480px] sm:h-[540px] md:h-[580px] w-full"
          >
            {/* Overlay Content Above Cylindrical Band */}
            <div className="relative z-10 flex h-full flex-col items-center justify-between py-8 sm:py-12 px-4 text-center pointer-events-none">
              
              {/* Top Title Group */}
              <div className="pointer-events-auto max-w-3xl mx-auto space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 dark:bg-slate-900/80 backdrop-blur-md border border-indigo-200/80 dark:border-indigo-400/30 text-indigo-700 dark:text-cyan-300 text-[10px] sm:text-xs font-bold tracking-wider uppercase shadow-md">
                  <Sparkles size={13} className="text-indigo-600 dark:text-cyan-400" />
                  <span>Interactive Visual Experience</span>
                </div>

                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.2] drop-shadow-sm">
                  Every Concept,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-cyan-500 to-indigo-500 dark:from-cyan-400 dark:via-indigo-300 dark:to-fuchsia-400">
                    Brought into Sharp Focus.
                  </span>
                </h2>
              </div>

              {/* Bottom Subtle Pill Description */}
              <div className="pointer-events-auto max-w-xl mx-auto">
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 py-2.5 px-5 rounded-2xl border border-slate-200/80 dark:border-indigo-500/30 shadow-lg leading-relaxed font-normal">
                  පන්ති කාමරයේ සජීවී අවස්ථා, ප්‍රායෝගික පරීක්ෂණ සහ තාර්කික සංකල්ප විශ්ලේෂණය එකම අත්දැකීමක් ලෙස.
                </p>
              </div>

            </div>
          </TiltedGridHero>
        </div>
      </RevealOnScroll>
    </section>
  );
};

export default HeroShowcaseSection;

