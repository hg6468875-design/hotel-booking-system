import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { isEmail } from '../services/validators';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!isEmail(form.email)) next.email = 'Enter a valid email';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors && typeof apiErrors === 'object') setErrors(apiErrors);
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 md:p-12 order-2 lg:order-1">
        <div className="w-full max-w-md animate-slide-up">
          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-slate-500 mb-8">Join thousands of travelers booking unforgettable stays.</p>

          <form noValidate onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input autoComplete="name" className={`input pl-10 ${errors.name ? 'border-rose-400' : ''}`} placeholder="Jane Doe"
                  value={form.name} onChange={(e) => setField('name', e.target.value)} />
              </div>
              {errors.name && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><FiAlertCircle size={12} /> {errors.name}</p>}
            </div>
            <div>
              <label className="label">Email</label>
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
                <input type="password" autoComplete="new-password"
                  className={`input pl-10 ${errors.password ? 'border-rose-400' : ''}`} placeholder="At least 6 characters"
                  value={form.password} onChange={(e) => setField('password', e.target.value)} />
              </div>
              {errors.password && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><FiAlertCircle size={12} /> {errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating…' : <>Create account <FiArrowRight /></>}
            </button>
          </form>

          <p className="text-sm text-slate-600 text-center mt-8">
            Already have an account? <Link to="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:block relative order-1 lg:order-2">
        <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-bl from-pink-500/40 via-brand-700/70 to-brand-900/90" />
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <h2 className="text-4xl font-bold mb-3 font-display">Begin your next escape.</h2>
          <p className="text-lg opacity-90 max-w-md">Save rooms, manage bookings, and unlock exclusive member rates from day one.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
