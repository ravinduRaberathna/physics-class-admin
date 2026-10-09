import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  MessageSquareQuote, 
  FileText,
  UserSquare2, 
  Sparkles, 
  Layers, 
  ArrowUpRight,
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';
import API from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import ManageClasses from './ManageClasses';
import ManageFeedback from './ManageFeedback';
import ManageBlogs from './ManageBlogs';
import EditTeacher from './EditTeacher';

const AdminDashboard = () => {
  const { admin, darkMode, toggleDarkMode } = useAuth();
  const [activeTab, setActiveTab] = useState('classes');
  const [stats, setStats] = useState({
    totalClasses: 0,
    activeClasses: 0,
    totalFeedbacks: 0,
    totalBlogs: 0,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
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
        console.log('Dashboard stats fetch skipped:', err);
      }
    };

    fetchDashboardStats();
  }, [activeTab]);

  const tabs = [
    { id: 'classes', label: 'Manage Classes', icon: BookOpen, count: stats.totalClasses },
    { id: 'feedbacks', label: 'Student Feedbacks', icon: MessageSquareQuote, count: stats.totalFeedbacks },
    { id: 'blogs', label: 'Blog & Articles', icon: FileText, count: stats.totalBlogs },
    { id: 'profile', label: 'Lecturer Profile', icon: UserSquare2 },
  ];

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 font-['Poppins'] text-slate-800">
      
      {/* Top Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 p-6 sm:p-8 text-white shadow-[0_20px_50px_-15px_rgba(99,102,241,0.35)]">
        <div
          className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute right-20 -bottom-16 w-52 h-52 rounded-full bg-cyan-300/20 blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[11px] font-bold uppercase tracking-widest mb-3">
              <Sparkles size={12} className="text-cyan-200" />
              <span>Masterclass Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {admin?.name || 'Administrator'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 mt-1.5 max-w-xl">
              Manage A/L Physics batches, student testimonials, blog articles, and lecturer profile settings from one clean workspace.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white text-xs font-bold shadow-sm transition cursor-pointer active:scale-95"
            >
              {darkMode ? <Sun size={15} className="text-amber-300" /> : <Moon size={15} />}
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-bold shadow-md transition active:scale-95"
            >
              <span>Open Live Site</span>
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </div>

      {/* Live KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('classes')}
          className="text-left bg-white p-5 rounded-3xl border border-slate-200/80 hover:border-indigo-300 shadow-[0_8px_30px_rgb(15,23,42,0.04)] transition group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Layers size={18} />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {stats.activeClasses} Active
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.totalClasses}</div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">Registered Class Batches</div>
        </button>

        <button
          onClick={() => setActiveTab('feedbacks')}
          className="text-left bg-white p-5 rounded-3xl border border-slate-200/80 hover:border-cyan-300 shadow-[0_8px_30px_rgb(15,23,42,0.04)] transition group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors">
              <MessageSquareQuote size={18} />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
              Reviews
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.totalFeedbacks}</div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">Student Testimonials</div>
        </button>

        <button
          onClick={() => setActiveTab('blogs')}
          className="text-left bg-white p-5 rounded-3xl border border-slate-200/80 hover:border-amber-300 shadow-[0_8px_30px_rgb(15,23,42,0.04)] transition group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <FileText size={18} />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Articles
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.totalBlogs}</div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">Blog & Articles</div>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className="text-left bg-white p-5 rounded-3xl border border-slate-200/80 hover:border-violet-300 shadow-[0_8px_30px_rgb(15,23,42,0.04)] transition group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-50 border border-violet-100 text-violet-600 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors">
              <UserSquare2 size={18} />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200">
              <CheckCircle2 size={10} /> Live
            </span>
          </div>
          <div className="text-base font-extrabold text-slate-900 mt-1">Lecturer Bio</div>
          <div className="text-xs font-medium text-slate-500 mt-1">Update Profile & Socials</div>
        </button>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-2xs overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Views */}
      <div>
        {activeTab === 'classes' && <ManageClasses embedded />}
        {activeTab === 'feedbacks' && <ManageFeedback embedded />}
        {activeTab === 'blogs' && <ManageBlogs embedded />}
        {activeTab === 'profile' && <EditTeacher embedded />}
      </div>

    </div>
  );
};

export default AdminDashboard;