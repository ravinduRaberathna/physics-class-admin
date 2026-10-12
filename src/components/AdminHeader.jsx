import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Atom, 
  Sun, 
  Moon, 
  ArrowUpRight, 
  LogOut, 
  Layers, 
  MessageSquareQuote, 
  FileText, 
  UserSquare2, 
  LayoutGrid,
  Sparkles,
  Search,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axiosInstance';

const AdminHeader = () => {
  const { admin, logout, darkMode, toggleDarkMode } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalClasses: 0,
    activeClasses: 0,
    totalFeedbacks: 0,
    totalBlogs: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [classesRes, feedbackRes, blogsRes] = await Promise.allSettled([
          API.get('/classes/admin/all'),
          API.get('/feedback'),
          API.get('/blogs'),
        ]);

        const classesData = classesRes.status === 'fulfilled' && Array.isArray(classesRes.value.data) ? classesRes.value.data : [];
        const feedbackData = feedbackRes.status === 'fulfilled' && Array.isArray(feedbackRes.value.data) ? feedbackRes.value.data : [];
        const blogsData = blogsRes.status === 'fulfilled' && Array.isArray(blogsRes.value.data) ? blogsRes.value.data : [];

        setStats({
          totalClasses: classesData.length,
          activeClasses: classesData.filter((c) => c.isActive).length,
          totalFeedbacks: feedbackData.length,
          totalBlogs: blogsData.length,
        });
      } catch (err) {
        console.error('Failed to load header stats:', err);
      }
    };

    fetchStats();
  }, [location.pathname]);

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutGrid },
    { label: 'Classes', path: '/admin/classes', icon: Layers, count: stats.totalClasses },
    { label: 'Feedbacks', path: '/admin/feedback', icon: MessageSquareQuote, count: stats.totalFeedbacks },
    { label: 'Articles', path: '/admin/blogs', icon: FileText, count: stats.totalBlogs },
    { label: 'Profile', path: '/admin/profile', icon: UserSquare2 },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Determine active section title
  const getSectionTitle = () => {
    switch (location.pathname) {
      case '/admin/classes':
        return 'Batches & Classes';
      case '/admin/feedback':
        return 'Student Feedbacks';
      case '/admin/blogs':
        return 'Knowledge Hub Articles';
      case '/admin/profile':
        return 'Lecturer Profile Settings';
      default:
        return 'Control Center';
    }
  };

  return (
    <header className="bg-[#0b1021] text-white border-b border-slate-800/80 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.7)] font-['Poppins']">
      {/* =========================================================================
          TOP NAVIGATION BAR (Dribbble SaaS Header Style)
         ========================================================================= */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 border-b border-white/[0.08] flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity Logo */}
        <Link to="/admin" className="flex items-center gap-3 shrink-0 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-[0_0_20px_rgba(147,51,234,0.35)]">
            <div className="w-full h-full bg-[#070a14] rounded-full flex items-center justify-center text-cyan-300">
              <Atom size={18} className="group-hover:rotate-180 transition-transform duration-700" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-wider uppercase text-white leading-none flex items-center gap-2">
              PHYSICS OS
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </span>
            <span className="text-[10px] font-semibold text-purple-300/80 uppercase tracking-widest leading-none mt-1">
              Masterclass SaaS v2.5
            </span>
          </div>
        </Link>

        {/* Center: Horizontal Pill Navigation Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-[#121933]/90 p-1.5 rounded-full border border-white/10 shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
                {typeof item.count === 'number' && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/25 text-white' : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions, Theme, Live Site & User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-300 hover:text-white transition active:scale-90 cursor-pointer"
          >
            {darkMode ? <Sun size={15} className="text-amber-300" /> : <Moon size={15} />}
          </button>

          {/* Open Live Website Button */}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-200 hover:text-white text-xs font-semibold transition"
          >
            <span>Live Site</span>
            <ArrowUpRight size={13} className="text-purple-300" />
          </a>

          {/* Admin User Profile Pill with Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-black text-xs flex items-center justify-center shadow-md">
              {admin?.name ? admin.name[0].toUpperCase() : 'A'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">
                {admin?.name || 'Admin'}
              </span>
              <span className="text-[10px] text-purple-300/80 leading-tight">
                Superuser
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:text-rose-300 transition cursor-pointer active:scale-95"
            >
              <LogOut size={14} />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/[0.06] text-slate-200 border border-white/10 active:scale-95 transition cursor-pointer"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 py-3 bg-[#0d142b] border-b border-white/10 flex flex-col gap-1.5 animate-in fade-in duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-300 hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={15} />
                  <span>{item.label}</span>
                </div>
                {typeof item.count === 'number' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/15">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          DARK STATS / METRICS BANNER (Exact Dribbble KPI Design)
         ========================================================================= */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-widest mb-1.5">
              <Sparkles size={11} className="text-purple-300" />
              <span>SaaS Management Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {getSectionTitle()}
            </h1>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Active Workspace: <strong className="text-purple-300">Physics Masterclass Live</strong>
          </div>
        </div>

        {/* 4 Dark KPI Tiles with Bright Color Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          
          {/* KPI 1: Total Batches (Purple Badge) */}
          <Link
            to="/admin/classes"
            className="group p-4 sm:p-5 rounded-2xl bg-[#121933]/90 hover:bg-[#161f3f] border border-white/[0.09] hover:border-purple-500/40 transition-all duration-300 flex items-center justify-between shadow-sm cursor-pointer"
          >
            <div>
              <span className="text-[11px] font-medium text-slate-400 block tracking-wide">
                Total Batches
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 block">
                {stats.totalClasses}
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 flex items-center justify-center font-bold text-xs shadow-inner shrink-0 group-hover:scale-105 transition-transform">
              <Layers size={17} />
            </div>
          </Link>

          {/* KPI 2: Active Classes (Amber/Yellow Crown Badge) */}
          <Link
            to="/admin/classes"
            className="group p-4 sm:p-5 rounded-2xl bg-[#121933]/90 hover:bg-[#161f3f] border border-white/[0.09] hover:border-amber-500/40 transition-all duration-300 flex items-center justify-between shadow-sm cursor-pointer"
          >
            <div>
              <span className="text-[11px] font-medium text-slate-400 block tracking-wide">
                Active Classes
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 block">
                {stats.activeClasses}
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center font-bold text-xs shadow-inner shrink-0 group-hover:scale-105 transition-transform">
              <CheckCircle2 size={17} />
            </div>
          </Link>

          {/* KPI 3: Student Reviews (Emerald/Green Badge) */}
          <Link
            to="/admin/feedback"
            className="group p-4 sm:p-5 rounded-2xl bg-[#121933]/90 hover:bg-[#161f3f] border border-white/[0.09] hover:border-emerald-500/40 transition-all duration-300 flex items-center justify-between shadow-sm cursor-pointer"
          >
            <div>
              <span className="text-[11px] font-medium text-slate-400 block tracking-wide">
                Testimonials
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 block">
                {stats.totalFeedbacks}
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold text-xs shadow-inner shrink-0 group-hover:scale-105 transition-transform">
              <MessageSquareQuote size={17} />
            </div>
          </Link>

          {/* KPI 4: Published Articles (Pink/Rose Badge) */}
          <Link
            to="/admin/blogs"
            className="group p-4 sm:p-5 rounded-2xl bg-[#121933]/90 hover:bg-[#161f3f] border border-white/[0.09] hover:border-pink-500/40 transition-all duration-300 flex items-center justify-between shadow-sm cursor-pointer"
          >
            <div>
              <span className="text-[11px] font-medium text-slate-400 block tracking-wide">
                Blog Articles
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 block">
                {stats.totalBlogs}
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/30 text-pink-300 flex items-center justify-center font-bold text-xs shadow-inner shrink-0 group-hover:scale-105 transition-transform">
              <FileText size={17} />
            </div>
          </Link>

        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

