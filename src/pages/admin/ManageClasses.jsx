import { useEffect, useState } from 'react';
import API from '../../api/axiosInstance';
import { Plus, Edit3, Trash2, X, Calendar, MapPin, Tag } from 'lucide-react';

const ManageClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    title: '',
    type: 'Theory',
    batchYear: 2027,
    deliveryMethod: 'Physical',
    image: '',
    locations: '',
    monthlyFee: '',
    description: '',
    day: 'Sunday',
    startTime: '08:00 AM',
    endTime: '01:00 PM',
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await API.get('/classes/admin/all');
      setClasses(res.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      type: formData.type,
      batchYear: Number(formData.batchYear),
      deliveryMethod: formData.deliveryMethod,
      image: formData.image,
      locations: formData.locations ? formData.locations.split(',').map((s) => s.trim()) : [],
      monthlyFee: formData.monthlyFee ? Number(formData.monthlyFee) : 0,
      description: formData.description,
      schedule: [
        {
          day: formData.day,
          startTime: formData.startTime,
          endTime: formData.endTime,
        },
      ],
      isActive: formData.isActive,
    };

    try {
      if (editingId) {
        await API.put(`/classes/${editingId}`, payload);
      } else {
        await API.post('/classes', payload);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData(initialFormState);
      fetchClasses();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const handleEdit = (cls) => {
    setEditingId(cls._id);
    setFormData({
      title: cls.title,
      type: cls.type,
      batchYear: cls.batchYear,
      deliveryMethod: cls.deliveryMethod,
      image: cls.image || '',
      locations: cls.locations ? cls.locations.join(', ') : '',
      monthlyFee: cls.monthlyFee || '',
      description: cls.description || '',
      day: cls.schedule?.[0]?.day || 'Sunday',
      startTime: cls.schedule?.[0]?.startTime || '',
      endTime: cls.schedule?.[0]?.endTime || '',
      isActive: cls.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this physics batch permanently?')) return;
    try {
      await API.delete(`/classes/${id}`);
      setClasses(classes.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete class');
    }
  };

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Class Batches Directory</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">Configure batch details, timetables, and live website visibility</p>
        </div>

        <button
          onClick={() => {
            setFormData(initialFormState);
            setEditingId(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-mono text-xs font-semibold tracking-wider transition shadow-lg shadow-indigo-600/25 border border-indigo-400/30"
        >
          <Plus size={15} /> Create Class Batch
        </button>
      </div>

      {/* Modern Table Container */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-slate-400">Loading batches...</div>
        ) : classes.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-slate-400">No classes registered yet. Create one!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-white/[0.03] border-b border-white/[0.06] text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-4 pl-6">Batch / Stream</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Delivery</th>
                  <th className="p-4">Schedule</th>
                  <th className="p-4">Monthly Fee</th>
                  <th className="p-4">Live Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {classes.map((cls) => (
                  <tr key={cls._id} className="hover:bg-white/[0.02] transition">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-slate-100 text-sm">{cls.title}</div>
                      <div className="text-[11px] font-mono text-indigo-400 mt-0.5">{cls.batchYear} A/L Cohort</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {cls.type}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-300">{cls.deliveryMethod}</td>
                    <td className="p-4 font-mono text-slate-400">
                      {cls.schedule?.[0] ? `${cls.schedule[0].day} (${cls.schedule[0].startTime} - ${cls.schedule[0].endTime})` : '-'}
                    </td>
                    <td className="p-4 font-mono font-bold text-cyan-400">
                      {cls.monthlyFee ? `Rs. ${cls.monthlyFee.toLocaleString()}` : 'Free'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase flex items-center gap-1.5 w-fit ${
                        cls.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cls.isActive ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                        {cls.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(cls)}
                          className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-white/[0.05] rounded-lg transition"
                          title="Edit"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(cls._id)}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-white/[0.05] rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modern Frosted Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0f1d] border border-white/[0.1] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
              <div>
                <h2 className="text-base font-bold text-white font-mono tracking-wider">
                  {editingId ? 'EDIT BATCH DETAILS' : 'CREATE NEW CLASS BATCH'}
                </h2>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">Parameters will reflect instantly on the public website</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.06] transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-semibold text-slate-300 mb-1.5">Class Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="2027 A/L Physics Theory"
                    className="admin-input w-full px-3.5 py-2.5 rounded-xl border border-white/[0.1] text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold text-slate-300 mb-1.5">Batch Year</label>
                  <input
                    type="number"
                    required
                    value={formData.batchYear}
                    onChange={(e) => setFormData({ ...formData, batchYear: e.target.value })}
                    className="admin-input w-full px-3.5 py-2.5 rounded-xl border border-white/[0.1] text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold text-slate-300 mb-1.5">Class Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="admin-input w-full px-3.5 py-2.5 rounded-xl border border-white/[0.1] text-xs focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Theory">Theory</option>
                    <option value="Revision">Revision</option>
                    <option value="Paper">Paper</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold text-slate-300 mb-1.5">Delivery Method</label>
                  <select
                    value={formData.deliveryMethod}
                    onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value })}
                    className="admin-input w-full px-3.5 py-2.5 rounded-xl border border-white/[0.1] text-xs focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Physical">Physical</option>
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-semibold text-slate-300 mb-1.5">Poster / Thumbnail URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="admin-input w-full px-3.5 py-2.5 rounded-xl border border-white/[0.1] text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-semibold text-slate-300 mb-1.5">Locations (කොමා වලින් වෙන් කරන්න)</label>
                <input
                  type="text"
                  value={formData.locations}
                  onChange={(e) => setFormData({ ...formData, locations: e.target.value })}
                  placeholder="Rotary Hall Nugegoda, SASIP Nawinna"
                  className="admin-input w-full px-3.5 py-2.5 rounded-xl border border-white/[0.1] text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-semibold text-slate-300 mb-1.5">Day</label>
                  <input
                    type="text"
                    required
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    placeholder="Sunday"
                    className="admin-input w-full px-3 py-2 rounded-xl border border-white/[0.1] text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-semibold text-slate-300 mb-1.5">Start Time</label>
                  <input
                    type="text"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    placeholder="08:00 AM"
                    className="admin-input w-full px-3 py-2 rounded-xl border border-white/[0.1] text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-semibold text-slate-300 mb-1.5">End Time</label>
                  <input
                    type="text"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    placeholder="01:30 PM"
                    className="admin-input w-full px-3 py-2 rounded-xl border border-white/[0.1] text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-[11px] font-mono font-semibold text-slate-300 mb-1.5">Monthly Fee (LKR)</label>
                  <input
                    type="number"
                    value={formData.monthlyFee}
                    onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                    placeholder="4500"
                    className="admin-input w-full px-3.5 py-2.5 rounded-xl border border-white/[0.1] text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-5">
                  <input
                    type="checkbox"
                    id="modalActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                  <label htmlFor="modalActive" className="text-xs font-mono font-semibold text-slate-300 cursor-pointer">
                    Publish Live on Site
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-semibold text-slate-300 mb-1.5">Syllabus Overview / Notes</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed breakdown of syllabus content and resources..."
                  className="admin-input w-full px-3.5 py-2.5 rounded-xl border border-white/[0.1] text-xs focus:border-indigo-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/[0.1] text-xs font-mono text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-semibold tracking-wider transition shadow-lg shadow-indigo-600/25 border border-indigo-400/30"
                >
                  {editingId ? 'Save Updates' : 'Publish Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageClasses;