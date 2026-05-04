import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiHeart, FiBookmark, FiGrid } from 'react-icons/fi';

const defaultAvatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=8b5cf6&color=fff&bold=true`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!menu) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [menu]);

  const linkCls = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:text-brand-600'
    }`;

  const handleLogout = () => {
    logout();
    setMenu(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="section flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center shadow-glow group-hover:scale-105 transition">
            <span className="text-white font-bold text-lg">SL</span>
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            Stay<span className="gradient-text">Luxe</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" end className={linkCls}>Home</NavLink>
          <NavLink to="/rooms" className={linkCls}>Rooms</NavLink>
          <NavLink to="/offers" className={linkCls}>Offers</NavLink>
          <NavLink to="/about" className={linkCls}>About</NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenu((v) => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 hover:border-brand-400 transition"
              >
                <img
                  src={user.avatar || defaultAvatar(user.name)}
                  onError={(e) => { e.currentTarget.src = defaultAvatar(user.name); }}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium pr-1">{user.name.split(' ')[0]}</span>
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-56 card animate-slide-up overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <Link to="/profile" onClick={() => setMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50">
                    <FiUser className="text-slate-500" /> Profile
                  </Link>
                  <Link to="/my-bookings" onClick={() => setMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50">
                    <FiBookmark className="text-slate-500" /> My Bookings
                  </Link>
                  <Link to="/favorites" onClick={() => setMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50">
                    <FiHeart className="text-slate-500" /> Favorites
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50">
                      <FiGrid className="text-slate-500" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-slate-100">
                    <FiLogOut /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
              <Link to="/register" className="btn-primary text-sm">Get started</Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2 rounded-lg hover:bg-slate-100" onClick={() => setOpen((v) => !v)}>
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white animate-slide-up">
          <div className="section py-4 flex flex-col gap-1">
            <NavLink to="/" end className={linkCls} onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/rooms" className={linkCls} onClick={() => setOpen(false)}>Rooms</NavLink>
            <NavLink to="/offers" className={linkCls} onClick={() => setOpen(false)}>Offers</NavLink>
            <NavLink to="/about" className={linkCls} onClick={() => setOpen(false)}>About</NavLink>
            <div className="border-t border-slate-100 my-2" />
            {user ? (
              <>
                <NavLink to="/profile" className={linkCls} onClick={() => setOpen(false)}>Profile</NavLink>
                <NavLink to="/my-bookings" className={linkCls} onClick={() => setOpen(false)}>My Bookings</NavLink>
                <NavLink to="/favorites" className={linkCls} onClick={() => setOpen(false)}>Favorites</NavLink>
                {user.role === 'admin' && (
                  <NavLink to="/admin" className={linkCls} onClick={() => setOpen(false)}>Admin Panel</NavLink>
                )}
                <button onClick={() => { handleLogout(); setOpen(false); }} className="text-left px-3 py-2 text-sm font-medium text-red-600">
                  Log out
                </button>
              </>
            ) : (
              <div className="flex gap-2 mt-2">
                <Link to="/login" className="btn-outline flex-1" onClick={() => setOpen(false)}>Sign in</Link>
                <Link to="/register" className="btn-primary flex-1" onClick={() => setOpen(false)}>Get started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
