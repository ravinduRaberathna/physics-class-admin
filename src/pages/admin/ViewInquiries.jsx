import { useEffect, useState } from 'react';
import API from '../../api/axiosInstance';
import { Trash2, CheckCircle2, Clock } from 'lucide-react';

const ViewInquiries = () => {
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

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Student Inquiries</h1>
        <p className="text-sm text-slate-500">Contact requests submitted from the website</p>
      </div>

      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading messages...</div>
        ) : inquiries.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No student inquiries received yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Phone / WhatsApp</th>
                  <th className="p-4">Interested Class</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inquiries.map((inq) => (
                  <tr key={inq._id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4 font-semibold text-slate-800">{inq.studentName}</td>
                    <td className="p-4 text-slate-600 font-medium">
                      <a href={`tel:${inq.phone}`} className="text-sky-600 hover:underline">
                        {inq.phone}
                      </a>
                    </td>
                    <td className="p-4 text-slate-600">
                      {inq.classInterested ? (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                          {inq.classInterested.title}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">General</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-600 max-w-xs truncate" title={inq.message}>
                      {inq.message || '-'}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleStatusToggle(inq)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                          inq.status === 'Contacted'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {inq.status === 'Contacted' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {inq.status}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(inq._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                      >
                        <Trash2 size={16} />
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