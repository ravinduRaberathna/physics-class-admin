import { useState, useEffect } from 'react';
import API from '../../api/axiosInstance';
import { Plus, Trash2, Star, MessageSquare } from 'lucide-react';

const ManageFeedback = () => {
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
    <div className="space-y-8 font-['Poppins']">
      
      {/* Create Feedback Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <h4 className="text-lg font-bold flex items-center gap-2 mb-6 text-cyan-400">
          <Plus size={18} />
          Add Student Feedback / Testimonial
        </h4>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Student Full Name</label>
            <input
              type="text"
              required
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              placeholder="e.g. Nimna Kavishka"
              className="admin-input w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Batch</label>
            <input
              type="text"
              required
              value={formData.batch}
              onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
              placeholder="e.g. 2026 A/L"
              className="admin-input w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">School (Optional)</label>
            <input
              type="text"
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              placeholder="e.g. Royal College, Colombo"
              className="admin-input w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Result Badge</label>
            <input
              type="text"
              value={formData.resultBadge}
              onChange={(e) => setFormData({ ...formData, resultBadge: e.target.value })}
              placeholder="e.g. Island 4th / Physics A"
              className="admin-input w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Avatar Image URL (Optional)</label>
            <input
              type="url"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="admin-input w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Rating (Stars)</label>
            <select
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              className="admin-input w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value={5}>5 Stars (★★★★★)</option>
              <option value={4}>4 Stars (★★★★☆)</option>
              <option value={3}>3 Stars (★★★☆☆)</option>
            </select>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Testimonial Comment</label>
            <textarea
              required
              rows={3}
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="පන්තිය, ප්‍රශ්න පත්‍ර සාකච්ඡාව හෝ සිද්ධාන්ත පැහැදිලි කිරීම ගැන ශිෂ්‍යයාගේ අදහස ලියන්න..."
              className="admin-input w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wider uppercase transition shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : 'Add Testimonial'}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Feedbacks Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
          <MessageSquare size={18} className="text-indigo-400" />
          Existing Student Feedbacks ({feedbacks.length})
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Student</th>
                <th className="p-3">Badge / Result</th>
                <th className="p-3">Comment</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {feedbacks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-500">
                    තවමත් feedbacks ඇතුළත් කර නොමැත. ඉහත form එකෙන් ඇතුළත් කරන්න.
                  </td>
                </tr>
              ) : (
                feedbacks.map((fb) => (
                  <tr key={fb._id} className="hover:bg-slate-800/40">
                    <td className="p-3">
                      <div className="font-bold text-white">{fb.studentName}</div>
                      <div className="text-[10px] text-slate-400">{fb.batch} • {fb.school || 'Private'}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-semibold text-[10px]">
                        {fb.resultBadge}
                      </span>
                    </td>
                    <td className="p-3 max-w-xs truncate text-slate-400">
                      "{fb.comment}"
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => toggleActive(fb._id, fb.isActive)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                          fb.isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' : 'bg-rose-950 text-rose-400 border border-rose-800/60'
                        }`}
                      >
                        {fb.isActive ? 'Visible' : 'Hidden'}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDelete(fb._id)}
                        className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400 hover:bg-rose-900 border border-rose-800/60 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={14} />
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