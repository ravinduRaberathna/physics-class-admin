import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import { 
  Atom, 
  Sparkles, 
  Phone, 
  Mail, 
  ChevronRight, 
  Send 
} from 'lucide-react';

const Footer = ({ teacher, classes: propClasses }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [classesList, setClassesList] = useState(() => {
    if (Array.isArray(propClasses) && propClasses.length > 0) return propClasses;
    try {
      const cached = sessionStorage.getItem('cached_classes_public');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (Array.isArray(propClasses) && propClasses.length > 0) {
      setClassesList(propClasses);
      return;
    }
    API.get('/classes')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setClassesList(res.data);
          try {
            sessionStorage.setItem('cached_classes_public', JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch(() => {});
  }, [propClasses]);

  const teacherName = teacher?.name || 'Chamath Piyumal';
  const phone = teacher?.contactInfo?.phone || '+94 77 123 4567';
  const whatsapp = teacher?.contactInfo?.whatsapp || '94771234567';
  const email = teacher?.contactInfo?.email || 'info@chamathphysics.lk';
  
  const cleanWhatsapp = String(whatsapp).replace(/[^0-9]/g, '');
  const formattedWp = cleanWhatsapp.startsWith('0') ? `94${cleanWhatsapp.slice(1)}` : cleanWhatsapp || '94771234567';
  
  const whatsappEnrollUrl = `https://wa.me/${formattedWp}?text=${encodeURIComponent(
    'Hello Sir, I would like to get more information about the classes. Could you please share more details?'
  )}`;

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      sessionStorage.setItem('returnToSection', id);
      navigate(`/#${id}`);
      return;
    }
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClassClick = (classId) => {
    navigate(`/class/${classId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-slate-50 dark:bg-[#080b13] text-slate-700 dark:text-slate-300 font-['Poppins'] transition-colors duration-300 border-t border-slate-200/80 dark:border-white/10 overflow-hidden">
      
      {/* =========================================================================
          BOTTOM FOOTER SECTION — SEAMLESS LIGHT & DARK MODE COMPATIBLE
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
        
        {/* Main Grid: Brand (6 cols) + Streams (3 cols) + Navigation (3 cols) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 sm:pb-12 border-b border-slate-200 dark:border-white/10">
          
          {/* Col 1: Brand & About (6 cols on lg) */}
          <div className="sm:col-span-2 lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 flex-shrink-0">
                <Atom className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white block">
                  {teacherName.toUpperCase()}
                </span>
                <span className="text-[11px] font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase block -mt-1">
                  A/L Physics Masterclass • Sri Lanka
                </span>
              </div>
            </div>

            {/* Social Links Row */}
            <div className="flex items-center gap-2.5 sm:gap-3 pt-2">
              {/* WhatsApp */}
              <a
                href={whatsappEnrollUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-white dark:bg-slate-800/80 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xs"
              >
                <Phone className="w-4 h-4" />
              </a>

              {/* YouTube */}
              <a
                href={teacher?.socialLinks?.youtube || "https://youtube.com"}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white dark:bg-slate-800/80 hover:bg-red-600 hover:text-white text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xs"
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
                className="w-9 h-9 rounded-full bg-white dark:bg-slate-800/80 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xs"
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
                className="w-9 h-9 rounded-full bg-white dark:bg-slate-800/80 hover:bg-sky-500 hover:text-white text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xs"
              >
                <Send className="w-4 h-4" />
              </a>

              {/* Email */}
              <a
                href={`mailto:${email}`}
                aria-label="Email"
                className="w-9 h-9 rounded-full bg-white dark:bg-slate-800/80 hover:bg-violet-600 hover:text-white text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xs"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            {/* Direct Hotline Pill */}
            <div className="pt-2">
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span>Hotline: {phone}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Academic Streams from MongoDB (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <span>Streams (පන්ති)</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              {classesList && classesList.length > 0 ? (
                classesList.map((cls) => (
                  <li key={cls._id}>
                    <button
                      type="button"
                      onClick={() => handleClassClick(cls._id)}
                      className="hover:text-indigo-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1.5 text-left truncate max-w-full cursor-pointer"
                      title={cls.title}
                    >
                      <ChevronRight className="w-3 h-3 text-indigo-500 dark:text-violet-500 shrink-0" />
                      <span className="truncate">{cls.title}</span>
                    </button>
                  </li>
                ))
              ) : (
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('classes')}
                    className="hover:text-indigo-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1.5 text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-indigo-500 dark:text-violet-500 shrink-0" />
                    <span>All Academic Streams</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: Quick Navigation (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Navigation (පිටු)</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button type="button" onClick={() => scrollToSection('hero')} className="hover:text-indigo-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-indigo-500 dark:text-violet-500 shrink-0" /> මුල් පිටුව (Home)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('lecturer')} className="hover:text-indigo-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-indigo-500 dark:text-violet-500 shrink-0" /> ගුරුභවතා (About Teacher)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('testimonials')} className="hover:text-indigo-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-indigo-500 dark:text-violet-500 shrink-0" /> ප්‍රතිඵල (Results)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('blogs')} className="hover:text-indigo-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-indigo-500 dark:text-violet-500 shrink-0" /> ලිපි (Study Blogs)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('register')} className="hover:text-indigo-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-indigo-500 dark:text-violet-500 shrink-0" /> සම්බන්ධ වන්න (Contact)
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Contact */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-500 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} <span className="font-semibold text-slate-700 dark:text-slate-400">{teacherName}</span> • A/L Physics Masterclass. All rights reserved.
          </div>
          <div className="flex items-center justify-center gap-4 sm:gap-6 text-[11px] text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> {email}
            </span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="text-slate-500">Sri Lanka Advanced Level</span>
          </div>
        </div>

      </div>

    </footer>
  );
};

export default Footer;
