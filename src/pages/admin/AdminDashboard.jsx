import { useEffect, useState } from 'react';
import API from '../../api/axiosInstance';
import { Layers, Inbox, AlertCircle, ArrowUpRight, Plus, Activity, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ classesCount: 0, inquiriesCount: 0, pendingInquiries: 0 });
  const [recentInquiries, setRecentInquiries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, inquiriesRes] = await Promise.all([
          API.get('/classes/admin/all'),
          API.get('/inquiries'),
        ]);

        const pending = inquiriesRes.data.filter((item) => item.status === 'Pending').length;

        setStats({
          classesCount: classesRes.data.length,
          inquiriesCount: inquiriesRes.data.length,
          pendingInquiries: pending,
        });

        setRecentInquiries(inquiriesRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            System Metrics <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">Live</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">Real-time status of academic streams & student conversions</p>
        </div>

        <Link
          to="/admin/classes"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold tracking-wider transition shadow-lg shadow-indigo-600/25 border border-indigo-400/30"
        >
          <Plus size={15} /> Add New Batch
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-medium">TOTAL CURRICULUMS</span>
            <Layers size={18} className="text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono mt-4 tracking-tight">{stats.classesCount}</div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Theory / Revision / Paper</span>
            <Link to="/admin/classes" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold">
              Batches <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-medium">STUDENT INQUIRIES</span>
            <Inbox size={18} className="text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono mt-4 tracking-tight">{stats.inquiriesCount}</div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Submitted via Landing Page</span>
            <Link to="/admin/inquiries" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold">
              View All <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-medium">PENDING FOLLOW-UPS</span>
            <AlertCircle size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono mt-4 tracking-tight">{stats.pendingInquiries}</div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Requires Action</span>
            <span className="text-amber-400/80 font-medium">Pending Contact</span>
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Activity size={16} className="text-indigo-400" /> RECENT INCOMING LEADS
          </h3>
          <Link to="/admin/inquiries" className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            See all leads <ArrowUpRight size={13} />
          </Link>
        </div>

        {recentInquiries.length === 0 ? (
          <p className="text-xs font-mono text-slate-400 text-center py-8">No recent activity detected.</p>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {recentInquiries.map((inq) => (
              <div key={inq._id} className="py-3.5 flex items-center justify-between hover:bg-white/[0.01] px-2 rounded-xl transition">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-slate-200">{inq.studentName}</p>
                  <p className="text-xs font-mono text-slate-400">
                    {inq.phone} • <span className="text-slate-300">{inq.classInterested?.title || 'General Influx'}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase flex items-center gap-1.5 ${
                    inq.status === 'Contacted'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${inq.status === 'Contacted' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                    {inq.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;