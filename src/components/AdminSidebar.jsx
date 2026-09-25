import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutGrid, 
  Layers, 
  UserSquare2, 
  Inbox, 
  LogOut, 
  Zap, 
  ArrowUpRight 
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
    { label: 'Overview', path: '/admin', icon: LayoutGrid },
    { label: 'Batches & Classes', path: '/admin/classes', icon: Layers },
    { label: 'Lecturer Bio', path: '/admin/profile', icon: UserSquare2 },
    { label: 'Student Inquiries', path: '/admin/inquiries', icon: Inbox },
  ];

  return (
    <aside className="w-72 bg-[#090c19]/80 backdrop-blur-2xl border-r border-white/[0.06] text-slate-300 min-h-screen flex flex-col justify-between p-5 shrink-0 relative z-20">
      <div className="space-y-6">
        {/* Brand Widget */}
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Zap size={18} className="fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono font-bold text-xs tracking-wider text-white flex items-center gap-1.5">
              PHYSICS OS <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-tight">Admin Console v2.0</span>
          </div>
        </div>

        {/* Navigation Group */}
        <div className="space-y-1">
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 px-3 pb-2 font-semibold">
            WORKSPACE
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'text-white bg-indigo-500/15 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]"></span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Live Site Preview Link */}
        <div className="pt-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono text-cyan-300 bg-cyan-950/20 border border-cyan-500/20 hover:bg-cyan-950/40 hover:border-cyan-500/40 transition group"
          >
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              View Live Site
            </span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* User Status & Sign Out */}
      <div className="pt-4 border-t border-white/[0.06] space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-900 to-slate-800 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300 font-mono">
            {admin?.name ? admin.name[0].toUpperCase() : 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-slate-200 truncate">{admin?.name || 'Administrator'}</p>
            <p className="text-[10px] font-mono text-slate-400 truncate">{admin?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono text-rose-400/90 hover:text-rose-300 bg-rose-500/[0.06] hover:bg-rose-500/[0.12] border border-rose-500/20 transition"
        >
          <LogOut size={14} />
          <span>Disconnect</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;