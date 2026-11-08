import { useEffect, useState, useRef } from 'react';
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
  Radio,
  Bold,
  Italic,
  List,
  ListOrdered,
  Underline,
  RemoveFormatting,
  GraduationCap
} from 'lucide-react';
import ImageUploadField from '../../components/ImageUploadField';
import AdminPagination from '../../components/AdminPagination';
import { getOptimizedThumbnail } from '../../utils/imageOptimizer';

const STANDARD_TYPES = ['None', 'Theory', 'Revision', 'Theory + Revision', 'Paper'];
const STANDARD_DELIVERY_METHODS = ['None', 'Physical', 'Online', 'Physical & Online'];
const STANDARD_BATCH_YEARS = [2025, 2026, 2027, 2028, 2029];

// Smart batch badge formatter: e.g. "2027 O/L", "2027 A/L", "2027 IGCSE", handles "None"
const getBatchLevelBadge = (cls) => {
  if (!cls) return '';
  const rawYear = cls.batchYear;
  const isNoneYear = !rawYear || rawYear === 0 || rawYear === '0' || rawYear === 'None';
  const year = isNoneYear ? '' : String(rawYear).trim();

  const rawLevel = cls.academicLevel;
  const isNoneLevel = !rawLevel || rawLevel === 'None';
  const level = isNoneLevel ? '' : rawLevel;

  if (year && level) {
    if (level === 'Other') return `${year} Stream`.trim();
    return `${year} ${level}`.trim();
  }
  if (year && !level) return year;
  if (!year && level) {
    if (level === 'Other') return '';
    return level;
  }
  return '';
};
const ITEMS_PER_PAGE = 6;

// Convert markdown or raw text into formatted HTML for live visual editing
const markdownToHtml = (str) => {
  if (!str) return '';
  if (/<[a-z][\s\S]*>/i.test(str)) {
    return str;
  }
  const lines = str.split('\n');
  let html = '';
  let inUl = false;
  let inOl = false;

  for (let line of lines) {
    let trimmed = line.trim();

    if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inUl) {
        if (inOl) { html += '</ol>'; inOl = false; }
        html += '<ul class="list-disc pl-5 my-1.5 space-y-1">';
        inUl = true;
      }
      let content = trimmed.replace(/^[•\-\*]\s*/u, '');
      content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      content = content.replace(/\*([^*]+)\*/g, '<em>$1</em>');
      html += '<li>' + content + '</li>';
      continue;
    } else if (inUl) {
      html += '</ul>';
      inUl = false;
    }

    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      if (!inOl) {
        html += '<ol class="list-decimal pl-5 my-1.5 space-y-1">';
        inOl = true;
      }
      let content = numMatch[2];
      content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      content = content.replace(/\*([^*]+)\*/g, '<em>$1</em>');
      html += '<li>' + content + '</li>';
      continue;
    } else if (inOl) {
      html += '</ol>';
      inOl = false;
    }

    if (trimmed.startsWith('📌') || trimmed.startsWith('>')) {
      let content = trimmed.replace(/^[📌>]\s*/u, '');
      content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      content = content.replace(/\*([^*]+)\*/g, '<em>$1</em>');
      html += '<div class="note-box" style="padding: 8px 12px; margin: 6px 0; background: rgba(99, 102, 241, 0.12); border-left: 3px solid #6366f1; border-radius: 8px; font-weight: 500;">📌 ' + content + '</div>';
      continue;
    }

    if (!trimmed) {
      html += '<div><br></div>';
      continue;
    }

    let content = line;
    content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    content = content.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html += '<div>' + content + '</div>';
  }

  if (inUl) html += '</ul>';
  if (inOl) html += '</ol>';
  return html;
};

