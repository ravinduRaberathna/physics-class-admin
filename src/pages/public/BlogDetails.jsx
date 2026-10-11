import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  User,
  FileText,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  Home as HomeIcon,
} from 'lucide-react';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      API.get('/blogs/public'),
      API.get('/teacher')
    ]).then(([blogsRes, teacherRes]) => {
      if (blogsRes.status === 'fulfilled' && Array.isArray(blogsRes.value.data)) {
        setBlogs(blogsRes.value.data);
      }
      if (teacherRes.status === 'fulfilled' && teacherRes.value.data) {
        setTeacher(teacherRes.value.data);
      }
    }).finally(() => setLoading(false));
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

  const handleBackToBlogs = () => {
    sessionStorage.setItem('returnToSection', 'blogs');
    navigate('/#blogs');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070a14] flex items-center justify-center font-['Poppins'] transition-colors">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto animate-pulse shadow-lg shadow-indigo-600/30">
            <FileText size={22} />
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading physics article...</p>
        </div>
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070a14] flex flex-col items-center justify-center p-6 font-['Poppins'] text-center transition-colors">
        <Navbar teacherName={teacher?.name || 'A/L PHYSICS'} />
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-500/30 text-indigo-600 dark:text-cyan-400 flex items-center justify-center mb-4">
          <FileText size={26} />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Article Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
          මෙම ලිපිය ඉවත් කර ඇත හෝ සොයාගත නොහැක.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md shadow-indigo-600/25"
        >
          <ArrowLeft size={15} />
          <span>Back to Homepage</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070a14] text-slate-900 dark:text-slate-100 font-['Poppins'] selection:bg-indigo-600 selection:text-white transition-colors duration-300 relative overflow-x-hidden flex flex-col justify-between">
      {/* Subtle Background Math Formulas */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-28 right-10 font-mono text-[9.5rem] font-black text-indigo-900/[0.03] dark:text-indigo-400/[0.04] select-none leading-none rotate-12">
          Δx·Δp ≥ ℏ/2
        </div>
        <div className="absolute top-[48rem] -left-10 font-mono text-[10.5rem] font-black text-indigo-900/[0.03] dark:text-indigo-400/[0.04] select-none leading-none -rotate-6">
          ∇×B = μ₀J
        </div>
        <div className="absolute bottom-24 right-16 font-mono text-[11rem] font-black text-indigo-900/[0.03] dark:text-indigo-400/[0.04] select-none leading-none rotate-3">
          E = mc²
        </div>
      </div>

      {/* Main Floating Capsule Navbar */}
      <Navbar teacherName={teacher?.name || 'A/L PHYSICS'} />

      {/* Main Content Area */}
      <main className="relative z-10 pt-28 sm:pt-32 pb-14 px-3 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Navigation Breadcrumbs & Back Button Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
          <button
            type="button"
            onClick={handleBackToBlogs}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#0d1326] hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-cyan-400 text-xs font-bold transition border border-slate-200/80 dark:border-slate-800 shadow-xs cursor-pointer active:scale-95"
          >
            <ArrowLeft size={15} />
            <span>Back to All Articles</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-medium">
            <Link to="/" className="hover:text-indigo-600 dark:hover:text-cyan-400 flex items-center gap-1 transition">
              <HomeIcon size={13} />
              <span>Home</span>
            </Link>
            <ChevronRight size={13} />
            <a 
              href="/#blogs" 
              onClick={(e) => { 
                e.preventDefault(); 
                handleBackToBlogs(); 
              }} 
              className="hover:text-indigo-600 dark:hover:text-cyan-400 transition cursor-pointer"
            >
              Articles
            </a>
            <ChevronRight size={13} />
            <span className="text-slate-600 dark:text-slate-300 font-semibold truncate max-w-xs">
              {currentBlog.title}
            </span>
          </div>
        </div>

        {/* Two-Column Grid: Article & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Main Article Overview (8 Cols) */}
          <article className="lg:col-span-8 bg-white dark:bg-[#0d1326] rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-[0_12px_35px_rgb(15,23,42,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-colors">
            {/* Cover Image */}
            {currentBlog.image && (
              <div className="relative h-64 sm:h-96 w-full bg-slate-900 overflow-hidden">
                <img
                  src={currentBlog.image}
                  alt={currentBlog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
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
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium pb-5 border-b border-slate-100 dark:border-slate-800/80">
                {!currentBlog.image && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-cyan-400 font-bold border border-indigo-200/80 dark:border-indigo-500/30">
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
                  <Clock size={14} className="text-cyan-500" />
                  {currentBlog.readTime || '3 min read'}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                  <User size={14} className="text-indigo-500" />
                  {currentBlog.author || 'Lecturer'}
                </span>
              </div>

              {/* Article Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mt-6 tracking-tight">
                {currentBlog.title}
              </h1>

              {/* Overview / Summary Highlight Box */}
              {currentBlog.summary && (
                <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-indigo-50/90 to-cyan-50/60 dark:from-indigo-950/50 dark:to-cyan-950/40 border border-indigo-100 dark:border-indigo-500/30 text-xs sm:text-sm font-semibold text-indigo-950 dark:text-indigo-200 leading-relaxed shadow-xs">
                  <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-cyan-400 font-bold uppercase text-[10px] tracking-wider">
                    <Sparkles size={13} />
                    <span>Article Overview / සාරාංශය</span>
                  </div>
                  {currentBlog.summary}
                </div>
              )}

              {/* Full Article Body */}
              <div className="mt-8 text-sm sm:text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-4">
                {currentBlog.content}
              </div>
            </div>
          </article>

          {/* RIGHT SIDEBAR: Other Blog Posts (4 Cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <div className="bg-white dark:bg-[#0d1326] rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-[0_12px_35px_rgb(15,23,42,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 transition-colors">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-500/30 text-indigo-600 dark:text-cyan-400 flex items-center justify-center">
                    <FileText size={15} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      More Physics Articles
                    </h3>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">තවත් විශේෂ ලිපි කියවන්න</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-500/30">
                  {otherBlogs.length}
                </span>
              </div>

              {otherBlogs.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-8">
                  තවත් ලිපි දැනට ඇතුළත් කර නොමැත.
                </p>
              ) : (
                <div className="space-y-4">
                  {otherBlogs.map((item) => (
                    <Link
                      key={item._id}
                      to={`/blog/${item._id}`}
                      className="group flex items-start gap-3.5 p-2.5 rounded-2xl hover:bg-indigo-50/60 dark:hover:bg-slate-800/60 border border-transparent hover:border-indigo-100 dark:hover:border-slate-700/60 transition-all"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                      ) : (
                        <div className="w-20 h-16 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shrink-0">
                          <FileText size={18} />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400 block">
                          {item.category || 'Physics'}
                        </span>
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug mt-0.5">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 mt-1">
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
                onClick={(e) => {
                  e.preventDefault();
                  sessionStorage.setItem('scrollToHash', 'register');
                  navigate('/#register');
                }}
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-white dark:bg-[#070a14] text-indigo-700 dark:text-cyan-300 hover:bg-indigo-50 dark:hover:bg-slate-900 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <span>Enroll via WhatsApp</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070a14] py-8 px-4 text-center text-xs text-slate-500 dark:text-slate-400 font-['Poppins'] transition-colors relative z-10 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-900 dark:text-white">
              {teacher?.name || 'A/L PHYSICS MASTERCLASS'}
            </span> • Sri Lanka Advanced Level
          </div>
          <div>
            Hotline: {teacher?.contactInfo?.phone || '+94 77 123 4567'} • Rotary • Sakya • Sasip • Syzygy
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogDetails;
