import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Gauge, 
  Layers, 
  MessageSquareQuote, 
  FileText, 
  UserSquare2, 
  LogOut, 
  ArrowUpRight,
  Hexagon,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navSections = [
    {
      title: null, // Top level
      items: [
        { label: 'Dashboard', path: '/admin', icon: Gauge, badge: 'NEW', badgeColor: 'bg-[#321fdb] text-white' },
      ],
    },
    {
      title: 'ACADEMIC MANAGEMENT',
      items: [
        { label: 'Batches & Classes', path: '/admin/classes', icon: Layers },
        { label: 'Student Reviews', path: '/admin/feedback', icon: MessageSquareQuote },
        { label: 'Blog & Articles', path: '/admin/blogs', icon: FileText },
      ],
    },
    {
      title: 'SYSTEM & SETTINGS',
      items: [
        { label: 'Lecturer Profile', path: '/admin/profile', icon: UserSquare2 },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* CoreUI Signature Dark Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[#212631] text-slate-300 flex flex-col justify-between shrink-0 transition-transform duration-300 font-['Poppins'] select-none border-r border-[#2d3446] shadow-xl lg:shadow-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* CoreUI Top Brand Logo Bar */}
          <div className="h-16 px-6 bg-[#1e222d] border-b border-[#2d3446] flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#321fdb] to-[#3399ff] flex items-center justify-center text-white shadow-md">
                <Hexagon size={18} className="stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-sm tracking-wider text-white uppercase leading-none">
                  PHYSICS<span className="text-[#3399ff]">OS</span>
                </span>
                <span className="text-[9px] font-semibold text-slate-400 tracking-widest uppercase mt-0.5">
                  COREUI REACT.JS
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links with CoreUI Categorized Headers */}
          <nav className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-8rem)]">
            {navSections.map((section, idx) => (
              <div key={idx} className="space-y-1">
                {section.title && (
                  <p className="px-3 pt-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400/80">
                    {section.title}
                  </p>
                )}
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen?.(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                        isActive
                          ? 'bg-[#2f3545] text-white shadow-xs font-bold border-l-4 border-[#321fdb]'
                          : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} className={isActive ? 'text-[#3399ff]' : 'text-slate-400'} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider ${item.badgeColor || 'bg-[#321fdb] text-white'}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}

            {/* Quick Live Site Link */}
            <div className="pt-2">
              <p className="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400/80">
                LIVE ACCESS
              </p>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.05] transition"
              >
                <div className="flex items-center gap-3">
                  <ArrowUpRight size={16} className="text-[#3399ff]" />
                  <span>Public Website</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">View</span>
              </a>
            </div>
          </nav>
        </div>

        {/* CoreUI Sidebar Footer / User Logout row */}
        <div className="p-3 bg-[#1e222d] border-t border-[#2d3446]">
          <div className="flex items-center justify-between px-2 py-1.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#321fdb] text-white font-extrabold text-xs flex items-center justify-center shadow-sm shrink-0">
                {admin?.name ? admin.name[0].toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate leading-tight">
                  {admin?.name || 'Administrator'}
                </span>
                <span className="text-[10px] text-slate-400 block truncate leading-tight">
                  Masterclass Superuser
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-md text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;