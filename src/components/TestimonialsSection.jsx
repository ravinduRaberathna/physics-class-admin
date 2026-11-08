import { useEffect, useState } from 'react';
import API from '../api/axiosInstance';
import RevealOnScroll from './RevealOnScroll';
import { 
  Star, 
  Award, 
  School, 
  ShieldCheck, 
  Atom,
  Pause,
  Play
} from 'lucide-react';
import { getOptimizedAvatar } from '../utils/imageOptimizer';

const TestimonialsSection = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    API.get('/feedback/public')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setFeedbacks(res.data);
        }
      })
      .catch((err) => console.log('Feedbacks load error:', err));
  }, []);

  if (feedbacks.length === 0) return null;

  // Ensure there are enough cards to make a seamless infinite loop from left to right
  const baseList = feedbacks.length <= 4 
    ? [...feedbacks, ...feedbacks, ...feedbacks] 
    : feedbacks.length <= 8 
      ? [...feedbacks, ...feedbacks] 
      : feedbacks;

  // Duplicate for seamless 50% translation loop
  const marqueeCards = [...baseList, ...baseList];

  return (
    <section 
      id="testimonials" 
      className="py-10 sm:py-14 max-w-7xl mx-auto px-3 sm:px-6 relative font-['Poppins'] selection:bg-indigo-600 selection:text-white overflow-hidden"
    >
      {/* Keyframes for seamless Left-to-Right slow motion */}
      <style>{`
        @keyframes feedback-scroll-ltr {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .animate-feedback-ltr {
          animation: feedback-scroll-ltr 50s linear infinite;
          will-change: transform;
        }
        .animate-feedback-ltr:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="relative z-10">
        
        {/* SECTION HEADER */}
        <RevealOnScroll delay={100}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-200/80 text-indigo-700 text-xs uppercase tracking-widest font-semibold mb-3 shadow-xs">
                <Atom size={14} className="text-indigo-600 animate-spin" style={{ animationDuration: '9s' }} />
                <span>Student Hall of Fame</span>
              </div>
              <h3 className="text-3xl sm:text-4xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Rankers Speak & Experiences
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2.5 max-w-2xl font-normal leading-relaxed">
                පළමු දින සිටම අපගේ ක්‍රමවේදය කෙරෙහි විශ්වාසය තැබූ සිසුන්ගේ සැබෑ අත්දැකීම්.
              </p>
            </div>

            {/* Live Status / Pause Toggle */}
            <div className="flex items-center gap-2.5 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 hover:border-indigo-400 text-slate-700 hover:text-indigo-600 transition shadow-xs text-xs font-semibold cursor-pointer active:scale-95"
                title={isPaused ? 'Resume slow motion' : 'Pause slow motion'}
              >
                {isPaused ? <Play size={13} className="text-emerald-500" /> : <Pause size={13} className="text-amber-500" />}
                <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-500 animate-pulse'}`} />
                <span>{isPaused ? 'Paused (Click to Play)' : 'Slow Stream • Hover to Read'}</span>
              </button>
            </div>
          </div>
        </RevealOnScroll>

        {/* INFINITE MARQUEE VIEWPORT (Left to Right Motion) */}
        <div 
          className="relative w-full overflow-hidden py-4 -mx-3 sm:-mx-6 px-3 sm:px-6"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Subtle Left & Right Edge Vignette Fades */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#f8fafc] dark:from-[#070a14] to-transparent z-20 pointer-events-none" 
            aria-hidden="true"
          />
          <div 
            className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#f8fafc] dark:from-[#070a14] to-transparent z-20 pointer-events-none" 
            aria-hidden="true"
          />

          {/* Continuous Left-to-Right Animated Track */}
          <div 
            className="flex w-max gap-5 sm:gap-6 animate-feedback-ltr"
            style={{
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          >
            {marqueeCards.map((fb, idx) => (
              <div 
                key={`${fb._id || 'fb'}-${idx}`}
                className="w-[310px] sm:w-[350px] md:w-[370px] shrink-0"
              >
                {/* FROSTED GLASS CAPSULE CARD */}
                <div className="group rounded-[2.2rem] bg-white/95 backdrop-blur-xl border border-slate-200/90 hover:border-indigo-400/80 p-6 sm:p-7 flex flex-col justify-between shadow-[0_10px_35px_-10px_rgba(15,23,42,0.06)] hover:shadow-[0_24px_50px_-12px_rgba(99,102,241,0.2)] transition-all duration-300 h-[340px] sm:h-[350px] relative overflow-hidden">
                  
                  {/* Glowing Top Laser on Hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div>
                    {/* Top Identity Row */}
                    <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3 min-w-0">
                        {fb.avatar ? (
                          <img 
                            src={getOptimizedAvatar(fb.avatar)} 
                            alt={fb.studentName} 
                            loading="lazy"
                            decoding="async"
                            className="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-indigo-200 shrink-0 transition-all" 
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                            {fb.studentName?.charAt(0) || 'S'}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                              {fb.studentName}
                            </h4>
                            <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                          </div>
                          {fb.school && fb.school.trim() ? (
                            <p className="text-[11px] text-slate-400 font-medium truncate flex items-center gap-1 mt-0.5">
                              <School size={11} className="text-slate-400 shrink-0" />
                              <span className="truncate">{fb.school}</span>
                            </p>
                          ) : null}
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
                    <div className="pt-4">
                      <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal line-clamp-5">
                        "{fb.comment}"
                      </p>
                    </div>
                  </div>

                  {/* Bottom Spec Bar */}
                  <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between mt-auto">
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

      </div>
    </section>
  );
};

export default TestimonialsSection;
