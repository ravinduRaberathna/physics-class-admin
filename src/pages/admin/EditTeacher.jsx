import { useEffect, useState } from 'react';
import API from '../../api/axiosInstance';

const EditTeacher = () => {
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

  if (loading) return <div className="p-8 text-center text-slate-500">Loading profile data...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Teacher Profile Settings</h1>
      <p className="text-sm text-slate-500 mb-6">Update lecturer bio, social links and contact details</p>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-3">General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Eng. Nivantha Silva"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Designation / Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="B.Sc. Eng (Hons) Moratuwa, Physics Lecturer"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Profile Photo URL</label>
            <input
              type="text"
              value={formData.profileImage}
              onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Biography / About</label>
            <textarea
              rows="4"
              required
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="වසර ගණනාවක A/L භෞතික විද්‍යා ඉගැන්වීමේ පළපුරුද්ද..."
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
            ></textarea>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-800 mb-3">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0771234567"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp</label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="0771234567"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="sir@physics.com"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-800 mb-3">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">YouTube URL</label>
              <input
                type="text"
                value={formData.youtube}
                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                placeholder="https://youtube.com/@channel"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Facebook URL</label>
              <input
                type="text"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                placeholder="https://facebook.com/page"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Telegram URL</label>
              <input
                type="text"
                value={formData.telegram}
                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                placeholder="https://t.me/group"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium transition disabled:bg-sky-400"
          >
            {submitting ? 'Saving Profile...' : 'Save Profile Details'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTeacher;