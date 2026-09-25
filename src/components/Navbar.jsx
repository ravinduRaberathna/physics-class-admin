import { useState } from 'react';
import { Atom, MessageCircle, Menu, X } from 'lucide-react';

const Navbar = ({ teacherName = 'NIVANTHA SILVA' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="bg-slate-900/75 backdrop-blur-xl rounded-full px-5 sm:px-7 py-3 flex items-center justify-between w-full max-w-4xl transition-all border border-slate-700/60 shadow-2xl">
        <a href="#hero" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-indigo-500/30">
            <Atom size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-mono font-bold tracking-wider text-xs sm:text-sm text-white">
              {teacherName.toUpperCase()}<span className="text-indigo-400">.PHYSICS</span>
            </span>
            <span className="text-[9px] text-slate-400 tracking-widest uppercase -mt-0.5 font-mono">
              Sri Lanka A/L Masterclass
            </span>
          </div>
        </a>

        <ul className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-semibold text-slate-300 font-mono">
          <li><a href="#venues" className="hover:text-indigo-400 transition-colors">Venues</a></li>
          <li><a href="#classes" className="hover:text-indigo-400 transition-colors">Classes</a></li>
          <li><a href="#simulator" className="hover:text-indigo-400 transition-colors">Virtual Lab</a></li>
          <li><a href="#modules" className="hover:text-indigo-400 transition-colors">Syllabus</a></li>
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#register"
            className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs tracking-wider uppercase transition shadow-lg shadow-indigo-600/30 active:scale-95 flex items-center gap-1.5 border border-indigo-400/40"
          >
            <MessageCircle size={14} />
            <span>Enroll Now</span>
          </a>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-1.5 text-slate-300 hover:text-white"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-x-4 top-20 z-40 md:hidden">
          <div className="bg-slate-900/95 backdrop-blur-2xl rounded-2xl p-5 border border-slate-700/80 shadow-2xl flex flex-col gap-3 font-mono text-sm">
            <a href="#hero" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-indigo-400 py-1">Home</a>
            <a href="#venues" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-indigo-400 py-1">Tuition Venues</a>
            <a href="#classes" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-indigo-400 py-1">Class Programs</a>
            <a href="#simulator" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-indigo-400 py-1">Virtual Lab</a>
            <a href="#modules" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-indigo-400 py-1">Syllabus Units</a>
            <a href="#register" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-indigo-400 py-1">Admissions & WhatsApp</a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;