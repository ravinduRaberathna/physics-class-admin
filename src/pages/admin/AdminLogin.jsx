import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Atom,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  ArrowLeft,
  Sun,
  Moon,
} from 'lucide-react';
import API from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { getOptimizedProfileImage } from '../../utils/imageOptimizer';

const formContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.25,
    },
  },
};

const formItemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [teacher, setTeacher] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_teacher_profile');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const { login, darkMode, toggleDarkMode } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/teacher')
      .then((res) => {
        if (res.data) setTeacher(res.data);
      })
      .catch(() => {});
  }, []);

  const sirPhoto =
    teacher?.profileImage ||
    'https://res.cloudinary.com/dkebgwbj/image/upload/v1791988020/egdu4u0bp2zv1rr8rx8p.jpg';

  const teacherName = teacher?.name || 'Chamath Piyumal';
  const patternA = Array.from({ length: 16 }, () => 'PHYSICS');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 font-['Poppins'] relative overflow-hidden bg-gradient-to-br from-slate-100 via-indigo-50/40 to-slate-200 dark:from-[#070b19] dark:via-[#0d142c] dark:to-[#050814] text-slate-900 dark:text-slate-100 selection:bg-indigo-600 selection:text-white transition-colors duration-300">
      
      {/* Floating Top Controls Bar (Home Link & Dark/Light Mode Switcher) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 sm:top-6 left-0 right-0 px-4 sm:px-8 z-50 flex items-center justify-between pointer-events-none"
      >
        <Link
          to="/"
          className="pointer-events-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/85 dark:bg-[#0c101d]/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm hover:border-indigo-400 dark:hover:border-cyan-400 hover:text-indigo-600 dark:hover:text-cyan-300 transition-all active:scale-95"
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Back to Public Site</span>
          <span className="sm:hidden">Home</span>
        </Link>

        {/* Dark / Light Toggle Pill */}
        <button
          type="button"
          onClick={toggleDarkMode}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
          className="pointer-events-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/85 dark:bg-[#0c101d]/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm hover:border-indigo-400 dark:hover:border-cyan-400 transition-all cursor-pointer active:scale-95 group"
        >
          {darkMode ? (
            <>
              <Sun size={15} className="text-amber-400 transition-transform group-hover:rotate-90 duration-300" />
              <span className="text-[11px] font-bold text-slate-200">Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={15} className="text-indigo-600 transition-transform group-hover:-rotate-12 duration-300" />
              <span className="text-[11px] font-bold text-slate-700">Dark Mode</span>
            </>
          )}
        </button>
      </motion.div>

      {/* Ambient Gradient Lighting (Animated Breathing Physics Orbs) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: [1, 1.08, 1] }}
        transition={{
          opacity: { duration: 1 },
          scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute top-1/4 -left-20 w-[28rem] h-[28rem] rounded-full bg-indigo-500/10 dark:bg-indigo-600/25 blur-[120px] pointer-events-none transition-colors duration-500"
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: [1.05, 0.96, 1.05] }}
        transition={{
          opacity: { duration: 1.2 },
          scale: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute bottom-1/4 -right-20 w-[28rem] h-[28rem] rounded-full bg-cyan-400/10 dark:bg-cyan-500/20 blur-[120px] pointer-events-none transition-colors duration-500"
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[38rem] rounded-full bg-purple-500/5 dark:bg-purple-600/10 blur-[140px] pointer-events-none transition-colors duration-500"
        aria-hidden="true"
      />

      {/* Main 2-Column Split Master Card (Entrance Animation) */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[960px] w-full bg-white/95 dark:bg-[#0c101d]/95 backdrop-blur-2xl rounded-[2.5rem] p-3 sm:p-4 shadow-[0_20px_70px_-15px_rgba(79,70,229,0.12)] dark:shadow-[0_30px_90px_-20px_rgba(0,0,0,0.6)] border border-slate-200/80 dark:border-white/10 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch transition-colors duration-300 mt-12 sm:mt-0"
      >
        
        {/* =========================================================================
            LEFT COLUMN: HERO AREA COSMIC KINETIC DESIGN (FROM PUBLIC HERO SECTION)
           ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[2rem] hero-spectrum-card relative overflow-hidden min-h-[480px] md:min-h-[540px] flex flex-col justify-between p-6 sm:p-8 text-white shadow-xl border border-indigo-500/30"
        >
          {/* Seamless Kinetic Background Streams (Matching Hero Section) */}
          <div
            className="absolute inset-[-60%_-30%] pointer-events-none select-none overflow-hidden flex justify-center items-center z-0 -rotate-12 origin-center kinetic-stage-masked opacity-60 sm:opacity-85"
            aria-hidden="true"
          >
            <div className="flex gap-4 sm:gap-6 w-[220%] justify-center scale-[0.45] sm:scale-[0.52]">
              <div className="flex flex-col shrink-0 overflow-hidden">
                <div className="lane-down-fast">
                  <div className="flex flex-col">
                    {patternA.map((t, idx) => (
                      <span
                        key={`login-l1-a-${idx}`}
                        className={`kinetic-item-styled ${idx % 2 === 0 ? 'kinetic-fill-glow' : 'kinetic-stroke-neon'}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col">
                    {patternA.map((t, idx) => (
                      <span
                        key={`login-l1-b-${idx}`}
                        className={`kinetic-item-styled ${idx % 2 === 0 ? 'kinetic-fill-glow' : 'kinetic-stroke-neon'}`}
                      >
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
                      <span
                        key={`login-l2-a-${idx}`}
                        className={`kinetic-item-styled ${idx % 2 !== 0 ? 'kinetic-fill-glow' : 'kinetic-stroke-neon'}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col">
                    {patternA.map((t, idx) => (
                      <span
                        key={`login-l2-b-${idx}`}
                        className={`kinetic-item-styled ${idx % 2 !== 0 ? 'kinetic-fill-glow' : 'kinetic-stroke-neon'}`}
                      >
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
                      <span
                        key={`login-l3-a-${idx}`}
                        className={`kinetic-item-styled ${idx % 2 === 0 ? 'kinetic-fill-glow' : 'kinetic-stroke-neon'}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col">
                    {patternA.map((t, idx) => (
                      <span
                        key={`login-l3-b-${idx}`}
                        className={`kinetic-item-styled ${idx % 2 === 0 ? 'kinetic-fill-glow' : 'kinetic-stroke-neon'}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Hero Domain Pill */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 p-1 pr-3 rounded-full bg-slate-950/80 backdrop-blur-xl border border-indigo-500/30 shadow-[0_0_25px_rgba(99,102,241,0.2)] max-w-full hover:border-cyan-400/40 transition-all duration-300">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-cyan-300 font-mono text-[9px] sm:text-[10px] font-semibold lowercase tracking-wide shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0"></span>
                <span>chamathwithphysics.com</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-indigo-400/40 shrink-0"></span>
              <span className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider truncate">
                PHYSICS OS
              </span>
            </div>
          </motion.div>

          {/* Center Hero Title & Simple Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 my-auto py-5 text-center flex flex-col items-center"
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.2] drop-shadow-lg">
              Welcome to the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400">
                Admin Panel
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-indigo-200/90 mt-3.5 font-medium tracking-wide max-w-xs mx-auto">
              Manage classes, blogs &amp; website updates.
            </p>
          </motion.div>

          {/* Minimal Bottom Dots & Admin Tag */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full pt-3"
          >
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-1.5 rounded-full bg-cyan-400 shadow-xs" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              </div>

              <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-indigo-200/90 uppercase tracking-widest">
                <Atom size={11} className="text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} />
                <span>Admin Portal</span>
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* =========================================================================
            RIGHT COLUMN: LOGIN FORM (STAGGERED ENTRANCE ANIMATION)
           ========================================================================= */}
        <motion.div
          variants={formContainerVariants}
          initial="hidden"
          animate="visible"
          className="p-6 sm:p-10 flex flex-col justify-center"
        >
          {/* Header */}
          <motion.div variants={formItemVariants} className="text-center mb-7 sm:mb-8">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome!
            </h2>

            {/* Brand Avatar & Teacher Pill */}
            <div className="inline-flex items-center gap-2 mt-3 pl-1.5 pr-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200/80 dark:border-indigo-500/30 text-indigo-700 dark:text-cyan-300 text-xs font-bold shadow-2xs">
              <img
                src={getOptimizedProfileImage(sirPhoto)}
                alt={teacherName}
                className="w-6 h-6 rounded-full object-cover object-top border border-indigo-300 dark:border-cyan-400/40"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://res.cloudinary.com/dkebgwbj/image/upload/v1791988020/egdu4u0bp2zv1rr8rx8p.jpg';
                }}
              />
              <span>{teacherName}</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Sign in to manage classes, reviews, blogs, and settings
            </p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="login-error"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 p-3.5 rounded-2xl text-xs font-semibold mb-5 border border-rose-200 dark:border-rose-500/30 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div variants={formItemVariants}>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@physics.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                />
              </div>
            </motion.div>

            <motion.div variants={formItemVariants}>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={formItemVariants}>
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.18 }}
                className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-indigo-500/25 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{submitting ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight size={15} />
              </motion.button>
            </motion.div>
          </form>

          {/* Footer (Matching Reference Mockup "By Continuing, you agree to our...") */}
          <motion.div variants={formItemVariants} className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 text-center space-y-2">
            <p className="text-[11px] text-slate-400">
              By continuing, you confirm authorized administrator access.
            </p>
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:underline transition"
              >
                <ArrowLeft size={13} />
                <span>Back to Public Website</span>
              </Link>
            </div>
          </motion.div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default AdminLogin;
