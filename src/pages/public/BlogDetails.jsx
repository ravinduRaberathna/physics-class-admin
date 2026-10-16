import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import RevealOnScroll from '../../components/RevealOnScroll';
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
  Quote,
  BookOpen,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { getOptimizedBlogBanner, getOptimizedThumbnail } from '../../utils/imageOptimizer';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState(() => {
    try {
      const cached = sessionStorage.getItem('cached_blogs_public');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [teacher, setTeacher] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_teacher_profile');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      const cached = sessionStorage.getItem('cached_blogs_public');
      if (cached) {
        const list = JSON.parse(cached);
        if (Array.isArray(list) && list.some((b) => b._id === id)) {
          return false;
        }
      }
    } catch {}
    return true;
  });
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    // If blog is not in current state, show loading spinner
    setBlogs((prev) => {
      if (!prev.some((b) => b._id === id)) {
        setLoading(true);
      }
      return prev;
    });

    API.get('/blogs/public')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setBlogs(res.data);
          try {
            sessionStorage.setItem('cached_blogs_public', JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    if (!teacher) {
      API.get('/teacher')
        .then((res) => {
          if (res.data) {
            setTeacher(res.data);
            try {
              localStorage.setItem('cached_teacher_profile', JSON.stringify(res.data));
            } catch {}
          }
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const cleanWhatsapp = String(teacher?.contactInfo?.whatsapp || '94771234567').replace(/[^0-9]/g, '');
  const formattedWp = cleanWhatsapp.startsWith('0') ? `94${cleanWhatsapp.slice(1)}` : cleanWhatsapp || '94771234567';
  
  const whatsappEnrollUrl = `https://wa.me/${formattedWp}?text=${encodeURIComponent(
    `Hello Sir, I was reading your article "${currentBlog?.title || 'Physics Article'}" on the website and would like to get more information about your classes.`
  )}`;

  const teacherName = teacher?.name || 'Eng. Chamath Dissanayake';
  const teacherTitle = teacher?.title || 'B.Sc. Engineering (Hons) • A/L Physics Lecturer';

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
        <Navbar teacherName={teacherName} />
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
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070a14] text-slate-900 dark:text-slate-100 font-['Poppins'] selection:bg-indigo-600 selection:text-white transition-colors duration-300 relative overflow-x-clip flex flex-col justify-between">
      
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
      <Navbar teacherName={teacherName} />

      {/* Main Editorial Container */}
      <main className="relative z-10 pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        
        {/* Navigation Breadcrumbs & Back Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 sm:mb-10 max-w-5xl mx-auto">
          <button
            type="button"
            onClick={handleBackToBlogs}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#0d1326] hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-cyan-400 text-xs font-bold transition border border-slate-200/80 dark:border-slate-800 shadow-xs cursor-pointer active:scale-95"
          >
            <ArrowLeft size={14} />
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

        {/* =========================================================================
            1. EDITORIAL ARTICLE HEADER (CENTERED, MATCHING MOCKUP DESIGN)
           ========================================================================= */}
        <RevealOnScroll delay={40}>
          <header className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-5 mb-8 sm:mb-12">
            
            {/* Top Published Date & Read Time Kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <Calendar size={13} className="text-indigo-500" />
              <span>Published {formatDate(currentBlog.createdAt)}</span>
              <span>•</span>
              <Clock size={13} className="text-cyan-500" />
              <span>{currentBlog.readTime || '3 min read'}</span>
            </div>

            {/* Main Article Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.18] sm:leading-tight">
              {currentBlog.title}
            </h1>

            {/* Subtitle / Overview Paragraph (Matching Mockup) */}
            {currentBlog.summary && (
              <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
                {currentBlog.summary}
              </p>
            )}

            {/* Colorful Category & Topic Tag Pills (Matching Mockup Design) */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {/* Pill 1: Main Category */}
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-cyan-300 border border-indigo-200/80 dark:border-indigo-500/30">
                <Tag size={12} />
                {currentBlog.category || 'Physics Theory'}
              </span>

              {/* Pill 2: Advanced Level Focus */}
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-500/30">
                <BookOpen size={12} />
                A/L Science Stream
              </span>

              {/* Pill 3: Masterclass Guidance */}
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-500/30">
                <Sparkles size={12} />
                Island Rank Guide
              </span>
            </div>

            {/* Author Byline */}
            <div className="flex items-center justify-center gap-3 pt-4">
              {teacher?.profileImage ? (
                <img
                  src={getOptimizedThumbnail(teacher.profileImage)}
                  alt={teacherName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500 shadow-xs"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                  CD
                </div>
              )}
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {currentBlog.author || teacherName}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                  {teacherTitle}
                </p>
              </div>
            </div>
          </header>
        </RevealOnScroll>

        {/* =========================================================================
            2. LARGE FEATURED LANDSCAPE IMAGE (MATCHING MOCKUP DESIGN)
           ========================================================================= */}
        {currentBlog.image && (
          <RevealOnScroll delay={80}>
            <div className="max-w-5xl mx-auto my-6 sm:my-10">
              <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-950/10 dark:shadow-black/60 border border-slate-200/80 dark:border-slate-800 bg-slate-900 aspect-[16/9] sm:aspect-[21/9] max-h-[520px] w-full">
                <img
                  src={getOptimizedBlogBanner(currentBlog.image)}
                  alt={currentBlog.title}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </RevealOnScroll>
        )}

        {/* =========================================================================
            3. EDITORIAL ARTICLE READING BODY (CENTERED READABLE COLUMN)
           ========================================================================= */}
        <article className="max-w-3xl mx-auto py-6 sm:py-8 space-y-8">
          
          {/* Introduction Subheading */}
          <RevealOnScroll delay={60}>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-cyan-400" />
                <span>Introduction & Fundamentals</span>
              </h2>
              <div className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal space-y-4">
                {currentBlog.content}
              </div>
            </div>
          </RevealOnScroll>

          {/* =========================================================================
              EDITORIAL QUOTE BLOCK (MATCHING MOCKUP BLOCKQUOTE DESIGN)
             ========================================================================= */}
          <RevealOnScroll delay={70}>
            <div className="my-8 sm:my-10 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0d1326] border-l-4 border-l-indigo-600 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <Quote className="absolute top-4 right-4 w-12 h-12 text-indigo-500/10 dark:text-cyan-400/10 pointer-events-none" />
              <p className="text-base sm:text-lg italic font-medium text-slate-800 dark:text-slate-200 leading-relaxed mb-5">
                &ldquo;භෞතික විද්‍යාව යනු සූත්‍ර කටපාඩම් කිරීමක් නොවේ; විශ්වයේ සියලු සිදුවීම් පිටුපස ඇති තර්කනය නිවැරදිව තේරුම් ගැනීමයි. මූලික සංකල්ප පැහැදිලි වූ විට ඕනෑම සංකීර්ණ විභාග ගැටලුවක් සරලව විසඳිය හැක.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                {teacher?.profileImage ? (
                  <img
                    src={getOptimizedThumbnail(teacher.profileImage)}
                    alt={teacherName}
                    className="w-11 h-11 rounded-full object-cover border-2 border-indigo-500 shadow-xs"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                    CD
                  </div>
                )}
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {teacherName}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {teacherTitle}
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* =========================================================================
              KEY TAKEAWAYS / CONCLUSION CARD (MATCHING MOCKUP CONCLUSION CARD)
             ========================================================================= */}
          <RevealOnScroll delay={70}>
            <div className="my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-cyan-50/70 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-cyan-950/30 border border-indigo-200/80 dark:border-indigo-500/30 shadow-xs">
              <div className="flex items-center gap-2.5 mb-4 text-indigo-700 dark:text-cyan-300 font-extrabold text-sm uppercase tracking-wider">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles size={15} />
                </div>
                <span>Conclusion & Exam Strategy</span>
              </div>
              
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>විෂය නිර්දේශයේ සියලුම ප්‍රායෝගික පරීක්ෂණ සහ ඒවායේ දෝෂ ගණනය කිරීම් නිරන්තරයෙන් පුහුණු වන්න.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>පසුගිය වසර 20 ක A/L විභාග ප්‍රශ්න පත්‍ර සහ Model Papers සඳහා නිවැරදි වේලා කළමනාකරණය ප්‍රගුණ කරන්න.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>සෑම පාඩමක් අවසානයේම තමන් විසින්ම කෙටි සටහන් (Mind Maps / Summary Formula Sheets) පිළියෙල කරන්න.</span>
                </li>
              </ul>
            </div>
          </RevealOnScroll>

          {/* Social Share & Action Bar */}
          <RevealOnScroll delay={60}>
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-2 flex items-center gap-1.5">
                  <Share2 size={14} />
                  <span>Share:</span>
                </span>

                {/* Share to WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Check out this physics article by ${teacherName}: ${currentBlog.title} - ${window.location.href}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>WhatsApp</span>
                </a>

                {/* Share to Telegram */}
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(currentBlog.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>Telegram</span>
                </a>

                {/* Copy Link Button */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>

              {/* Direct Enroll Question CTA */}
              <a
                href={whatsappEnrollUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs tracking-wider uppercase transition shadow-md shadow-indigo-600/25 active:scale-95"
              >
                <span>Ask Sir on WhatsApp</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </RevealOnScroll>

        </article>

        {/* =========================================================================
            4. SUBSCRIBE / WHATSAPP CHANNEL BOX (MATCHING MOCKUP SUBSCRIBE CARD)
           ========================================================================= */}
        <RevealOnScroll delay={80}>
          <section className="max-w-4xl mx-auto my-12 sm:my-16">
            <div className="relative rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white border border-indigo-500/30 shadow-2xl p-8 sm:p-12 text-center overflow-hidden">
              {/* Ambient Glow */}
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-4 max-w-xl mx-auto">
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 text-cyan-300 text-[10px] font-bold uppercase tracking-wider border border-white/15">
                  Stay Updated & Prepared
                </span>

                <h3 className="text-xl sm:text-3xl font-black tracking-tight text-white">
                  Join the Official A/L Physics Channel
                </h3>

                <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed font-normal">
                  නව විෂය නිර්දේශයේ Physics Papers, Model Tests සහ පන්ති කාලසටහන් පිළිබඳ සියලුම තොරතුරු ඔබේ WhatsApp වෙතම ලබාගන්න.
                </p>

                <div className="pt-2">
                  <a
                    href={whatsappEnrollUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs tracking-wider uppercase shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <span>Connect with WhatsApp Community</span>
                    <ArrowUpRight size={15} />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </RevealOnScroll>

        {/* =========================================================================
            5. LATEST ARTICLES GRID (MATCHING MOCKUP'S 3-COLUMN "LATEST ARTICLE")
           ========================================================================= */}
        {otherBlogs.length > 0 && (
          <RevealOnScroll delay={80}>
            <section className="max-w-6xl mx-auto pt-6 sm:pt-10">
              
              {/* Section Header with "View All Posts ->" Button (Matching Mockup) */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400 block mb-1">
                    More Knowledge
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Latest Physics Articles
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleBackToBlogs}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold tracking-wide transition shadow-md shadow-indigo-600/25 cursor-pointer self-start sm:self-auto hover:scale-105 active:scale-95"
                >
                  <span>View All Articles</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>

              {/* 3-Column Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {otherBlogs.slice(0, 3).map((item) => (
                  <Link
                    key={item._id}
                    to={`/blog/${item._id}`}
                    className="group flex flex-col bg-white dark:bg-[#0d1326] rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:shadow-indigo-950/5 dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    {/* Thumbnail Banner */}
                    <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                      {item.image ? (
                        <img
                          src={getOptimizedThumbnail(item.image)}
                          alt={item.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-indigo-700 to-cyan-600 flex items-center justify-center text-white">
                          <FileText size={28} />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="inline-block px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-cyan-300 border border-white/20">
                          {item.category || 'Physics'}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between space-y-3">
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </h4>
                        {item.summary && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                            {item.summary}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 dark:text-slate-500">
                        <div className="flex items-center gap-2">
                          <span>{formatDate(item.createdAt)}</span>
                          <span>•</span>
                          <span>{item.readTime || '3 min'}</span>
                        </div>
                        <span className="text-indigo-600 dark:text-cyan-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                          Read
                          <ChevronRight size={13} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

            </section>
          </RevealOnScroll>
        )}

      </main>

      {/* Footer */}
      <Footer teacher={teacher} />
    </div>
  );
};

export default BlogDetails;
