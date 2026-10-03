import { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Sparkle, 
  CheckCircle2 
} from 'lucide-react';

const venuesList = [
  { 
    name: 'Rotary Hall', 
    loc: 'Nugegoda', 
    hall: 'Main Auditorium (A/C)', 
    time: 'Every Sunday • 08:00 AM - 01:30 PM', 
    tag: 'Premier Hub', 
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    features: ['1200+ Seating Capacity', 'Live Overhead 4K Projection', 'Individual Acoustic Audio Desks']
  },
  { 
    name: 'SASIP Institute', 
    loc: 'Nawinna', 
    hall: 'Auditorium Complex 02', 
    time: 'Every Saturday • 01:30 PM - 06:30 PM', 
    tag: 'Flagship Center', 
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    features: ['Tiered Lecture Hall', 'Studio-Grade Acoustics', 'Tutorial Helpdesk Station']
  },
  { 
    name: 'Sakya Higher Education', 
    loc: 'Kohuwela', 
    hall: 'Block B - Hall 04', 
    time: 'Every Monday • 03:00 PM - 07:00 PM', 
    tag: 'Theory Center', 
    badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    features: ['Multi-Zone Climate Control', 'Interactive Screen System', 'Dedicated Vehicle Parking']
  },
  { 
    name: 'Syzygy Institute', 
    loc: 'Nugegoda', 
    hall: 'Upper Deck Lecture Room', 
    time: 'Every Wednesday • 02:30 PM - 06:00 PM', 
    tag: 'Speed Revision', 
    badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    features: ['Paper Discussion Setup', 'Biometric Gate Access', 'High-Speed WiFi Study Lounge']
  },
  { 
    name: 'Apex Academy', 
    loc: 'Matara', 
    hall: 'Central Hall A', 
    time: 'Every Friday • 02:00 PM - 06:30 PM', 
    tag: 'Southern Hub', 
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    features: ['Direct Highway Express Access', 'Full Acoustic Dispersion', 'On-Site Exam Hall']
  },
];

