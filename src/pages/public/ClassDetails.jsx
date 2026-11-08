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
  MapPin,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  Home as HomeIcon,
  BookOpen,
  Share2,
  Radio,
  FileText,
  Video,
  Award,
  Layers,
  Phone,
  MessageSquare,
  Check,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { getOptimizedBlogBanner, getOptimizedProfileImage } from '../../utils/imageOptimizer';

// Helper for inline bold (**text**) and italic (*text*)
const parseInlineStyles = (str) => {
  if (!str) return '';
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(str.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-bold text-slate-900 dark:text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="italic text-slate-800 dark:text-slate-200">
          {token.slice(1, -1)}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < str.length) {
    parts.push(str.substring(lastIndex));
  }

  return parts.length > 0 ? parts : str;
};

// Formatted Notes Renderer with lists, bullets, callouts
const renderFormattedNotes = (rawText) => {
  if (!rawText) return null;

  // If rawText already contains HTML elements (from WYSIWYG editor), render styled HTML directly
  if (/<[a-z][\s\S]*>/i.test(rawText)) {
    return (
      <div
        className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2.5 [&_li]:my-1 [&_strong]:font-black [&_strong]:text-slate-900 dark:[&_strong]:text-white [&_em]:italic [&_em]:text-slate-800 dark:[&_em]:text-slate-200 [&_u]:underline [&_.note-box]:my-3.5 [&_.note-box]:p-3.5 [&_.note-box]:rounded-2xl [&_.note-box]:bg-indigo-50/70 dark:[&_.note-box]:bg-cyan-950/20 [&_.note-box]:border-l-4 [&_.note-box]:border-indigo-500 dark:[&_.note-box]:border-cyan-400 [&_.note-box]:text-indigo-950 dark:[&_.note-box]:text-cyan-100 [&_.note-box]:font-medium"
        dangerouslySetInnerHTML={{ __html: rawText }}
      />
    );
  }

  const lines = rawText.split('\n');
  const elements = [];
  let currentList = [];
  let listType = null;

  const flushList = () => {
    if (currentList.length > 0) {
      if (listType === 'bullet') {
        elements.push(
          <ul key={`ul-${elements.length}`} className="my-2 space-y-1.5 pl-1 sm:pl-2">
            {currentList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0"></span>
                <span className="flex-1 leading-relaxed">{parseInlineStyles(item)}</span>
              </li>
            ))}
          </ul>
        );
      } else if (listType === 'number') {
        elements.push(
          <ol key={`ol-${elements.length}`} className="my-2 space-y-1.5 pl-1 sm:pl-2 list-decimal list-inside text-slate-700 dark:text-slate-300">
            {currentList.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                <span>{parseInlineStyles(item)}</span>
              </li>
            ))}
          </ol>
        );
      }
      currentList = [];
      listType = null;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (listType !== 'bullet') {
        flushList();
        listType = 'bullet';
      }
      currentList.push(trimmed.replace(/^[•\-\*]\s*/, ''));
      return;
    }

    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      if (listType !== 'number') {
        flushList();
        listType = 'number';
      }
      currentList.push(numMatch[2]);
      return;
    }

    flushList();

    if (!trimmed) {
      elements.push(<div key={`sp-${index}`} className="h-1.5" />);
      return;
    }

    if (trimmed.startsWith('📌') || trimmed.startsWith('>')) {
      const calloutText = trimmed.replace(/^[📌>]\s*/, '');
      elements.push(
        <div
          key={`callout-${index}`}
          className="my-3 p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-cyan-950/20 border-l-4 border-indigo-500 dark:border-cyan-400 text-indigo-950 dark:text-cyan-100 text-xs sm:text-sm font-medium flex items-start gap-2 shadow-2xs"
        >
          <span className="shrink-0 text-base">📌</span>
          <div className="leading-relaxed">{parseInlineStyles(calloutText)}</div>
        </div>
      );
      return;
    }

    elements.push(
      <p key={`p-${index}`} className="leading-relaxed text-slate-700 dark:text-slate-300">
        {parseInlineStyles(line)}
      </p>
    );
  });

  flushList();
  return elements;
};

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

