import { useState } from 'react';
import { 
  Atom, 
  Sparkles, 
  Calendar, 
  ArrowUpRight, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  BookOpen, 
  ExternalLink,
  ChevronRight,
  Flame,
  CheckCircle2,
  GraduationCap,
  Send
} from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';

// Physics themed showcase cards for the right-hand angled upward marquee
const physicsCardsColumn1 = [
  {
    id: 1,
    title: 'Wave Optics & Laser Lab',
    tag: 'Exp 14',
    category: 'Practicals',
    image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=400&q=80',
    color: 'from-blue-500/80 to-indigo-600/80'
  },
  {
    id: 2,
    title: 'Newtonian Mechanics',
    tag: 'Unit 02',
    category: '2026/2027 Theory',
    image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80',
    color: 'from-violet-500/80 to-purple-700/80'
  },
  {
    id: 3,
    title: 'Logic Gates & Digital',
    tag: 'Unit 10',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
    color: 'from-cyan-500/80 to-blue-600/80'
  },
  {
    id: 4,
    title: 'Island Rank 01 Results',
    tag: 'A* Star',
    category: 'Hall of Fame',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80',
    color: 'from-amber-500/80 to-orange-600/80'
  }
];

const physicsCardsColumn2 = [
  {
    id: 5,
    title: 'Electromagnetic Fields',
    tag: 'Unit 07',
    category: 'Advanced Theory',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80',
    color: 'from-fuchsia-500/80 to-purple-600/80'
  },
  {
    id: 6,
    title: 'Gravitation & Orbits',
    tag: 'Unit 04',
    category: 'Astrophysics',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
    color: 'from-sky-500/80 to-indigo-600/80'
  },
  {
    id: 7,
    title: 'Complete 42 Practicals',
    tag: 'All Labs',
    category: 'Practical Mastery',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=80',
    color: 'from-emerald-500/80 to-teal-700/80'
  },
  {
    id: 8,
    title: '150+ Model Papers',
    tag: 'Revision',
    category: 'Past Paper Clinic',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
    color: 'from-rose-500/80 to-pink-700/80'
  }
];

