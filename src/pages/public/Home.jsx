import { useEffect, useState } from 'react';
import API from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';
import VirtualLab from '../../components/VirtualLab';
import PageLoader from '../../components/PageLoader';
import RevealOnScroll from '../../components/RevealOnScroll';
import VenuesCarousel from '../../components/VenuesCarousel';
import ClassesSection from '../../components/ClassesSection';
import TestimonialsSection from '../../components/TestimonialsSection';
import { 
  BookOpen, 
  Sparkles, 
  PhoneCall, 
  MessageSquare, 
  Send 
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
      {!loadingComplete && (
        <PageLoader onComplete={() => setLoadingComplete(true)} />
      )}

      <div className="text-slate-900 font-['Poppins'] antialiased overflow-x-hidden relative min-h-screen selection:bg-indigo-600 selection:text-white">
        {/* Subtle Background Math Formulas */}
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

        <main className="relative z-10 pt-2 sm:pt-3 px-2 sm:px-4 md:px-6 max-w-[1536px] mx-auto">
          
          {/* HERO SECTION */}
          <RevealOnScroll delay={100}>
            <section 
              id="hero" 
              className="relative rounded-3xl sm:rounded-[2.5rem] hero-spectrum-card overflow-hidden min-h-[90vh] md:h-[calc(100vh-1rem)] md:min-h-[640px] md:max-h-[960px] flex items-center justify-center px-4 py-20 sm:p-10 lg:p-14 shadow-[0_25px_60px_-15px_rgba(99,102,241,0.25)] border border-indigo-500/30 text-white font-['Poppins']"
            >
              <div 
                className="absolute inset-[-60%_-30%] sm:inset-[-80%_-50%] pointer-events-none select-none overflow-hidden flex justify-center items-center z-1 -rotate-12 origin-center kinetic-stage-masked opacity-60 sm:opacity-100" 
                aria-hidden="true"
              >
                <div className="flex gap-4 sm:gap-8 md:gap-10 w-[200%] sm:w-[170%] justify-center">
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
                </div>
              </div>

              <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center justify-center my-auto w-full">
                <div className="animate-hero-badge inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-indigo-400/40 text-cyan-300 text-[10px] sm:text-xs font-medium tracking-wider uppercase mb-3.5 sm:mb-6 shadow-sm max-w-full truncate">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400 animate-pulse shrink-0"></span>
                  <span className="truncate">A/L PHYSICS ACADEMY • {teacher?.name || 'MASTERCLASS'}</span>
                </div>

                <h1 className="animate-hero-title text-[1.85rem] xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.18] sm:leading-tight drop-shadow-lg px-1">
                  MASTER THE LAWS OF <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400">
                    THE PHYSICAL UNIVERSE
                  </span>
                </h1>

                <p className="animate-hero-sub text-[11px] sm:text-sm md:text-base text-indigo-200 mt-3 sm:mt-4 uppercase tracking-wider sm:tracking-widest font-semibold max-w-2xl px-2 leading-relaxed">
                  Comprehensive Theory • Systematic Revision • Paper Classes
                </p>

                <p className="animate-hero-desc text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mt-2.5 sm:mt-4 leading-relaxed font-normal px-2">
                  {teacher?.bio || 'Designed specifically for ambitious Sri Lankan students targeting Island Top Rankings. Transform mechanical memorization into sharp conceptual clarity.'}
                </p>

                <div className="animate-hero-cta flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto px-2">
                  <a href="#classes" className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold text-xs tracking-wider uppercase transition shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 border border-white/20 active:scale-95">
                    <BookOpen size={15} />
                    <span>Explore Classes & Enroll</span>
                  </a>

                  <a href="#simulator" className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700 text-white font-semibold text-xs tracking-wider uppercase transition shadow-sm flex items-center justify-center gap-2 active:scale-95">
                    <Sparkles size={15} className="text-cyan-400" />
                    <span>Launch Virtual Lab</span>
                  </a>
                </div>

                <div className="animate-hero-stats grid grid-cols-3 gap-3 sm:gap-14 pt-5 sm:pt-8 mt-6 sm:mt-8 border-t border-slate-700/80 max-w-xl w-full px-2">
                  <div className="text-center">
                    <div className="text-lg xs:text-xl sm:text-3xl font-extrabold text-cyan-400 tracking-tight">98%</div>
                    <div className="text-[9px] sm:text-[11px] text-slate-300 uppercase mt-0.5 tracking-wide font-medium">Pass Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg xs:text-xl sm:text-3xl font-extrabold text-white tracking-tight">24+</div>
                    <div className="text-[9px] sm:text-[11px] text-slate-300 uppercase mt-0.5 tracking-wide font-medium">Top 50</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg xs:text-xl sm:text-3xl font-extrabold text-pink-400 tracking-tight">1800+</div>
                    <div className="text-[9px] sm:text-[11px] text-slate-300 uppercase mt-0.5 tracking-wide font-medium">Students</div>
                  </div>
                </div>

              </div>
            </section>
          </RevealOnScroll>

          {/* VENUES CAROUSEL */}
         {/* <RevealOnScroll delay={150}>
            <VenuesCarousel onSelectVenue={(venueText) => setMessage(venueText)} />
          </RevealOnScroll>

          {/* ACADEMIC BATCHES & PROGRAMS SECTION */}
          <ClassesSection 
            classes={classes} 
            onSelectClass={(classId) => setSelectedClassId(classId)} 
          />

          {/* TESTIMONIALS SECTION */}
          <TestimonialsSection />

          {/* VIRTUAL LAB */}
         {/* <RevealOnScroll delay={150}>
            <VirtualLab />
          </RevealOnScroll>

          {/* OFFICIAL 8 UNITS */}
          <section id="modules" className="py-14 max-w-7xl mx-auto">
            <RevealOnScroll delay={100}>
              <div className="mb-10 text-center sm:text-left">
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">Syllabus Scope</span>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-1">Official 8 Units of A/L Physics</h3>
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
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-600 mb-3">
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
                    <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">Admissions</span>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-1">Direct WhatsApp Enrollment</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      Register now for online portal access, LMS credentials, and physical classroom verification cards.
                    </p>
                    <div className="mt-6 space-y-3 text-xs text-slate-700">
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
                      <label className="block text-[11px] text-slate-700 mb-1 font-semibold">Student Full Name</label>
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
                      <label className="block text-[11px] text-slate-700 mb-1 font-semibold">WhatsApp Mobile Number</label>
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
                      <label className="block text-[11px] text-slate-700 mb-1 font-semibold">Select Class Batch</label>
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
                      <label className="block text-[11px] text-slate-700 mb-1 font-semibold">Message / Preferred Venue</label>
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
                      className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs tracking-wider uppercase transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:bg-slate-400 cursor-pointer"
                    >
                      <Send size={14} />
                      <span>{isSubmitting ? 'Processing...' : 'Confirm Registration on WhatsApp'}</span>
                    </button>

                    {feedback && (
                      <p className="text-[11px] text-center text-emerald-600 animate-pulse font-medium">
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
        <footer className="border-t border-slate-200 bg-white py-8 px-4 text-center text-xs text-slate-500 font-['Poppins']">
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