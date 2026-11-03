import { useState, useEffect } from 'react';
import API from '../../api/axiosInstance';
import ImageUploadField from '../../components/ImageUploadField';
import { getOptimizedThumbnail } from '../../utils/imageOptimizer';
import { TiltedGridHero } from '../../components/ui/tilted-grid-hero';
import {
  Images,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Eye,
  AlertCircle
} from 'lucide-react';

const DEFAULT_TEMPLATE_SHOWCASE = [
  {
    src: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
    alt: 'Physics Laboratory Research and Experiments',
  },
  {
    src: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=1200&q=80',
    alt: 'Quantum & Theoretical Physics Wave Models',
  },
  {
    src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    alt: 'Digital Learning & Modern Classroom Technology',
  },
  {
    src: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80',
    alt: 'Optics & Laser Light Refraction in Physics',
  },
  {
    src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    alt: 'Astrophysics, Cosmic Gravity and Universe Dimensions',
  },
  {
    src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    alt: 'Data Analysis and Problem Solving',
  },
  {
    src: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1200&q=80',
    alt: 'Advanced Mechanical and Electrical Science',
  },
  {
    src: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=1200&q=80',
    alt: 'Mathematical Equations and Pure Physics Foundations',
  },
];

const ManageHeroShowcase = ({ embedded = false }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [teacherData, setTeacherData] = useState(null);
  const [images, setImages] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [newAlt, setNewAlt] = useState('');
  const [showLivePreview, setShowLivePreview] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await API.get('/teacher');
        if (res.data) {
          setTeacherData(res.data);
          const currentImages = Array.isArray(res.data.showcaseImages)
            ? res.data.showcaseImages.map((img) =>
                typeof img === 'string' ? { src: img, alt: '' } : img
              )
            : [];
          setImages(currentImages);
        }
      } catch (err) {
        console.error('Failed to load teacher showcase data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, []);

  const handleAddImage = (e) => {
    e?.preventDefault();
    if (!newUrl.trim()) return;

    const newItem = {
      src: newUrl.trim(),
      alt: newAlt.trim() || 'Classroom / Physics Showcase Photo',
    };

    setImages((prev) => [...prev, newItem]);
    setNewUrl('');
    setNewAlt('');
    setSuccessMessage('Photo added to list. Click "Save All Changes" below to apply live.');
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setSuccessMessage('Photo removed. Click "Save All Changes" below to apply live.');
  };

  const handleLoadDefaults = () => {
    if (
      images.length > 0 &&
      !window.confirm('Replace your current showcase photos with the 8 curated physics demonstration images?')
    ) {
      return;
    }
    setImages([...DEFAULT_TEMPLATE_SHOWCASE]);
    setSuccessMessage('Loaded 8 template photos. Click "Save All Changes" below to apply live.');
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage('');

    try {
      const payload = {
        ...(teacherData || {}),
        showcaseImages: images,
      };

      const res = await API.post('/teacher', payload);
      setTeacherData(res.data);
      try {
        localStorage.setItem('cached_teacher_profile', JSON.stringify(res.data));
      } catch {}
      setSuccessMessage('Hero 3D Showcase Photos saved successfully! Homepage updated.');
      setTimeout(() => setSuccessMessage(''), 6000);
    } catch (err) {
      console.error('Save showcase error:', err);
      alert('Failed to save showcase photos. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs font-semibold text-slate-500 font-['Poppins']">
        Loading 3D showcase photos...
      </div>
    );
  }

  const previewDisplayImages = images.length > 0 ? images : DEFAULT_TEMPLATE_SHOWCASE;

  return (
    <div className={`${embedded ? '' : 'p-6 sm:p-8 lg:p-10 max-w-6xl mx-auto'} space-y-6 font-['Poppins']`}>
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1e222d] p-6 rounded-3xl border border-slate-200/80 dark:border-[#2d3446] shadow-sm">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <Images size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Hero 3D Curved Showcase Photos
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                3D Cylindrical Loop
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Upload and manage photos for the 3D rotating cylinder that curves directly below the Hero section on the homepage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleLoadDefaults}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset to Templates</span>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold transition shadow-md shadow-purple-600/25 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Save size={14} />
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Success Alert Banner */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200 flex items-center justify-between gap-3 text-xs font-bold animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage('')}
            className="text-[11px] underline opacity-80 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Live Preview Toggle & Card */}
      <div className="bg-white dark:bg-[#1e222d] rounded-3xl border border-slate-200/80 dark:border-[#2d3446] overflow-hidden shadow-sm">
        <div className="p-4 px-6 border-b border-slate-100 dark:border-[#2d3446] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white">
            <Eye size={15} className="text-indigo-600 dark:text-cyan-400" />
            <span>Real-time 3D Curved Loop Preview</span>
          </div>
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="text-[11px] font-bold text-indigo-600 dark:text-cyan-400 hover:underline cursor-pointer"
          >
            {showLivePreview ? 'Hide Preview' : 'Show Live Preview'}
          </button>
        </div>

        {showLivePreview && (
          <div className="p-4 sm:p-6 bg-slate-950">
            <div className="relative rounded-2xl overflow-hidden border border-indigo-500/30">
              <TiltedGridHero
                images={previewDisplayImages}
                speed={4}
                tileHeight={30}
                aspectRatio={16 / 9}
                gap={6}
                axis={54}
                curve={78}
                fade={12}
                className="h-[360px] sm:h-[400px] w-full"
              >
                <div className="relative z-10 flex h-full flex-col items-center justify-center text-center pointer-events-none p-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-slate-900/80 text-cyan-300 text-[10px] font-bold uppercase tracking-wider border border-white/20 mb-2">
                    Live 3D Rotation Preview
                  </span>
                  <p className="text-xs text-slate-300 max-w-sm">
                    {images.length > 0
                      ? `Displaying ${images.length} custom photos in 3D loop.`
                      : 'Displaying 8 default curated physics templates.'}
                  </p>
                </div>
              </TiltedGridHero>
            </div>
          </div>
        )}
      </div>

      {/* Step 1: Upload / Add New Photo Card */}
      <div className="bg-white dark:bg-[#1e222d] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-[#2d3446] shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-[#2d3446]">
          <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-500/30 text-purple-600 dark:text-purple-300 flex items-center justify-center font-black text-xs">
            1
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              Upload New Photo
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Select a photo from your computer/mobile (uploaded directly via Cloudinary) or paste a direct image URL.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <ImageUploadField
            label="Choose Photo from Computer / Phone"
            value={newUrl}
            onChange={(url) => setNewUrl(url)}
            placeholder="Click 'Choose Image' to upload from device or paste image URL"
          />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              value={newAlt}
              onChange={(e) => setNewAlt(e.target.value)}
              placeholder="Caption or label (e.g. Model Paper Class, Laboratory Practical, 2026 Batch)"
              className="admin-input flex-1 px-4 py-2.5 rounded-xl border text-xs"
            />
            <button
              type="button"
              disabled={!newUrl.trim()}
              onClick={handleAddImage}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-md shadow-purple-600/20 shrink-0 active:scale-95"
            >
              <Plus size={15} />
              <span>Add to 3D Loop</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step 2: Manage Active Photos Grid */}
      <div className="bg-white dark:bg-[#1e222d] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-[#2d3446] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-[#2d3446]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-black text-xs">
              2
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                Active Photos in 3D Cylindrical Band
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                These photos rotate continuously along the curved cylinder on the home page.
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-cyan-300 border border-indigo-200/80 dark:border-indigo-500/30 self-start sm:self-auto">
            {images.length} Photos in Loop
          </span>
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((item, idx) => {
              const src = typeof item === 'string' ? item : item.src;
              const alt = typeof item === 'string' ? `Photo #${idx + 1}` : item.alt || `Photo #${idx + 1}`;
              return (
                <div
                  key={idx}
                  className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 aspect-[16/10] shadow-sm hover:shadow-lg transition-all"
                >
                  <img
                    src={getOptimizedThumbnail(src)}
                    alt={alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-80" />

                  {/* Position Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold text-cyan-300 border border-white/20">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    title="Remove this photo"
                    className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white flex items-center justify-center transition shadow-md cursor-pointer hover:scale-110 active:scale-95"
                  >
                    <Trash2 size={13} />
                  </button>

                  {/* Caption Overlay */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 truncate">
                    <p className="text-[11px] font-medium text-white truncate drop-shadow-xs">
                      {alt}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-10 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
            <Images size={32} className="mx-auto text-slate-400 mb-2.5 opacity-60" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No custom photos uploaded yet
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              The website is currently showing the 8 default curated physics demonstration photos. Use Step 1 above to add your own class or lab photos!
            </p>
            <button
              type="button"
              onClick={handleLoadDefaults}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 text-xs font-bold transition hover:bg-purple-100 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Load 8 Default Physics Photos as Starting Base</span>
            </button>
          </div>
        )}

        {/* Bottom Save Action Bar */}
        <div className="pt-6 border-t border-slate-100 dark:border-[#2d3446] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Remember to click <strong>Save All Changes</strong> so your updates appear live on the homepage.
          </p>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold tracking-wider uppercase transition shadow-lg shadow-purple-600/25 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Save size={15} />
            <span>{saving ? 'Saving to Database...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageHeroShowcase;

