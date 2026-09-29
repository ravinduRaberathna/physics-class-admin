import { useEffect, useState } from 'react';
import API from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';
import VirtualLab from '../../components/VirtualLab';
import PageLoader from '../../components/PageLoader';
import RevealOnScroll from '../../components/RevealOnScroll';
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  PhoneCall, 
  MessageSquare, 
  Send, 
  Calendar, 
  MapPin 
} from 'lucide-react';

const Home = () => {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [classes, setClasses] = useState([]);
  const [teacher, setTeacher] = useState(null);

  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(false);

  useEffect(() => {
    API.get('/classes')
      .then((res) => setClasses(res.data))
      .catch((err) => console.error(err));

    API.get('/teacher')
      .then((res) => setTeacher(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await API.post('/inquiries', {
        studentName,
        phone,
        classInterested: selectedClassId || undefined,
        message,
      });

      setFeedback(true);

      const chosenClass = classes.find((c) => c._id === selectedClassId);
      const classTitle = chosenClass ? chosenClass.title : 'General Inquiry';
      const wpNumber = teacher?.contactInfo?.whatsapp || '94771234567';

      const wpText = encodeURIComponent(
        `Hi Sir, I would like to enroll for A/L Physics.\nName: ${studentName}\nPhone: ${phone}\nClass: ${classTitle}\nMessage: ${message || 'No additional note'}`
      );

      setTimeout(() => {
        window.open(`https://wa.me/${wpNumber}?text=${wpText}`, '_blank');
        setIsSubmitting(false);
      }, 400);
    } catch (err) {
      console.error(err);
      alert('Failed to submit enrollment');
      setIsSubmitting(false);
    }
  };

  const patternA = ['PHYSICS', 'PHYSICS', 'PHYSICS', 'PHYSICS', 'PHYSICS', 'PHYSICS'];

  return (
    <>
      {/* Intro Preloader Animation */}
      {!loadingComplete && (
        <PageLoader onComplete={() => setLoadingComplete(true)} />
      )}

      <div className="text-slate-900 font-sans antialiased overflow-x-hidden relative min-h-screen selection:bg-indigo-600 selection:text-white">
        {/* Background Math Equations */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-28 right-10 font-mono text-[9.5rem] font-black text-indigo-900/[0.03] select-none leading-none rotate-12">
            Δx·Δp ≥ ℏ/2
          </div>
          <div className="absolute top-[48rem] -left-10 font-mono text-[10.5rem] font-black text-indigo-900/[0.03] select-none leading-none -rotate-6">
            ∇×B = μ₀J
          </div>
          <div className="absolute bottom-24 right-16 font-mono text-[11rem] font-black text-indigo-900/[0.03] select-none leading-none rotate-3">
            E = mc²
          </div>
        </div>

        <Navbar teacherName={teacher?.name || 'A/L PHYSICS'} />

        <main className="relative z-10 pt-24 px-3 sm:px-6 max-w-7xl mx-auto">
          
          {/* HERO SECTION: PRESERVED DARK SPECTRUM & KINETIC CANVAS */}
          <RevealOnScroll delay={100}>
            <section id="hero" className="relative rounded-3xl hero-spectrum-card overflow-hidden min-h-[88vh] flex items-center justify-center p-6 sm:p-12 lg:p-16 my-4 shadow-2xl border border-indigo-500/30 text-white">
              
              {/* 100% ENDLESS SEAMLESS KINETIC DIAGONAL STREAM */}
              <div 
                className="absolute inset-[-80%_-50%] pointer-events-none select-none overflow-hidden flex justify-center items-center z-1 -rotate-12 origin-center kinetic-stage-masked" 
                aria-hidden="true"
              >
                <div className="flex gap-6 sm:gap-8 md:gap-10 w-[170%] justify-center">
                  
                  {/* LANE 1: Endless Downward Stream */}
                  <div className="flex flex-col shrink-0 overflow-hidden">
                    <div className="lane-down-fast">
                      <div className="flex flex-col">
                        {patternA.map((t, idx) => (
                          <span key={`l1-a-${idx}`} className={`kinetic-item-styled ${idx % 2 === 0 ? 'kinetic-fill-glow' : 'kinetic-stroke-neon'}`}>
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-col">
                        {patternA.map((t, idx) => (
                          <span key={`l1-b-${idx}`} className={`kinetic-item-styled ${idx % 2 === 0 ? 'kinetic-fill-glow' : 'kinetic-stroke-neon'}`}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* LANE 2: Endless Upward Stream */}
                  <div className="flex flex-col shrink-0 overflow-hidden">
                    <div className="lane-up-normal">
                      <div className="flex flex-col">
                        {patternA.map((t, idx) => (
                          <span key={`l2-a-${idx}`} className={`kinetic-item-styled ${idx % 2 !== 0 ? 'kinetic-fill-glow' : 'kinetic-stroke-neon'}`}>
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-col">
                        {patternA.map((t, idx) => (
                          <span key={`l2-b-${idx}`} className={`kinetic-item-styled ${idx % 2 !== 0 ? 'kinetic-fill-glow' : 'kinetic-stroke-neon'}`}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* LANE 3: Endless Downward Stream */}
                  <div className="flex flex-col shrink-0 overflow-hidden">
                    <div className="lane-down-slow">
                      <div className="flex flex-col">
                        {patternA.map((t, idx) => (
                          <span key={`l3-a-${idx}`} className={`kinetic-item-styled ${idx % 2 === 0 ? 'kinetic-fill-glow' : 'kinetic-stroke-neon'}`}>
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-col">
                        {patternA.map((t, idx) => (
                          <span key={`l3-b-${idx}`} className={`kinetic-item-styled ${idx % 2 === 0 ? 'kinetic-fill-glow' : 'kinetic-stroke-neon'}`}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* LANE 4: Endless Upward Stream */}
                  <div className="hidden md:flex flex-col shrink-0 overflow-hidden">
                    <div className="lane-up-normal">
                      <div className="flex flex-col">
                        {patternA.map((t, idx) => (
                          <span key={`l4-a-${idx}`} className={`kinetic-item-styled ${idx % 2 !== 0 ? 'kinetic-fill-glow' : 'kinetic-stroke-neon'}`}>
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-col">
                        {patternA.map((t, idx) => (
                          <span key={`l4-b-${idx}`} className={`kinetic-item-styled ${idx % 2 !== 0 ? 'kinetic-fill-glow' : 'kinetic-stroke-neon'}`}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Hero Foreground Content with Staggered Entrance Animations */}
              <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
                
                {/* 1. Batch Badge */}
                <div className="animate-hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-indigo-400/40 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-6 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>A/L PHYSICS ACADEMY • {teacher?.name || 'MASTERCLASS'}</span>
                </div>

                {/* 2. Headline */}
                <h1 className="animate-hero-title text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight font-sans drop-shadow-lg">
                  MASTER THE LAWS OF <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400">
                    THE PHYSICAL UNIVERSE
                  </span>
                </h1>

                {/* 3. Stream Subtitle */}
                <p className="animate-hero-sub font-mono text-xs sm:text-sm md:text-base text-indigo-200 mt-4 uppercase tracking-widest font-semibold max-w-2xl">
                  Comprehensive Theory • Systematic Revision • Analytical Paper Classes
                </p>

                {/* 4. Description */}
                <p className="animate-hero-desc text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mt-4 leading-relaxed font-sans font-normal">
                  {teacher?.bio || 'Designed specifically for ambitious Sri Lankan students targeting Island Top Rankings. Transform mechanical memorization into sharp conceptual clarity.'}
                </p>

                {/* 5. CTA Buttons */}
                <div className="animate-hero-cta flex flex-col sm:flex-row items-center gap-3.5 mt-8 w-full sm:w-auto">
                  <a href="#classes" className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-mono font-bold text-xs tracking-wider uppercase transition shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 border border-white/20">
                    <BookOpen size={16} />
                    <span>Explore Classes & Enroll</span>
                  </a>

                  <a href="#simulator" className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700 text-white font-mono font-bold text-xs tracking-wider uppercase transition shadow-sm flex items-center justify-center gap-2">
                    <Sparkles size={16} className="text-cyan-400" />
                    <span>Launch Virtual Lab</span>
                  </a>
                </div>

                {/* 6. Live Stat Numbers */}
                <div className="animate-hero-stats grid grid-cols-3 gap-6 sm:gap-14 pt-8 mt-8 border-t border-slate-700/80 max-w-xl w-full">
                  <div>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-cyan-400">98%</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-300 uppercase font-mono mt-0.5 tracking-wider font-semibold">Pass Rate</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-white">24+</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-300 uppercase font-mono mt-0.5 tracking-wider font-semibold">Island Top 50</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-pink-400">1800+</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-300 uppercase font-mono mt-0.5 tracking-wider font-semibold">Active Students</div>
                  </div>
                </div>

              </div>
            </section>
          </RevealOnScroll>

          {/* VENUES INFINITE SLIDING MARQUEE */}
          <RevealOnScroll delay={150}>
            <section id="venues" className="py-10 border-y border-slate-200 my-10 relative overflow-hidden blueprint-card rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-6 px-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-indigo-500/20"></div>
                  <h3 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-slate-900 font-bold">
                    Physical Class Locations (Sri Lanka)
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                  Rotary • Sakya • Sasip • Apex • Syzygy
                </span>
              </div>

              <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_96px,_black_calc(100%-96px),transparent_100%)]">
                <div className="venue-track gap-4 py-2">
                  {[
                    { name: 'Rotary Hall', loc: 'Nugegoda', time: 'Every Sunday 8:00 AM - 1:30 PM' },
                    { name: 'SASIP Institute', loc: 'Nawinna', time: 'Every Saturday 1:30 PM - 6:30 PM' },
                    { name: 'Sakya Higher Education', loc: 'Kohuwela', time: 'Every Monday 3:00 PM - 7:00 PM' },
                    { name: 'Syzygy Institute', loc: 'Nugegoda', time: 'Every Wednesday 2:30 PM - 6:00 PM' },
                    { name: 'Apex Academy', loc: 'Matara', time: 'Every Friday 2:00 PM - 6:30 PM' },
                    { name: 'Rotary Hall', loc: 'Nugegoda', time: 'Every Sunday 8:00 AM - 1:30 PM' },
                    { name: 'SASIP Institute', loc: 'Nawinna', time: 'Every Saturday 1:30 PM - 6:30 PM' },
                    { name: 'Sakya Higher Education', loc: 'Kohuwela', time: 'Every Monday 3:00 PM - 7:00 PM' },
                    { name: 'Syzygy Institute', loc: 'Nugegoda', time: 'Every Wednesday 2:30 PM - 6:00 PM' },
                    { name: 'Apex Academy', loc: 'Matara', time: 'Every Friday 2:00 PM - 6:30 PM' },
                  ].map((v, i) => (
                    <div key={i} className="w-[300px] sm:w-[340px] bg-white rounded-xl p-5 border border-slate-200 shadow-sm shrink-0 flex flex-col justify-between hover:border-indigo-500 transition-colors">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">Hub {i % 5 + 1}</span>
                          <span className="text-xs text-indigo-600 font-mono font-semibold">{v.loc}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-800">{v.name}</h4>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-600">{v.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </RevealOnScroll>

          {/* DYNAMIC CLASS PROGRAMS */}
          <section id="classes" className="py-16 max-w-7xl mx-auto">
            <RevealOnScroll delay={100}>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-600 text-xs font-mono uppercase tracking-widest font-semibold mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                    Official Curriculum
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
                    Academic Batches & Programs
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl font-mono">
                    Systematically engineered for Island Rank targets with complete syllabus coverage and model paper speed drills.
                  </p>
                </div>

                <div className="text-xs font-mono text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {classes.length} Active Streams Running
                </div>
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {classes.length === 0 ? (
                <div className="col-span-2 blueprint-card p-14 text-center rounded-3xl text-slate-500 font-mono border border-dashed border-slate-300">
                  Prastutaniki e classes register avvaledhu. Admin Panel nunchi add cheyyandi!
                </div>
              ) : (
                classes.map((cls, index) => (
                  <RevealOnScroll key={cls._id} delay={index * 120}>
                    <div className="group relative bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/90 hover:border-indigo-500/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between overflow-hidden h-full">
                      <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>

                      <div className="p-7 sm:p-8 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-5">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-lg bg-slate-900 text-white font-mono text-xs font-bold tracking-wider uppercase shadow-xs">
                              {cls.batchYear} A/L
                            </span>
                            <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-mono text-xs font-semibold uppercase">
                              {cls.type}
                            </span>
                          </div>

                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold ${
                            cls.deliveryMethod === 'Online' 
                              ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' 
                              : cls.deliveryMethod === 'Hybrid'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {cls.deliveryMethod} Delivery
                          </span>
                        </div>

                        {cls.image && (
                          <div className="mb-5 rounded-2xl overflow-hidden h-44 w-full bg-slate-100 border border-slate-200/80 relative">
                            <img 
                              src={cls.image} 
                              alt={cls.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                          </div>
                        )}

                        <h4 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                          {cls.title}
                        </h4>
                        
                        <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed font-sans line-clamp-3">
                          {cls.description || 'Sampoorna siddhantha vivarana, model paper analysis mariyu special tutorial discussions.'}
                        </p>

                        <div className="mt-6 space-y-2.5">
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 text-xs font-mono text-slate-700">
                            <div className="p-1.5 rounded-lg bg-indigo-100/70 text-indigo-600 shrink-0">
                              <Calendar size={15} />
                            </div>
                            <span className="font-medium">
                              {cls.schedule?.[0] ? `${cls.schedule[0].day}: ${cls.schedule[0].startTime} - ${cls.schedule[0].endTime}` : 'Time Scheduled Weekly'}
                            </span>
                          </div>

                          {cls.locations?.length > 0 && (
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 text-xs font-mono text-slate-700">
                              <div className="p-1.5 rounded-lg bg-cyan-100/70 text-cyan-700 shrink-0 mt-0.5">
                                <MapPin size={15} />
                              </div>
                              <span className="font-medium leading-relaxed">
                                {cls.locations.join(' • ')}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-5 pt-5 border-t border-slate-100 text-xs font-mono text-slate-600">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                            <span>Monthly Tutorial Packs</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                            <span>Timed Paper Discussions</span>
                          </div>
                        </div>
                      </div>

                      <div className="px-7 sm:px-8 py-4 bg-slate-50/90 border-t border-slate-200/80 flex items-center justify-between mt-auto">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">Monthly Tuition Fee</span>
                          <span className="text-xl font-mono font-extrabold text-slate-900 tracking-tight">
                            {cls.monthlyFee ? `Rs. ${cls.monthlyFee.toLocaleString()}` : 'Free Access'}
                          </span>
                        </div>

                        <a
                          href="#register"
                          onClick={() => setSelectedClassId(cls._id)}
                          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold uppercase tracking-wider transition shadow-md shadow-indigo-600/20 active:scale-95 flex items-center gap-1.5 border border-indigo-400/30"
                        >
                          <span>Enroll Class</span>
                          <span className="text-indigo-200">→</span>
                        </a>
                      </div>
                    </div>
                  </RevealOnScroll>
                ))
              )}
            </div>
          </section>

          {/* VIRTUAL LAB SIMULATOR */}
          <RevealOnScroll delay={150}>
            <VirtualLab />
          </RevealOnScroll>

          {/* OFFICIAL 8 UNITS */}
          <section id="modules" className="py-14 max-w-7xl mx-auto">
            <RevealOnScroll delay={100}>
              <div className="mb-10 text-center sm:text-left">
                <span className="text-xs font-mono font-semibold text-indigo-600 uppercase tracking-widest">Syllabus Scope</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Official 8 Units of A/L Physics</h3>
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: '01', title: 'Measurement', desc: 'Dimensions, Vernier Caliper, Micrometer Screw Gauge, Errors & Uncertainties.' },
                { id: '02', title: 'Mechanics', desc: "Kinematics, Newton's Laws, Work, Energy, Circular Motion, Gravitation & Fluids." },
                { id: '03', title: 'Oscillations & Waves', desc: 'Simple Harmonic Motion, Wave Superposition, Doppler Effect, Resonance.' },
                { id: '04', title: 'Thermal Physics', desc: 'Temperature Scales, Thermal Expansion, Heat Capacity, Ideal Gases & Laws.' },
                { id: '05', title: 'Fields (Electro & Grav)', desc: "Coulomb's Law, Field Intensity, Electric Potential, Capacitance & Gauss." },
                { id: '06', title: 'Current Electricity', desc: "Ohm's Law, Kirchhoff's Rules, Potentiometer Balancing, Internal Resistance." },
                { id: '07', title: 'Electromagnetism & AC', desc: "Biot-Savart Law, Faraday's & Lenz's Induction, Mutual Inductance & AC." },
                { id: '08', title: 'Modern & Electronics', desc: 'Semiconductors, Diodes, Transistors, Op-Amps, Photoelectric Effect.' },
              ].map((u, i) => (
                <RevealOnScroll key={u.id} delay={i * 80}>
                  <div className="blueprint-card p-5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-400 transition bg-white h-full flex flex-col justify-start">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center font-mono text-xs font-bold text-indigo-600 mb-3">
                      {u.id}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">{u.title}</h4>
                    <p className="text-xs text-slate-600">{u.desc}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </section>

          {/* ENROLLMENT & WHATSAPP FORM */}
          <RevealOnScroll delay={150}>
            <section id="register" className="py-14 max-w-4xl mx-auto">
              <div className="blueprint-card rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-lg bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <span className="text-xs font-mono font-semibold text-indigo-600 uppercase tracking-widest">Admissions</span>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-1">Direct WhatsApp Enrollment</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      Register now for online portal access, LMS credentials, and physical classroom verification cards.
                    </p>
                    <div className="mt-6 space-y-3 font-mono text-xs text-slate-700">
                      <div className="flex items-center gap-2">
                        <PhoneCall size={16} className="text-indigo-600" />
                        <span>Direct Hotline: {teacher?.contactInfo?.phone || '+94 77 123 4567'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare size={16} className="text-emerald-600" />
                        <span>WhatsApp: {teacher?.contactInfo?.whatsapp || '+94 77 123 4567'}</span>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleEnrollSubmit} className="space-y-3.5 bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-700 mb-1 font-semibold">Student Full Name</label>
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. Kasun Fernando"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-700 mb-1 font-semibold">WhatsApp Mobile Number</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="07XXXXXXXX"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-700 mb-1 font-semibold">Select Class Batch</label>
                      <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-indigo-600"
                      >
                        <option value="">General Physics Inquiry</option>
                        {classes.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.title} ({c.batchYear} - {c.type})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-700 mb-1 font-semibold">Message / Preferred Venue</label>
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="e.g. Joining Rotary Nugegoda Batch"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs tracking-wider uppercase transition font-mono shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:bg-slate-400"
                    >
                      <Send size={14} />
                      <span>{isSubmitting ? 'Processing...' : 'Confirm Registration on WhatsApp'}</span>
                    </button>

                    {feedback && (
                      <p className="text-[11px] text-center text-emerald-600 font-mono animate-pulse">
                        Saved! Redirecting to WhatsApp...
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </section>
          </RevealOnScroll>
        </main>

        {/* FOOTER */}
        <footer className="border-t border-slate-200 bg-white py-8 px-4 text-center font-mono text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-bold text-slate-900">{teacher?.name || 'A/L PHYSICS MASTERCLASS'}</span> • Sri Lanka Advanced Level
            </div>
            <div>
              Hotline: {teacher?.contactInfo?.phone || '+94 77 123 4567'} • Rotary • Sakya • Sasip • Syzygy
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;