import { useEffect, useState } from 'react';
import { Atom } from 'lucide-react';

const PageLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsFading(true), 250);
          setTimeout(() => onComplete && onComplete(), 800);
          return 100;
        }
        const diff = Math.floor(Math.random() * 15) + 10;
        return Math.min(prev + diff, 100);
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#060813] transition-all duration-700 ease-in-out ${
        isFading ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Ambient Glows */}
      <div className="absolute w-72 h-72 rounded-full bg-indigo-600/20 blur-[100px] pointer-events-none"></div>
      <div className="absolute w-60 h-60 rounded-full bg-cyan-500/15 blur-[90px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Glowing Spinning Atom */}
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1.5px] shadow-[0_0_35px_rgba(99,102,241,0.4)] animate-pulse">
            <div className="w-full h-full bg-[#080c1d] rounded-2xl flex items-center justify-center text-cyan-300">
              <Atom size={32} className="animate-spin" style={{ animationDuration: '6s' }} />
            </div>
          </div>
          <span className="absolute -inset-1 rounded-2xl border border-cyan-400/30 animate-ping opacity-40 pointer-events-none"></span>
        </div>

        {/* Brand Text */}
        <h2 className="font-mono text-xs sm:text-sm tracking-[0.3em] font-bold text-white uppercase mb-2">
          PHYSICS<span className="text-cyan-400">.MASTERCLASS</span>
        </h2>
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-6">
          Initializing Engine...
        </p>

        {/* Sleek Progress Bar */}
        <div className="w-48 sm:w-60 h-1.5 bg-slate-800/80 rounded-full overflow-hidden p-[1px] border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-400 rounded-full transition-all duration-200 shadow-[0_0_10px_rgba(56,189,248,0.5)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Counter */}
        <div className="mt-3 font-mono text-xs font-semibold text-cyan-400">
          {progress}%
        </div>
      </div>
    </div>
  );
};

export default PageLoader;