import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import RevealOnScroll from './RevealOnScroll';
import {
  FileText,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Check,
} from 'lucide-react';
import { getOptimizedCardImage } from '../utils/imageOptimizer';

const POSTS_PER_PAGE = 4;

const BlogSection = ({ teacher = null }) => {
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
  const [copiedBlogId, setCopiedBlogId] = useState(null);
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

  const handleShareOrCopy = (blog) => {
    const blogUrl = `${window.location.origin}/blog/${blog._id}`;
    if (navigator.share) {
      navigator
        .share({
          title: blog.title,
          text: blog.summary || blog.title,
          url: blogUrl,
        })
        .catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard
        .writeText(blogUrl)
        .then(() => {
          setCopiedBlogId(blog._id);
          setTimeout(() => setCopiedBlogId(null), 2000);
        })
        .catch(() => {});
    }
  };

  return (
    <section
      id="blogs"
      className="py-8 sm:py-12 max-w-7xl mx-auto px-3 sm:px-6 relative font-['Poppins'] selection:bg-indigo-600 selection:text-white"
    >
      <div className="relative z-10">
        {/* Section Header */}
        <RevealOnScroll delay={100}>
          <div className="mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-indigo-200/80 dark:border-indigo-500/30 text-indigo-700 dark:text-cyan-300 text-xs uppercase tracking-widest font-semibold mb-3 shadow-xs">
              <Sparkles size={14} className="text-indigo-600 dark:text-cyan-400" />
              <span>Knowledge Hub & Insights</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Latest Articles & Exam Insights
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5 max-w-2xl font-normal leading-relaxed">
              විෂය නිර්දේශය, විභාග රහස් සහ ඉහළම ප්‍රතිඵලයක් කරා යාමට උපකාරී වන විශේෂ අධ්‍යයන ලිපි පෙළ.
            </p>
          </div>
        </RevealOnScroll>

        {/* Blog Cards Grid: 2-column horizontal card layout matching reference */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {paginatedBlogs.map((blog, idx) => {
            const authorName = blog.author || teacher?.name || 'Chamath Piyumal';
            const authorAvatar = teacher?.profileImage || null;
            const categoryTag = blog.category
              ? (blog.category.startsWith('#')
                  ? blog.category.toLowerCase()
                  : `#${blog.category.toLowerCase().replace(/[^a-z0-9]/g, '')}`)
              : '#physics';

            return (
              <RevealOnScroll key={blog._id} delay={idx * 80}>
                <article
                  onClick={() => {
                    sessionStorage.setItem('returnToSection', 'blogs');
                    sessionStorage.setItem('blogSectionPage', String(safePage));
                    navigate(`/blog/${blog._id}`);
                  }}
                  className="group rounded-[28px] sm:rounded-[32px] bg-white dark:bg-[#181a20] p-3.5 sm:p-4.5 border border-slate-200/80 dark:border-white/10 shadow-[0_10px_30px_rgba(15,23,42,0.05)] hover:shadow-[0_20px_45px_rgba(15,23,42,0.11)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row gap-4 sm:gap-5 items-stretch cursor-pointer h-full"
                >
                  {/* LEFT: ROUNDED SQUARE THUMBNAIL WITH #TAG */}
                  <div className="relative w-full sm:w-44 md:w-48 lg:w-52 h-48 sm:h-auto sm:aspect-square rounded-[22px] overflow-hidden shrink-0 bg-[#0d111c]">
                    {/* Top-left category tag like #science or #art */}
                    <span className="absolute top-3.5 left-4 z-10 text-[12px] sm:text-[13px] font-semibold text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wide select-none">
                      {categoryTag}
                    </span>

                    {/* Gradient overlay for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/25 z-[1] pointer-events-none" />

                    {blog.image ? (
                      <img
                        src={getOptimizedCardImage(blog.image)}
                        alt={blog.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0b0f19] via-[#1a2333] to-[#0f172a] text-white p-4 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center mb-2 shadow-lg">
                          <FileText size={24} className="text-white" />
                        </div>
                        <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                          Study Article
                        </span>
                      </div>
                    )}
                  </div>

                  {/* RIGHT: TEXT CONTENT, AUTHOR & ACTION BUTTONS */}
                  <div className="flex-1 flex flex-col justify-between py-1 px-1 sm:px-1.5 min-w-0">
                    <div>
                      {/* Blog Title */}
                      <h4 className="text-base sm:text-lg lg:text-[19px] font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug line-clamp-2">
                        {blog.title}
                      </h4>

                      {/* Blog Summary / Excerpt */}
                      <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 sm:line-clamp-3 leading-relaxed font-normal">
                        {blog.summary || blog.content}
                      </p>
                    </div>

                    {/* BOTTOM ROW: AUTHOR ON LEFT + 2 CIRCLE BUTTONS ON RIGHT */}
                    <div className="flex items-center justify-between gap-3 mt-4 pt-2 border-t border-slate-100 dark:border-white/5 sm:border-0">
                      {/* Author Info */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        {authorAvatar ? (
                          <img
                            src={authorAvatar}
                            alt={authorName}
                            className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200/80 dark:border-white/15 shadow-2xs"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {authorName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[130px] sm:max-w-[160px]">
                            By {authorName}
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium leading-tight">
                            {formatDate(blog.createdAt)}
                          </div>
                        </div>
                      </div>

                      {/* Circular Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Purple Circular CTA Button with curved arrow */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            sessionStorage.setItem('returnToSection', 'blogs');
                            sessionStorage.setItem('blogSectionPage', String(safePage));
                            navigate(`/blog/${blog._id}`);
                          }}
                          aria-label="Read full article"
                          title="Read full article"
                          className="w-9 h-9 rounded-full bg-[#5b3af6] hover:bg-[#4d2ee6] text-white flex items-center justify-center shadow-md shadow-indigo-600/30 transition-all duration-200 active:scale-90 hover:scale-105 cursor-pointer"
                        >
                          <svg
                            className="w-4 h-4 fill-current transform rotate-[-6deg]"
                            viewBox="0 0 24 24"
                          >
                            <path d="M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z" />
                          </svg>
                        </button>

                        {/* Neutral Circular Options Button (3 dots) with tooltip/copy */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShareOrCopy(blog);
                          }}
                          aria-label="Share article"
                          title={
                            copiedBlogId === blog._id
                              ? 'Copied link!'
                              : `Share or details (${blog.readTime || '3 min read'})`
                          }
                          className="w-9 h-9 rounded-full bg-slate-100 dark:bg-[#22252e] hover:bg-slate-200 dark:hover:bg-[#2b2f3a] text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-white/10 flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer relative"
                        >
                          {copiedBlogId === blog._id ? (
                            <Check size={15} className="text-emerald-500" />
                          ) : (
                            <MoreHorizontal size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              </RevealOnScroll>
            );
          })}
        </div>

        {/* Pagination Bar (Shown when there are more than 4 posts) */}
        {totalPages > 1 && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Showing{' '}
              <strong className="text-slate-800 dark:text-white">
                {(safePage - 1) * POSTS_PER_PAGE + 1}–
                {Math.min(safePage * POSTS_PER_PAGE, blogs.length)}
              </strong>{' '}
              of <strong className="text-slate-800 dark:text-white">{blogs.length}</strong> articles
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => handlePageChange(safePage - 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-cyan-300 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition shadow-2xs cursor-pointer active:scale-95"
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
                          : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-cyan-300'
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
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-cyan-300 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition shadow-2xs cursor-pointer active:scale-95"
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
