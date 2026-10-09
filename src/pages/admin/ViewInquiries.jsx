import { useEffect, useState } from 'react';
import API from '../../api/axiosInstance';
import AdminPagination from '../../components/AdminPagination';
import {
  Trash2,
  CheckCircle2,
  Clock,
  Inbox,
  PhoneCall,
  MessageSquare,
  Search,
} from 'lucide-react';

const ITEMS_PER_PAGE = 5;

const ViewInquiries = ({ embedded = false }) => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await API.get('/inquiries');
      setInquiries(res.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusToggle = async (inq) => {
    const nextStatus = inq.status === 'Pending' ? 'Contacted' : 'Pending';
    try {
      await API.put(`/inquiries/${inq._id}`, { status: nextStatus });
      setInquiries(
        inquiries.map((item) => (item._id === inq._id ? { ...item, status: nextStatus } : item))
      );
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry message?')) return;
    try {
      await API.delete(`/inquiries/${id}`);
      setInquiries(inquiries.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete inquiry');
    }
  };

  const pendingCount = inquiries.filter((i) => i.status === 'Pending').length;

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStatus = statusFilter === 'All' || inq.status === statusFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      inq.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone?.includes(searchQuery) ||
      inq.classInterested?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.message?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredInquiries.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedInquiries = filteredInquiries.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  return (
    <div className={`${embedded ? '' : 'p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto'} space-y-6 font-['Poppins']`}>
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0d1326] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(15,23,42,0.04)]">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <Inbox size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Student Inquiries
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-200/80 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30">
                {inquiries.length} Total
              </span>
              {pendingCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30">
                  {pendingCount} Pending
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enrollment & contact requests submitted from the public website
            </p>
          </div>
        </div>
      </div>

      {/* Ultra-Modern Table Card with Search & Status Filter */}
      <div className="bg-white dark:bg-[#0d1326] rounded-3xl shadow-[0_12px_35px_rgb(15,23,42,0.05)] border border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
        
        {/* Interactive Toolbar */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          <div className="relative w-full md:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student, phone or batch..."
              className="admin-input w-full pl-9 pr-4 py-2 rounded-xl border text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {['All', 'Pending', 'Contacted'].map((status) => {
              const active = statusFilter === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                      : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:border-indigo-300'
                  }`}
                >
                  {status === 'All' ? 'All Requests' : status}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
            Loading messages...
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="p-16 text-center space-y-1">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              No student inquiries found
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              New website registration submissions will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/90 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-extrabold">
                  <th className="py-4 pl-6 pr-3 w-12">#</th>
                  <th className="py-4 px-4">Student Name</th>
                  <th className="py-4 px-4">Direct Contact</th>
                  <th className="py-4 px-4">Interested Stream</th>
                  <th className="py-4 px-4">Note / Venue</th>
                  <th className="py-4 px-4">Follow-Up Status</th>
                  <th className="py-4 pl-4 pr-6 text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {paginatedInquiries.map((inq, index) => {
                  const cleanPhone = (inq.phone || '').replace(/[^0-9]/g, '');
                  const wpPhone = cleanPhone.startsWith('0')
                    ? `94${cleanPhone.slice(1)}`
                    : cleanPhone;

                  return (
                    <tr
                      key={inq._id}
                      className="group/row hover:bg-indigo-50/40 dark:hover:bg-indigo-500/[0.06] transition-all duration-200"
                    >
                      <td className="py-4 pl-6 pr-3 font-mono text-[11px] font-bold text-slate-400 dark:text-slate-500">
                        {String((safePage - 1) * ITEMS_PER_PAGE + index + 1).padStart(2, '0')}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-extrabold text-xs flex items-center justify-center shadow-xs shrink-0">
                            {inq.studentName ? inq.studentName[0].toUpperCase() : 'S'}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm block">
                              {inq.studentName}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Online Inquiry
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-semibold">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${inq.phone}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 text-slate-700 dark:text-slate-200 hover:text-indigo-600 border border-slate-200/70 dark:border-slate-700 transition"
                            title="Call Student"
                          >
                            <PhoneCall size={12} className="text-indigo-500" />
                            <span>{inq.phone}</span>
                          </a>

                          {wpPhone && (
                            <a
                              href={`https://wa.me/${wpPhone}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition"
                              title="Reply on WhatsApp"
                            >
                              <MessageSquare size={13} />
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-slate-600">
                        {inq.classInterested ? (
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200/80 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30 rounded-xl text-[11px] font-bold inline-block">
                            {inq.classInterested.title}
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-[11px] font-semibold inline-block">
                            General Inquiry
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        <div
                          className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 truncate"
                          title={inq.message}
                        >
                          {inq.message || 'No additional note'}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleStatusToggle(inq)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition cursor-pointer border ${
                            inq.status === 'Contacted'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30'
                              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30'
                          }`}
                        >
                          {inq.status === 'Contacted' ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <Clock size={12} />
                          )}
                          {inq.status}
                        </button>
                      </td>

                      <td className="py-4 pl-4 pr-6 text-right">
                        <button
                          onClick={() => handleDelete(inq._id)}
                          className="p-2 text-rose-600 dark:text-rose-400 hover:text-white bg-rose-50 dark:bg-rose-500/15 hover:bg-rose-600 border border-rose-200/80 dark:border-rose-500/30 hover:border-rose-600 rounded-xl transition cursor-pointer"
                          title="Delete Inquiry"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <AdminPagination
          currentPage={safePage}
          totalItems={filteredInquiries.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          itemLabel="student inquiries"
        />
      </div>
    </div>
  );
};

export default ViewInquiries;