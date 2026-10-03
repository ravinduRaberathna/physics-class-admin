import { Calendar, MapPin, CheckCircle2, ArrowRight, Radio, Sparkles, BookOpen } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';

const ClassesSection = ({ classes = [], onSelectClass }) => {
  return (
    <section id="classes" className="py-20 max-w-7xl mx-auto px-3 sm:px-6 font-['Poppins']">
      
      {/* SECTION HEADER */}
      <RevealOnScroll delay={100}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
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

      {/* HORIZONTAL GRID OF CARDS (SIDE BY SIDE ROW) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
        {classes.length === 0 ? (
          <div className="col-span-full blueprint-card p-14 text-center rounded-3xl text-slate-500 border border-dashed border-slate-300">
            දැනට පන්ති ලියාපදිංචි කර නොමැත. Admin Panel එකෙන් අලුත් class එකක් ඇතුළත් කරන්න!
          </div>
        ) : (
          classes.map((cls, index) => {
            const isOnline = cls.deliveryMethod === 'Online';
            const isHybrid = cls.deliveryMethod === 'Hybrid';

            return (
              <RevealOnScroll key={cls._id} delay={index * 120}>
                <div className="group rounded-[2rem] bg-white border border-slate-200/90 hover:border-indigo-400/60 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.06)] hover:shadow-[0_22px_50px_-15px_rgba(99,102,241,0.2)] transition-all duration-500 flex flex-col justify-between overflow-hidden h-full relative">
                  
                  {/* TOP CARD IMAGE WITH FLOATING TAGS */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-900 shrink-0">
                    {cls.image ? (
                      <img 
                        src={cls.image} 
                        alt={cls.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-indigo-900 via-slate-900 to-indigo-950 text-indigo-300">
                        <BookOpen size={40} className="opacity-40 mb-2" />
                        <span className="text-xs uppercase tracking-widest font-semibold opacity-60">Physics Class</span>
                      </div>
                    )}
                    
                    {/* Dark gradient for text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>

                    {/* Top Pill Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold tracking-wider uppercase border border-white/10 shadow-xs">
                          {cls.batchYear} A/L
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-indigo-600/85 backdrop-blur-md text-white text-[11px] font-semibold uppercase border border-indigo-400/30">
                          {cls.type}
                        </span>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur-md border ${
                        isOnline 
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30' 
                          : isHybrid
                          ? 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      }`}>
                        {cls.deliveryMethod}
                      </span>
                    </div>

                    {/* Bottom overlay badge inside image */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-300">
                      <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-0.5 rounded-lg border border-white/10">
                        <Sparkles size={11} className="text-cyan-400" />
                        Target Top Rankings
                      </span>
                    </div>
                  </div>

                  {/* CARD BODY CONTENT */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title */}
                      <h4 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight leading-snug">
                        {cls.title}
                      </h4>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed line-clamp-2">
                        {cls.description || 'විෂය නිර්දේශයේ සියලුම සිද්ධාන්ත, model papers සහ විශේෂ නිබන්ධන මාලාව.'}
                      </p>

                      {/* Information Pods */}
                      <div className="mt-5 space-y-2.5">
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70 text-xs text-slate-700">
                          <div className="p-1.5 rounded-xl bg-indigo-100 text-indigo-600 shrink-0">
                            <Calendar size={14} />
                          </div>
                          <span className="font-medium truncate">
                            {cls.schedule?.[0] ? `${cls.schedule[0].day}: ${cls.schedule[0].startTime} - ${cls.schedule[0].endTime}` : 'Time Scheduled Weekly'}
                          </span>
                        </div>

                        {cls.locations?.length > 0 && (
                          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70 text-xs text-slate-700">
                            <div className="p-1.5 rounded-xl bg-cyan-100 text-cyan-700 shrink-0">
                              <MapPin size={14} />
                            </div>
                            <span className="font-medium truncate">
                              {cls.locations.join(' • ')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Perks */}
                      <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                          <span>Printed Tutes</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                          <span>Paper Drills</span>
                        </div>
                      </div>
                    </div>

                    {/* PRICING & ENROLL FOOTER */}
                    <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold leading-none">Monthly Fee</span>
                        <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mt-1 inline-block">
                          {cls.monthlyFee ? `Rs. ${cls.monthlyFee.toLocaleString()}` : 'Free Access'}
                        </span>
                      </div>

                      <a
                        href="#register"
                        onClick={() => onSelectClass && onSelectClass(cls._id)}
                        className="px-4 sm:px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md shadow-indigo-600/20 active:scale-95 flex items-center gap-1.5 group/btn"
                      >
                        <span>Enroll</span>
                        <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    </div>
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