const VenuesCarousel = ({ onSelectVenue }) => {
  const [activeVenueIdx, setActiveVenueIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoSlideTimerRef = useRef(null);

  const handlePrevVenue = () => {
    setActiveVenueIdx((prev) => (prev === 0 ? venuesList.length - 1 : prev - 1));
  };

  const handleNextVenue = () => {
    setActiveVenueIdx((prev) => (prev === venuesList.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (isPaused) return;

    autoSlideTimerRef.current = setInterval(() => {
      handleNextVenue();
    }, 3800);

    return () => {
      if (autoSlideTimerRef.current) clearInterval(autoSlideTimerRef.current);
    };
  }, [isPaused, activeVenueIdx]);

  return (
    <section 
      id="venues"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="py-16 my-10 relative overflow-hidden rounded-3xl bg-[#090d16] border border-white/[0.08] shadow-2xl p-6 sm:p-12 text-slate-100 font-['Poppins']"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-indigo-600/15 blur-[100px] pointer-events-none"></div>

      {/* Header with Controls */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-cyan-400 text-xs font-mono uppercase tracking-widest font-semibold mb-3">
            <Sparkle size={12} className="animate-spin text-cyan-400" style={{ animationDuration: '6s' }} />
            Islandwide Physical Locations
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Lecture Theatres & Campus Hubs
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-normal">
            Tiered auditoriums with optical 4K multi-projection & individual exam stations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handlePrevVenue}
            className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.08] transition active:scale-95 cursor-pointer"
            aria-label="Previous Location"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNextVenue}
            className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.08] transition active:scale-95 cursor-pointer"
            aria-label="Next Location"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* 3D Orbiting Cards Carousel */}
      <div className="relative py-8 flex items-center justify-center min-h-[490px] carousel-stage overflow-hidden sm:overflow-visible">
        <div className="relative w-full max-w-5xl h-[420px] flex items-center justify-center">
          {venuesList.map((venue, idx) => {
            const total = venuesList.length;
            let diff = (idx - activeVenueIdx) % total;
            if (diff < -Math.floor(total / 2)) diff += total;
            if (diff > Math.floor(total / 2)) diff -= total;

            const isCenter = diff === 0;
            const isRight = diff === 1;
            const isLeft = diff === -1;

            let transform = '';
            let zIndex = 10;
            let opacity = 0;
            let pointerEvents = 'none';

            if (isCenter) {
              transform = 'translate3d(-50%, -50%, 80px) rotateY(0deg) scale(1)';
              zIndex = 30;
              opacity = 1;
              pointerEvents = 'auto';
            } else if (isRight) {
              transform = 'translate3d(15%, -50%, -140px) rotateY(-26deg) scale(0.84)';
              zIndex = 20;
              opacity = 0.55;
              pointerEvents = 'auto';
            } else if (isLeft) {
              transform = 'translate3d(-115%, -50%, -140px) rotateY(26deg) scale(0.84)';
              zIndex = 20;
              opacity = 0.55;
              pointerEvents = 'auto';
            } else {
              const offscreenX = diff > 0 ? '120%' : '-180%';
              transform = `translate3d(${offscreenX}, -50%, -350px) rotateY(${diff > 0 ? -40 : 40}deg) scale(0.65)`;
              zIndex = 5;
              opacity = 0;
            }

            return (
              <div
                key={venue.name}
                onClick={() => {
                  if (isRight) handleNextVenue();
                  if (isLeft) handlePrevVenue();
                }}
                style={{
                  top: '50%',
                  left: '50%',
                  transform,
                  zIndex,
                  opacity,
                  pointerEvents,
                }}
                className={`card-orbit-anim absolute w-[92%] sm:w-[480px] md:w-[500px] rounded-3xl p-7 sm:p-8 flex flex-col justify-between cursor-pointer select-none ${
                  isCenter
                    ? 'bg-[#101625]/95 border border-indigo-500/40 shadow-[0_25px_60px_-12px_rgba(99,102,241,0.32)] ring-1 ring-indigo-500/30'
                    : 'bg-[#0c111d]/85 border border-white/[0.06] shadow-xl hover:opacity-85'
                }`}
              >
                {isCenter && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-20 bg-indigo-500/20 blur-2xl pointer-events-none rounded-full"></div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase border ${venue.badge}`}>
                      {venue.tag}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.06]">
                      <MapPin size={13} className="text-cyan-400" />
                      {venue.loc}
                    </span>
                  </div>

                  <h4 className={`font-black tracking-tight text-white transition-colors duration-500 ${
                    isCenter ? 'text-2xl sm:text-3xl' : 'text-lg text-slate-300'
                  }`}>
                    {venue.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    {venue.hall}
                  </p>

                  <div className={`mt-6 p-4 rounded-2xl border flex items-center gap-3 text-xs transition-colors duration-500 ${
                    isCenter 
                      ? 'bg-white/[0.03] border-white/[0.08] text-cyan-200 font-medium' 
                      : 'bg-white/[0.01] border-white/[0.04] text-slate-400'
                  }`}>
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <Clock size={16} />
                    </div>
                    <span>{venue.time}</span>
                  </div>

                  {isCenter && (
                    <div className="mt-6 space-y-2.5 border-t border-white/[0.06] pt-5">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                        Auditorium Specifications:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                        {venue.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2">
                            <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-5 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    Verified Seating
                  </span>
                  <a
                    href="#register"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectVenue) {
                        onSelectVenue(`Joining ${venue.name} (${venue.loc}) Batch`);
                      }
                    }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition flex items-center gap-1.5 ${
                      isCenter
                        ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white shadow-lg shadow-indigo-500/20 active:scale-95'
                        : 'bg-white/[0.05] text-slate-300'
                    }`}
                  >
                    <span>Reserve Seat</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {venuesList.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveVenueIdx(i)}
            className="relative h-1.5 rounded-full overflow-hidden transition-all duration-500 cursor-pointer bg-white/[0.1]"
            style={{
              width: activeVenueIdx === i ? '2.8rem' : '0.6rem'
            }}
            aria-label={`Go to slide ${i + 1}`}
          >
            {activeVenueIdx === i && (
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-cyan-400" />
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default VenuesCarousel;