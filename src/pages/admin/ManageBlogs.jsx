import { useState, useEffect } from 'react';
import API from '../../api/axiosInstance';
import ImageUploadField from '../../components/ImageUploadField';
import AdminPagination from '../../components/AdminPagination';
import {
  Plus,
  Edit3,
  Trash2,
  X,
  FileText,
  Sparkles,
  Search,
  Clock,
  CheckCircle2,
  EyeOff,
  Tag,
  Calendar,
} from 'lucide-react';

const ITEMS_PER_PAGE = 5;

const ManageBlogs = ({ embedded = false }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormState = {
    title: '',
    category: 'Physics Theory',
    summary: '',
    content: '',
    image: '',
    author: 'Lecturer',
    readTime: '3 min read',
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await API.get('/blogs');
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        await API.put(`/blogs/${editingId}`, formData);
      } else {
        await API.post('/blogs', formData);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData(initialFormState);
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setFormData({
      title: blog.title || '',
      category: blog.category || 'Physics Theory',
      summary: blog.summary || '',
      content: blog.content || '',
      image: blog.image || '',
      author: blog.author || 'Lecturer',
      readTime: blog.readTime || '3 min read',
      isActive: blog.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('මෙම Blog Post එක ස්ථිරවම ඉවත් කිරීමට අවශ්‍යද?')) return;
    try {
      await API.delete(`/blogs/${id}`);
      setBlogs(blogs.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete blog post');
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await API.put(`/blogs/${id}`, { isActive: !currentStatus });
      fetchBlogs();
    } catch (err) {
      alert('Failed to update visibility status');
    }
  };

  const categories = ['All', 'Physics Theory', 'Exam Tips', 'Past Paper Guide', 'Class News'];

  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory = categoryFilter === 'All' || blog.category === categoryFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedBlogs = filteredBlogs.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  return (
    <div className={`${embedded ? '' : 'p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto'} space-y-6 font-['Poppins']`}>
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0d1326] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(15,23,42,0.04)]">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <FileText size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Physics Blog & Articles
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-200/80 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30">
                {blogs.length} Posts
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Publish physics articles, study guides, and exam tips after the Rankers Speak section
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
          <span>New Blog Post</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="rounded-3xl bg-white dark:bg-[#0d1326] border border-slate-200/80 dark:border-slate-800/80 shadow-[0_12px_35px_rgb(15,23,42,0.05)] overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          <div className="relative w-full md:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search article title or topic..."
              className="admin-input w-full pl-9 pr-4 py-2 rounded-xl border text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => {
              const active = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                      : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:border-indigo-300'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
            Loading blog posts...
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto mb-2">
              <FileText size={22} />
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              No blog posts found
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click "New Blog Post" to publish your first physics article.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/90 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-extrabold">
                  <th className="py-4 pl-6 pr-3 w-12">#</th>
                  <th className="py-4 px-4">Article & Cover</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Read Time & Date</th>
                  <th className="py-4 px-4">Visibility</th>
                  <th className="py-4 pl-4 pr-6 text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {paginatedBlogs.map((blog, index) => (
                  <tr
                    key={blog._id}
                    className="group/row hover:bg-indigo-50/40 dark:hover:bg-indigo-500/[0.06] transition-all duration-200"
                  >
                    <td className="py-4 pl-6 pr-3 font-mono text-[11px] font-bold text-slate-400 dark:text-slate-500">
                      {String((safePage - 1) * ITEMS_PER_PAGE + index + 1).padStart(2, '0')}
                    </td>

                    <td className="py-4 px-4 max-w-md">
                      <div className="flex items-center gap-3.5">
                        {blog.image ? (
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-14 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/15 to-cyan-500/15 border border-indigo-200/80 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0">
                            <FileText size={18} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-extrabold text-slate-900 dark:text-white text-sm truncate">
                            {blog.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {blog.summary || blog.content?.slice(0, 80)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30">
                        <Tag size={11} />
                        {blog.category}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-0.5 text-[11px] text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-1 font-semibold">
                          <Clock size={11} className="text-indigo-500" />
                          {blog.readTime || '3 min read'}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Calendar size={10} />
                          {blog.createdAt
                            ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'Recent'}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleActive(blog._id, blog.isActive)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 w-fit border cursor-pointer transition ${
                          blog.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30'
                            : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30'
                        }`}
                      >
                        {blog.isActive ? (
                          <CheckCircle2 size={12} className="text-emerald-500" />
                        ) : (
                          <EyeOff size={12} className="text-rose-500" />
                        )}
                        {blog.isActive ? 'Published' : 'Hidden'}
                      </button>
                    </td>

                    <td className="py-4 pl-4 pr-6 text-right">
                      <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-white dark:hover:bg-slate-700 rounded-xl font-semibold text-[11px] transition cursor-pointer"
                          title="Edit Post"
                        >
                          <Edit3 size={13} />
                          <span className="hidden xl:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="p-1.5 text-rose-600 dark:text-rose-400 hover:text-white hover:bg-rose-600 rounded-xl transition cursor-pointer"
                          title="Delete Post"
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

        <AdminPagination
          currentPage={safePage}
          totalItems={filteredBlogs.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          itemLabel="blog posts"
        />
      </div>

      {/* Create / Edit Blog Modal */}
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
                    {editingId ? 'Edit Blog Post' : 'Create New Blog Post'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Appears right after the Rankers Speak & Experiences section
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
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Blog Post Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. A/L Physics MCQ ලකුණු 45+ ගන්න රහස් ක්‍රමවේදය"
                  className="admin-input w-full px-3.5 py-2.5 rounded-xl border text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="admin-input w-full px-3.5 py-2.5 rounded-xl border text-xs"
                  >
                    <option value="Physics Theory">Physics Theory</option>
                    <option value="Exam Tips">Exam Tips</option>
                    <option value="Past Paper Guide">Past Paper Guide</option>
                    <option value="Class News">Class News</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Lecturer"
                    className="admin-input w-full px-3.5 py-2.5 rounded-xl border text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="4 min read"
                    className="admin-input w-full px-3.5 py-2.5 rounded-xl border text-xs"
                  />
                </div>
              </div>

              <ImageUploadField
                label="Blog Cover Image (Uploads to Cloudinary)"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                placeholder="Upload cover photo or paste URL..."
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Short Summary / Excerpt (Card Preview)
                </label>
                <input
                  type="text"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="කෙටි හැඳින්වීමක්..."
                  className="admin-input w-full px-3.5 py-2.5 rounded-xl border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Blog Content
                </label>
                <textarea
                  rows="6"
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="ඔබගේ සම්පූර්ණ ලිපිය මෙහි ලියන්න..."
                  className="admin-input w-full px-3.5 py-2.5 rounded-xl border text-xs"
                ></textarea>
              </div>

              <label
                htmlFor="blogActive"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-500/10 border border-indigo-200/70 dark:border-indigo-500/30 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  id="blogActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  Publish Live on Website
                </span>
              </label>

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
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white text-xs font-bold tracking-wide transition shadow-lg shadow-indigo-500/25 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving...' : editingId ? 'Save Updates' : 'Publish Blog Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBlogs;

