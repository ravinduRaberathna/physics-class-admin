import { useEffect, useState } from 'react';
import API from '../../api/axiosInstance';
import { 
  UserSquare2, 
  PhoneCall, 
  Share2, 
  Save, 
  Sparkles, 
  Images, 
  Plus, 
  Trash2, 
  ExternalLink,
  RotateCcw,
  Check
} from 'lucide-react';
import ImageUploadField from '../../components/ImageUploadField';
import { getOptimizedThumbnail } from '../../utils/imageOptimizer';

const DEFAULT_HIGHLIGHTS = [
  '98% Pass Rate & Island Ranks',
  'Complete Theory & Speed Revision',
  'Physical & Online LMS Access',
];

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

const EditTeacher = ({ embedded = false }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    profileImage: '',
    coverImage: '',
    phone: '',
    whatsapp: '',
    email: '',
    youtube: '',
    facebook: '',
    telegram: '',
    showcaseImages: [],
    highlights: [...DEFAULT_HIGHLIGHTS],
  });

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await API.get('/teacher');
        if (res.data) {
          const rawCover =
            res.data.coverImage ||
            (Array.isArray(res.data.showcaseImages)
              ? res.data.showcaseImages.find((img) => img && img.alt === '__COVER_IMAGE__')?.src
              : '') ||
            '';

          const pureShowcase = Array.isArray(res.data.showcaseImages)
            ? res.data.showcaseImages.filter((img) => img && img.alt !== '__COVER_IMAGE__')
            : [];

          setFormData({
            name: res.data.name || '',
            title: res.data.title || '',
            bio: res.data.bio || '',
            profileImage: res.data.profileImage || '',
            coverImage: rawCover,
            phone: res.data.contactInfo?.phone || '',
            whatsapp: res.data.contactInfo?.whatsapp || '',
            email: res.data.contactInfo?.email || '',
            youtube: res.data.socialLinks?.youtube || '',
            facebook: res.data.socialLinks?.facebook || '',
            telegram: res.data.socialLinks?.telegram || '',
            showcaseImages: pureShowcase,
            highlights:
              Array.isArray(res.data.highlights) && res.data.highlights.length > 0
                ? res.data.highlights
                : [...DEFAULT_HIGHLIGHTS],
          });
        }
      } catch (err) {
        console.log('No profile exists yet or error fetching');
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, []);

  const handleAddShowcaseImage = (e) => {
    e?.preventDefault();
    if (!newImageUrl.trim()) return;

    const newItem = {
      src: newImageUrl.trim(),
      alt: newImageAlt.trim() || 'Classroom & Laboratory Showcase',
    };

    setFormData((prev) => ({
      ...prev,
      showcaseImages: [...(prev.showcaseImages || []), newItem],
    }));

    setNewImageUrl('');
    setNewImageAlt('');
  };

  const handleRemoveShowcaseImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      showcaseImages: prev.showcaseImages.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleLoadTemplateShowcase = () => {
    if (
      formData.showcaseImages?.length > 0 &&
      !window.confirm('Replace current showcase images with 8 curated physics template photos?')
    ) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      showcaseImages: [...DEFAULT_TEMPLATE_SHOWCASE],
    }));
  };

  const handleHighlightChange = (index, value) => {
    setFormData((prev) => {
      const updated = [...(prev.highlights || [])];
      updated[index] = value;
      return { ...prev, highlights: updated };
    });
  };

  const handleAddHighlight = () => {
    setFormData((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), ''],
    }));
  };

  const handleRemoveHighlight = (index) => {
    setFormData((prev) => ({
      ...prev,
      highlights: (prev.highlights || []).filter((_, i) => i !== index),
    }));
  };

  const handleResetHighlights = () => {
    setFormData((prev) => ({
      ...prev,
      highlights: [...DEFAULT_HIGHLIGHTS],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const pureShowcase = (formData.showcaseImages || []).filter(
      (img) => img && img.alt !== '__COVER_IMAGE__'
    );

    const finalShowcase = [...pureShowcase];
    if (formData.coverImage && formData.coverImage.trim()) {
      finalShowcase.push({
        src: formData.coverImage.trim(),
        alt: '__COVER_IMAGE__',
      });
    }

    const payload = {
      name: formData.name,
      title: formData.title,
      bio: formData.bio,
      profileImage: formData.profileImage,
      coverImage: formData.coverImage || '',
      contactInfo: {
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        email: formData.email,
      },
      socialLinks: {
        youtube: formData.youtube,
        facebook: formData.facebook,
        telegram: formData.telegram,
      },
      showcaseImages: finalShowcase,
      highlights: (formData.highlights || []).filter(
        (h) => typeof h === 'string' && h.trim() !== ''
      ),
    };

    try {
      const res = await API.post('/teacher', payload);
      const updatedTeacher = {
        ...res.data,
        coverImage: formData.coverImage || '',
        highlights: payload.highlights,
      };
      try {
        localStorage.setItem('cached_teacher_profile', JSON.stringify(updatedTeacher));
        window.dispatchEvent(new Event('storage'));
      } catch {}
      alert('Teacher profile details & key highlights saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update teacher profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-14 text-center text-xs font-medium text-slate-500 font-['Poppins']">
        Loading teacher profile data...
      </div>
    );
  }

  return (
    <div className={`${embedded ? '' : 'p-6 sm:p-8 lg:p-10 max-w-5xl mx-auto'} space-y-6 font-['Poppins']`}>
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgb(15,23,42,0.04)]">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <UserSquare2 size={22} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              Teacher Profile & Hero Showcase Settings
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Update teacher biography, official hotline numbers, social channels, and 3D curved Hero images
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(15,23,42,0.04)] border border-slate-200/80 space-y-8"
      >
        {/* General Info */}
        <div>
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <Sparkles size={15} />
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
              General Biography
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Eng. Chamath Dissanayake"
                className="admin-input w-full px-3.5 py-2.5 border rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Designation / Academic Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="B.Sc. Engineering (Hons) • A/L Physics Teacher"
                className="admin-input w-full px-3.5 py-2.5 border rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <ImageUploadField
              label="Teacher Profile Photo (Circular Portrait)"
              value={formData.profileImage}
              onChange={(url) => setFormData({ ...formData, profileImage: url })}
              placeholder="https://res.cloudinary.com/... or upload photo"
            />
            <ImageUploadField
              label="Overview Modal Background / Cover Banner (Landscape)"
              value={formData.coverImage}
              onChange={(url) => setFormData({ ...formData, coverImage: url })}
              placeholder="https://res.cloudinary.com/... or upload banner photo"
            />
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Short Bio / Philosophy</label>
            <textarea
              rows="3"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Enter brief teacher bio or teaching motto..."
              className="admin-input w-full px-3.5 py-2.5 border rounded-xl text-xs"
            ></textarea>
          </div>

          {/* Key Highlights / Profile Checklist Features */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-white">
                  Teacher Key Highlights (2x2 Green Checklist Details)
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  සර්ගේ Profile Section එකේ කොළ පාට හරි ලකුණු (Checkmarks) සමඟ පෙන්වන ප්‍රධාන කරුණු ලැයිස්තුව මෙතැනින් Edit කරන්න හෝ අලුතින් Add කරන්න:
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetHighlights}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-cyan-400 cursor-pointer self-start sm:self-auto"
              >
                <RotateCcw size={12} />
                <span>Reset Default 3 Points</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {(formData.highlights || []).map((point, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#16c60c] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Check size={12} strokeWidth={3.5} />
                  </div>
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => handleHighlightChange(index, e.target.value)}
                    placeholder={`Highlight point ${index + 1} (e.g. 98% Pass Rate & Island Ranks)`}
                    className="admin-input flex-1 px-3.5 py-2.5 border rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(index)}
                    className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                    title="Remove point"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddHighlight}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 text-xs font-bold transition cursor-pointer mt-2"
              >
                <Plus size={14} />
                <span>Add Highlight Point</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            HERO CURVED 3D CYLINDRICAL SHOWCASE IMAGES (ADMIN MANAGEMENT)
           ========================================================================= */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Images size={15} />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                  Hero 3D Curved Showcase Images
                </h2>
                <p className="text-[11px] text-slate-500">
                  Hero area එකට යටින් 3D සිලින්ඩරාකාරව කැරකෙන images band එක සඳහා පින්තූර මෙතැනින් එකතු කරන්න / වෙනස් කරන්න.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadTemplateShowcase}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Reset to Templates</span>
              </button>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                {formData.showcaseImages?.length || 0} Images
              </span>
            </div>
          </div>

          {/* Add New Showcase Image Sub-form */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-5 space-y-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Plus size={14} className="text-purple-600" />
              <span>Add New Image to 3D Loop</span>
            </span>

            <ImageUploadField
              label="Choose from Device or Enter URL"
              value={newImageUrl}
              onChange={(url) => setNewImageUrl(url)}
              placeholder="Upload photo via Cloudinary or paste direct image URL"
            />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <input
                type="text"
                value={newImageAlt}
                onChange={(e) => setNewImageAlt(e.target.value)}
                placeholder="Image description or label (e.g. Model Paper Class, Laboratory)"
                className="admin-input flex-1 px-3.5 py-2.5 border rounded-xl text-xs bg-white"
              />
              <button
                type="button"
                disabled={!newImageUrl.trim()}
                onClick={handleAddShowcaseImage}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-md shadow-purple-600/20 shrink-0"
              >
                <Plus size={14} />
                <span>Add to Showcase</span>
              </button>
            </div>
          </div>

          {/* Showcase Images Gallery Grid */}
          {formData.showcaseImages && formData.showcaseImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {formData.showcaseImages.map((img, idx) => {
                const src = typeof img === 'string' ? img : img.src;
                const alt = typeof img === 'string' ? `Showcase image ${idx + 1}` : (img.alt || `Showcase image ${idx + 1}`);
                return (
                  <div
                    key={idx}
                    className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-[16/10] shadow-sm hover:shadow-md transition-all"
                  >
                    <img
                      src={getOptimizedThumbnail(src)}
                      alt={alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
                    
                    {/* Index badge */}
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-white border border-white/20">
                        #{idx + 1}
                      </span>
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveShowcaseImage(idx)}
                      title="Remove image"
                      className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white flex items-center justify-center transition shadow-md cursor-pointer opacity-90 hover:scale-110 active:scale-95"
                    >
                      <Trash2 size={13} />
                    </button>

                    {/* Bottom label */}
                    <div className="absolute bottom-1.5 left-2 right-2 truncate">
                      <span className="text-[10px] font-medium text-slate-200 truncate block">
                        {alt}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
              <Images size={28} className="mx-auto text-slate-400 mb-2 opacity-60" />
              <p className="text-xs font-semibold text-slate-600">No custom images added yet</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                Currently, the 8 curated default physics stock images are displayed on the homepage. You can upload custom classroom or lab photos anytime above.
              </p>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center">
              <PhoneCall size={15} />
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
              Official Contact Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hotline Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0771234567"
                className="admin-input w-full px-3.5 py-2.5 border rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">WhatsApp Number</label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="94771234567"
                className="admin-input w-full px-3.5 py-2.5 border rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Official Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="sir@physics.com"
                className="admin-input w-full px-3.5 py-2.5 border rounded-xl text-xs"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-100 text-violet-600 flex items-center justify-center">
              <Share2 size={15} />
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
              Social Media Channels
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">YouTube URL</label>
              <input
                type="text"
                value={formData.youtube}
                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                placeholder="https://youtube.com/@channel"
                className="admin-input w-full px-3.5 py-2.5 border rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Facebook URL</label>
              <input
                type="text"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                placeholder="https://facebook.com/page"
                className="admin-input w-full px-3.5 py-2.5 border rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Telegram URL</label>
              <input
                type="text"
                value={formData.telegram}
                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                placeholder="https://t.me/group"
                className="admin-input w-full px-3.5 py-2.5 border rounded-xl text-xs"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white rounded-2xl text-xs font-bold tracking-wide transition shadow-lg shadow-indigo-500/25 disabled:opacity-60 cursor-pointer active:scale-95"
          >
            <Save size={15} />
            <span>{submitting ? 'Saving Profile & Showcase...' : 'Save Profile & Showcase Images'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTeacher;