const formatBatchYearLabel = (clsOrYear) => {
  if (!clsOrYear) return '';
  if (typeof clsOrYear === 'object') return getBatchLevelBadge(clsOrYear);
  return getBatchLevelBadge({ batchYear: clsOrYear });
};


const ClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [classes, setClasses] = useState(() => {
    try {
      const cached = sessionStorage.getItem('cached_classes_public');
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
      const cached = sessionStorage.getItem('cached_classes_public');
      if (cached) {
        const list = JSON.parse(cached);
        if (Array.isArray(list) && list.some((c) => c._id === id)) {
          return false;
        }
      }
    } catch {}
    return true;
  });

  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState('timetable'); // 'timetable' | 'curriculum' | 'privileges'

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    setClasses((prev) => {
      if (!prev.some((c) => c._id === id)) {
        setLoading(true);
      }
      return prev;
    });

    API.get('/classes')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setClasses(res.data);
          try {
            sessionStorage.setItem('cached_classes_public', JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch((err) => console.error('Error fetching classes:', err))
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

  const currentClass = classes.find((c) => c._id === id);

  const handleBackToClasses = () => {
    sessionStorage.setItem('returnToSection', 'classes');
    navigate('/#classes');
  };

  const navigateToSection = (sectionId) => {
    sessionStorage.setItem('returnToSection', sectionId);
    navigate(`/#${sectionId}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const cleanWhatsapp = String(teacher?.contactInfo?.whatsapp || '94771234567').replace(/[^0-9]/g, '');
  const formattedWp = cleanWhatsapp.startsWith('0') ? `94${cleanWhatsapp.slice(1)}` : cleanWhatsapp || '94771234567';

  const scheduleStr = currentClass?.schedule?.[0]
    ? `${currentClass.schedule[0].day} (${currentClass.schedule[0].startTime} - ${currentClass.schedule[0].endTime})`
    : 'Weekly Regular Session';

  const whatsappEnrollUrl = `https://wa.me/${formattedWp}?text=${encodeURIComponent(
    `Hello Sir, I was reviewing the Class Details for "${currentClass?.title || 'Physics Class'}" on the website and would like to join/enroll.`
  )}`;

  const teacherName = teacher?.name || 'Chamath Piyumal';
  const teacherTitle = teacher?.title || 'B.Sc. (Hons) University of Sri Jayewardenepura';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070a14] flex items-center justify-center font-['Poppins'] transition-colors">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto animate-pulse shadow-lg shadow-indigo-600/30">
            <BookOpen size={22} />
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Loading class overview & details...
          </p>
        </div>
      </div>
    );
  }

  if (!currentClass) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070a14] flex flex-col items-center justify-center p-6 font-['Poppins'] text-center transition-colors">
        <Navbar teacherName={teacherName} />
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-500/30 text-indigo-600 dark:text-cyan-400 flex items-center justify-center mb-4">
          <BookOpen size={26} />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Batch Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
          මෙම පන්තියේ තොරතුරු ඉවත් කර ඇත හෝ සොයාගත නොහැක.
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

  // Core curriculum modules for Sri Lanka A/L Physics
  const physicsModules = [
    {
      unit: 'Unit 01',
      title: 'Measurement & Units (මාන සහ ඒකක)',
      desc: 'භෞතික රාශි, මාන විශ්ලේෂණය, මිනුම් උපකරණ (වර්නියර්, මයික්‍රෝමීටර්) සහ දෝෂ ගණනය කිරීම්.',
      icon: Layers,
    },
    {
      unit: 'Unit 02',
      title: 'Mechanics (යාන්ත්‍ර විද්‍යාව)',
      desc: 'චලිත සමීකරණ, නිව්ටන් නියම, ගම්‍යතාව, කාර්යය, ශක්තිය, ක්ෂමතාව, භ්‍රමණ චලිතය සහ ජලස්ථිතිය.',
      icon: Zap,
    },
    {
      unit: 'Unit 03',
      title: 'Oscillations & Waves (දෝලන සහ තරංග)',
      desc: 'සරල අනුවර්තී චලිතය, තරංග ප්‍රචාරණය, ධ්වනි තරංග, ඩොප්ලර් ආචරණය සහ අනුනාදය.',
      icon: Radio,
    },
    {
      unit: 'Unit 04',
      title: 'Geometrical & Physical Optics (ආලෝකය)',
      desc: 'ආලෝක පරාවර්තනය, වර්තනය, ප්‍රිස්ම, කාච, අන්වීක්ෂ, දුරේක්ෂ සහ ආලෝකයේ තරංගමය හැසිරීම.',
      icon: Sparkles,
    },
    {
      unit: 'Unit 05',
      title: 'Thermal Physics (තාප භෞතික විද්‍යාව)',
      desc: 'උෂ්ණත්වමානය, තාප ප්‍රසාරණය, කැලරිමිතිය, තාප සන්නයනය, වායු නියම සහ තාප ගති විද්‍යාව.',
      icon: Clock,
    },
    {
      unit: 'Unit 06',
      title: 'Gravitational & Electrostatic Fields (ක්ෂේත්‍ර)',
      desc: 'ගුරුත්වාකර්ෂණ ක්ෂේත්‍ර, කූලෝම් නියමය, විද්‍යුත් විභවය, ගවුස් ප්‍රමේයය සහ ධාරිත්‍රක.',
      icon: Award,
    },
    {
      unit: 'Unit 07',
      title: 'Current Electricity (ධාරා විද්‍යුතය)',
      desc: 'ඕම් නියමය, කර්චොෆ් නියම, විද්‍යුත් පරිපථ විශ්ලේෂණය, පොටෙන්ෂියෝමීටරය සහ මීටර් පාලම.',
      icon: Zap,
    },
    {
      unit: 'Unit 08',
      title: 'Magnetism & EM Induction (චුම්භක ක්ෂේත්‍ර)',
      desc: 'චුම්භක බල, බයෝ-සවාර් නියමය, ෆැරඩේ නියමය, ලෙන්ස් නියමය සහ ප්‍රත්‍යාවර්ත ධාරා පරිපථ.',
      icon: Radio,
    },
    {
      unit: 'Unit 09',
      title: 'Electronics & Modern Physics (නවීන භෞතික විද්‍යාව)',
      desc: 'අර්ධ සන්නායක, ඩයෝඩ, ට්‍රාන්සිස්ටර්, තාර්කික ද්වාර, ෆෝටෝන, එක්ස් කිරණ සහ විකිරණශීලීතාව.',
      icon: ShieldCheck,
    },
    {
      unit: 'Unit 10',
      title: '42 School Lab Practicals (පාසල් ප්‍රායෝගික පරීක්ෂණ)',
      desc: 'විභාග දෙපාර්තමේන්තුව නිර්දේශිත ප්‍රායෝගික පරීක්ෂණ 42ම සජීවී ආදර්ශන සහ ආකෘති ප්‍රශ්න සාකච්ඡාව.',
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070a14] text-slate-900 dark:text-slate-100 font-['Poppins'] selection:bg-indigo-600 selection:text-white transition-colors duration-300 relative overflow-x-clip flex flex-col justify-between">
      {/* Background Math Formulas */}
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

      {/* Floating Capsule Navbar */}
      <Navbar teacherName={teacherName} />

      {/* Main Container */}
      <main className="relative z-10 pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Navigation Breadcrumbs & Back Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 sm:mb-10 max-w-5xl mx-auto">
          <button
            type="button"
            onClick={handleBackToClasses}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#0d1326] hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-cyan-400 text-xs font-bold transition border border-slate-200/80 dark:border-slate-800 shadow-xs cursor-pointer active:scale-95"
          >
            <ArrowLeft size={14} />
            <span>Back to All Batches</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-medium">
              <Link to="/" className="hover:text-indigo-600 dark:hover:text-cyan-400 flex items-center gap-1 transition">
                <HomeIcon size={13} />
                <span>Home</span>
              </Link>
              <ChevronRight size={13} />
              <button
                type="button"
                onClick={handleBackToClasses}
                className="hover:text-indigo-600 dark:hover:text-cyan-400 transition cursor-pointer"
              >
                Batches
              </button>
              <ChevronRight size={13} />
              <span className="text-slate-600 dark:text-slate-300 font-semibold truncate max-w-xs">
                {currentClass.title}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy page link"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#0d1326] border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium hover:text-indigo-600 dark:hover:text-cyan-300 transition shadow-2xs active:scale-95 cursor-pointer ml-2"
            >
              {copiedLink ? <Check size={13} className="text-emerald-500" /> : <Share2 size={13} />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            1. EDITORIAL CLASS OVERVIEW HEADER (CLEANED PER USER REQUEST)
           ========================================================================= */}
        <RevealOnScroll delay={40}>
          <header className="max-w-4xl mx-auto text-center mb-8 sm:mb-10">
            {/* Main Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.18] sm:leading-tight">
              {currentClass.title}
            </h1>
          </header>
        </RevealOnScroll>

        {/* =========================================================================
            2. FEATURED CLASS POSTER / HERO IMAGE BANNER
           ========================================================================= */}
        <RevealOnScroll delay={80}>
          <div className="max-w-4xl mx-auto mb-10 sm:mb-12">
            <div className="relative rounded-3xl sm:rounded-[2.2rem] overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xl bg-gradient-to-br from-[#070b14] via-[#0f172a] to-[#1e293b]">
              {currentClass.image ? (
                <img
                  src={getOptimizedBlogBanner(currentClass.image)}
                  alt={currentClass.title}
                  className="w-full h-[280px] sm:h-[400px] md:h-[460px] object-cover"
                />
              ) : (
                <div className="w-full h-[280px] sm:h-[380px] flex flex-col items-center justify-center p-8 text-center text-white relative">
                  <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 shadow-xl">
                    <BookOpen size={40} className="text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
                    {getBatchLevelBadge(currentClass)}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 uppercase tracking-widest font-semibold">
                    {[currentClass.type && currentClass.type !== 'None' ? `${currentClass.type} Masterclass` : null, currentClass.deliveryMethod && currentClass.deliveryMethod !== 'None' ? (currentClass.deliveryMethod === 'Hybrid' ? 'Physical & Online' : currentClass.deliveryMethod) : null].filter(Boolean).join(' • ') || 'Comprehensive Masterclass'}
                  </p>
                </div>
              )}

              {/* Floating Bottom Quick Action Overlay inside poster */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-5 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-white">
                  <div className="text-xs uppercase tracking-wider text-cyan-300 font-bold">
                    Official Academic Stream
                  </div>
                  <div className="text-lg sm:text-xl font-black">{currentClass.title}</div>
                </div>

                <div className="flex items-center gap-3">
                  {currentClass.monthlyFee > 0 && (
                    <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-extrabold text-sm sm:text-base">
                      Rs. {currentClass.monthlyFee.toLocaleString()}{' '}
                      <span className="text-[10px] font-normal text-slate-300">/mo</span>
                    </div>
                  )}

                  <a
                    href={whatsappEnrollUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold tracking-wide shadow-lg shadow-emerald-600/30 transition active:scale-95 inline-flex items-center gap-1.5"
                  >
                    <MessageSquare size={14} />
                    <span>Join Class</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            SYLLABUS OVERVIEW / SPECIAL NOTES (DISPLAYED DIRECTLY UNDER POSTER IMAGE)
           ========================================================================= */}
        {currentClass.description && (
          <RevealOnScroll delay={100}>
            <div className="max-w-4xl mx-auto mb-10 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c101d] border border-slate-200/80 dark:border-white/10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-white/5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-cyan-950/40 text-indigo-600 dark:text-cyan-400 flex items-center justify-center font-bold shadow-xs shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {currentClass.title}
                  </h3>
                </div>
              </div>

              {/* Formatted Notes Body */}
              <div className="text-sm leading-relaxed space-y-2">
                {renderFormattedNotes(currentClass.description)}
              </div>
            </div>
          </RevealOnScroll>
        )}

        {/* =========================================================================
            3. KEY SNAPSHOT STATS (DYNAMIC 3 OR 4 METRIC CARDS)
           ========================================================================= */}
        <div
          className={`max-w-4xl mx-auto grid ${
            currentClass.monthlyFee > 0 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'
          } gap-3.5 sm:gap-4 mb-10 sm:mb-12`}
        >
          {/* Card 1: Batch */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101d] border border-slate-200/80 dark:border-white/10 shadow-xs">
            <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
              Target Batch
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
              {getBatchLevelBadge(currentClass)}
            </div>
            <div className="text-[11px] text-indigo-600 dark:text-cyan-400 font-medium mt-0.5">
              Science Stream
            </div>
          </div>

          {/* Card 2: Stream */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101d] border border-slate-200/80 dark:border-white/10 shadow-xs">
            <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
              Program Type
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
              {currentClass.type}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
              Full Masterclass
            </div>
          </div>

          {/* Card 3: Delivery */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101d] border border-slate-200/80 dark:border-white/10 shadow-xs">
            <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
              Delivery Method
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
              {currentClass.deliveryMethod === 'Hybrid' ? 'Physical & Online' : currentClass.deliveryMethod}
            </div>
            <div className="text-[11px] text-violet-600 dark:text-violet-400 font-medium mt-0.5">
              Centers & LMS
            </div>
          </div>

          {/* Card 4: Fee (Hidden if no monthly fee is added) */}
          {currentClass.monthlyFee > 0 && (
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101d] border border-slate-200/80 dark:border-white/10 shadow-xs">
              <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                Monthly Fee
              </div>
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                Rs. {currentClass.monthlyFee.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                Per 4 Weeks
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            4. INTERACTIVE TABS (TIMETABLE / CURRICULUM / PRIVILEGES)
           ========================================================================= */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-[#0d1222] border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('timetable')}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'timetable'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Schedule & Venues
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('curriculum')}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'curriculum'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Syllabus & Modules
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('privileges')}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'privileges'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Study Materials & LMS
            </button>
          </div>
        </div>

        {/* =========================================================================
            5. TAB CONTENT PANELS
           ========================================================================= */}
        <div className="max-w-4xl mx-auto space-y-10">
          {/* TAB 1: SCHEDULE & VENUES MATRIX */}
          {activeTab === 'timetable' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c101d] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Calendar size={13} />
                    <span>Class Timetable & Centers</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    පන්ති පැවැත්වෙන ස්ථාන සහ වේලාවන්
                  </h3>
                </div>

                {/* Primary Schedule Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-cyan-400">
                      Regular Weekly Schedule
                    </div>
                    <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                      {scheduleStr}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      සෑම සතියකම අදාළ දිනයන්හිදී සම්පූර්ණ සිද්ධාන්ත හා ප්‍රශ්න පත්‍ර සාකච්ඡාව.
                    </div>
                  </div>

                  <a
                    href={whatsappEnrollUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md shadow-indigo-600/25 inline-flex items-center gap-2 self-start sm:self-auto shrink-0"
                  >
                    <Calendar size={14} />
                    <span>Confirm Slot</span>
                  </a>
                </div>

                {/* Dynamic Locations from Database */}
                {currentClass.locations && currentClass.locations.length > 0 && (
                  <div className="p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5 space-y-2.5">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                      <MapPin size={15} className="text-emerald-500" />
                      <span>Class Locations & Venues (පන්ති පැවැත්වෙන ස්ථාන)</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {currentClass.locations.map((loc, idx) => (
                        <div
                          key={idx}
                          className="px-4 py-2 rounded-xl bg-white dark:bg-[#131724] border border-slate-200/90 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs inline-flex items-center gap-2"
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>{loc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SYLLABUS & MODULES */}
          {activeTab === 'curriculum' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c101d] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Layers size={13} />
                    <span>Complete Curriculum</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    විෂය නිර්දේශ ඒකක සහ ප්‍රධාන සංකල්ප සැලැස්ම
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    ශ්‍රී ලංකා විභාග දෙපාර්තමේන්තුවේ උසස් පෙළ භෞතික විද්‍යාව විෂය නිර්දේශයේ සම්පූර්ණ ඒකක පෙළගැස්ම.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {physicsModules.map((mod, i) => {
                    const IconComponent = mod.icon;
                    return (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5 hover:border-indigo-400 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-cyan-400">
                            {mod.unit}
                          </span>
                          <IconComponent size={15} className="text-slate-400" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{mod.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                          {mod.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRIVILEGES & STUDY MATERIALS */}
          {activeTab === 'privileges' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c101d] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Award size={13} />
                    <span>Student Privileges</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    මෙම පන්තියට ලියාපදිංචි වන සිසුවෙකුට ලැබෙන සම්පූර්ණ පැකේජය
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400 font-bold text-sm">
                      <BookOpen size={16} />
                      <span>Printed Monthly Tutes</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      සෑම මසකටම අදාළ උසස් තත්ත්වයේ සිද්ධාන්ත හා ප්‍රශ්න පත්‍ර නිබන්ධන කට්ටලය ශාලාවෙන් හෝ කුරියර් මඟින් නිවසටම.
                    </p>
                  </div>

                  <div className="p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400 font-bold text-sm">
                      <Video size={16} />
                      <span>Full HD LMS Recording Access</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      පන්තියක් මඟහැරුණද හෝ නැවත නැවත බලා අධ්‍යයනය කිරීමට කැමති අයට 24/7 ආරක්ෂිත වීඩියෝ නැරඹුම් පහසුකම.
                    </p>
                  </div>

                  <div className="p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400 font-bold text-sm">
                      <Award size={16} />
                      <span>Paper Marking & Rank Cards</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      පුහුණු ගුරු මණ්ඩලයක් මඟින් ප්‍රශ්න පත්‍ර පරීක්ෂා කර ලකුණු ලබාදීම සහ දිවයිනේ ශ්‍රේණිගත කිරීම් වාර්තා.
                    </p>
                  </div>

                  <div className="p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400 font-bold text-sm">
                      <MessageSquare size={16} />
                      <span>24/7 Doubt Resolution Hub</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      ගැටළු සහ නොතේරෙන තැන් සර් සහ සහායක කණ්ඩායම සමඟ සාකච්ඡා කර විසඳා ගැනීමට වෙන්වූ Telegram & WhatsApp groups.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              6. LECTURER / TEACHER PROFILE SNAPSHOT CARD
             ========================================================================= */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c101d] border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-indigo-50 border border-indigo-200/80 dark:border-white/10 shadow-md">
              {teacher?.profileImage ? (
                <img
                  src={getOptimizedProfileImage(teacher.profileImage)}
                  alt={teacherName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-black text-2xl text-indigo-600">
                  {teacherName.charAt(0)}
                </div>
              )}
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-cyan-300 text-[11px] font-bold uppercase tracking-wider">
                Teacher Profile
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{teacherName}</h4>
              <p className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-cyan-400">{teacherTitle}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {teacher?.bio ||
                  'කටපාඩමෙන් එහා ගිය තාර්කික අවබෝධය — උසස් පෙළ භෞතික විද්‍යාව විෂයය හරියටම ග්‍රහණය කරගන්න නව පරපුරේ මඟපෙන්වීම.'}
              </p>
            </div>

            <a
              href={`https://wa.me/${formattedWp}?text=${encodeURIComponent(
                `Hello ${teacherName}, I would like to get more information regarding the ${currentClass.title}.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-md shadow-emerald-600/25 inline-flex items-center gap-2 shrink-0 active:scale-95"
            >
              <MessageSquare size={14} />
              <span>Message Sir</span>
            </a>
          </div>

          {/* =========================================================================
              7. ACTION ENROLLMENT BANNER (BOTTOM FLOATING CTA - UPDATED TEXT)
             ========================================================================= */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white shadow-2xl space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5">
              <span className="text-xs uppercase font-bold tracking-widest text-indigo-200">
                Admissions Open for {getBatchLevelBadge(currentClass)}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">
                Join {currentClass.title} Today
              </h3>
              <p className="text-xs sm:text-sm text-indigo-100 max-w-xl">
                පන්තිවලට සහභාගී වීමට දැන්ම අපව සම්බන්ධ කරගන්න.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href={whatsappEnrollUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-900 text-xs sm:text-sm font-bold shadow-lg transition active:scale-95 inline-flex items-center gap-2"
              >
                <MessageSquare size={16} className="text-emerald-600" />
                <span>Enroll via WhatsApp</span>
              </a>

              <a
                href={`tel:${teacher?.contactInfo?.phone || '+94771234567'}`}
                className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 transition active:scale-95 inline-flex items-center gap-2"
              >
                <Phone size={14} />
                <span>Call Hotline</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer teacher={teacher} classes={classes} />
    </div>
  );
};

export default ClassDetails;
