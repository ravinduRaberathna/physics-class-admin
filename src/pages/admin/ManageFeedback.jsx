import { useState, useEffect } from 'react';
import API from '../../api/axiosInstance';
import { Plus, Trash2, Star, MessageSquare, Sparkles, Award } from 'lucide-react';

const ManageFeedback = ({ embedded = false }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [formData, setFormData] = useState({
    studentName: '',
    batch: '2026 A/L',
    school: '',
    resultBadge: 'Physics A',
    rating: 5,
    comment: '',
    avatar: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchFeedbacks = () => {
    API.get('/feedback')
      .then((res) => setFeedbacks(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await API.post('/feedback', formData);
      setFormData({
        studentName: '',
        batch: '2026 A/L',
        school: '',
        resultBadge: 'Physics A',
        rating: 5,
        comment: '',
        avatar: '',
      });
      fetchFeedbacks();
      alert('Feedback එක සාර්ථකව ඇතුළත් කළා!');
    } catch (err) {
      alert('Feedback ඇතුළත් කිරීම අසාර්ථකයි!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('මෙම Feedback එක ඉවත් කිරීමට අවශ්‍යද?')) return;
    try {
      await API.delete(`/feedback/${id}`);
      fetchFeedbacks();
    } catch (err) {
      alert('Delete කිරීම අසාර්ථකයි!');
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await API.put(`/feedback/${id}`, { isActive: !currentStatus });
      fetchFeedbacks();
    } catch (err) {
      alert('Status වෙනස් කිරීම අසාර්ථකයි!');
    }
  };

  return (
    <div className={`${embedded ? '' : 'p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto'} space-y-6 font-['Poppins']`}>
      
      {/* Create Feedback Form Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 text-slate-800 shadow-[0_8px_30px_rgb(15,23,42,0.04)]">
        <div className="flex items-center gap-3.5 pb-5 mb-6 border-b border-slate-100">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Add Student Feedback / Testimonial
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Publish top student reviews and island rank achievements to the homepage carousel
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-700 block mb-1.5 font-semibold">Student Full Name</label>
            <input
              type="text"
              required
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              placeholder="e.g. Nimna Kavishka"
              className="admin-input w-full px-3.5 py-2.5 rounded-xl text-xs border"
            />
          </div>

          <div>
            <label className="text-xs text-slate-700 block mb-1.5 font-semibold">Batch</label>
            <input
              type="text"
              required
              value={formData.batch}
              onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
              placeholder="e.g. 2026 A/L"
              className="admin-input w-full px-3.5 py-2.5 rounded-xl text-xs border"
            />
          </div>

          <div>
            <label className="text-xs text-slate-700 block mb-1.5 font-semibold">School (Optional)</label>
            <input
              type="text"
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              placeholder="e.g. Royal College, Colombo"
              className="admin-input w-full px-3.5 py-2.5 rounded-xl text-xs border"
            />
          </div>

          <div>
            <label className="text-xs text-slate-700 block mb-1.5 font-semibold">Result Badge</label>
            <input
              type="text"
              value={formData.resultBadge}
              onChange={(e) => setFormData({ ...formData, resultBadge: e.target.value })}
              placeholder="e.g. Island 4th / Physics A"
              className="admin-input w-full px-3.5 py-2.5 rounded-xl text-xs border"
            />
          </div>

          <div>
            <label className="text-xs text-slate-700 block mb-1.5 font-semibold">Avatar Image URL (Optional)</label>
            <input
              type="url"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="admin-input w-full px-3.5 py-2.5 rounded-xl text-xs border"
            />
          </div>

          <div>
            <label className="text-xs text-slate-700 block mb-1.5 font-semibold">Rating (Stars)</label>
            <select
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              className="admin-input w-full px-3.5 py-2.5 rounded-xl text-xs border"
            >
              <option value={5}>5 Stars (★★★★★)</option>
              <option value={4}>4 Stars (★★★★☆)</option>
              <option value={3}>3 Stars (★★★☆☆)</option>
            </select>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className="text-xs text-slate-700 block mb-1.5 font-semibold">Testimonial Comment</label>
            <textarea
              required
              rows={3}
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="පන්තිය, ප්‍රශ්න පත්‍ර සාකච්ඡාව හෝ සිද්ධාන්ත පැහැදිලි කිරීම ගැන ශිෂ්‍යයාගේ අදහස ලියන්න..."
              className="admin-input w-full px-3.5 py-2.5 rounded-xl text-xs border"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-bold text-xs tracking-wide transition shadow-lg shadow-indigo-500/25 cursor-pointer active:scale-95"
            >
              <Plus size={16} />
              <span>{isSubmitting ? 'Saving...' : 'Add Testimonial'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Existing Feedbacks Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden text-slate-800 shadow-[0_8px_30px_rgb(15,23,42,0.04)]">
        <div className="p-6 sm:px-8 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <MessageSquare size={17} />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-900">
                Existing Student Feedbacks
              </h4>
              <p className="text-[11px] text-slate-500">Click the status pill to toggle visibility on the public site</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-200/80">
            {feedbacks.length} Reviews
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/90 border-b border-slate-200/80 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="p-4 pl-6">Student</th>
                <th className="p-4">Badge / Result</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Comment</th>
                <th className="p-4 text-center">Visibility</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {feedbacks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-slate-500">
                    තවමත් feedbacks ඇතුළත් කර නොමැත. ඉහත form එකෙන් ඇතුළත් කරන්න.
                  </td>
                </tr>
              ) : (
                feedbacks.map((fb) => (
                  <tr key={fb._id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        {fb.avatar ? (
                          <img
                            src={fb.avatar}
                            alt={fb.studentName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-100 to-cyan-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200/60 shrink-0">
                            {fb.studentName ? fb.studentName[0].toUpperCase() : 'S'}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">{fb.studentName}</div>
                          <div className="text-[11px] text-slate-500">
                            {fb.batch} • {fb.school || 'Private Candidate'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/80 font-bold text-[11px]">
                        <Award size={12} className="text-indigo-500" />
                        {fb.resultBadge}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: fb.rating || 5 }).map((_, idx) => (
                          <Star key={idx} size={13} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 max-w-xs truncate text-slate-600 italic" title={fb.comment}>
                      "{fb.comment}"
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleActive(fb._id, fb.isActive)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition ${
                          fb.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            fb.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        ></span>
                        {fb.isActive ? 'Visible' : 'Hidden'}
                      </button>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleDelete(fb._id)}
                        className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200/80 hover:border-rose-600 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ManageFeedback;