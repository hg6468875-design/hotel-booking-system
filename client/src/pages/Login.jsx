import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { isEmail } from '../services/validators';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!isEmail(form.email)) next.email = 'Enter a valid email';
    if (!form.password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors && typeof apiErrors === 'object') setErrors(apiErrors);
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') setForm({ email: 'admin@stayluxe.com', password: 'admin123' });
    else setForm({ email: 'demo@stayluxe.com', password: 'demo123' });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] grid lg:grid-cols-2">
      <div className="hidden lg:block relative">
        <img src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/90 via-brand-700/70 to-pink-500/40" />
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <h2 className="text-4xl font-bold mb-3 font-display">Welcome back to luxury.</h2>
          <p className="text-lg opacity-90 max-w-md">Pick up where you left off — your saved rooms and upcoming trips await.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md animate-slide-up">
          <h1 className="text-3xl font-bold mb-2">Sign in</h1>
          <p className="text-slate-500 mb-8">Enter your credentials to access your account.</p>

          <form noValidate onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" inputMode="email" autoComplete="email"
                  className={`input pl-10 ${errors.email ? 'border-rose-400' : ''}`} placeholder="you@example.com"
                  value={form.email} onChange={(e) => setField('email', e.target.value)} />
              </div>
              {errors.email && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><FiAlertCircle size={12} /> {errors.email}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" autoComplete="current-password"
                  className={`input pl-10 ${errors.password ? 'border-rose-400' : ''}`} placeholder="••••••••"
                  value={form.password} onChange={(e) => setField('password', e.target.value)} />
              </div>
              {errors.password && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><FiAlertCircle size={12} /> {errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in…' : <>Sign in <FiArrowRight /></>}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 uppercase tracking-wider">Try a demo account</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => fillDemo('user')} className="btn-outline text-sm">User demo</button>
            <button onClick={() => fillDemo('admin')} className="btn-outline text-sm">Admin demo</button>
          </div>

          <p className="text-sm text-slate-600 text-center mt-8">
            New here? <Link to="/register" className="text-brand-600 font-semibold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