const ManageClasses = ({ embedded = false }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isCustomType, setIsCustomType] = useState(false);
  const [isCustomDelivery, setIsCustomDelivery] = useState(false);
  const [isCustomBatchYear, setIsCustomBatchYear] = useState(false);
  const editorRef = useRef(null);

  // Search & view mode states
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [currentPage, setCurrentPage] = useState(1);

  const initialFormState = {
    title: '',
    type: 'Theory',
    academicLevel: 'A/L',
    customLevel: '',
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

  // Initialize WYSIWYG editor content when modal opens or batch changes
  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = markdownToHtml(formData.description || '');
        }
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen, editingId]);

  // Live visual formatting execution (preserves selection & applies style in-place)
  const executeFormat = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const clean = (html === '<br>' || html === '<p><br></p>' || html === '<div><br></div>') ? '' : html;
      setFormData((prev) => ({ ...prev, description: clean }));
    }
  };

  const insertCallout = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    const calloutHtml = '<div class="note-box" style="padding: 8px 12px; margin: 6px 0; background: rgba(99, 102, 241, 0.12); border-left: 3px solid #6366f1; border-radius: 8px; font-weight: 500;">📌 <strong>Important Note:</strong> Enter details here...</div><div><br></div>';
    document.execCommand('insertHTML', false, calloutHtml);
    if (editorRef.current) {
      setFormData((prev) => ({ ...prev, description: editorRef.current.innerHTML }));
    }
  };

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

    // Clean locations and handle "None" flags cleanly without breaking Vercel backend enums
    const cleanLocations = formData.locations
      ? formData.locations.split(',').map((s) => s.trim()).filter(Boolean).filter((s) => !s.startsWith('__'))
      : [];

    let typePayload = formData.type;
    if (typePayload === 'None') {
      cleanLocations.push('__TYPE_NONE__');
      typePayload = 'Theory'; // Valid enum for backend
    }

    let deliveryMethodPayload = formData.deliveryMethod;
    if (deliveryMethodPayload === 'None') {
      cleanLocations.push('__DELIVERY_NONE__');
      deliveryMethodPayload = 'Physical'; // Valid enum for backend
    } else if (deliveryMethodPayload === 'Physical & Online') {
      deliveryMethodPayload = 'Hybrid'; // Backend representation
    }

    let batchYearPayload;
    if (formData.batchYear === 'None' || !formData.batchYear || formData.batchYear === '0' || formData.batchYear === 0) {
      batchYearPayload = 0; // Stored as 0 to satisfy Number validation
    } else {
      const batchYearRaw = String(formData.batchYear).trim();
      batchYearPayload = /^\d+$/.test(batchYearRaw) ? Number(batchYearRaw) : batchYearRaw;
    }

    const finalLevel =
      formData.academicLevel === 'Other'
        ? (formData.customLevel?.trim() || 'Other')
        : formData.academicLevel;

    const payload = {
      title: formData.title,
      type: typePayload,
      academicLevel: finalLevel,
      batchYear: batchYearPayload,
      deliveryMethod: deliveryMethodPayload,
      image: formData.image,
      locations: cleanLocations,
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
              setIsCustomType(false);
              setIsCustomDelivery(false);
              setIsCustomBatchYear(false);
      setFormData(initialFormState);
      fetchClasses();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving class batch');
    }
  };

  const handleEdit = (cls) => {
    setEditingId(cls._id);
    const isNoneType = cls.type === 'None' || cls.locations?.includes('__TYPE_NONE__');
    const resolvedType = isNoneType ? 'None' : cls.type;
    const isCustomT = !STANDARD_TYPES.includes(resolvedType);
    setIsCustomType(isCustomT);

    const isNoneDelivery = cls.deliveryMethod === 'None' || cls.locations?.includes('__DELIVERY_NONE__');
    const mappedDelivery = isNoneDelivery
      ? 'None'
      : cls.deliveryMethod === 'Hybrid'
      ? 'Physical & Online'
      : cls.deliveryMethod;
    const isCustomD = !STANDARD_DELIVERY_METHODS.includes(mappedDelivery);
    setIsCustomDelivery(isCustomD);

    const isNoneYear = !cls.batchYear || cls.batchYear === 0 || cls.batchYear === '0' || cls.batchYear === 'None';
    const resolvedBatchYear = isNoneYear ? 'None' : cls.batchYear;
    const isCustomB = !isNoneYear && (!STANDARD_BATCH_YEARS.includes(Number(cls.batchYear)) || !/^\d+$/.test(String(cls.batchYear)));
    setIsCustomBatchYear(isCustomB);

    let initialLevel = 'A/L';
    let initialCustomLevel = '';

    if (cls.academicLevel) {
      if (cls.academicLevel === 'A/L' || cls.academicLevel === 'O/L') {
        initialLevel = cls.academicLevel;
      } else {
        initialLevel = 'Other';
        initialCustomLevel = cls.academicLevel;
      }
    } else {
      const text = `${cls.title || ''} ${cls.batchYear || ''}`;
      if (/O\/L|Ordinary|Grade 10|Grade 11/i.test(text)) {
        initialLevel = 'O/L';
      } else if (/IGCSE|GCSE|Edexcel|Cambridge|Astronomy|Other/i.test(text)) {
        initialLevel = 'Other';
        const match = text.match(/(IGCSE|GCSE|Edexcel|Cambridge|Astronomy|Grade\s*\d+)/i);
        initialCustomLevel = match ? match[0] : 'Other';
      } else {
        initialLevel = 'A/L';
      }
    }

    setFormData({
      title: cls.title,
      type: resolvedType,
      academicLevel: initialLevel,
      customLevel: initialCustomLevel,
      batchYear: resolvedBatchYear,
      deliveryMethod: mappedDelivery,
      image: cls.image || '',
      locations: cls.locations ? cls.locations.filter(l => !l.startsWith('__')).join(', ') : '',
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
      cls.academicLevel?.toLowerCase().includes(q) ||
      String(cls.batchYear).includes(q) ||
      cls.type?.toLowerCase().includes(q) ||
      (cls.deliveryMethod === 'Hybrid' ? 'physical & online' : cls.deliveryMethod?.toLowerCase())?.includes(q) ||
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
                          {getBatchLevelBadge(cls)} • {cls.type} Stream
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
                      <span className="font-semibold">{cls.deliveryMethod === 'Hybrid' ? 'Physical & Online' : cls.deliveryMethod}</span>
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
                        {cls.monthlyFee > 0 ? `Rs. ${cls.monthlyFee.toLocaleString()}` : 'Not Specified'}
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
                        <div className="text-[10px] text-slate-400 font-semibold">{getBatchLevelBadge(cls)}</div>
                      </td>
                      <td className="py-4 px-3 font-semibold">{cls.type}</td>
                      <td className="py-4 px-3">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 block">{cls.deliveryMethod === 'Hybrid' ? 'Physical & Online' : cls.deliveryMethod}</span>
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

                {/* Academic Level (A/L, O/L, Other) & Batch Year Selector */}
                <div className="sm:col-span-2 p-3.5 sm:p-4 rounded-2xl bg-slate-100/70 dark:bg-[#202533]/80 border border-slate-200 dark:border-[#2d3446] space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-slate-200/80 dark:border-white/5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <GraduationCap size={16} className="text-[#321fdb] dark:text-[#3399ff]" />
                      <span>Academic Stream & Batch Year (අධ්‍යයන අංශය සහ වසර)</span>
                    </span>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-cyan-400">
                      Target: {formData.academicLevel === 'Other' ? (formData.customLevel || 'Other Stream') : `${formData.academicLevel} Examination`} • {formData.batchYear || 'Year'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* A/L | O/L | Other Segmented Selector */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Examination / Stream (A/L, O/L, Other)
                      </label>
                      <div className="grid grid-cols-3 gap-1.5 p-1 bg-white dark:bg-[#1a1d28] rounded-xl border border-slate-200 dark:border-[#2d3446]">
                        {[
                          { id: 'A/L', label: '🎓 A/L' },
                          { id: 'O/L', label: '📚 O/L' },
                          { id: 'Other', label: '🌐 Other' },
                        ].map((lvl) => (
                          <button
                            key={lvl.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, academicLevel: lvl.id })}
                            className={`py-2 px-1 rounded-lg text-xs font-extrabold transition text-center cursor-pointer ${
                              formData.academicLevel === lvl.id
                                ? 'bg-[#321fdb] text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            {lvl.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Batch Year Dropdown */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Batch Year
                      </label>
                      <select
                        value={
                          isCustomBatchYear
                            ? 'CUSTOM'
                            : formData.batchYear === 'None' || formData.batchYear === 0 || formData.batchYear === '0'
                            ? 'None'
                            : STANDARD_BATCH_YEARS.includes(Number(formData.batchYear))
                            ? Number(formData.batchYear)
                            : 'CUSTOM'
                        }
                        onChange={(e) => {
                          if (e.target.value === 'CUSTOM') {
                            setIsCustomBatchYear(true);
                            setFormData({ ...formData, batchYear: '' });
                          } else if (e.target.value === 'None') {
                            setIsCustomBatchYear(false);
                            setFormData({ ...formData, batchYear: 'None' });
                          } else {
                            setIsCustomBatchYear(false);
                            setFormData({ ...formData, batchYear: Number(e.target.value) });
                          }
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2d3446] bg-white dark:bg-[#1a1d28] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#321fdb]"
                      >
                        <option value="None">None (No specific year)</option>
                        <option value={2025}>2025</option>
                        <option value={2026}>2026</option>
                        <option value={2027}>2027</option>
                        <option value={2028}>2028</option>
                        <option value={2029}>2029</option>
                        <option value={2030}>2030</option>
                        <option value="CUSTOM">Custom Year (Type below)...</option>
                      </select>
                    </div>
                  </div>

                  {/* Custom Level or Custom Year Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {formData.academicLevel === 'Other' && (
                      <div className={isCustomBatchYear ? '' : 'sm:col-span-2'}>
                        <label className="block text-[11px] font-bold text-indigo-600 dark:text-cyan-400 mb-1">
                          Specify Stream / Subject (e.g. EDEXCEL IGCSE, GCSE, Grade 10-11, Cambridge)
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. EDEXCEL IGCSE, Cambridge O/L, GCSE Astronomy, Grade 10"
                          value={formData.customLevel || ''}
                          onChange={(e) => setFormData({ ...formData, customLevel: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-indigo-400 dark:border-cyan-500/50 bg-white dark:bg-[#1a1d28] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    )}

                    {isCustomBatchYear && (
                      <div className={formData.academicLevel === 'Other' ? '' : 'sm:col-span-2'}>
                        <label className="block text-[11px] font-bold text-indigo-600 dark:text-cyan-400 mb-1">
                          Type Custom Year (e.g. 2026/2027, 2031)
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 2026/2027 or 2031"
                          value={formData.batchYear}
                          onChange={(e) => setFormData({ ...formData, batchYear: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-indigo-400 dark:border-cyan-500/50 bg-white dark:bg-[#1a1d28] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Class Type
                  </label>
                  <select
                    value={isCustomType ? 'CUSTOM' : formData.type}
                    onChange={(e) => {
                      if (e.target.value === 'CUSTOM') {
                        setIsCustomType(true);
                        setFormData({ ...formData, type: '' });
                      } else {
                        setIsCustomType(false);
                        setFormData({ ...formData, type: e.target.value });
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2d3446] bg-slate-50 dark:bg-[#282d3c] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#321fdb]"
                  >
                    <option value="None">None (No specific type)</option>
                    <option value="Theory">Theory</option>
                    <option value="Revision">Revision</option>
                    <option value="Theory + Revision">Theory + Revision</option>
                    <option value="Paper">Paper</option>
                    <option value="CUSTOM">Custom (Type below)...</option>
                  </select>
                  {isCustomType && (
                    <input
                      type="text"
                      required
                      placeholder="Type custom class type..."
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="mt-2 w-full px-3 py-2 rounded-xl border border-indigo-400 dark:border-cyan-500 bg-indigo-50/40 dark:bg-cyan-950/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#321fdb]"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Delivery Method
                  </label>
                  <select
                    value={
                      isCustomDelivery
                        ? 'CUSTOM'
                        : formData.deliveryMethod === 'Hybrid'
                        ? 'Physical & Online'
                        : STANDARD_DELIVERY_METHODS.includes(formData.deliveryMethod)
                        ? formData.deliveryMethod
                        : 'CUSTOM'
                    }
                    onChange={(e) => {
                      if (e.target.value === 'CUSTOM') {
                        setIsCustomDelivery(true);
                        setFormData({ ...formData, deliveryMethod: '' });
                      } else {
                        setIsCustomDelivery(false);
                        setFormData({ ...formData, deliveryMethod: e.target.value });
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2d3446] bg-slate-50 dark:bg-[#282d3c] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#321fdb]"
                  >
                    <option value="None">None (No specific method)</option>
                    <option value="Physical">Physical</option>
                    <option value="Online">Online</option>
                    <option value="Physical & Online">Physical & Online</option>
                    <option value="CUSTOM">Custom Method (Type below)...</option>
                  </select>
                  {isCustomDelivery && (
                    <input
                      type="text"
                      required
                      placeholder="Type custom delivery method (e.g. Home Visit, Recording Stream)..."
                      value={formData.deliveryMethod}
                      onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value })}
                      className="mt-2 w-full px-3 py-2 rounded-xl border border-indigo-400 dark:border-cyan-500 bg-indigo-50/40 dark:bg-cyan-950/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#321fdb]"
                    />
                  )}
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

              {/* Syllabus Overview / Notes (Live Visual WYSIWYG Editor) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Syllabus Overview / Notes
                  </label>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Visual Formatting (Bold, Italic, Bullets in-place)
                  </span>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-100 dark:bg-[#202533] border border-b-0 border-slate-200 dark:border-[#2d3446] rounded-t-xl select-none">
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      executeFormat('bold');
                    }}
                    title="Bold (Ctrl+B)"
                    className="px-2.5 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <Bold size={13} />
                    <span className="text-[10px] font-black">Bold</span>
                  </button>

                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      executeFormat('italic');
                    }}
                    title="Italic (Ctrl+I)"
                    className="px-2.5 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs italic transition flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <Italic size={13} />
                    <span className="text-[10px] italic">Italic</span>
                  </button>

                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      executeFormat('underline');
                    }}
                    title="Underline (Ctrl+U)"
                    className="px-2.5 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs underline transition flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <Underline size={13} />
                    <span className="text-[10px]">Underline</span>
                  </button>

                  <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>

                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      executeFormat('insertUnorderedList');
                    }}
                    title="Bullet List"
                    className="px-2.5 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs transition flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <List size={13} />
                    <span className="text-[10px]">Bullets</span>
                  </button>

                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      executeFormat('insertOrderedList');
                    }}
                    title="Numbered List"
                    className="px-2.5 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs transition flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <ListOrdered size={13} />
                    <span className="text-[10px]">Numbers</span>
                  </button>

                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      insertCallout();
                    }}
                    title="Insert Highlight Box"
                    className="px-2.5 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs transition flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <span className="text-xs">📌</span>
                    <span className="text-[10px]">Note Box</span>
                  </button>

                  <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>

                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      executeFormat('removeFormat');
                    }}
                    title="Clear Formatting"
                    className="px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs transition flex items-center gap-1 cursor-pointer active:scale-95"
                  >
                    <RemoveFormatting size={13} />
                    <span className="text-[10px]">Clear</span>
                  </button>
                </div>

                {/* Live WYSIWYG Editable Area */}
                <div className="relative">
                  {(!formData.description ||
                    formData.description.trim() === '' ||
                    formData.description === '<br>' ||
                    formData.description === '<div><br></div>') && (
                    <div
                      onClick={() => editorRef.current?.focus()}
                      className="absolute top-3 left-3.5 text-xs text-slate-400 dark:text-slate-500 pointer-events-none select-none"
                    >
                      Type syllabus notes here... Select text and click Bold, Italic, or Bullets to format live in-place.
                    </div>
                  )}
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => {
                      const html = e.currentTarget.innerHTML;
                      const clean =
                        html === '<br>' || html === '<p><br></p>' || html === '<div><br></div>'
                          ? ''
                          : html;
                      setFormData((prev) => ({ ...prev, description: clean }));
                    }}
                    className="w-full min-h-[140px] max-h-[300px] overflow-y-auto px-3.5 py-3 rounded-b-xl border border-slate-200 dark:border-[#2d3446] bg-slate-50 dark:bg-[#282d3c] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#321fdb] leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1.5 [&_li]:my-0.5 [&_strong]:font-black [&_strong]:text-slate-900 dark:[&_strong]:text-white [&_em]:italic [&_em]:text-slate-800 dark:[&_em]:text-slate-200 [&_u]:underline cursor-text"
                  />
                </div>
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