import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Atom, Lock, Mail, ArrowRight, ShieldCheck, Sun, Moon } from 'lucide-react';
import API from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, darkMode, toggleDarkMode } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 font-['Poppins'] relative overflow-hidden transition-colors duration-300 ${
        darkMode ? 'dark admin-dark bg-[#070a14] text-slate-100' : ''
      }`}
    >
      {/* Top-Right Theme Toggle */}
      <button
        type="button"
        onClick={toggleDarkMode}
        className={`fixed top-5 right-5 z-30 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition cursor-pointer shadow-sm ${
          darkMode
            ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'
        }`}
      >
        {darkMode ? <Sun size={15} /> : <Moon size={15} />}
        <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
      </button>

      {/* Subtle Ambient Glows */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)] p-8 sm:p-10 border border-slate-200/90 relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 mb-4">
            <Atom size={28} className="animate-[spin_18s_linear_infinite]" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-2">
            <ShieldCheck size={12} />
            <span>Authorized Access</span>
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Admin Control Portal
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            A/L Physics Masterclass Management System
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-3.5 rounded-2xl text-xs font-medium mb-5 border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Administrator Email
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input w-full pl-10 pr-4 py-3 border rounded-xl text-xs"
                placeholder="admin@physics.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input w-full pl-10 pr-4 py-3 border rounded-xl text-xs"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white rounded-xl font-bold text-xs tracking-wide transition shadow-lg shadow-indigo-500/25 disabled:opacity-60 mt-2 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>{submitting ? 'Signing in...' : 'Sign In to Dashboard'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <Link
            to="/"
            className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
          >
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;