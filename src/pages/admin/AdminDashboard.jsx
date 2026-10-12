import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  MessageSquareQuote, 
  FileText, 
  UserSquare2, 
  Sparkles, 
  Layers, 
  ArrowUpRight,
  TrendingUp,
  MoreVertical,
  CloudDownload,
  Users,
  CheckCircle2,
  GraduationCap,
  Calendar,
  Radio
} from 'lucide-react';
import API from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import ManageClasses from './ManageClasses';
import ManageFeedback from './ManageFeedback';
import ManageBlogs from './ManageBlogs';
import EditTeacher from './EditTeacher';

const AdminDashboard = () => {
  const { admin } = useAuth();
  const [activeTab, setActiveTab] = useState('classes');
  const [timeRange, setTimeRange] = useState('Month'); // 'Day' | 'Month' | 'Year'
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
        console.log('Stats fetch skipped:', err);
      }
    };

    fetchStats();
  }, [activeTab]);

  const managementTabs = [
    { id: 'classes', label: 'Batches & Classes', icon: BookOpen, count: stats.totalClasses },
    { id: 'feedbacks', label: 'Student Reviews', icon: MessageSquareQuote, count: stats.totalFeedbacks },
    { id: 'blogs', label: 'Knowledge Hub Articles', icon: FileText, count: stats.totalBlogs },
    { id: 'profile', label: 'Lecturer Bio & Socials', icon: UserSquare2 },
  ];

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  return (
    <div className="space-y-6 font-['Poppins']">
      
      {/* =========================================================================
          SECTION 1: 4 COREUI METRIC CARDS (Customized for A/L Physics Masterclass)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Royal Purple / Violet (#5856d6) - Total Batches */}
        <div className="bg-[#5856d6] rounded-xl text-white shadow-sm overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5">
          <div className="p-5 pb-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl lg:text-3xl font-extrabold tracking-tight">
                    {stats.totalClasses}
                  </span>
                  <span className="text-xs font-semibold text-white/85 inline-flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full">
                    <span>Batches</span>
                    <TrendingUp size={12} className="inline" />
                  </span>
                </div>
                <p className="text-xs font-medium text-white/90 mt-1">Total Physics Batches</p>
                <p className="text-[10px] text-white/70 mt-0.5">Theory, Revision & Paper</p>
              </div>

              <div className="p-2 rounded-lg bg-white/10 text-white/90">
                <Layers size={18} />
              </div>
            </div>
          </div>

          {/* Sparkline wave with node dots */}
          <div className="px-1 pb-1">
            <svg viewBox="0 0 300 70" className="w-full h-16 overflow-visible" preserveAspectRatio="none">
              <path
                d="M 15 48 Q 45 46, 70 45 T 120 30 T 165 30 T 205 52 T 245 46 T 285 64"
                fill="none"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {[
                { cx: 15, cy: 48 },
                { cx: 70, cy: 45 },
                { cx: 120, cy: 30 },
                { cx: 165, cy: 30 },
                { cx: 205, cy: 52 },
                { cx: 245, cy: 46 },
                { cx: 285, cy: 64 },
              ].map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.cx}
                  cy={pt.cy}
                  r="3.5"
                  fill="#5856d6"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Card 2: Sky / Electric Blue (#3399ff) - Active Live Classes */}
        <div className="bg-[#3399ff] rounded-xl text-white shadow-sm overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5">
          <div className="p-5 pb-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl lg:text-3xl font-extrabold tracking-tight">
                    {stats.activeClasses}
                  </span>
                  <span className="text-xs font-semibold text-white/85 inline-flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full">
                    <span>Live on Web</span>
                    <Radio size={12} className="inline animate-pulse" />
                  </span>
                </div>
                <p className="text-xs font-medium text-white/90 mt-1">Active Class Batches</p>
                <p className="text-[10px] text-white/70 mt-0.5">Physical Venues & Online</p>
              </div>

              <div className="p-2 rounded-lg bg-white/10 text-white/90">
                <BookOpen size={18} />
              </div>
            </div>
          </div>

          {/* Sparkline wave with node dots */}
          <div className="px-1 pb-1">
            <svg viewBox="0 0 300 70" className="w-full h-16 overflow-visible" preserveAspectRatio="none">
              <path
                d="M 15 60 Q 55 50, 85 52 T 145 44 T 200 28 T 250 48 T 285 54"
                fill="none"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {[
                { cx: 15, cy: 60 },
                { cx: 85, cy: 52 },
                { cx: 145, cy: 44 },
                { cx: 200, cy: 28 },
                { cx: 250, cy: 48 },
                { cx: 285, cy: 54 },
              ].map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.cx}
                  cy={pt.cy}
                  r="3.5"
                  fill="#3399ff"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Card 3: Warm Orange / Amber Yellow (#f9b115) - Student Reviews */}
        <div className="bg-[#f9b115] rounded-xl text-white shadow-sm overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5">
          <div className="p-5 pb-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl lg:text-3xl font-extrabold tracking-tight">
                    {stats.totalFeedbacks}
                  </span>
                  <span className="text-xs font-semibold text-white/85 inline-flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full">
                    <span>5.0 ★ Rated</span>
                  </span>
                </div>
                <p className="text-xs font-medium text-white/90 mt-1">Student Reviews</p>
                <p className="text-[10px] text-white/70 mt-0.5">Verified Testimonials</p>
              </div>

              <div className="p-2 rounded-lg bg-white/10 text-white/90">
                <MessageSquareQuote size={18} />
              </div>
            </div>
          </div>

          {/* Smooth filled area wave */}
          <div className="w-full">
            <svg viewBox="0 0 300 70" className="w-full h-16" preserveAspectRatio="none">
              <defs>
                <linearGradient id="amberWaveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <path
                d="M 0 35 C 70 25, 130 38, 190 48 C 240 56, 275 60, 300 62 L 300 70 L 0 70 Z"
                fill="url(#amberWaveGrad)"
              />
              <path
                d="M 0 35 C 70 25, 130 38, 190 48 C 240 56, 275 60, 300 62"
                fill="none"
                stroke="rgba(255,255,255,0.75)"
                strokeWidth="2.5"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Coral / Crimson Red (#e55353) - Knowledge Hub Articles */}
        <div className="bg-[#e55353] rounded-xl text-white shadow-sm overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5">
          <div className="p-5 pb-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl lg:text-3xl font-extrabold tracking-tight">
                    {stats.totalBlogs}
                  </span>
                  <span className="text-xs font-semibold text-white/85 inline-flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full">
                    <span>Published</span>
                  </span>
                </div>
                <p className="text-xs font-medium text-white/90 mt-1">Knowledge Hub Articles</p>
                <p className="text-[10px] text-white/70 mt-0.5">Physics Short Notes & Guides</p>
              </div>

              <div className="p-2 rounded-lg bg-white/10 text-white/90">
                <FileText size={18} />
              </div>
            </div>
          </div>

          {/* Bar Chart Sparkline */}
          <div className="px-3 pb-1">
            <svg viewBox="0 0 300 70" className="w-full h-16" preserveAspectRatio="none">
              {[
                { x: 10, h: 54 },
                { x: 28, h: 44 },
                { x: 46, h: 32 },
                { x: 64, h: 20 },
                { x: 82, h: 14 },
                { x: 100, h: 48 },
                { x: 118, h: 26 },
                { x: 136, h: 40 },
                { x: 154, h: 18 },
                { x: 172, h: 52 },
                { x: 190, h: 36 },
                { x: 208, h: 22 },
                { x: 226, h: 46 },
                { x: 244, h: 38 },
                { x: 262, h: 50 },
                { x: 280, h: 28 },
              ].map((bar, i) => (
                <rect
                  key={i}
                  x={bar.x}
                  y={70 - bar.h}
                  width="7.5"
                  height={bar.h}
                  rx="1.5"
                  fill="rgba(255,255,255,0.35)"
                />
              ))}
            </svg>
          </div>
        </div>

      </div>

      {/* =========================================================================
          SECTION 2: CLASS ACTIVITY & STUDENT INQUIRIES CHART
          ========================================================================= */}
      <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2d3446] rounded-xl shadow-xs overflow-hidden">
        
        {/* Card Header */}
        <div className="p-5 sm:p-6 pb-2 sm:pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-[#2d3446]/60">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
                Student Inquiries & Academic Engagement
              </h2>
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              2026 Academic Year • Physical & Online Class Engagements
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {/* Segmented Button Group [ Day | Month | Year ] */}
            <div className="inline-flex rounded-lg border border-slate-300 dark:border-slate-700 p-0.5 bg-white dark:bg-[#1e222d]">
              {['Day', 'Month', 'Year'].map((range) => {
                const isSelected = timeRange === range;
                return (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#5856d6] text-white shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {range}
                  </button>
                );
              })}
            </div>

            {/* Cloud Download Action Button */}
            <button
              type="button"
              title="Download Academic Summary Report"
              onClick={() => alert('Generating academic batch summary report as CSV...')}
              className="p-2 rounded-lg bg-[#5856d6] hover:bg-[#4845c4] text-white shadow-xs transition cursor-pointer active:scale-95"
            >
              <CloudDownload size={18} />
            </button>
          </div>
        </div>

        {/* Legend Row */}
        <div className="px-5 sm:px-6 pt-3 flex items-center gap-5 text-xs font-semibold text-slate-500 dark:text-slate-400 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#3399ff]" />
            <span>Student Inquiries & Registrations (ශිෂ්‍ය විමසීම්)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#2eb85c]" />
            <span>Class Attendance & Portal Traffic (පැමිණීම සහ සහභාගීත්වය)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-0.5 border-t-2 border-dashed border-[#e55353]" />
            <span>Target Capacity Threshold</span>
          </div>
        </div>

        {/* SVG Multi-Line Chart Canvas */}
        <div className="p-4 sm:p-6 pb-2">
          <div className="w-full relative">
            <svg 
              viewBox="0 0 920 320" 
              className="w-full h-64 sm:h-80 select-none overflow-visible"
            >
              <defs>
                {/* Blue Gradient Area */}
                <linearGradient id="trafficBlueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3399ff" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3399ff" stopOpacity="0.0" />
                </linearGradient>

                {/* Green Gradient Area */}
                <linearGradient id="trafficGreenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2eb85c" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#2eb85c" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines & Y-Axis Labels */}
              <text x="30" y="44" textAnchor="end" className="text-[11px] font-semibold fill-slate-400">250</text>
              <line x1="45" y1="40" x2="905" y2="40" stroke="#f1f5f9" className="dark:stroke-[#2b3244]" strokeWidth="1" />

              <text x="30" y="99" textAnchor="end" className="text-[11px] font-semibold fill-slate-400">200</text>
              <line x1="45" y1="95" x2="905" y2="95" stroke="#f1f5f9" className="dark:stroke-[#2b3244]" strokeWidth="1" />

              <text x="30" y="194" textAnchor="end" className="text-[11px] font-semibold fill-slate-400">100</text>
              <line x1="45" y1="190" x2="905" y2="190" stroke="#f1f5f9" className="dark:stroke-[#2b3244]" strokeWidth="1" />

              <text x="30" y="284" textAnchor="end" className="text-[11px] font-semibold fill-slate-400">0</text>
              <line x1="45" y1="280" x2="905" y2="280" stroke="#e2e8f0" className="dark:stroke-[#333c52]" strokeWidth="1.2" />

              {/* Red Dashed Threshold Line */}
              <line 
                x1="45" 
                y1="225" 
                x2="905" 
                y2="225" 
                stroke="#e55353" 
                strokeWidth="1.5" 
                strokeDasharray="5 5" 
              />

              {/* --- BLUE SPLINE WAVE (Inquiries) --- */}
              <path
                d="M 45 160 C 110 180, 140 220, 195 220 C 270 220, 290 105, 360 105 C 430 105, 460 135, 510 135 C 570 135, 590 85, 650 85 C 730 85, 750 145, 810 160 C 855 170, 880 205, 905 225 L 905 280 L 45 280 Z"
                fill="url(#trafficBlueGrad)"
              />
              <path
                d="M 45 160 C 110 180, 140 220, 195 220 C 270 220, 290 105, 360 105 C 430 105, 460 135, 510 135 C 570 135, 590 85, 650 85 C 730 85, 750 145, 810 160 C 855 170, 880 205, 905 225"
                fill="none"
                stroke="#3399ff"
                strokeWidth="2.8"
                strokeLinecap="round"
              />

              {/* --- GREEN SPLINE WAVE (Attendance) --- */}
              <path
                d="M 45 175 C 95 200, 130 232, 185 232 C 240 232, 280 92, 345 92 C 410 92, 440 170, 490 170 C 540 170, 570 228, 630 228 C 690 228, 715 90, 770 90 C 820 90, 860 180, 905 230 L 905 280 L 45 280 Z"
                fill="url(#trafficGreenGrad)"
              />
              <path
                d="M 45 175 C 95 200, 130 232, 185 232 C 240 232, 280 92, 345 92 C 410 92, 440 170, 490 170 C 540 170, 570 228, 630 228 C 690 228, 715 90, 770 90 C 820 90, 860 180, 905 230"
                fill="none"
                stroke="#2eb85c"
                strokeWidth="2.8"
                strokeLinecap="round"
              />

              {/* Month X-Axis Tick Labels */}
              {months.map((month, idx) => {
                const xPos = 45 + idx * (860 / (months.length - 1));
                return (
                  <g key={month}>
                    <line x1={xPos} y1="280" x2={xPos} y2="285" stroke="#cbd5e1" className="dark:stroke-slate-600" />
                    <text
                      x={xPos}
                      y="302"
                      textAnchor={idx === 0 ? 'start' : idx === months.length - 1 ? 'end' : 'middle'}
                      className="text-[11px] font-semibold fill-slate-500 dark:fill-slate-400"
                    >
                      {month}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Progress Summary Row (Tailored to tuition) */}
        <div className="border-t border-slate-100 dark:border-[#2d3446] p-5 sm:p-6 bg-slate-50/50 dark:bg-[#1a1f2c]/50">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center sm:text-left">
            
            {/* Metric 1: New Inquiries */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">New Inquiries</span>
              <p className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white">
                1,420 Students <span className="text-xs font-semibold text-slate-500">(85%)</span>
              </p>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-[#2eb85c] rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            {/* Metric 2: Active Batches */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Active Batches</span>
              <p className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white">
                {stats.activeClasses} of {stats.totalClasses} Batches Live
              </p>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#3399ff] rounded-full" 
                  style={{ width: stats.totalClasses > 0 ? `${(stats.activeClasses / stats.totalClasses) * 100}%` : '100%' }} 
                />
              </div>
            </div>

            {/* Metric 3: Attendance Turnout */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Attendance Rate</span>
              <p className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white">
                94.8% Average Turnout
              </p>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-[#f9b115] rounded-full" style={{ width: '94%' }} />
              </div>
            </div>

            {/* Metric 4: Satisfaction */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Satisfaction</span>
              <p className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white">
                99.2% Positive Reviews
              </p>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-[#e55353] rounded-full" style={{ width: '99%' }} />
              </div>
            </div>

            {/* Metric 5: Knowledge Reads */}
            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Knowledge Hub Reads</span>
              <p className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white">
                12.5K Monthly Readers
              </p>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-[#5856d6] rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* =========================================================================
          SECTION 3: MANAGEMENT WORKSPACE HUB
          ========================================================================= */}
      <div className="space-y-4">
        {/* Workspace Segmented Controls */}
        <div className="flex items-center justify-between gap-4 flex-wrap bg-white dark:bg-[#1e222d] p-3 rounded-xl border border-slate-200 dark:border-[#2d3446] shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {managementTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#321fdb] text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#321fdb] hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                  {typeof tab.count === 'number' && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-2 pr-2 text-xs font-semibold text-slate-400">
            <span>Logged in as:</span>
            <span className="text-[#321fdb] dark:text-[#3399ff] font-bold">{admin?.name || 'Administrator'}</span>
          </div>
        </div>

        {/* Dynamic Workspace Container */}
        <div>
          {activeTab === 'classes' && <ManageClasses embedded />}
          {activeTab === 'feedbacks' && <ManageFeedback embedded />}
          {activeTab === 'blogs' && <ManageBlogs embedded />}
          {activeTab === 'profile' && <EditTeacher embedded />}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;