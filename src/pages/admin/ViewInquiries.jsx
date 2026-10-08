import { useEffect, useState } from 'react';
import API from '../../api/axiosInstance';
import { Trash2, CheckCircle2, Clock, Inbox, PhoneCall, MessageCircle } from 'lucide-react';

const ViewInquiries = ({ embedded = false }) => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className={`${embedded ? '' : 'p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto'} space-y-6 font-['Poppins']`}>
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgb(15,23,42,0.04)]">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <Inbox size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                Student Inquiries
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-200/80">
                {inquiries.length} Total
              </span>
              {pendingCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  {pendingCount} Pending
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Enrollment & contact requests submitted from the public website
            </p>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(15,23,42,0.04)] border border-slate-200/80 overflow-hidden">
        {loading ? (
          <div className="p-14 text-center text-xs font-medium text-slate-500">Loading messages...</div>
        ) : inquiries.length === 0 ? (
          <div className="p-14 text-center space-y-1">
            <p className="text-sm font-bold text-slate-700">No student inquiries received yet</p>
            <p className="text-xs text-slate-500">New website registration submissions will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50/90 border-b border-slate-200/80 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-4 pl-6">Student Name</th>
                  <th className="p-4">Phone / WhatsApp</th>
                  <th className="p-4">Interested Class</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inquiries.map((inq) => (
                  <tr key={inq._id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0">
                          {inq.studentName ? inq.studentName[0].toUpperCase() : 'S'}
                        </div>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">
                          {inq.studentName}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${inq.phone}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition"
                        >
                          <PhoneCall size={12} />
                          <span>{inq.phone}</span>
                        </a>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      {inq.classInterested ? (
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200/80 rounded-lg text-[11px] font-bold">
                          {inq.classInterested.title}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-medium">
                          General Inquiry
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-600 max-w-xs truncate" title={inq.message}>
                      {inq.message || '-'}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleStatusToggle(inq)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                          inq.status === 'Contacted'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {inq.status === 'Contacted' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {inq.status}
                      </button>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleDelete(inq._id)}
                        className="p-2 text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200/80 hover:border-rose-600 rounded-xl transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewInquiries;