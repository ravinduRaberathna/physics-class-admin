import { useEffect, useState } from 'react';
import API from '../../api/axiosInstance';
import { Plus, Edit3, Trash2, X, Calendar, MapPin, BookOpen, Sparkles } from 'lucide-react';

const ManageClasses = ({ embedded = false }) => {
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
    <div className={`${embedded ? '' : 'p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto'} space-y-6 font-['Poppins']`}>
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgb(15,23,42,0.04)]">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <BookOpen size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                Class Batches Directory
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-200/80">
                {classes.length} Total
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Configure batch details, timetables, fees, and live website visibility
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setFormData(initialFormState);
            setEditingId(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white px-5 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all shadow-lg shadow-indigo-500/25 cursor-pointer shrink-0 active:scale-95"
        >
          <Plus size={16} />
          <span>Create Class Batch</span>
        </button>
      </div>

      {/* Modern Light Table Container */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-[0_8px_30px_rgb(15,23,42,0.04)] overflow-hidden">
        {loading ? (
          <div className="p-14 text-center text-xs font-medium text-slate-500">
            Loading physics batches...
          </div>
        ) : classes.length === 0 ? (
          <div className="p-14 text-center space-y-2">
            <p className="text-sm font-bold text-slate-700">No classes registered yet</p>
            <p className="text-xs text-slate-500">Click "Create Class Batch" above to publish your first A/L batch.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50/90 border-b border-slate-200/80 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-4 pl-6">Batch / Stream</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Delivery & Venue</th>
                  <th className="p-4">Schedule</th>
                  <th className="p-4">Monthly Fee</th>
                  <th className="p-4">Live Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classes.map((cls) => (
                  <tr key={cls._id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3.5">
                        {cls.image ? (
                          <img
                            src={cls.image}
                            alt={cls.title}
                            className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0 hidden sm:block"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 hidden sm:flex">
                            {cls.batchYear ? String(cls.batchYear).slice(-2) : 'AL'}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{cls.title}</div>
                          <div className="text-[11px] font-semibold text-indigo-600 mt-0.5">
                            {cls.batchYear} A/L Cohort
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                          cls.type === 'Revision'
                            ? 'bg-violet-50 text-violet-700 border-violet-200'
                            : cls.type === 'Paper'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}
                      >
                        {cls.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-700">{cls.deliveryMethod}</div>
                      {cls.locations?.length > 0 && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 max-w-[180px] truncate">
                          <MapPin size={11} className="text-indigo-500 shrink-0" />
                          <span className="truncate">{cls.locations.join(', ')}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-slate-600 font-medium">
                      {cls.schedule?.[0] ? (
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-indigo-500 shrink-0" />
                          <span>
                            {cls.schedule[0].day} ({cls.schedule[0].startTime} - {cls.schedule[0].endTime})
                          </span>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg bg-cyan-50/80 text-cyan-800 border border-cyan-200/70 font-bold text-xs">
                        {cls.monthlyFee ? `Rs. ${cls.monthlyFee.toLocaleString()}` : 'Free'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 w-fit ${
                          cls.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            cls.isActive ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        ></span>
                        {cls.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(cls)}
                          className="p-2 text-slate-600 hover:text-indigo-600 bg-slate-100/80 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 rounded-xl transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(cls._id)}
                          className="p-2 text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200/80 hover:border-rose-600 rounded-xl transition cursor-pointer"
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

      {/* Modern Light Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                    {editingId ? 'Edit Batch Details' : 'Create New Class Batch'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Parameters will reflect instantly on the public website
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Class Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="2027 A/L Physics Theory"
                    className="admin-input w-full px-3.5 py-2.5 rounded-xl border text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Batch Year</label>
                  <input
                    type="number"
                    required
                    value={formData.batchYear}
                    onChange={(e) => setFormData({ ...formData, batchYear: e.target.value })}
                    className="admin-input w-full px-3.5 py-2.5 rounded-xl border text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Class Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="admin-input w-full px-3.5 py-2.5 rounded-xl border text-xs"
                  >
                    <option value="Theory">Theory</option>
                    <option value="Revision">Revision</option>
                    <option value="Paper">Paper</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Delivery Method</label>
                  <select
                    value={formData.deliveryMethod}
                    onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value })}
                    className="admin-input w-full px-3.5 py-2.5 rounded-xl border text-xs"
                  >
                    <option value="Physical">Physical</option>
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Poster / Thumbnail URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="admin-input w-full px-3.5 py-2.5 rounded-xl border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Locations (කොමා වලින් වෙන් කරන්න)
                </label>
                <input
                  type="text"
                  value={formData.locations}
                  onChange={(e) => setFormData({ ...formData, locations: e.target.value })}
                  placeholder="Rotary Hall Nugegoda, SASIP Nawinna"
                  className="admin-input w-full px-3.5 py-2.5 rounded-xl border text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Day</label>
                  <input
                    type="text"
                    required
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    placeholder="Sunday"
                    className="admin-input w-full px-3 py-2.5 rounded-xl border text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Start Time</label>
                  <input
                    type="text"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    placeholder="08:00 AM"
                    className="admin-input w-full px-3 py-2.5 rounded-xl border text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">End Time</label>
                  <input
                    type="text"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    placeholder="01:30 PM"
                    className="admin-input w-full px-3 py-2.5 rounded-xl border text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Monthly Fee (LKR)</label>
                  <input
                    type="number"
                    value={formData.monthlyFee}
                    onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                    placeholder="4500"
                    className="admin-input w-full px-3.5 py-2.5 rounded-xl border text-xs"
                  />
                </div>

                <label
                  htmlFor="modalActive"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-indigo-50/70 border border-indigo-200/70 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    id="modalActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-indigo-900">
                    Publish Live on Website
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Syllabus Overview / Notes
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed breakdown of syllabus content and resources..."
                  className="admin-input w-full px-3.5 py-2.5 rounded-xl border text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white text-xs font-bold tracking-wide transition shadow-lg shadow-indigo-500/25 cursor-pointer"
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