import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import RevealOnScroll from './RevealOnScroll';
import {
  FileText,
  Clock,
  Calendar,
  ArrowUpRight,
  Sparkles,
  Tag,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { getOptimizedCardImage } from '../utils/imageOptimizer';

const POSTS_PER_PAGE = 3;

const BlogSection = () => {
  const [blogs, setBlogs] = useState(() => {
    try {
      const cached = sessionStorage.getItem('cached_blogs_public');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = Number(sessionStorage.getItem('blogSectionPage'));
    return saved > 0 ? saved : 1;
  });
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/blogs/public')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setBlogs(res.data);
          try {
            sessionStorage.setItem('cached_blogs_public', JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch((err) => console.log('Blogs load error:', err));
  }, []);

  useEffect(() => {
    if (blogs.length > 0) {
      const shouldScrollToBlogs =
        sessionStorage.getItem('returnToSection') === 'blogs' ||
        window.location.hash === '#blogs';

      if (shouldScrollToBlogs) {
        sessionStorage.removeItem('returnToSection');
        setTimeout(() => {
          const el = document.getElementById('blogs');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  }, [blogs]);

  if (blogs.length === 0) return null;

  const totalPages = Math.max(1, Math.ceil(blogs.length / POSTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedBlogs = blogs.slice(
    (safePage - 1) * POSTS_PER_PAGE,
    safePage * POSTS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    sessionStorage.setItem('blogSectionPage', String(newPage));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <section
      id="blogs"
      className="py-8 sm:py-10 max-w-7xl mx-auto px-3 sm:px-6 relative font-['Poppins'] selection:bg-indigo-600 selection:text-white"
    >
      <div className="relative z-10">
        {/* Section Header */}
        <RevealOnScroll delay={100}>
          <div className="mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-200/80 text-indigo-700 text-xs uppercase tracking-widest font-semibold mb-3 shadow-xs">
              <Sparkles size={14} className="text-indigo-600" />
              <span>Knowledge Hub & Insights</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Latest Articles & Exam Insights
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2.5 max-w-2xl font-normal leading-relaxed">
              විෂය නිර්දේශය, විභාග රහස් සහ ඉහළම ප්‍රතිඵලයක් කරා යාමට උපකාරී වන විශේෂ අධ්‍යයන ලිපි පෙළ.
            </p>
          </div>
        </RevealOnScroll>

        {/* Blog Cards Grid (Modern Inset Image Card Style matching Classes Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
          {paginatedBlogs.map((blog, idx) => (
            <RevealOnScroll key={blog._id} delay={idx * 100}>
              <article
                onClick={() => {
                  sessionStorage.setItem('returnToSection', 'blogs');
                  sessionStorage.setItem('blogSectionPage', String(safePage));
                  navigate(`/blog/${blog._id}`);
                }}
                className="group rounded-[2.2rem] bg-white p-3.5 sm:p-4 border border-slate-200/80 shadow-[0_14px_35px_-12px_rgba(15,23,42,0.08)] hover:shadow-[0_24px_50px_-12px_rgba(15,23,42,0.14)] hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between h-full cursor-pointer"
              >
                <div>
                  {/* INSET ROUNDED IMAGE BOX */}
                  <div className="relative h-56 sm:h-60 w-full rounded-[1.65rem] overflow-hidden bg-gradient-to-b from-[#0b101b] via-[#1e293b] to-[#cbd5e1] shrink-0">
                    {blog.image ? (
                      <img
                        src={getOptimizedCardImage(blog.image)}
                        alt={blog.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#090d16] via-[#1e293b] to-[#cbd5e1] text-white p-6 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center mb-3 shadow-lg">
                          <FileText size={30} className="text-white" />
                        </div>
                        <span className="text-lg font-extrabold tracking-wider uppercase text-white drop-shadow">
                          {blog.category || 'Physics Insights'}
                        </span>
                        <span className="text-[11px] uppercase tracking-widest text-slate-200 mt-0.5 font-medium">
                          Study Article
                        </span>
                      </div>
                    )}

                    {/* Subtle top vignette so top badges always pop */}
                    <div
                      className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/50 to-transparent pointer-events-none"
                      aria-hidden="true"
                    />

                    {/* TOP BADGES & CIRCLE ARROW BUTTON */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
                      <div className="flex items-center gap-1.5">
                        <span className="px-3.5 py-1 rounded-full bg-[#22c55e] text-white text-xs font-semibold tracking-wide shadow-sm flex items-center gap-1">
                          <Tag size={11} />
                          <span>{blog.category || 'Article'}</span>
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md text-white text-[10px] font-semibold border border-white/15 flex items-center gap-1">
                          <Clock size={11} className="text-cyan-300" />
                          <span>{blog.readTime || '3 min read'}</span>
                        </span>
                      </div>

                      <div className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-slate-700 group-hover:text-indigo-600 group-hover:scale-105 transition-transform shrink-0">
                        <ArrowUpRight size={16} />
                      </div>
                    </div>
                  </div>

                  {/* CARD TEXT CONTENT */}
                  <div className="px-2.5 pt-5 pb-2">
                    {/* Bold Title */}
                    <h4 className="text-xl sm:text-[22px] font-extrabold text-[#1e293b] group-hover:text-indigo-600 transition-colors tracking-tight leading-snug line-clamp-2">
                      {blog.title}
                    </h4>

                    {/* Muted Description / Summary */}
                    <p className="text-xs sm:text-[13.5px] text-slate-500 mt-2 leading-relaxed line-clamp-2 font-normal">
                      {blog.summary || blog.content}
                    </p>

                    {/* Compact Date & Topic Pills */}
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 text-slate-700 font-medium">
                        <Calendar size={12} className="text-indigo-600 shrink-0" />
                        <span>{formatDate(blog.createdAt)}</span>
                      </span>

                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 text-slate-700 font-medium">
                        <Clock size={12} className="text-cyan-600 shrink-0" />
                        <span>{blog.readTime || '3 min read'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* BOTTOM ROW: AUTHOR ON LEFT & DARK CHARCOAL PILL BUTTON ON RIGHT */}
                <div className="px-2.5 pt-5 pb-1.5 flex items-center justify-between gap-3 border-t border-slate-100/90 mt-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                      <User size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none">
                        Author
                      </p>
                      <p className="text-xs font-extrabold text-[#1e293b] mt-0.5 truncate max-w-[120px] sm:max-w-[150px]">
                        {blog.author || 'Lecturer'}
                      </p>
                    </div>
                  </div>

                  <span className="px-6 py-2.5 rounded-full bg-[#22252a] group-hover:bg-[#111315] hover:bg-[#111315] text-white text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 shadow-md active:scale-95 inline-flex items-center gap-1.5 shrink-0">
                    <span>Read Article</span>
                    <ArrowUpRight size={15} />
                  </span>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>

        {/* Pagination Bar (Shown when there are more than 3 posts) */}
        {totalPages > 1 && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <span className="text-xs text-slate-500 font-medium">
              Showing{' '}
              <strong className="text-slate-800">
                {(safePage - 1) * POSTS_PER_PAGE + 1}–
                {Math.min(safePage * POSTS_PER_PAGE, blogs.length)}
              </strong>{' '}
              of <strong className="text-slate-800">{blogs.length}</strong> articles
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => handlePageChange(safePage - 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-slate-200/90 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition shadow-2xs cursor-pointer active:scale-95"
              >
                <ChevronLeft size={15} />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const active = page === safePage;
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center justify-center ${
                        active
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25'
                          : 'bg-white border border-slate-200/90 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => handlePageChange(safePage + 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-slate-200/90 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition shadow-2xs cursor-pointer active:scale-95"
              >
                <span>Next</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
