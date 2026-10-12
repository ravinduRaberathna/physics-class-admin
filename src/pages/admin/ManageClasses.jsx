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
  SlidersHorizontal,
  RotateCcw,
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
  
  // Filter states (Matching the Dribbble screenshot)
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Active' | 'Hidden'
  const [deliveryFilter, setDeliveryFilter] = useState('All'); // 'All' | 'Physical' | 'Online'
  const [typeFilter, setTypeFilter] = useState('All'); // 'All' | 'Theory' | 'Revision' | 'Paper'
  const [yearFilter, setYearFilter] = useState('All'); // 'All' | 2025 | 2026 | 2027
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

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setDeliveryFilter('All');
    setTypeFilter('All');
    setYearFilter('All');
    setCurrentPage(1);
  };

  // Filter application
  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      !searchQuery.trim() ||
      cls.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(cls.batchYear).includes(searchQuery) ||
      cls.locations?.join(' ').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Active' && cls.isActive) ||
      (statusFilter === 'Hidden' && !cls.isActive);

    const matchesDelivery =
      deliveryFilter === 'All' || cls.deliveryMethod === deliveryFilter;

    const matchesType =
      typeFilter === 'All' || cls.type === typeFilter;

    const matchesYear =
      yearFilter === 'All' || String(cls.batchYear) === String(yearFilter);

    return matchesSearch && matchesStatus && matchesDelivery && matchesType && matchesYear;
  });

  const totalPages = Math.max(1, Math.ceil(filteredClasses.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedClasses = filteredClasses.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  return (
    <div className="font-['Poppins']">
      
      {/* =========================================================================
          Dribbble Split-Tone Layout (Left Filters + Right Cards Grid)
         ========================================================================= */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* =====================================================================
            LEFT FILTERS PANEL (Exact Dribbble Sidebar Style)
           ===================================================================== */}
        <aside className="w-full lg:w-72 shrink-0 bg-white dark:bg-[#0c1224] rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.04)] space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-purple-600 dark:text-purple-400" />
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">
                Filters
              </h3>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              title="Reset all filters"
              className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <RotateCcw size={13} />
            </button>
          </div>

          {/* Section 1: Order / Class Status */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Batch Status
            </span>
            <div className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {[
                { label: 'All Statuses', value: 'All' },
                { label: 'Active (Live on Web)', value: 'Active' },
                { label: 'Hidden / Inactive', value: 'Hidden' },
              ].map((item) => (
                <label key={item.value} className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="batchStatus"
                    checked={statusFilter === item.value}
                    onChange={() => {
                      setStatusFilter(item.value);
                      setCurrentPage(1);
                    }}
                    className="accent-purple-600 w-4 h-4 cursor-pointer"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 2: Delivery Mode */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Delivery Method
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Physical', 'Online', 'Hybrid'].map((method) => {
                const active = deliveryFilter === method;
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => {
                      setDeliveryFilter(method);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      active
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {method}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Class Type */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Class Stream / Type
            </span>
            <div className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {['All', 'Theory', 'Revision', 'Paper'].map((type) => (
                <label key={type} className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="classType"
                    checked={typeFilter === type}
                    onChange={() => {
                      setTypeFilter(type);
                      setCurrentPage(1);
                    }}
                    className="accent-purple-600 w-4 h-4 cursor-pointer"
                  />
                  <span>{type === 'All' ? 'All Types' : `${type} Masterclass`}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 4: Batch Year */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              A/L Batch Year
            </span>
            <div className="grid grid-cols-2 gap-2">
              {['All', '2025', '2026', '2027'].map((yr) => {
                const active = yearFilter === yr;
                return (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => {
                      setYearFilter(yr);
                      setCurrentPage(1);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      active
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-sm'
                        : 'bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-purple-300'
                    }`}
                  >
                    {yr === 'All' ? 'All Batches' : `${yr} A/L`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: View Mode Switch (Card View / Table View) */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Card view
            </span>
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
              className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                viewMode === 'cards' ? 'bg-purple-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        </aside>

        {/* =====================================================================
            RIGHT WORKSPACE (Card Grid or Table Matching Screenshot)
           ===================================================================== */}
        <div className="flex-1 min-w-0 w-full space-y-5">
          
          {/* Top Control Bar: Search + Count Badge + Add Class Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0c1224] p-4 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
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
                placeholder="Search batch, venue, or year..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-3 justify-between sm:justify-end">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                <strong className="text-purple-600 dark:text-purple-400 font-extrabold">{filteredClasses.length}</strong> Batches
              </span>

              <button
                type="button"
                onClick={() => {
                  setFormData(initialFormState);
                  setEditingId(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-600/25 transition cursor-pointer active:scale-95 shrink-0"
              >
                <Plus size={16} />
                <span>New Batch</span>
              </button>
            </div>
          </div>

          {/* Loading Indicator */}
          {loading ? (
            <div className="p-16 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-[#0c1224] rounded-3xl border border-slate-200/90 dark:border-slate-800">
              <div className="inline-block animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mb-3" />
              <p className="text-xs font-semibold">Loading class batches...</p>
            </div>
          ) : filteredClasses.length === 0 ? (
            <div className="p-16 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-[#0c1224] rounded-3xl border border-slate-200/90 dark:border-slate-800">
              <Layers size={36} className="mx-auto text-slate-300 mb-2 opacity-60" />
              <p className="text-xs font-semibold">සෙවුමට ගැලපෙන පන්ති හමු නොවීය.</p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 text-xs font-bold text-purple-600 hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : viewMode === 'cards' ? (
            /* =================================================================
                CARD GRID VIEW (Matches Alex Trio, Jerome Bell cards from Dribbble)
               ================================================================= */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {paginatedClasses.map((cls) => (
                <div
                  key={cls._id}
                  className="bg-white dark:bg-[#0c1224] rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 hover:border-purple-400/80 dark:hover:border-purple-500/50 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.05)] hover:shadow-[0_20px_45px_-10px_rgba(147,51,234,0.18)] transition-all flex flex-col justify-between group h-full"
                >
                  <div>
                    {/* Top Header Row of Card */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {cls.image ? (
                          <img
                            src={getOptimizedThumbnail(cls.image)}
                            alt={cls.title}
                            className="w-11 h-11 rounded-2xl object-cover shrink-0 border border-slate-100 dark:border-slate-800"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-sm font-black text-xs">
                            <BookOpen size={18} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors truncate">
                            {cls.title}
                          </h4>
                          <span className="text-[11px] font-semibold text-slate-400 block truncate mt-0.5">
                            {cls.batchYear} A/L • {cls.type}
                          </span>
                        </div>
                      </div>

                      {/* Status Pill Badge */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide shrink-0 ${
                          cls.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30'
                        }`}
                      >
                        {cls.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </div>

                    {/* Middle Details Grid */}
                    <div className="space-y-2 py-3 border-y border-slate-100 dark:border-slate-800/70 text-xs">
                      {/* Schedule */}
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                          <Calendar size={13} className="text-purple-500" />
                          <span>Schedule</span>
                        </span>
                        <span className="font-bold text-[11px]">
                          {cls.schedule?.[0]
                            ? `${cls.schedule[0].day} (${cls.schedule[0].startTime})`
                            : 'Weekly Session'}
                        </span>
                      </div>

                      {/* Delivery Mode & Venue */}
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                          <MapPin size={13} className="text-cyan-500" />
                          <span>Venue</span>
                        </span>
                        <span className="font-bold text-[11px] truncate max-w-[150px]">
                          {cls.locations?.[0] || cls.deliveryMethod}
                        </span>
                      </div>

                      {/* Monthly Fee */}
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span className="text-slate-400 text-[11px]">Monthly Fee</span>
                        <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                          {cls.monthlyFee > 0 ? `Rs. ${cls.monthlyFee.toLocaleString()}` : 'Free / Contact'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer (Matches "Order details →" button in Dribbble) */}
                  <div className="mt-4 pt-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      {/* Toggle Active Switch */}
                      <button
                        type="button"
                        onClick={() => toggleActiveStatus(cls)}
                        title={cls.isActive ? 'Hide batch from website' : 'Publish batch live'}
                        className={`p-2 rounded-xl transition cursor-pointer ${
                          cls.isActive
                            ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800'
                            : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {cls.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDelete(cls._id)}
                        title="Delete batch permanently"
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Manage Details Primary Action Button */}
                    <button
                      type="button"
                      onClick={() => handleEdit(cls)}
                      className="px-4 py-2 rounded-xl bg-[#0f172a] dark:bg-purple-600/20 hover:bg-purple-600 dark:hover:bg-purple-600 text-white dark:text-purple-300 hover:text-white border border-slate-700/50 dark:border-purple-500/30 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
                    >
                      <span>Class details</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* =================================================================
                TABLE VIEW (Alternate classic view)
               ================================================================= */
            <div className="bg-white dark:bg-[#0c1224] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.04)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider">
                    <tr>
                      <th className="py-4 pl-6 pr-3">Batch</th>
                      <th className="py-4 px-3">Type</th>
                      <th className="py-4 px-3">Mode & Venues</th>
                      <th className="py-4 px-3">Schedule</th>
                      <th className="py-4 px-3">Fee</th>
                      <th className="py-4 px-3">Status</th>
                      <th className="py-4 pl-3 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginatedClasses.map((cls) => (
                      <tr key={cls._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
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
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            cls.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {cls.isActive ? 'Active' : 'Hidden'}
                          </span>
                        </td>
                        <td className="py-4 pl-3 pr-6 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleEdit(cls)}
                              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-purple-50 transition cursor-pointer"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(cls._id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer"
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
      </div>

      {/* =========================================================================
          ADD / EDIT BATCH MODAL (Sleek Glassmorphic Modal)
         ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0d142b] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <Layers size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                    {editingId ? 'Edit Physics Class Batch' : 'Create New Class Batch'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configure syllabus stream, schedules, monthly fee and live visibility
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Class Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
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
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
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
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
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
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Publish Checkbox */}
              <label className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                />
                <span className="text-xs font-bold text-purple-950 dark:text-purple-200">
                  Publish Live on Website
                </span>
              </label>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold transition shadow-md shadow-purple-600/25 cursor-pointer active:scale-95"
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