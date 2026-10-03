import { useState } from 'react';
import { BookOpen, MessageSquareQuote, LogOut } from 'lucide-react';
import ManageClasses from './ManageClasses';
import ManageFeedback from './ManageFeedback';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('classes');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 font-['Poppins']">
      
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-[#0a0e1c] px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white text-xs">
              AL
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-white tracking-wider uppercase leading-none">
                Masterclass Admin
              </h1>
              <span className="text-[10px] text-cyan-400 uppercase tracking-widest leading-none mt-1 inline-block">
                Control Center
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition cursor-pointer"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-800 pb-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('classes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'classes'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen size={15} />
            <span>Manage Classes</span>
          </button>

          <button
            onClick={() => setActiveTab('feedbacks')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'feedbacks'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MessageSquareQuote size={15} />
            <span>Student Feedbacks</span>
          </button>
        </div>

        {/* Dynamic Tab Views */}
        <div>
          {activeTab === 'classes' && <ManageClasses />}
          {activeTab === 'feedbacks' && <ManageFeedback />}
        </div>
      </main>

    </div>
  );
};

export default AdminDashboard;