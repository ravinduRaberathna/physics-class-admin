import { useState } from 'react';
import RevealOnScroll from './RevealOnScroll';
import {
  GraduationCap,
  PhoneCall,
  MessageSquare,
  Mail,
  Video,
  Globe,
  Send,
  Check,
  CheckCircle2,
  ExternalLink,
  X,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

const TeacherProfileSection = ({ teacher, isModalOpen, onCloseModal, onOpenModal }) => {
  const [imgError, setImgError] = useState(false);

  const name = teacher?.name || 'Eng. Nivantha Silva';
  const title = teacher?.title || 'B.Sc. Engineering (Hons) • A/L Physics Lecturer';
  const bio =
    teacher?.bio ||
    'වසර ගණනාවක A/L භෞතික විද්‍යා ඉගැන්වීමේ පළපුරුද්ද සමඟින්, සංකීර්ණ සිද්ධාන්ත ඉතා සරල හා ප්‍රායෝගික අයුරින් සිසුන් වෙත සමීප කරවමින් දිවයිනේ විශිෂ්ටතම ප්‍රතිඵල බිහිකළ ප්‍රවීණ දේශකවරයෙකි.';
  const profileImage = !imgError && teacher?.profileImage ? teacher.profileImage : '';

  const phone = teacher?.contactInfo?.phone || '+94 77 123 4567';
  const whatsapp = teacher?.contactInfo?.whatsapp || '94771234567';
  const email = teacher?.contactInfo?.email || 'info@physicsmasterclass.lk';

  const youtube = teacher?.socialLinks?.youtube || '';
  const facebook = teacher?.socialLinks?.facebook || '';
  const telegram = teacher?.socialLinks?.telegram || '';

  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const checkFeatures = [
    title,
    '98% Pass Rate & Island Ranks',
    'Complete Theory & Speed Revision',
    'Physical & Online LMS Access',
  ];

  return (
    <>
      {/* =====================================================================
          TEACHER PROFILE SECTION — EDUAN-INSPIRED CIRCULAR PORTRAIT & DOODLES
         ===================================================================== */}
      <section
        id="lecturer"
        className="relative py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-8 font-['Poppins'] overflow-hidden"
      >
        {/* Top-Center Hand-Drawn Loop Arrow SVG (Pointing to Teacher Portrait) */}
        <svg
          className="hidden md:block absolute top-8 left-[43%] -translate-x-1/2 w-28 h-20 text-slate-800 pointer-events-none select-none z-20"
          viewBox="0 0 120 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M112 72C112 38 78 18 58 28C43 35 46 58 62 56C78 54 78 24 50 16C28 10 14 18 6 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M14 14L5 24L17 27"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Top-Left Floating Cyan Triangle + Dark Stem Doodle */}
        <svg
          className="hidden sm:block absolute top-14 left-6 lg:left-10 w-14 h-14 pointer-events-none select-none z-10 animate-bounce [animation-duration:5s]"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <polygon points="24,10 56,28 28,46" fill="#14b8a6" />
          <line
            x1="10"
            y1="38"
            x2="32"
            y2="27"
            stroke="#0f172a"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>

        {/* Bottom-Left Floating 3D Pill / Cylinder Outline Doodle */}
        <svg
          className="hidden sm:block absolute bottom-10 left-4 lg:left-8 w-16 h-12 pointer-events-none select-none z-10"
          viewBox="0 0 80 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M14 32L56 10C62 7 69 11 70 17C71 22 68 26 63 29L21 50"
            stroke="#475569"
            strokeWidth="1.8"
          />
          <ellipse
            cx="17"
            cy="41"
            rx="6"
            ry="9"
            transform="rotate(-28 17 41)"
            fill="#e9d5ff"
            stroke="#475569"
            strokeWidth="1.8"
          />
        </svg>

        {/* Top-Right Floating Pink/Magenta 3D Zigzag Squiggle Doodle */}
        <svg
          className="hidden sm:block absolute top-24 right-4 lg:right-8 w-14 h-14 pointer-events-none select-none z-10 animate-pulse"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <polyline
            points="10,36 22,18 32,36 44,18 54,34"
            stroke="#0f172a"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="13,32 25,14 35,32 47,14 57,30"
            stroke="#ec4899"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Bottom-Right Floating Purple Crosshatch (#) Doodle */}
        <svg
          className="hidden sm:block absolute bottom-16 right-10 lg:right-20 w-10 h-10 pointer-events-none select-none z-10"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M18 8L12 40M34 8L28 40M8 18L40 24M6 30L38 36"
            stroke="#9333ea"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>

        <RevealOnScroll delay={100}>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* LEFT COLUMN: CIRCULAR PURPLE/INDIGO PORTRAIT WITH CONCENTRIC OUTER RING */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="relative w-72 h-72 xs:w-80 xs:h-80 sm:w-[25rem] sm:h-[25rem] lg:w-[27rem] lg:h-[27rem] flex items-center justify-center group">
                
                {/* Outer Thin Concentric Ring */}
                <div className="absolute inset-0 rounded-full border-[1.5px] border-purple-500/55 group-hover:scale-[1.02] transition-transform duration-500"></div>

                {/* Inner Vibrant Purple/Indigo Circle */}
                <div className="relative w-[86%] h-[86%] rounded-full bg-gradient-to-tr from-[#7e22ce] via-[#9333ea] to-[#6366f1] shadow-[0_25px_60px_-15px_rgba(147,51,234,0.45)] overflow-hidden flex items-end justify-center">
                  {/* Subtle inner radial highlight */}
                  <div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.22),transparent_65%)] pointer-events-none"
                    aria-hidden="true"
                  />

                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={name}
                      onError={() => setImgError(true)}
                      className="relative z-10 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center p-6 text-white select-none">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/15 backdrop-blur-md border-2 border-white/30 flex items-center justify-center text-3xl sm:text-4xl font-black text-white shadow-inner mb-3">
                        {initials}
                      </div>
                      <p className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                        {name}
                      </p>
                      <p className="text-[11px] sm:text-xs text-purple-100 font-medium mt-0.5 max-w-[200px] line-clamp-2">
                        {title}
                      </p>
                    </div>
                  )}
                </div>

                {/* Subtle Floating Experience / Rank Badge on Circle Edge */}
                <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-purple-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none">
                      Verified Mentor
                    </p>
                    <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                      A/L Physics
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: EDITORIAL CONTENT, 2x2 GREEN CHECKMARKS & CTA BUTTON */}
            <div className="lg:col-span-6 text-left space-y-5 max-w-xl mx-auto lg:mx-0">
              
              {/* Top Accent Kicker */}
              <span className="inline-block text-xs sm:text-sm font-semibold text-[#f95715] tracking-wide">
                Know About Lecturer
              </span>

              {/* Main Bold Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-slate-900 tracking-tight leading-[1.22]">
                {name} — Guiding Students to Island Top Rankings.
              </h2>

              {/* Description / Bio */}
              <p className="text-xs sm:text-sm md:text-[15px] text-slate-500 leading-relaxed whitespace-pre-line font-normal">
                {bio}
              </p>

              {/* 2x2 Green Checkmark Feature List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 pt-2">
                {checkFeatures.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#16c60c] text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Check size={12} strokeWidth={3.5} />
                    </span>
                    <span className="text-xs sm:text-[13.5px] font-semibold text-slate-800 truncate">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Bar: More Details Button + Quick Contact Links */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onOpenModal}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#f95715] hover:bg-[#e04809] text-white text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 shadow-[0_12px_25px_-8px_rgba(249,87,21,0.55)] cursor-pointer active:scale-95"
                >
                  <span>More Details</span>
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </button>

                {cleanWhatsapp && (
                  <a
                    href={`https://wa.me/${cleanWhatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-indigo-600 border border-slate-200 text-xs sm:text-sm font-semibold transition shadow-2xs"
                  >
                    <MessageSquare size={15} className="text-emerald-500" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>

            </div>

          </div>
        </RevealOnScroll>
      </section>

      {/* =====================================================================
          MORE DETAILS MODAL — COMPLETE LECTURER PROFILE & CHANNELS
         ===================================================================== */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 font-['Poppins']"
          onClick={onCloseModal}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative text-slate-800 animate-hero-badge"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Cover Header */}
            <div className="relative h-36 bg-gradient-to-r from-[#7e22ce] via-[#9333ea] to-indigo-600 p-6 flex justify-between items-start overflow-hidden">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck size={13} className="text-emerald-300" />
                <span>Verified Lecturer Profile</span>
              </span>

              <button
                type="button"
                onClick={onCloseModal}
                className="relative z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition cursor-pointer"
                aria-label="Close profile modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 sm:px-8 pb-8">
              <div className="relative -mt-14 mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="w-28 h-28 rounded-full p-1 bg-white shadow-xl shrink-0">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-tr from-[#7e22ce] to-indigo-600 flex items-center justify-center">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <span className="text-3xl font-black text-white">
                        {initials}
                      </span>
                    )}
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold w-fit">
                  <CheckCircle2 size={14} />
                  <span>Lead A/L Physics Lecturer</span>
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {name}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-purple-700 mt-1 flex items-center gap-1.5">
                <GraduationCap size={16} />
                <span>{title}</span>
              </p>

              {/* Bio Box */}
              <div className="mt-5 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  About Lecturer
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {bio}
                </p>
              </div>

              {/* Contact Grid */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href={`tel:${phone}`}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 hover:border-purple-200 transition flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <PhoneCall size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Hotline</p>
                    <p className="text-xs font-bold text-slate-800 truncate">{phone}</p>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-200 transition flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <MessageSquare size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase text-slate-400">WhatsApp</p>
                    <p className="text-xs font-bold text-slate-800 truncate">{whatsapp}</p>
                  </div>
                </a>

                <a
                  href={`mailto:${email}`}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 transition flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <Mail size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Email</p>
                    <p className="text-xs font-bold text-slate-800 truncate">{email}</p>
                  </div>
                </a>
              </div>

              {/* Social Links */}
              {(youtube || facebook || telegram) && (
                <div className="mt-5 pt-5 border-t border-slate-100">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                    Official Social Media Channels
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {youtube && (
                      <a
                        href={youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition"
                      >
                        <Video size={15} />
                        <span>YouTube</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                    {facebook && (
                      <a
                        href={facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 text-xs font-bold transition"
                      >
                        <Globe size={15} />
                        <span>Facebook</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                    {telegram && (
                      <a
                        href={telegram}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200 text-xs font-bold transition"
                      >
                        <Send size={14} />
                        <span>Telegram</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-5 border-t border-slate-100 flex justify-end gap-3">
                <a
                  href="#register"
                  onClick={onCloseModal}
                  className="px-6 py-2.5 rounded-xl bg-[#f95715] hover:bg-[#e04809] text-white text-xs font-bold transition shadow-md shadow-orange-500/20"
                >
                  Enroll Now
                </a>
                <button
                  type="button"
                  onClick={onCloseModal}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherProfileSection;
