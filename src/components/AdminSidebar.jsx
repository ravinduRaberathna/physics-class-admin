import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutGrid, 
  Layers, 
  MessageSquareQuote,
  UserSquare2, 
  Inbox, 
  LogOut, 
  Atom, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

const AdminSidebar = () => {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Control Center', path: '/admin', icon: LayoutGrid, badge: 'Hub' },
    { label: 'Batches & Classes', path: '/admin/classes', icon: Layers },
    { label: 'Student Feedbacks', path: '/admin/feedback', icon: MessageSquareQuote },
    { label: 'Student Inquiries', path: '/admin/inquiries', icon: Inbox },
    { label: 'Lecturer Profile', path: '/admin/profile', icon: UserSquare2 },
  ];

  return (
    <aside className="w-full lg:w-72 bg-white/95 backdrop-blur-2xl border-b lg:border-b-0 lg:border-r border-slate-200/80 text-slate-700 lg:min-h-screen flex flex-col justify-between p-5 shrink-0 relative z-20 shadow-[4px_0_30px_-12px_rgba(15,23,42,0.05)] font-['Poppins']">
      <div className="space-y-6">
        {/* Brand Widget */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-white to-cyan-50/70 border border-indigo-100/90 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 shrink-0">
            <Atom size={20} className="animate-[spin_18s_linear_infinite]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-sm tracking-tight text-slate-900 flex items-center gap-1.5">
              PHYSICS OS
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/15 animate-pulse"></span>
            </span>
            <span className="text-[11px] text-indigo-600 font-semibold tracking-wide">
              Masterclass Admin v2.5
            </span>
          </div>
        </div>

        {/* Navigation Group */}
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 px-3 pb-1.5 font-bold">
            Management Suite
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100/80 group-hover:text-indigo-600'
                    }`}
                  >
                    <Icon size={15} />
                  </div>
                  <span className="truncate">{item.label}</span>
                  {item.badge && !isActive && (
                    <span className="ml-auto hidden lg:inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200/70">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9]"></span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Live Site Preview Link */}
        <div className="pt-1 hidden lg:block">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold text-indigo-700 bg-gradient-to-r from-indigo-50/80 to-cyan-50/80 border border-indigo-200/70 hover:border-indigo-300 hover:shadow-sm transition group"
          >
            <span className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-cyan-500 ring-4 ring-cyan-500/15"></span>
              <span>View Live Website</span>
            </span>
            <ArrowUpRight size={15} className="text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* User Status & Sign Out */}
      <div className="pt-4 mt-4 lg:mt-0 border-t border-slate-200/80 flex lg:flex-col items-center lg:items-stretch justify-between gap-3">
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/70">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-xs shrink-0">
            {admin?.name ? admin.name[0].toUpperCase() : 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-800 truncate">{admin?.name || 'Administrator'}</p>
            <p className="text-[10px] text-slate-500 truncate">{admin?.email || 'admin@physics.lk'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200/80 hover:border-rose-600 transition-all duration-200 cursor-pointer shadow-2xs"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;