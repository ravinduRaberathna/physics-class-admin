import { useState } from 'react';
import { Calendar, MapPin, Radio, BookOpen, Heart, ArrowUpRight } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';

const formatWhatsAppNumber = (raw) => {
  const digits = String(raw || '').replace(/[^0-9]/g, '');
  if (!digits) return '94771234567';
  return digits.startsWith('0') ? `94${digits.slice(1)}` : digits;
};

const ClassesSection = ({ classes = [], onSelectClass, whatsappNumber }) => {
  const [likedIds, setLikedIds] = useState({});

  const toggleLike = (id) => {
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const wpNumber = formatWhatsAppNumber(
    whatsappNumber || import.meta.env.VITE_WHATSAPP_NUMBER || '94771234567'
  );

  const buildClassWhatsAppUrl = (cls) => {
    const scheduleStr = cls.schedule?.[0]
      ? `${cls.schedule[0].day} (${cls.schedule[0].startTime} - ${cls.schedule[0].endTime})`
      : 'Weekly Session';
    const locationsStr = cls.locations?.length > 0 ? cls.locations.join(', ') : '';
    const feeStr = cls.monthlyFee > 0 ? `Rs. ${cls.monthlyFee.toLocaleString()}` : '';

    const lines = [
      'Hello Sir, I would like to join or get more information about the following A/L Physics class:',
      '',
      `*Class:* ${cls.title}`,
      `*Batch & Stream:* ${cls.batchYear} A/L (${cls.type})`,
      `*Mode:* ${cls.deliveryMethod || 'Physical'}`,
      `*Schedule:* ${scheduleStr}`,
    ];

    if (locationsStr) {
      lines.push(`*Venues:* ${locationsStr}`);
    }
    if (feeStr) {
      lines.push(`*Monthly Fee:* ${feeStr}`);
    }

    lines.push('', 'Could you please share the enrollment details? Thank you!');

    return `https://wa.me/${wpNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  return (
    <section id="classes" className="py-8 sm:py-10 max-w-7xl mx-auto px-3 sm:px-6 font-['Poppins']">
      
      {/* SECTION HEADER */}
      <RevealOnScroll delay={100}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs uppercase tracking-widest font-semibold mb-3 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
              <span>Official Academic Streams</span>
            </div>
            <h3 className="text-3xl sm:text-4xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Academic Batches & Programs
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl font-normal leading-relaxed">
              Island Rank ඉලක්ක කරගත් ක්‍රමවේදය — සම්පූර්ණ විෂය නිර්දේශ ආවරණය, Speed Paper Drills සහ පෞද්ගලික අධීක්ෂණය.
            </p>
          </div>

          <div className="text-xs text-slate-600 bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-2.5 self-start md:self-auto font-medium">
            <Radio size={14} className="text-emerald-500 animate-pulse" />
            <span>{classes.length} Streams Active</span>
          </div>
        </div>
      </RevealOnScroll>

      {/* HORIZONTAL GRID OF CARDS (MODERN INSET IMAGE CARD STYLE) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
        {classes.length === 0 ? (
          <div className="col-span-full blueprint-card p-14 text-center rounded-3xl text-slate-500 border border-dashed border-slate-300">
            දැනට පන්ති ලියාපදිංචි කර නොමැත. Admin Panel එකෙන් අලුත් class එකක් ඇතුළත් කරන්න!
          </div>
        ) : (
          classes.map((cls, index) => {
            const isLiked = likedIds[cls._id] ?? true;

            return (
              <RevealOnScroll key={cls._id} delay={index * 120}>
                <div className="group rounded-[2.2rem] bg-white p-3.5 sm:p-4 border border-slate-200/80 shadow-[0_14px_35px_-12px_rgba(15,23,42,0.08)] hover:shadow-[0_24px_50px_-12px_rgba(15,23,42,0.14)] hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between h-full">
                  
                  <div>
                    {/* INSET ROUNDED IMAGE BOX */}
                    <div className="relative h-56 sm:h-60 w-full rounded-[1.65rem] overflow-hidden bg-gradient-to-b from-[#0b101b] via-[#1e293b] to-[#cbd5e1] shrink-0">
                      {cls.image ? (
                        <img
                          src={cls.image}
                          alt={cls.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#090d16] via-[#1e293b] to-[#cbd5e1] text-white p-6 text-center">
                          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center mb-3 shadow-lg">
                            <BookOpen size={30} className="text-white" />
                          </div>
                          <span className="text-lg font-extrabold tracking-wider uppercase text-white drop-shadow">
                            {cls.batchYear} A/L PHYSICS
                          </span>
                          <span className="text-[11px] uppercase tracking-widest text-slate-200 mt-0.5 font-medium">
                            {cls.type} • {cls.deliveryMethod}
                          </span>
                        </div>
                      )}

                      {/* Subtle top vignette so top badges always pop */}
                      <div
                        className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/50 to-transparent pointer-events-none"
                        aria-hidden="true"
                      />

                      {/* TOP-LEFT GREEN PILL ("Trending" style) & TOP-RIGHT WHITE HEART CIRCLE */}
                      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
                        <div className="flex items-center gap-1.5">
                          <span className="px-3.5 py-1 rounded-full bg-[#22c55e] text-white text-xs font-semibold tracking-wide shadow-sm">
                            {cls.batchYear} A/L • {cls.type}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md text-white text-[10px] font-semibold border border-white/15">
                            {cls.deliveryMethod}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleLike(cls._id)}
                          aria-label="Bookmark class"
                          className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center transition-transform active:scale-90 cursor-pointer shrink-0"
                        >
                          <Heart
                            size={16}
                            className={
                              isLiked
                                ? 'fill-[#ef4444] text-[#ef4444]'
                                : 'text-slate-400 hover:text-[#ef4444]'
                            }
                          />
                        </button>
                      </div>
                    </div>

                    {/* CARD TEXT CONTENT */}
                    <div className="px-2.5 pt-5 pb-2">
                      {/* Bold Title */}
                      <h4 className="text-xl sm:text-[22px] font-extrabold text-[#1e293b] group-hover:text-indigo-600 transition-colors tracking-tight leading-snug">
                        {cls.title}
                      </h4>

                      {/* Muted Description */}
                      <p className="text-xs sm:text-[13.5px] text-slate-500 mt-2 leading-relaxed line-clamp-2 font-normal">
                        {cls.description ||
                          'විෂය නිර්දේශයේ සියලුම සිද්ධාන්ත, model papers සහ විශේෂ නිබන්ධන මාලාව සමඟින් විශිෂ්ට ප්‍රතිඵලයකට මඟපෙන්වීම.'}
                      </p>

                      {/* Compact Schedule & Venue Pills */}
                      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 text-slate-700 font-medium">
                          <Calendar size={12} className="text-indigo-600 shrink-0" />
                          <span>
                            {cls.schedule?.[0]
                              ? `${cls.schedule[0].day} (${cls.schedule[0].startTime} - ${cls.schedule[0].endTime})`
                              : 'Weekly Session'}
                          </span>
                        </span>

                        {cls.locations?.length > 0 && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 text-slate-700 font-medium max-w-full truncate">
                            <MapPin size={12} className="text-emerald-600 shrink-0" />
                            <span className="truncate">{cls.locations.join(' • ')}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM ROW: BOLD PRICE ON LEFT & DARK CHARCOAL PILL BUTTON ON RIGHT */}
                  <div className="px-2.5 pt-5 pb-1.5 flex items-center justify-between gap-3">
                    <div>
                      {cls.monthlyFee > 0 && (
                        <span className="text-lg sm:text-xl font-extrabold text-[#1e293b] tracking-tight">
                          Rs. {cls.monthlyFee.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <a
                      href={buildClassWhatsAppUrl(cls)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => onSelectClass && onSelectClass(cls._id)}
                      className="px-6 py-2.5 rounded-full bg-[#22252a] hover:bg-[#111315] text-white text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 shadow-md active:scale-95 inline-flex items-center gap-1.5"
                    >
                      <span>Enroll Now</span>
                      <ArrowUpRight size={15} />
                    </a>
                  </div>

                </div>
              </RevealOnScroll>
            );
          })
        )}
      </div>

    </section>
  );
};

export default ClassesSection;