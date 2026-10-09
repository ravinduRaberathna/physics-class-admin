import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../../api/axiosInstance';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  User,
  FileText,
  Sparkles,
  ArrowUpRight,
  BookOpen,
} from 'lucide-react';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    setLoading(true);
    API.get('/blogs/public')
      .then((res) => {
        setBlogs(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error('Error loading blogs:', err))
      .finally(() => setLoading(false));
  }, []);

  const currentBlog = blogs.find((b) => b._id === id);
  const otherBlogs = blogs.filter((b) => b._id !== id);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-['Poppins']">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto animate-pulse">
            <FileText size={20} />
          </div>
          <p className="text-xs font-semibold text-slate-500">Loading physics article...</p>
        </div>
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 font-['Poppins'] text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
          <FileText size={26} />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">Article Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          මෙම ලිපිය ඉවත් කර ඇත හෝ සොයාගත නොහැක.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition"
        >
          <ArrowLeft size={15} />
          <span>Back to Homepage</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-['Poppins'] selection:bg-indigo-600 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-xs font-bold transition cursor-pointer"
          >
            <ArrowLeft size={15} />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
            <Sparkles size={14} />
            <span className="uppercase tracking-wider hidden sm:inline">
              A/L Physics Knowledge Hub
            </span>
          </div>

          <a
            href="/#register"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-xs font-bold shadow-sm hover:opacity-95 transition"
          >
            <BookOpen size={13} />
            <span>Join Classes</span>
          </a>
        </div>
      </header>

      {/* Main Two-Column Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Main Article Overview (8 Cols) */}
          <article className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_35px_rgb(15,23,42,0.04)] overflow-hidden">
            {/* Cover Image */}
            {currentBlog.image && (
              <div className="relative h-64 sm:h-96 w-full bg-slate-900 overflow-hidden">
                <img
                  src={currentBlog.image}
                  alt={currentBlog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-6">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                    <Tag size={12} />
                    {currentBlog.category || 'Physics Article'}
                  </span>
                </div>
              </div>
            )}

            <div className="p-6 sm:p-10">
              {/* Meta Info Bar */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium pb-5 border-b border-slate-100">
                {!currentBlog.image && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/80">
                    <Tag size={11} />
                    {currentBlog.category || 'Physics Article'}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} className="text-indigo-500" />
                  {formatDate(currentBlog.createdAt)}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} className="text-cyan-600" />
                  {currentBlog.readTime || '3 min read'}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                  <User size={14} className="text-indigo-500" />
                  {currentBlog.author || 'Lecturer'}
                </span>
              </div>

              {/* Article Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mt-6">
                {currentBlog.title}
              </h1>

              {/* Overview / Summary Highlight Box */}
              {currentBlog.summary && (
                <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-indigo-50/80 to-cyan-50/50 border border-indigo-100 text-xs sm:text-sm font-semibold text-indigo-950 leading-relaxed">
                  {currentBlog.summary}
                </div>
              )}

              {/* Full Article Body */}
              <div className="mt-8 text-sm sm:text-[15px] text-slate-700 leading-relaxed whitespace-pre-line space-y-4">
                {currentBlog.content}
              </div>
            </div>
          </article>

          {/* RIGHT SIDEBAR: Other Blog Posts (4 Cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_35px_rgb(15,23,42,0.04)] p-6">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                    <FileText size={15} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      More Physics Articles
                    </h3>
                    <p className="text-[11px] text-slate-400">තවත් විශේෂ ලිපි කියවන්න</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600">
                  {otherBlogs.length}
                </span>
              </div>

              {otherBlogs.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">
                  තවත් ලිපි දැනට ඇතුළත් කර නොමැත.
                </p>
              ) : (
                <div className="space-y-4">
                  {otherBlogs.map((item) => (
                    <Link
                      key={item._id}
                      to={`/blog/${item._id}`}
                      className="group flex items-start gap-3.5 p-2.5 rounded-2xl hover:bg-indigo-50/50 border border-transparent hover:border-indigo-100 transition-all"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                      ) : (
                        <div className="w-20 h-16 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shrink-0">
                          <FileText size={18} />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                          {item.category || 'Physics'}
                        </span>
                        <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug mt-0.5">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                          <span>{formatDate(item.createdAt)}</span>
                          <span>•</span>
                          <span>{item.readTime || '3 min read'}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Enrollment CTA Card */}
            <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-cyan-500 p-6 text-white shadow-lg shadow-indigo-500/20">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-200">
                A/L Physics Masterclass
              </span>
              <h4 className="text-base font-extrabold mt-1">
                Ready to Aim for an Island Rank?
              </h4>
              <p className="text-xs text-indigo-100 mt-1.5 leading-relaxed">
                Theory, Revision සහ Paper Classes සඳහා දැන්ම ලියාපදිංචි වන්න.
              </p>
              <a
                href="/#register"
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <span>Enroll via WhatsApp</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default BlogDetails;

