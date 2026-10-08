import { useState, useEffect } from 'react';
import { Atom, Menu, X, ArrowRight, Sparkles } from 'lucide-react';

const Navbar = ({ teacherName = 'A/L PHYSICS' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Lecturer', href: '#lecturer' },
    { name: 'Batches', href: '#classes' },
    { name: 'Centres', href: '#venues' },
    { name: 'Virtual Lab', href: '#simulator' },
    { name: 'Syllabus', href: '#modules' },
    { name: 'Contact', href: '#register' },
  ];

  return (
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none font-['Poppins']">
      {/* Centered Floating Glass Capsule */}
      <nav
        className={`pointer-events-auto w-full max-w-5xl rounded-full transition-all duration-500 border ${
          isScrolled
            ? 'bg-[#090d1a]/85 backdrop-blur-2xl border-indigo-500/30 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.6)] py-2.5 px-5 sm:px-8'
            : 'bg-[#0b1021]/60 backdrop-blur-xl border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.3)] py-3 px-6 sm:px-9'
        }`}
      >
        <div className="flex items-center justify-between">
          
          {/* Logo & Academy Title */}
          <a
            href="#hero"
            className="flex items-center gap-3 group select-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1.2px] shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <div className="w-full h-full bg-[#070a14] rounded-full flex items-center justify-center text-cyan-300">
                <Atom size={16} className="group-hover:rotate-180 transition-transform duration-700" />
              </div>
            </div>

            <div className="flex flex-col text-left">
              <span className="text-xs sm:text-sm font-bold tracking-wider text-white uppercase leading-none">
                {teacherName}
              </span>
              <span className="text-[9px] font-semibold text-cyan-400/90 uppercase tracking-widest leading-none mt-1">
                MASTERCLASS
              </span>
            </div>
          </a>

          {/* Desktop Links (No Box Container, Pure Sleek Links) */}
          <div className="hidden md:flex items-center gap-7 lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[13px] font-medium text-slate-300 hover:text-cyan-300 transition-colors duration-200 relative group py-1"
              >
                <span>{link.name}</span>
                {/* Subtle active underline hover effect */}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-indigo-400 to-cyan-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
            ))}
          </div>

          {/* Enroll Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <a
              href="#register"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-md shadow-indigo-500/25 border border-white/20 active:scale-95"
            >
              <span>Enroll</span>
              <ArrowRight size={13} className="text-cyan-100" />
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-white/10 text-slate-200 hover:text-white border border-white/10 active:scale-95 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-1 pb-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 transition flex items-center justify-between"
              >
                <span>{link.name}</span>
                <span className="text-slate-500">→</span>
              </a>
            ))}
            <a
              href="#register"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30"
            >
              <Sparkles size={13} className="text-cyan-300" />
              <span>Enroll Class Now</span>
            </a>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;