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
} from 'lucide-react';

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/blogs/public')
      .then((res) => setBlogs(res.data))
      .catch((err) => console.log('Blogs load error:', err));
  }, []);

  if (blogs.length === 0) return null;

  const categories = ['All', ...new Set(blogs.map((b) => b.category).filter(Boolean))];

  const filteredBlogs =
    selectedCategory === 'All'
      ? blogs
      : blogs.filter((b) => b.category === selectedCategory);

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
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-200/80 text-indigo-700 text-xs uppercase tracking-widest font-semibold mb-3 shadow-xs">
                <Sparkles size={14} className="text-indigo-600" />
                <span>Physics Knowledge Hub</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Latest Articles & Exam Insights
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2.5 max-w-2xl font-normal leading-relaxed">
                A/L භෞතික විද්‍යා විෂය නිර්දේශය, විභාග රහස්, සහ ඉහළම ප්‍රතිඵලයක් කරා යාමට වැදගත් වන විශේෂ ලිපි පෙළ.
              </p>
            </div>

            {/* Category Filter Pills */}
            {categories.length > 2 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                {categories.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25'
                          : 'bg-white border border-slate-200/90 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </RevealOnScroll>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog, idx) => (
            <RevealOnScroll key={blog._id} delay={idx * 90}>
              <article
                onClick={() => navigate(`/blog/${blog._id}`)}
                className="group rounded-[2rem] bg-white border border-slate-200/90 hover:border-indigo-400/80 overflow-hidden shadow-[0_10px_35px_-10px_rgba(15,23,42,0.06)] hover:shadow-[0_24px_50px_-12px_rgba(99,102,241,0.18)] transition-all duration-500 flex flex-col h-full cursor-pointer"
              >
                {/* Cover Image */}
                <div className="relative h-52 overflow-hidden bg-gradient-to-tr from-indigo-950 via-indigo-900 to-cyan-900">
                  {blog.image ? (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/80 p-6 text-center">
                      <FileText size={36} className="text-cyan-400 mb-2 opacity-80" />
                      <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">
                        A/L Physics Article
                      </span>
                    </div>
                  )}

                  {/* Category Badge Overlay */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
                      <Tag size={10} />
                      {blog.category || 'Physics Article'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium mb-2.5">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-indigo-500" />
                        {formatDate(blog.createdAt)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-cyan-600" />
                        {blog.readTime || '3 min read'}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                      {blog.title}
                    </h4>

                    <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                      {blog.summary || blog.content}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                      <User size={12} className="text-indigo-500" />
                      {blog.author || 'Lecturer'}
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                      <span>Read Article</span>
                      <ArrowUpRight
                        size={14}
                        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                      />
                    </span>
                  </div>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
