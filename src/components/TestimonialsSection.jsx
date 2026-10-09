import { useEffect, useState, useRef } from 'react';
import API from '../api/axiosInstance';
import RevealOnScroll from './RevealOnScroll';
import { 
  Star, 
  Award, 
  School, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Atom
} from 'lucide-react';

const TestimonialsSection = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(3);
  const autoSlideTimerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    API.get('/feedback/public')
      .then((res) => setFeedbacks(res.data))
      .catch((err) => console.log('Feedbacks load error:', err));
  }, []);

  const total = feedbacks.length;
  const maxIndex = Math.max(0, total - itemsPerView);

  const handleNext = () => {
    if (total <= itemsPerView) return;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    if (total <= itemsPerView) return;
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    if (isPaused || total <= itemsPerView) return;

    autoSlideTimerRef.current = setInterval(() => {
      handleNext();
    }, 4200);

    return () => {
      if (autoSlideTimerRef.current) clearInterval(autoSlideTimerRef.current);
    };
  }, [isPaused, total, maxIndex, itemsPerView]);

  if (total === 0) return null;

  return (
    <section 
      id="testimonials" 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="py-16 sm:py-20 my-0 relative overflow-hidden font-['Poppins'] selection:bg-indigo-600 selection:text-white rounded-[3rem] border border-slate-200/80 bg-gradient-to-b from-slate-50/70 via-indigo-50/20 to-slate-50/60"
    >
      {/* ========================================================
          BACKGROUND LAYER: GRID, AURORA GLOWS & WATERMARKS
         ======================================================== */}
      
      {/* 1. Precision Blueprint Grid Lines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* 2. Top-Left Cyan/Indigo Ambient Glow */}
      <div 
        className="absolute -top-24 -left-20 w-[30rem] h-[30rem] bg-gradient-to-br from-cyan-400/15 via-indigo-500/10 to-transparent blur-[110px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      {/* 3. Bottom-Right Violet/Fuchsia Ambient Glow */}
      <div 
        className="absolute -bottom-24 -right-20 w-[32rem] h-[32rem] bg-gradient-to-tl from-purple-500/15 via-pink-400/10 to-transparent blur-[120px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      {/* 4. Subtle Floating Physics Watermark Formulas */}
      <div className="absolute top-12 right-16 font-mono text-[7rem] font-black text-indigo-900/[0.03] select-none pointer-events-none leading-none rotate-6" aria-hidden="true">
        Ψ(x,t)
      </div>
      <div className="absolute bottom-8 left-12 font-mono text-[8rem] font-black text-indigo-900/[0.03] select-none pointer-events-none leading-none -rotate-12" aria-hidden="true">
        ∮B·dl
      </div>

      {/* ========================================================
          MAIN CONTENT CONTAINER
         ======================================================== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* SECTION HEADER & NAVIGATION */}
        <RevealOnScroll delay={100}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-200/80 text-indigo-700 text-xs uppercase tracking-widest font-semibold mb-3 shadow-xs">
                <Atom size={14} className="text-indigo-600 animate-spin" style={{ animationDuration: '9s' }} />
                <span>Student Hall of Fame</span>
              </div>
              <h3 className="text-3xl sm:text-4xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Rankers Speak & Experiences
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2.5 max-w-2xl font-normal leading-relaxed">
                දිවයිනේ ඉහළම සාමාර්ථ කරා ළඟා වූ අපගේ සිසුන් පන්ති ක්‍රමවේදය සහ විභාග ජයග්‍රහණය කළ අයුරු ගැන දක්වන අදහස්.
              </p>
            </div>

            {/* Navigation Controls */}
            {total > itemsPerView && (
              <div className="flex items-center gap-2.5 self-start md:self-auto">
                <button
                  onClick={handlePrev}
                  className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 hover:border-indigo-400 text-slate-700 hover:text-indigo-600 hover:shadow-lg hover:shadow-indigo-500/10 transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-xs"
                  aria-label="Previous Feedback"
                >
                  <ChevronLeft size={19} />
                </button>
                <button
                  onClick={handleNext}
                  className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 hover:border-indigo-400 text-slate-700 hover:text-indigo-600 hover:shadow-lg hover:shadow-indigo-500/10 transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-xs"
                  aria-label="Next Feedback"
                >
                  <ChevronRight size={19} />
                </button>
              </div>
            )}
          </div>
        </RevealOnScroll>

        {/* CAROUSEL VIEWPORT */}
        <div className="overflow-hidden relative pt-2 pb-6">
          <div 
            className="flex transition-transform duration-700 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
            }}
          >
            {feedbacks.map((fb) => (
              <div 
                key={fb._id}
                className="w-full md:w-1/2 lg:w-1/3 shrink-0 px-3 sm:px-3.5"
              >
                {/* FROSTED GLASS CAPSULE CARD */}
                <div className="group rounded-[2.2rem] bg-white/90 backdrop-blur-xl border border-slate-200/90 hover:border-indigo-400/80 p-6 sm:p-7 flex flex-col justify-between shadow-[0_10px_35px_-10px_rgba(15,23,42,0.06)] hover:shadow-[0_24px_50px_-12px_rgba(99,102,241,0.2)] transition-all duration-500 h-[370px] relative overflow-hidden">
                  
                  {/* Glowing Top Laser on Hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div>
                    {/* Top Identity Row */}
                    <div className="flex items-center justify-between gap-3 pb-5 border-b border-slate-100">
                      <div className="flex items-center gap-3 min-w-0">
                        {fb.avatar ? (
                          <img 
                            src={fb.avatar} 
                            alt={fb.studentName} 
                            className="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-indigo-200 shrink-0 transition-all" 
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                            {fb.studentName.charAt(0)}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                              {fb.studentName}
                            </h4>
                            <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                          </div>
                          <p className="text-[11px] text-slate-400 font-medium truncate flex items-center gap-1 mt-0.5">
                            {fb.school && <School size={11} className="text-slate-400 shrink-0" />}
                            <span className="truncate">{fb.school || fb.batch}</span>
                          </p>
                        </div>
                      </div>

                      {/* Stars Pill */}
                      <div className="flex items-center gap-0.5 bg-amber-50/80 border border-amber-200/60 px-2 py-1 rounded-xl shrink-0">
                        {[...Array(fb.rating || 5)].map((_, i) => (
                          <Star key={i} size={11} className="text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    {/* Comment Body */}
                    <div className="pt-5">
                      <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal line-clamp-5">
                        {fb.comment}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Spec Bar */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                      {fb.batch || 'A/L Examination'}
                    </span>

                    {fb.resultBadge && (
                      <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-200/80 text-indigo-700 text-[10px] font-bold tracking-wide uppercase flex items-center gap-1.5 shadow-2xs">
                        <Award size={12} className="text-indigo-600" />
                        <span>{fb.resultBadge}</span>
                      </span>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CAPSULE PAGINATION BAR */}
        {total > itemsPerView && (
          <div className="flex items-center justify-center gap-2 mt-4 relative z-10">
            {[...Array(maxIndex + 1)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className="h-1.5 rounded-full transition-all duration-500 cursor-pointer overflow-hidden bg-slate-200"
                style={{
                  width: currentIndex === i ? '2.4rem' : '0.6rem'
                }}
                aria-label={`Slide ${i + 1}`}
              >
                {currentIndex === i && (
                  <span className="block h-full w-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
                )}
              </button>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default TestimonialsSection;