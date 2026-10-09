import { useState, useEffect } from 'react';
import API from '../../api/axiosInstance';
import {
  Plus,
  Trash2,
  Star,
  MessageSquare,
  Sparkles,
  Award,
  Search,
  CheckCircle2,
  EyeOff,
} from 'lucide-react';
import ImageUploadField from '../../components/ImageUploadField';
import AdminPagination from '../../components/AdminPagination';

const ITEMS_PER_PAGE = 5;

const ManageFeedback = ({ embedded = false }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    studentName: '',
    batch: '2026 A/L',
    school: '',
    resultBadge: 'Physics A',
    rating: 5,
    comment: '',
    avatar: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchFeedbacks = () => {
    API.get('/feedback')
      .then((res) => setFeedbacks(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await API.post('/feedback', formData);
      setFormData({
        studentName: '',
        batch: '2026 A/L',
        school: '',
        resultBadge: 'Physics A',
        rating: 5,
        comment: '',
        avatar: '',
      });
      fetchFeedbacks();
      alert('Feedback එක සාර්ථකව ඇතුළත් කළා!');
    } catch (err) {
      alert('Feedback ඇතුළත් කිරීම අසාර්ථකයි!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('මෙම Feedback එක ඉවත් කිරීමට අවශ්‍යද?')) return;
    try {
      await API.delete(`/feedback/${id}`);
      fetchFeedbacks();
    } catch (err) {
      alert('Delete කිරීම අසාර්ථකයි!');
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await API.put(`/feedback/${id}`, { isActive: !currentStatus });
      fetchFeedbacks();
    } catch (err) {
      alert('Status වෙනස් කිරීම අසාර්ථකයි!');
    }
  };

  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Visible' && fb.isActive) ||
      (statusFilter === 'Hidden' && !fb.isActive);
    const matchesSearch =
      !searchQuery.trim() ||
      fb.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.school?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.resultBadge?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.comment?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredFeedbacks.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedFeedbacks = filteredFeedbacks.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  return (
    <div className={`${embedded ? '' : 'p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto'} space-y-6 font-['Poppins']`}>
      
      {/* Create Feedback Form Card */}
      <div className="bg-white dark:bg-[#0d1326] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 text-slate-800 dark:text-slate-100 shadow-[0_8px_30px_rgb(15,23,42,0.04)]">
        <div className="flex items-center gap-3.5 pb-5 mb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Add Student Feedback / Testimonial
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Publish top student reviews and island rank achievements to the homepage carousel
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-700 dark:text-slate-300 block mb-1.5 font-semibold">
              Student Full Name
            </label>
            <input
              type="text"
              required
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              placeholder="e.g. Nimna Kavishka"
              className="admin-input w-full px-3.5 py-2.5 rounded-xl text-xs border"
            />
          </div>

          <div>
            <label className="text-xs text-slate-700 dark:text-slate-300 block mb-1.5 font-semibold">
              Batch
            </label>
            <input
              type="text"
              required
              value={formData.batch}
              onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
              placeholder="e.g. 2026 A/L"
              className="admin-input w-full px-3.5 py-2.5 rounded-xl text-xs border"
            />
          </div>

          <div>
            <label className="text-xs text-slate-700 dark:text-slate-300 block mb-1.5 font-semibold">
              School (Optional)
            </label>
            <input
              type="text"
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              placeholder="e.g. Royal College, Colombo"
              className="admin-input w-full px-3.5 py-2.5 rounded-xl text-xs border"
            />
          </div>

          <div>
            <label className="text-xs text-slate-700 dark:text-slate-300 block mb-1.5 font-semibold">
              Result Badge
            </label>
            <input
              type="text"
              value={formData.resultBadge}
              onChange={(e) => setFormData({ ...formData, resultBadge: e.target.value })}
              placeholder="e.g. Island 4th / Physics A"
              className="admin-input w-full px-3.5 py-2.5 rounded-xl text-xs border"
            />
          </div>

          <div>
            <ImageUploadField
              label="Avatar Image (Optional - Uploads to Cloudinary)"
              value={formData.avatar}
              onChange={(url) => setFormData({ ...formData, avatar: url })}
              placeholder="Upload photo or paste URL..."
            />
          </div>

          <div>
            <label className="text-xs text-slate-700 dark:text-slate-300 block mb-1.5 font-semibold">
              Rating (Stars)
            </label>
            <select
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              className="admin-input w-full px-3.5 py-2.5 rounded-xl text-xs border"
            >
              <option value={5}>5 Stars (★★★★★)</option>
              <option value={4}>4 Stars (★★★★☆)</option>
              <option value={3}>3 Stars (★★★☆☆)</option>
            </select>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className="text-xs text-slate-700 dark:text-slate-300 block mb-1.5 font-semibold">
              Testimonial Comment
            </label>
            <textarea
              required
              rows={3}
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="පන්තිය, ප්‍රශ්න පත්‍ර සාකච්ඡාව හෝ සිද්ධාන්ත පැහැදිලි කිරීම ගැන ශිෂ්‍යයාගේ අදහස ලියන්න..."
              className="admin-input w-full px-3.5 py-2.5 rounded-xl text-xs border"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-bold text-xs tracking-wide transition shadow-lg shadow-indigo-500/25 cursor-pointer active:scale-95"
            >
              <Plus size={16} />
              <span>{isSubmitting ? 'Saving...' : 'Add Testimonial'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Existing Feedbacks Ultra-Modern Table Card */}
      <div className="bg-white dark:bg-[#0d1326] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl overflow-hidden text-slate-800 dark:text-slate-100 shadow-[0_12px_35px_rgb(15,23,42,0.05)]">
        {/* Card Header + Search & Filter Toolbar */}
        <div className="p-5 sm:px-6 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-100 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0">
              <MessageSquare size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Existing Student Feedbacks
                </h4>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-200/80 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30">
                  {feedbacks.length} Reviews
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Click the visibility badge to show or hide testimonials on the homepage
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student, school or badge..."
                className="admin-input w-full pl-9 pr-3.5 py-2 rounded-xl border text-xs"
              />
            </div>

            {/* Visibility Filter Pills */}
            <div className="flex items-center gap-1.5">
              {['All', 'Visible', 'Hidden'].map((status) => {
                const active = statusFilter === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      active
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50'
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-extrabold tracking-wider">
                <th className="py-4 pl-6 pr-3 w-12">#</th>
                <th className="py-4 px-4">Student Profile</th>
                <th className="py-4 px-4">Achievement Badge</th>
                <th className="py-4 px-4">Star Rating</th>
                <th className="py-4 px-4">Review Excerpt</th>
                <th className="py-4 px-4 text-center">Live Status</th>
                <th className="py-4 pl-4 pr-6 text-right">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {filteredFeedbacks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-14 text-center text-slate-500 dark:text-slate-400">
                    තවමත් feedbacks ඇතුළත් කර නොමැත හෝ සෙවුමට ගැලපෙන ප්‍රතිඵල නැත.
                  </td>
                </tr>
              ) : (
                paginatedFeedbacks.map((fb, index) => (
                  <tr
                    key={fb._id}
                    className="group/row hover:bg-indigo-50/40 dark:hover:bg-indigo-500/[0.06] transition-all duration-200"
                  >
                    <td className="py-4 pl-6 pr-3 font-mono text-[11px] font-bold text-slate-400 dark:text-slate-500">
                      {String((safePage - 1) * ITEMS_PER_PAGE + index + 1).padStart(2, '0')}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3.5">
                        {fb.avatar ? (
                          <img
                            src={fb.avatar}
                            alt={fb.studentName}
                            className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100 dark:border-indigo-500/30 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-extrabold text-xs flex items-center justify-center shadow-xs shrink-0">
                            {fb.studentName ? fb.studentName[0].toUpperCase() : 'S'}
                          </div>
                        )}
                        <div>
                          <div className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                            {fb.studentName}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {fb.batch} • {fb.school || 'Private Candidate'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/80 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30 font-bold text-[11px]">
                        <Award size={13} className="text-indigo-500 dark:text-indigo-400 shrink-0" />
                        <span>{fb.resultBadge}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50/90 dark:bg-amber-500/10 border border-amber-200/70 dark:border-amber-500/25">
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {Array.from({ length: fb.rating || 5 }).map((_, idx) => (
                            <Star key={idx} size={12} className="fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-300 ml-1">
                          {fb.rating || 5}.0
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 max-w-xs">
                      <div
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 italic truncate"
                        title={fb.comment}
                      >
                        "{fb.comment}"
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => toggleActive(fb._id, fb.isActive)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold cursor-pointer transition border ${
                          fb.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                        }`}
                      >
                        {fb.isActive ? (
                          <CheckCircle2 size={12} className="text-emerald-500" />
                        ) : (
                          <EyeOff size={12} className="text-slate-400" />
                        )}
                        {fb.isActive ? 'Visible' : 'Hidden'}
                      </button>
                    </td>

                    <td className="py-4 pl-4 pr-6 text-right">
                      <button
                        onClick={() => handleDelete(fb._id)}
                        className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white border border-rose-200/80 dark:border-rose-500/30 hover:border-rose-600 transition cursor-pointer"
                        title="Delete Review"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination
          currentPage={safePage}
          totalItems={filteredFeedbacks.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          itemLabel="student testimonials"
        />
      </div>

    </div>
  );
};

export default ManageFeedback;