import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  Bell, 
  ListTodo, 
  Mail, 
  Sun, 
  Moon, 
  ArrowUpRight 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminTopNav = ({ onToggleSidebar }) => {
  const { admin, darkMode, toggleDarkMode } = useAuth();
  const location = useLocation();

  // Get current breadcrumb label
  const getBreadcrumb = () => {
    switch (location.pathname) {
      case '/admin/classes':
        return 'Batches & Classes';
      case '/admin/feedback':
        return 'Student Feedbacks';
      case '/admin/blogs':
        return 'Blog & Articles';
      case '/admin/profile':
        return 'Lecturer Profile';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="bg-white dark:bg-[#1e222d] border-b border-slate-200 dark:border-[#2d3446] font-['Poppins']">
      {/* Upper Navigation Row */}
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Left: Hamburger + Search with Ctrl / Badge */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-md">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Toggle Navigation"
          >
            <Menu size={19} />
          </button>

          {/* CoreUI Search Bar with shortcut badge */}
          <div className="relative flex-1 hidden sm:block">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-9 pr-14 py-2 rounded-lg bg-slate-50 dark:bg-[#282d3c] border border-slate-200 dark:border-[#373e52] text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#321fdb]"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-slate-400 bg-slate-200/80 dark:bg-slate-700/80 select-none">
              Ctrl /
            </span>
          </div>
        </div>

        {/* Right: Notification, Task, Mail, Theme Switch, Avatar */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Notification Bell */}
          <button
            type="button"
            title="Notifications"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative cursor-pointer"
          >
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#e55353]" />
          </button>

          {/* Task List */}
          <button
            type="button"
            title="Class Tasks"
            className="hidden sm:block p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <ListTodo size={17} />
          </button>

          {/* Mail / Messages */}
          <button
            type="button"
            title="Inquiries"
            className="hidden sm:block p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <Mail size={17} />
          </button>

          {/* Dark / Light Mode Toggle (CoreUI Sun/Moon icon) */}
          <button
            type="button"
            onClick={toggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer active:scale-95"
          >
            {darkMode ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

          {/* Public Website Preview Link */}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1 text-xs font-semibold text-[#321fdb] dark:text-[#3399ff] hover:underline px-2"
          >
            <span>Live Site</span>
            <ArrowUpRight size={13} />
          </a>

          {/* User Profile Avatar (Circular Avatar from screenshot) */}
          <div className="relative group pl-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#321fdb] to-[#3399ff] text-white flex items-center justify-center font-bold text-xs ring-2 ring-slate-100 dark:ring-slate-700 shadow-xs cursor-pointer">
              {admin?.name ? admin.name[0].toUpperCase() : 'A'}
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb Row (Directly below navbar, like CoreUI screenshot) */}
      <div className="px-4 sm:px-6 py-2 bg-slate-50/70 dark:bg-[#181c24] border-t border-slate-100 dark:border-[#2d3446] flex items-center gap-2 text-xs">
        <Link to="/admin" className="text-[#321fdb] dark:text-[#3399ff] hover:underline font-semibold">
          Home
        </Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-600 dark:text-slate-300 font-medium">
          {getBreadcrumb()}
        </span>
      </div>
    </div>
  );
};

export default AdminTopNav;

