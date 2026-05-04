import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMapPin, FiCalendar, FiUsers, FiX } from 'react-icons/fi';
import api from '../services/api';
import Loader from '../components/Loader';

const StatusPill = ({ status }) => {
  const map = {
    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
    completed: 'bg-slate-100 text-slate-600 border-slate-200',
  };
  return <span className={`badge border capitalize ${map[status] || ''}`}>{status}</span>;
};

const PaymentPill = ({ status }) => {
  const map = {
    paid: 'bg-emerald-100 text-emerald-700',
    refunded: 'bg-amber-100 text-amber-700',
    pending: 'bg-slate-100 text-slate-600',
  };
  return <span className={`badge ${map[status] || ''}`}>{status}</span>;
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');

  const load = () => {
    setLoading(true);
    api.get('/bookings')
      .then((r) => setBookings(Array.isArray(r.data) ? r.data : []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const now = Date.now();
  const upcoming = bookings.filter((b) => b.status === 'confirmed' && new Date(b.checkOut).getTime() > now);
  const past = bookings.filter((b) => new Date(b.checkOut).getTime() <= now && b.status !== 'cancelled');
  const cancelled = bookings.filter((b) => b.status === 'cancelled');

  const list = { upcoming, past, cancelled }[tab];

  const cancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      load();
    } catch {
      toast.error('Could not cancel');
    }
  };

  return (
    <div className="section py-10">
      <h1 className="text-3xl font-bold mb-2">My bookings</h1>
      <p className="text-slate-500 mb-8">Track and manage all your reservations in one place.</p>

      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
        {[
          { id: 'upcoming', label: `Upcoming (${upcoming.length})` },
          { id: 'past', label: `Past (${past.length})` },
          { id: 'cancelled', label: `Cancelled (${cancelled.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === t.id ? 'bg-white shadow-sm text-brand-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader label="Loading bookings" />
      ) : list.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-3xl mb-2">📅</p>
          <h3 className="font-bold text-lg mb-1">No {tab} bookings</h3>
          <p className="text-slate-500 mb-4">When you book, your reservations will show up here.</p>
          <Link to="/rooms" className="btn-primary">Browse rooms</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((b) => (
            <div key={b.id} className="card p-5 grid sm:grid-cols-[160px_1fr_auto] gap-5 hover:shadow-glow transition">
              <img src={b.image} alt={b.hotelName} className="w-full sm:w-40 h-32 object-cover rounded-xl" />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <StatusPill status={b.status} />
                  <PaymentPill status={b.paymentStatus} />
                  <span className="text-xs text-slate-400 font-mono">#{b.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <h3 className="font-bold text-lg">{b.hotelName}</h3>
                <p className="text-sm text-slate-600 mb-2">{b.roomType}</p>
                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><FiMapPin size={12} /> {b.city}</span>
                  <span className="flex items-center gap-1"><FiCalendar size={12} /> {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><FiUsers size={12} /> {b.guests} guests</span>
                  <span>· {b.nights} nights</span>
                </div>
              </div>
              <div className="text-right flex sm:flex-col items-center sm:items-end justify-between gap-2">
                <div>
                  <p className="text-xs text-slate-400">Total paid</p>
                  <p className="text-xl font-bold">${b.total}</p>
                </div>
                {tab === 'upcoming' && (
                  <button onClick={() => cancel(b.id)} className="btn-outline text-sm py-2 text-red-600 hover:border-red-200 hover:bg-red-50">
                    <FiX size={14} /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
