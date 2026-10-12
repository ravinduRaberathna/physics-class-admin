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
  ArrowRight,
  Eye,
  Radio
} from 'lucide-react';
import ImageUploadField from '../../components/ImageUploadField';
import AdminPagination from '../../components/AdminPagination';
import { getOptimizedThumbnail } from '../../utils/imageOptimizer';

const ITEMS_PER_PAGE = 6;

const ManageClasses = ({ embedded = false }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Search & view mode states (Clean, streamlined)
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [currentPage, setCurrentPage] = useState(1);

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
      alert(err.response?.data?.message || 'Error saving class batch');
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

  const toggleActiveStatus = async (cls) => {
    try {
      const updated = !cls.isActive;
      await API.put(`/classes/${cls._id}`, { isActive: updated });
      setClasses(classes.map((c) => (c._id === cls._id ? { ...c, isActive: updated } : c)));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  // Streamlined search filtering
  const filteredClasses = classes.filter((cls) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cls.title?.toLowerCase().includes(q) ||
      String(cls.batchYear).includes(q) ||
      cls.type?.toLowerCase().includes(q) ||
      cls.deliveryMethod?.toLowerCase().includes(q) ||
      cls.locations?.join(' ').toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredClasses.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedClasses = filteredClasses.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  return (
    <div className="font-['Poppins'] space-y-5">
      
      {/* Top Control Bar: Search + Cards/Table Toggle + Count + Add Class Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1e222d] p-4 sm:px-6 rounded-2xl border border-slate-200/90 dark:border-[#2d3446] shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by batch title, stream, venue, or year..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#282d3c] border border-slate-200 dark:border-[#373e52] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#321fdb]"
          />
        </div>

        {/* Right Actions: View Toggle + Count Badge + Create Button */}
        <div className="flex items-center gap-3 justify-between sm:justify-end flex-wrap">
          
          {/* Card / Table Toggle */}
          <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-[#282d3c]">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-[#1e222d] text-[#321fdb] dark:text-[#3399ff] shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              Cards View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-[#1e222d] text-[#321fdb] dark:text-[#3399ff] shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              Table View
            </button>
          </div>

          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            <strong className="text-[#321fdb] dark:text-[#3399ff] font-extrabold">{filteredClasses.length}</strong> Batches
          </span>

          <button
            type="button"
            onClick={() => {
              setFormData(initialFormState);
              setEditingId(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#321fdb] hover:bg-[#2b19c2] text-white text-xs font-bold shadow-xs transition cursor-pointer active:scale-95 shrink-0"
          >
            <Plus size={16} />
            <span>Create New Batch</span>
          </button>
        </div>
      </div>

      {/* Main Workspace (Full Width) */}
      <div className="w-full space-y-5">
        
        {/* Loading Indicator */}
        {loading ? (
          <div className="p-16 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-[#1e222d] rounded-2xl border border-slate-200/90 dark:border-[#2d3446]">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-[#321fdb] border-t-transparent rounded-full mb-3" />
            <p className="text-xs font-semibold">Loading class batches...</p>
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="p-16 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-[#1e222d] rounded-2xl border border-slate-200/90 dark:border-[#2d3446]">
            <Layers size={36} className="mx-auto text-slate-300 dark:text-slate-600 mb-2 opacity-60" />
            <p className="text-xs font-semibold">සෙවුමට ගැලපෙන පන්ති හමු නොවීය.</p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-3 text-xs font-bold text-[#321fdb] hover:underline cursor-pointer"
              >
                Clear search query
              </button>
            )}
          </div>
        ) : viewMode === 'cards' ? (
          /* =================================================================
              CARD GRID VIEW (Full Width Grid)
             ================================================================= */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {paginatedClasses.map((cls) => (
              <div
                key={cls._id}
                className="bg-white dark:bg-[#1e222d] rounded-2xl p-5 border border-slate-200/90 dark:border-[#2d3446] hover:border-[#321fdb]/50 dark:hover:border-[#3399ff]/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group h-full"
              >
                <div>
                  {/* Top Header Row of Card */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {cls.image ? (
                        <img
                          src={getOptimizedThumbnail(cls.image)}
                          alt={cls.title}
                          className="w-11 h-11 rounded-xl object-cover shrink-0 border border-slate-100 dark:border-[#2d3446]"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#321fdb] to-[#3399ff] text-white flex items-center justify-center shrink-0 shadow-xs font-black text-xs">
                          <BookOpen size={18} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-[#321fdb] dark:group-hover:text-[#3399ff] transition-colors truncate">
                          {cls.title}
                        </h4>
                        <span className="text-[11px] font-semibold text-slate-400 block truncate mt-0.5">
                          {cls.batchYear} A/L • {cls.type} Stream
                        </span>
                      </div>
                    </div>

                    {/* Toggle Active Button */}
                    <button
                      type="button"
                      onClick={() => toggleActiveStatus(cls)}
                      title={cls.isActive ? 'Live on web (Click to hide)' : 'Hidden (Click to publish)'}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase transition shrink-0 cursor-pointer ${
                        cls.isActive
                          ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-500/30'
                          : 'bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-500/30'
                      }`}
                    >
                      {cls.isActive ? 'Active' : 'Hidden'}
                    </button>
                  </div>

                  {/* Middle Info Highlights */}
                  <div className="space-y-2 py-3 border-y border-slate-100 dark:border-[#2d3446] text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Radio size={14} className="text-[#321fdb] dark:text-[#3399ff] shrink-0" />
                      <span className="font-semibold">{cls.deliveryMethod}</span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-slate-500 dark:text-slate-400 truncate">
                        {cls.locations?.join(', ') || 'No venues specified'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-[#321fdb] dark:text-[#3399ff] shrink-0" />
                      <span className="font-semibold">
                        {cls.schedule?.[0]?.day || 'Schedule TBA'}
                      </span>
                      {cls.schedule?.[0]?.startTime && (
                        <span className="text-slate-500 dark:text-slate-400">
                          ({cls.schedule[0].startTime} - {cls.schedule[0].endTime || 'End'})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Monthly Fee Row */}
                  <div className="pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Monthly Tuition
                      </span>
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        {cls.monthlyFee > 0 ? `Rs. ${cls.monthlyFee.toLocaleString()}` : 'Free / Not Specified'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEdit(cls)}
                        title="Edit Batch Details"
                        className="p-2 rounded-lg text-slate-500 hover:text-[#321fdb] hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(cls._id)}
                        title="Delete Batch"
                        className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* =================================================================
              TABLE VIEW (Full Width Table)
             ================================================================= */
          <div className="bg-white dark:bg-[#1e222d] border border-slate-200/90 dark:border-[#2d3446] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#282d3c] border-b border-slate-200 dark:border-[#2d3446] text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 pl-6 pr-3">Batch & Title</th>
                    <th className="py-3.5 px-3">Stream</th>
                    <th className="py-3.5 px-3">Delivery & Venues</th>
                    <th className="py-3.5 px-3">Schedule</th>
                    <th className="py-3.5 px-3">Fee</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#2d3446]">
                  {paginatedClasses.map((cls) => (
                    <tr key={cls._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="py-4 pl-6 pr-3">
                        <div className="font-extrabold text-slate-900 dark:text-white">{cls.title}</div>
                        <div className="text-[10px] text-slate-400 font-semibold">{cls.batchYear} A/L</div>
                      </td>
                      <td className="py-4 px-3 font-semibold">{cls.type}</td>
                      <td className="py-4 px-3">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 block">{cls.deliveryMethod}</span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[150px] block">{cls.locations?.join(', ') || '-'}</span>
                      </td>
                      <td className="py-4 px-3 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        {cls.schedule?.[0] ? `${cls.schedule[0].day} (${cls.schedule[0].startTime})` : '-'}
                      </td>
                      <td className="py-4 px-3 font-extrabold text-slate-900 dark:text-white">
                        {cls.monthlyFee > 0 ? `Rs. ${cls.monthlyFee.toLocaleString()}` : '-'}
                      </td>
                      <td className="py-4 px-3">
                        <button
                          type="button"
                          onClick={() => toggleActiveStatus(cls)}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
                            cls.isActive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400'
                          }`}
                        >
                          {cls.isActive ? 'Active' : 'Hidden'}
                        </button>
                      </td>
                      <td className="py-4 pl-3 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEdit(cls)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#321fdb] hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(cls._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer"
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
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <AdminPagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

      </div>

      {/* =========================================================================
          ADD / EDIT BATCH MODAL
         ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1e222d] rounded-2xl border border-slate-200/90 dark:border-[#2d3446] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#2d3446]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#321fdb]/10 text-[#321fdb] dark:text-[#3399ff] flex items-center justify-center font-bold">
                  <Layers size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                    {editingId ? 'Edit Physics Class Batch' : 'Create New Class Batch'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configure stream, schedule, monthly fee and live visibility
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Class Batch Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. 2027 A/L Theory Masterclass"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2d3446] bg-slate-50 dark:bg-[#282d3c] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#321fdb]"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2d3446] bg-slate-50 dark:bg-[#282d3c] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#321fdb]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Class Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2d3446] bg-slate-50 dark:bg-[#282d3c] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#321fdb]"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2d3446] bg-slate-50 dark:bg-[#282d3c] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#321fdb]"
                  >
                    <option value="Physical">Physical</option>
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Monthly Fee (LKR)
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyFee}
                    onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                    placeholder="4500"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2d3446] bg-slate-50 dark:bg-[#282d3c] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#321fdb]"
                  />
                </div>
              </div>

              <ImageUploadField
                label="Poster / Thumbnail Image"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                placeholder="Upload photo or paste URL..."
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Locations / Venues (Separate by comma)
                </label>
                <input
                  type="text"
                  value={formData.locations}
                  onChange={(e) => setFormData({ ...formData, locations: e.target.value })}
                  placeholder="Rotary Hall Nugegoda, SASIP Nawinna"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2d3446] bg-slate-50 dark:bg-[#282d3c] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#321fdb]"
                />
              </div>

              {/* Schedule row */}
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
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-[#2d3446] bg-slate-50 dark:bg-[#282d3c] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#321fdb]"
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
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-[#2d3446] bg-slate-50 dark:bg-[#282d3c] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#321fdb]"
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
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-[#2d3446] bg-slate-50 dark:bg-[#282d3c] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#321fdb]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Syllabus Overview / Notes
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed breakdown of syllabus content and materials..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2d3446] bg-slate-50 dark:bg-[#282d3c] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#321fdb]"
                />
              </div>

              {/* Publish Checkbox */}
              <label className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 accent-[#321fdb] rounded cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Publish Live on Website
                </span>
              </label>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-[#2d3446]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#321fdb] hover:bg-[#2b19c2] text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
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