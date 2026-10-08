import { useEffect, useState } from 'react';
import API from '../../api/axiosInstance';
import { UserSquare2, PhoneCall, Share2, Save, Sparkles } from 'lucide-react';
import ImageUploadField from '../../components/ImageUploadField';

const EditTeacher = ({ embedded = false }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    profileImage: '',
    phone: '',
    whatsapp: '',
    email: '',
    youtube: '',
    facebook: '',
    telegram: '',
  });

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await API.get('/teacher');
        if (res.data) {
          setFormData({
            name: res.data.name || '',
            title: res.data.title || '',
            bio: res.data.bio || '',
            profileImage: res.data.profileImage || '',
            phone: res.data.contactInfo?.phone || '',
            whatsapp: res.data.contactInfo?.whatsapp || '',
            email: res.data.contactInfo?.email || '',
            youtube: res.data.socialLinks?.youtube || '',
            facebook: res.data.socialLinks?.facebook || '',
            telegram: res.data.socialLinks?.telegram || '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name: formData.name,
      title: formData.title,
      bio: formData.bio,
      profileImage: formData.profileImage,
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
    };

    try {
      await API.post('/teacher', payload);
      alert('Teacher profile updated successfully!');
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
        Loading lecturer profile data...
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
              Lecturer Profile & Contact Settings
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Update lecturer biography, official hotline numbers, and social media channels
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
                placeholder="Eng. Nivantha Silva"
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
                placeholder="B.Sc. Eng (Hons) Moratuwa, Physics Lecturer"
                className="admin-input w-full px-3.5 py-2.5 border rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="mt-4">
            <ImageUploadField
              label="Profile Photo (Uploads to Cloudinary)"
              value={formData.profileImage}
              onChange={(url) => setFormData({ ...formData, profileImage: url })}
              placeholder="Upload photo or paste URL..."
            />
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Biography / About Lecturer
            </label>
            <textarea
              rows="4"
              required
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="වසර ගණනාවක A/L භෞතික විද්‍යා ඉගැන්වීමේ පළපුරුද්ද..."
              className="admin-input w-full px-3.5 py-2.5 border rounded-xl text-xs"
            ></textarea>
          </div>
        </div>

        {/* Contact Info */}
        <div>
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
        <div>
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
            <span>{submitting ? 'Saving Profile...' : 'Save Profile Details'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTeacher;