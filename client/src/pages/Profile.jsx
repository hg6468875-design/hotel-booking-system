import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiCalendar, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', avatar: user?.avatar || '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated');
    } catch {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Your profile</h1>
      <p className="text-slate-500 mb-8">Manage your account details and preferences.</p>

      <div className="card p-6 mb-6">
        <div className="flex items-start gap-5 mb-6">
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=8b5cf6&color=fff&bold=true&size=160`}
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=8b5cf6&color=fff&bold=true&size=160`;
            }}
            alt={user.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-brand-100"
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-slate-500">{user.email}</p>
            <span className="badge bg-brand-50 text-brand-700 mt-2">
              {user.role === 'admin' ? <><FiShield size={12} /> Admin</> : <><FiUser size={12} /> Member</>}
            </span>
          </div>
        </div>

        <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Full name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input bg-slate-50" value={user.email} disabled />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Avatar URL</label>
            <input className="input" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} placeholder="https://..." />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Email', value: user.email, icon: FiMail },
          { label: 'Member since', value: new Date(user.createdAt || Date.now()).toLocaleDateString(), icon: FiCalendar },
          { label: 'Role', value: user.role, icon: FiShield },
        ].map((s, i) => (
          <div key={i} className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <s.icon size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="font-semibold text-sm capitalize truncate">{s.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