const Footer = ({ teacher }) => {
  const teacherName = teacher?.name || 'Eng. Chamath Dissanayake';
  const phone = teacher?.contactInfo?.phone || '+94 77 123 4567';
  const whatsapp = teacher?.contactInfo?.whatsapp || '94771234567';
  const email = teacher?.contactInfo?.email || 'info@chamathphysics.lk';
  
  const cleanWhatsapp = String(whatsapp).replace(/[^0-9]/g, '');
  const formattedWp = cleanWhatsapp.startsWith('0') ? `94${cleanWhatsapp.slice(1)}` : cleanWhatsapp || '94771234567';
  
  const whatsappEnrollUrl = `https://wa.me/${formattedWp}?text=${encodeURIComponent(
    'Hello Sir, I would like to enroll in the A/L Physics Masterclass. Could you please share the registration details?'
  )}`;

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-[#090b11] text-slate-300 font-['Poppins'] overflow-hidden">
      
      {/* =========================================================================
          TOP FLOATING CTA BANNER — PURPLE CARD WITH ANGLED UPWARD MOVING CARDS
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12 relative z-10">
        <RevealOnScroll delay={100}>
          <div className="relative rounded-3xl sm:rounded-[36px] bg-gradient-to-br from-[#4c1d95] via-[#5b21b6] to-[#7c3aed] border border-white/20 shadow-2xl shadow-indigo-950/60 overflow-hidden text-white p-6 sm:p-10 lg:p-14">
            
            {/* Ambient Background Glow & Checker Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_20%,rgba(192,132,252,0.35),transparent_70%)] pointer-events-none" />
            <div 
              className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" 
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
                maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
              }}
            />
            <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-violet-400/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-indigo-400/25 blur-3xl pointer-events-none" />

            {/* -------------------------------------------------------------
                LEFT SIDE: ANGLED STACKED CARDS (PEEKING FROM THE LEFT EDGE)
               ------------------------------------------------------------- */}
            <div className="hidden xl:block absolute -left-12 top-1/2 -translate-y-1/2 pointer-events-none select-none z-10">
              <div className="relative w-48 h-64">
                {/* Tilted Card 1 (Back / Top) */}
                <div className="absolute -top-6 left-0 w-44 h-24 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 shadow-xl border border-white/30 transform -rotate-[22deg] p-3 text-white flex flex-col justify-between opacity-90 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full">Speed Revision</span>
                    <Award className="w-4 h-4 text-amber-200" />
                  </div>
                  <div className="text-xs font-bold leading-tight">150+ Model Papers & Speed Tests</div>
                </div>

                {/* Tilted Card 2 (Middle) */}
                <div className="absolute top-14 left-4 w-44 h-24 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 shadow-2xl border border-white/30 transform -rotate-[16deg] p-3 text-white flex flex-col justify-between backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full">2026 A/L</span>
                    <Sparkles className="w-4 h-4 text-pink-200" />
                  </div>
                  <div className="text-xs font-bold leading-tight">Complete Theory Masterclass</div>
                </div>

                {/* Tilted Card 3 (Front / Bottom) */}
                <div className="absolute top-36 left-8 w-44 h-24 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-600 shadow-2xl border border-white/40 transform -rotate-[10deg] p-3 text-white flex flex-col justify-between backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full">2027 A/L</span>
                    <Atom className="w-4 h-4 text-cyan-200" />
                  </div>
                  <div className="text-xs font-bold leading-tight">New Intake Theory Syllabus</div>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------
                RIGHT SIDE: ANGLED CONTINUOUS UPWARD MOVING CARDS STREAM
               ------------------------------------------------------------- */}
            <div 
              className="absolute -right-8 sm:-right-4 md:right-0 lg:right-4 -top-28 -bottom-28 w-44 sm:w-64 md:w-80 lg:w-[410px] pointer-events-none select-none overflow-hidden z-10 opacity-70 sm:opacity-90 lg:opacity-100"
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
              }}
            >
              {/* Rotated Parent Wrapper: transforms the vertical scroll into an angled trajectory */}
              <div className="h-full w-full transform -rotate-[13deg] flex justify-end gap-3 sm:gap-4 lg:gap-5 pr-2">
                
                {/* Column 1 — Scrolling Continuously Upward */}
                <div className="flex flex-col gap-3.5 sm:gap-4 animate-scroll-up-1">
                  {[...physicsCardsColumn1, ...physicsCardsColumn1].map((card, idx) => (
                    <div
                      key={`col1-${idx}`}
                      className="w-32 sm:w-36 md:w-40 lg:w-44 h-24 sm:h-28 md:h-32 rounded-2xl bg-slate-900/90 border border-white/25 shadow-2xl shadow-indigo-950/70 overflow-hidden relative flex-shrink-0 group backdrop-blur-md"
                    >
                      <img 
                        src={card.image} 
                        alt={card.title} 
                        loading="lazy" 
                        className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2.5 sm:p-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                            {card.tag}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        </div>
                        <div>
                          <div className="text-[10px] sm:text-[11px] font-semibold text-violet-200 line-clamp-1">
                            {card.category}
                          </div>
                          <div className="text-[11px] sm:text-xs font-bold text-white line-clamp-1 leading-snug">
                            {card.title}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Column 2 — Staggered Column Scrolling Continuously Upward */}
                <div className="flex flex-col gap-3.5 sm:gap-4 animate-scroll-up-2 pt-14">
                  {[...physicsCardsColumn2, ...physicsCardsColumn2].map((card, idx) => (
                    <div
                      key={`col2-${idx}`}
                      className="w-32 sm:w-36 md:w-40 lg:w-44 h-24 sm:h-28 md:h-32 rounded-2xl bg-slate-900/90 border border-white/25 shadow-2xl shadow-indigo-950/70 overflow-hidden relative flex-shrink-0 group backdrop-blur-md"
                    >
                      <img 
                        src={card.image} 
                        alt={card.title} 
                        loading="lazy" 
                        className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2.5 sm:p-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                            {card.tag}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        </div>
                        <div>
                          <div className="text-[10px] sm:text-[11px] font-semibold text-cyan-200 line-clamp-1">
                            {card.category}
                          </div>
                          <div className="text-[11px] sm:text-xs font-bold text-white line-clamp-1 leading-snug">
                            {card.title}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* -------------------------------------------------------------
                CENTER CONTENT: HEADLINE, SUBTITLE, PILL BUTTONS & STATS
               ------------------------------------------------------------- */}
            <div className="relative z-20 max-w-2xl xl:ml-36">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>2026 & 2027 A/L Theory & Revision Intakes</span>
              </div>

              {/* Main Heading */}
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4 drop-shadow-md">
                Join Chamath Sir&apos;s <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-white via-indigo-100 to-violet-200 bg-clip-text text-transparent">
                  Physics Masterclass Today
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-violet-100/90 leading-relaxed mb-8 max-w-xl">
                Make your Advanced Level dreams a reality. Master every fundamental theory, past paper trap, and practical experiment with island-recognized guidance!
              </p>

              {/* Pill Action Buttons (Matching reference image Google Play & App Store buttons) */}
              <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 mb-10">
                
                {/* Button 1: WhatsApp Enroll (White Sleek Pill) */}
                <a
                  href={whatsappEnrollUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-white text-slate-900 font-bold text-sm shadow-xl shadow-black/25 hover:bg-violet-50 hover:scale-[1.03] transition-all duration-200 active:scale-95 group"
                >
                  {/* WhatsApp SVG Icon */}
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-5 h-5 fill-emerald-500 group-hover:scale-110 transition-transform"
                  >
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.149.929 3.182 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.768-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.941-.708-1.792s.448-1.272.607-1.446c.159-.175.346-.219.462-.219s.231.006.332.012c.107.006.251-.041.391.296.144.347.491 1.2.534 1.288.043.088.072.19.014.305-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.353.101.173.449.741.964 1.2 1.05.938 1.936 1.228 2.211 1.365.275.137.434.116.593-.067.159-.183.679-.791.86-.106.181.183.361.378.853.623.491.245.818.406.934.609.116.202.116.852-.028 1.257z" />
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.84.5 3.56 1.37 5.05L2 22l5.09-1.33C8.52 21.52 10.21 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.27c-1.57 0-3.04-.44-4.29-1.21l-.31-.19-3.19.83.85-3.11-.2-.32C4.04 14.98 3.57 13.53 3.57 12c0-4.65 3.78-8.43 8.43-8.43s8.43 3.78 8.43 8.43-3.78 8.27-8.43 8.27z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 leading-none">Register Now</div>
                    <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">Enroll via WhatsApp</div>
                  </div>
                </a>

                {/* Button 2: Explore Batches (Dark Translucent Pill) */}
                <button
                  type="button"
                  onClick={() => scrollToSection('classes')}
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white font-bold text-sm border border-white/20 shadow-xl shadow-black/20 hover:scale-[1.03] transition-all duration-200 active:scale-95 group"
                >
                  <Calendar className="w-5 h-5 text-violet-300 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-violet-200 leading-none">Official Streams</div>
                    <div className="text-xs sm:text-sm font-extrabold text-white leading-tight">Explore Batches</div>
                  </div>
                </button>

              </div>

              {/* -------------------------------------------------------------
                  STATS ROW (4 COLUMNS - MATCHING THE DESIGN OF REFERENCE IMAGE)
                 ------------------------------------------------------------- */}
              <div className="pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                    +10
                  </div>
                  <div className="text-[11px] sm:text-xs text-violet-200 font-medium mt-0.5">
                    Years Excellence
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                    +5,000
                  </div>
                  <div className="text-[11px] sm:text-xs text-violet-200 font-medium mt-0.5">
                    Students Guided
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                    98%
                  </div>
                  <div className="text-[11px] sm:text-xs text-violet-200 font-medium mt-0.5">
                    A/L Pass Rate
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                    +150
                  </div>
                  <div className="text-[11px] sm:text-xs text-violet-200 font-medium mt-0.5">
                    Model Papers
                  </div>
                </div>
              </div>

            </div>

          </div>
        </RevealOnScroll>
      </div>


      {/* =========================================================================
          BOTTOM DARK FOOTER SECTION — SLEEK OBSIDIAN NAV & BRAND LINKS
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-4 relative z-10">
        
        {/* Main Grid: Brand + 3 Column Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand & About (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <Atom className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white block">
                  {teacherName.toUpperCase()}
                </span>
                <span className="text-[11px] font-semibold tracking-wider text-indigo-400 uppercase block -mt-1">
                  A/L Physics Masterclass • Sri Lanka
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              උසස් පෙළ භෞතික විද්‍යාව විෂය නිර්දේශය තර්කානුකූලව සහ ප්‍රායෝගිකව විභාග ජයග්‍රහණය දක්වා මෙහෙයවන දිවයිනේ ප්‍රමුඛතම භෞතික විද්‍යා පන්තිය.
            </p>

            {/* Social Links Row */}
            <div className="flex items-center gap-3 pt-2">
              {/* WhatsApp */}
              <a
                href={whatsappEnrollUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-emerald-600 hover:text-white border border-white/10 text-slate-300 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
              >
                <Phone className="w-4 h-4" />
              </a>

              {/* YouTube */}
              <a
                href={teacher?.socialLinks?.youtube || "https://youtube.com"}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-red-600 hover:text-white border border-white/10 text-slate-300 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href={teacher?.socialLinks?.facebook || "https://facebook.com"}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-blue-600 hover:text-white border border-white/10 text-slate-300 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* Telegram */}
              <a
                href={teacher?.socialLinks?.telegram || "https://t.me"}
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
                className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-sky-500 hover:text-white border border-white/10 text-slate-300 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </a>

              {/* Email */}
              <a
                href={`mailto:${email}`}
                aria-label="Email"
                className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-violet-600 hover:text-white border border-white/10 text-slate-300 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Academic Streams (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">
              Streams (පන්ති)
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button type="button" onClick={() => scrollToSection('classes')} className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-violet-500" /> 2026 A/L Theory
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('classes')} className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-violet-500" /> 2027 A/L Theory
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('classes')} className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-violet-500" /> Speed Revision
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('classes')} className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-violet-500" /> Model Paper Class
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('classes')} className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-violet-500" /> 42 Lab Practicals
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">
              Navigation (පිටු)
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button type="button" onClick={() => scrollToSection('hero')} className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-violet-500" /> මුල් පිටුව (Home)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('lecturer')} className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-violet-500" /> දේශකයා (About Sir)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('testimonials')} className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-violet-500" /> ප්‍රතිඵල (Results)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('blogs')} className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-violet-500" /> ලිපි (Study Blogs)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('contact')} className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-violet-500" /> සම්බන්ධ වන්න (Contact)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Venues & Hotline (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">
              Centers & Venues
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-violet-400 mt-0.5 flex-shrink-0" />
                <span>Rotary Hall & SASIP — Nugegoda</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-violet-400 mt-0.5 flex-shrink-0" />
                <span>Sakya Higher Education — Kohuwela</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-violet-400 mt-0.5 flex-shrink-0" />
                <span>Syzygy Institute — Gampaha</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>All Island Live Stream (Zoom / LMS)</span>
              </li>
            </ul>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-white/10 text-xs font-medium text-slate-300">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hotline: {phone}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Contact */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} <span className="font-semibold text-slate-400">{teacherName}</span> • A/L Physics Masterclass. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" /> {email}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500">Sri Lanka Advanced Level</span>
          </div>
        </div>

      </div>

    </footer>
  );
};

export default Footer;

