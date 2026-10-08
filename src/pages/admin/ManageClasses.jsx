import { useEffect, useState } from 'react';
import API from '../../api/axiosInstance';
import {
  Plus,
  Edit3,
  Trash2,
  X,
  Calendar,
  MapPin,
  BookOpen,
  Sparkles,
  Search,
  Layers,
  Clock,
  CheckCircle2,
  EyeOff,
} from 'lucide-react';
import ImageUploadField from '../../components/ImageUploadField';

const ManageClasses = ({ embedded = false }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

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

  const filteredClasses = classes.filter((cls) => {
    const matchesType = typeFilter === 'All' || cls.type === typeFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      cls.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(cls.batchYear).includes(searchQuery) ||
      cls.locations?.join(' ').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className={`${embedded ? '' : 'p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto'} space-y-6 font-['Poppins']`}>
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0d1326] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(15,23,42,0.04)]">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <BookOpen size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Class Batches Directory
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-200/80 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30">
                {classes.length} Batches
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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

      {/* Ultra-Modern Table Card with Search & Filter Toolbar */}
      <div className="rounded-3xl bg-white dark:bg-[#0d1326] border border-slate-200/80 dark:border-slate-800/80 shadow-[0_12px_35px_rgb(15,23,42,0.05)] overflow-hidden">
        
        {/* Interactive Table Toolbar */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search batch title, year or venue..."
              className="admin-input w-full pl-9 pr-4 py-2 rounded-xl border text-xs"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {['All', 'Theory', 'Revision', 'Paper'].map((type) => {
              const active = typeFilter === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTypeFilter(type)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                      : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:border-indigo-300'
                  }`}
                >
                  {type === 'All' ? 'All Streams' : type}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
            Loading physics batches...
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto mb-2">
              <Layers size={22} />
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              No matching classes found
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Try clearing your search filter or click "Create Class Batch" to add a new stream.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/90 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-extrabold">
                  <th className="py-4 pl-6 pr-3 w-12">#</th>
                  <th className="py-4 px-4">Batch & Academic Stream</th>
                  <th className="py-4 px-4">Program Type</th>
                  <th className="py-4 px-4">Mode & Venues</th>
                  <th className="py-4 px-4">Weekly Timetable</th>
                  <th className="py-4 px-4">Monthly Fee</th>
                  <th className="py-4 px-4">Visibility</th>
                  <th className="py-4 pl-4 pr-6 text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {filteredClasses.map((cls, index) => (
                  <tr
                    key={cls._id}
                    className="group/row relative hover:bg-indigo-50/40 dark:hover:bg-indigo-500/[0.06] transition-all duration-200"
                  >
                    {/* Index Number */}
                    <td className="py-4 pl-6 pr-3 font-mono text-[11px] font-bold text-slate-400 dark:text-slate-500">
                      {String(index + 1).padStart(2, '0')}
                    </td>

                    {/* Batch Thumbnail & Title */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3.5">
                        {cls.image ? (
                          <img
                            src={cls.image}
                            alt={cls.title}
                            className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0 group-hover/row:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/15 to-cyan-500/15 border border-indigo-200/80 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300 flex flex-col items-center justify-center font-extrabold text-[11px] shrink-0">
                            <span>{cls.batchYear ? String(cls.batchYear).slice(-2) : 'AL'}</span>
                            <span className="text-[8px] uppercase tracking-wider opacity-75">Batch</span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-extrabold text-slate-900 dark:text-white text-sm group-hover/row:text-indigo-600 dark:group-hover/row:text-indigo-400 transition-colors truncate">
                            {cls.title}
                          </div>
                          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            <span>{cls.batchYear} A/L Cohort</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Program Type Badge */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold border ${
                          cls.type === 'Revision'
                            ? 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/30'
                            : cls.type === 'Paper'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30'
                        }`}
                      >
                        {cls.type}
                      </span>
                    </td>

                    {/* Delivery & Venues */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-1 ${
                          cls.deliveryMethod === 'Online'
                            ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300'
                            : cls.deliveryMethod === 'Hybrid'
                            ? 'bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {cls.deliveryMethod}
                      </span>
                      {cls.locations?.length > 0 && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 max-w-[190px] truncate">
                          <MapPin size={11} className="text-indigo-500 shrink-0" />
                          <span className="truncate">{cls.locations.join(', ')}</span>
                        </div>
                      )}
                    </td>

                    {/* Schedule */}
                    <td className="py-4 px-4">
                      {cls.schedule?.[0] ? (
                        <div className="inline-flex flex-col gap-0.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70">
                          <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-[11px]">
                            <Calendar size={12} className="text-indigo-500 shrink-0" />
                            {cls.schedule[0].day}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Clock size={10} />
                            {cls.schedule[0].startTime} - {cls.schedule[0].endTime}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    {/* Monthly Fee */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-cyan-50/90 text-cyan-800 border border-cyan-200/80 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30 font-extrabold text-xs">
                        {cls.monthlyFee ? `Rs. ${cls.monthlyFee.toLocaleString()}` : 'Free'}
                      </span>
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 w-fit border ${
                          cls.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30'
                            : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30'
                        }`}
                      >
                        {cls.isActive ? (
                          <CheckCircle2 size={12} className="text-emerald-500" />
                        ) : (
                          <EyeOff size={12} className="text-rose-500" />
                        )}
                        {cls.isActive ? 'Published' : 'Hidden'}
                      </span>
                    </td>

                    {/* Actions Capsule */}
                    <td className="py-4 pl-4 pr-6 text-right">
                      <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                        <button
                          onClick={() => handleEdit(cls)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-white dark:hover:bg-slate-700 rounded-xl font-semibold text-[11px] transition cursor-pointer"
                          title="Edit Batch"
                        >
                          <Edit3 size={13} />
                          <span className="hidden xl:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(cls._id)}
                          className="p-1.5 text-rose-600 dark:text-rose-400 hover:text-white hover:bg-rose-600 dark:hover:bg-rose-600 rounded-xl transition cursor-pointer"
                          title="Delete Batch"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer Summary */}
        <div className="px-6 py-3.5 bg-slate-50/70 dark:bg-slate-900/60 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <span>
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredClasses.length}</strong> of{' '}
            <strong className="text-slate-800 dark:text-slate-200">{classes.length}</strong> registered batches
          </span>
          <span>Live Sync Enabled</span>
        </div>
      </div>

      {/* Modern Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-100 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {editingId ? 'Edit Batch Details' : 'Create New Class Batch'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Parameters will reflect instantly on the public website
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Class Title
                  </label>
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Batch Year
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.batchYear}
                    onChange={(e) => setFormData({ ...formData, batchYear: e.target.value })}
                    className="admin-input w-full px-3.5 py-2.5 rounded-xl border text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Class Type
                  </label>
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Delivery Method
                  </label>
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

              <ImageUploadField
                label="Poster / Thumbnail Image (Uploads to Cloudinary)"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                placeholder="Upload image or paste URL..."
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Day
                  </label>
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Start Time
                  </label>
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    End Time
                  </label>
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Monthly Fee (LKR)
                  </label>
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
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-500/10 border border-indigo-200/70 dark:border-indigo-500/30 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    id="modalActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    Publish Live on Website
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
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

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/80 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer"
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