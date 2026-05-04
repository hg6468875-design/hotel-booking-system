import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiGrid, FiHome, FiBookmark, FiTag, FiPlus, FiEdit2, FiTrash2, FiX,
  FiTrendingUp, FiDollarSign, FiPercent, FiUsers,
} from 'react-icons/fi';
import api from '../services/api';
import Loader from '../components/Loader';

const Stat = ({ icon: Icon, label, value, color }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const RoomFormModal = ({ room, onClose, onSave }) => {
  const [form, setForm] = useState(
    room || {
      hotelName: '',
      city: '',
      country: '',
      type: 'Deluxe Suite',
      beds: 'King Bed',
      size: 40,
      maxGuests: 2,
      pricePerNight: 200,
      rating: 4.5,
      amenities: ['Free WiFi', 'Air Conditioning'],
      images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80'],
      description: '',
    }
  );

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...form,
        size: Number(form.size),
        maxGuests: Number(form.maxGuests),
        pricePerNight: Number(form.pricePerNight),
        rating: Number(form.rating),
      };
      if (room) {
        const { data: updated } = await api.put(`/rooms/${room.id}`, data);
        onSave(updated, 'update');
      } else {
        const { data: created } = await api.post('/rooms', data);
        onSave(created, 'create');
      }
    } catch {
      toast.error('Save failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white">
          <h2 className="font-bold text-lg">{room ? 'Edit room' : 'Add new room'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><FiX /></button>
        </div>
        <form onSubmit={submit} className="p-5 grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><label className="label">Hotel name</label><input required className="input" value={form.hotelName} onChange={(e) => setForm({ ...form, hotelName: e.target.value })} /></div>
          <div><label className="label">City</label><input required className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
          <div><label className="label">Country</label><input required className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
          <div><label className="label">Room type</label><input required className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} /></div>
          <div><label className="label">Beds</label><input className="input" value={form.beds} onChange={(e) => setForm({ ...form, beds: e.target.value })} /></div>
          <div><label className="label">Size (m²)</label><input type="number" className="input" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} /></div>
          <div><label className="label">Max guests</label><input type="number" className="input" value={form.maxGuests} onChange={(e) => setForm({ ...form, maxGuests: e.target.value })} /></div>
          <div><label className="label">Price / night ($)</label><input type="number" className="input" value={form.pricePerNight} onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })} /></div>
          <div><label className="label">Rating</label><input type="number" step="0.1" min="0" max="5" className="input" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className="label">Description</label><textarea rows="3" className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className="label">Image URLs (comma-separated)</label><input className="input" value={form.images.join(', ')} onChange={(e) => setForm({ ...form, images: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} /></div>
          <div className="sm:col-span-2"><label className="label">Amenities (comma-separated)</label><input className="input" value={form.amenities.join(', ')} onChange={(e) => setForm({ ...form, amenities: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} /></div>
          <div className="sm:col-span-2 flex justify-end gap-2 pt-3">
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
            <button type="submit" className="btn-primary">{room ? 'Update room' : 'Create room'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const OfferFormModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    code: '',
    discount: 10,
    validTill: '2026-12-31',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/offers', { ...form, discount: Number(form.discount) });
      onSave(data);
    } catch {
      toast.error('Save failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="font-bold text-lg">New offer</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><FiX /></button>
        </div>
        <form onSubmit={submit} className="p-5 grid gap-4">
          <div><label className="label">Title</label><input required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="label">Description</label><textarea required rows="2" className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Code</label><input required className="input uppercase" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} /></div>
            <div><label className="label">Discount %</label><input required type="number" className="input" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} /></div>
          </div>
          <div><label className="label">Valid till</label><input type="date" className="input" value={form.validTill} onChange={(e) => setForm({ ...form, validTill: e.target.value })} /></div>
          <div><label className="label">Image URL</label><input className="input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
            <button type="submit" className="btn-primary">Create offer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Admin = () => {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [addingOffer, setAddingOffer] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [s, r, b, o] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/rooms'),
        api.get('/bookings/all'),
        api.get('/offers'),
      ]);
      setStats(s.data);
      setRooms(r.data);
      setBookings(b.data);
      setOffers(o.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const deleteRoom = async (id) => {
    if (!confirm('Delete this room?')) return;
    await api.delete(`/rooms/${id}`);
    setRooms((rs) => rs.filter((r) => r.id !== id));
    toast.success('Room deleted');
  };

  const deleteOffer = async (id) => {
    if (!confirm('Delete this offer?')) return;
    await api.delete(`/offers/${id}`);
    setOffers((os) => os.filter((o) => o.id !== id));
    toast.success('Offer deleted');
  };

  const cancelBooking = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    await api.put(`/bookings/${id}/cancel`);
    setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status: 'cancelled', paymentStatus: 'refunded' } : b)));
    toast.success('Booking cancelled');
  };

  const onSaveRoom = (room, mode) => {
    if (mode === 'create') setRooms((rs) => [room, ...rs]);
    else setRooms((rs) => rs.map((r) => (r.id === room.id ? room : r)));
    setAdding(false);
    setEditing(null);
    toast.success(mode === 'create' ? 'Room created' : 'Room updated');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
    { id: 'rooms', label: 'Rooms', icon: FiHome },
    { id: 'bookings', label: 'Bookings', icon: FiBookmark },
    { id: 'offers', label: 'Offers', icon: FiTag },
  ];

  if (loading) return <Loader />;

  return (
    <div className="section py-10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-slate-500 text-sm">Manage rooms, bookings, and special offers.</p>
        </div>
      </div>

      <div className="flex gap-1 mb-8 bg-slate-100 p-1 rounded-xl w-fit overflow-x-auto scrollbar-hide max-w-full">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              tab === t.id ? 'bg-white shadow-sm text-brand-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && stats && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat icon={FiBookmark} label="Total Bookings" value={stats.totalBookings} color="bg-brand-50 text-brand-600" />
            <Stat icon={FiDollarSign} label="Revenue" value={`$${stats.revenue.toLocaleString()}`} color="bg-emerald-50 text-emerald-600" />
            <Stat icon={FiPercent} label="Occupancy" value={`${stats.occupancy}%`} color="bg-amber-50 text-amber-600" />
            <Stat icon={FiUsers} label="Users" value={stats.users} color="bg-pink-50 text-pink-600" />
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            <Stat icon={FiTrendingUp} label="Active Bookings" value={stats.activeBookings} color="bg-blue-50 text-blue-600" />
            <Stat icon={FiX} label="Cancellations" value={stats.cancelled} color="bg-red-50 text-red-600" />
            <Stat icon={FiHome} label="Total Rooms" value={stats.rooms} color="bg-purple-50 text-purple-600" />
          </div>

          <div className="card p-6">
            <h3 className="font-bold mb-4">Recent bookings</h3>
            {bookings.length === 0 ? (
              <p className="text-sm text-slate-500">No bookings yet.</p>
            ) : (
              <div className="space-y-2">
                {bookings.slice(0, 5).map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img src={b.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-sm">{b.userName} → {b.hotelName}</p>
                        <p className="text-xs text-slate-500">{new Date(b.checkIn).toLocaleDateString()} · {b.nights} nights</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm">${b.total}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'rooms' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setAdding(true)} className="btn-primary"><FiPlus /> Add room</button>
          </div>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="text-left p-4">Room</th>
                  <th className="text-left p-4">Type</th>
                  <th className="text-left p-4">Location</th>
                  <th className="text-right p-4">Price</th>
                  <th className="text-right p-4">Rating</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rooms.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="p-4 flex items-center gap-3">
                      <img src={r.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <span className="font-medium">{r.hotelName}</span>
                    </td>
                    <td className="p-4 text-slate-600">{r.type}</td>
                    <td className="p-4 text-slate-600">{r.city}, {r.country}</td>
                    <td className="p-4 text-right font-semibold">${r.pricePerNight}</td>
                    <td className="p-4 text-right">{r.rating.toFixed(1)} ★</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setEditing(r)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"><FiEdit2 size={14} /></button>
                        <button onClick={() => deleteRoom(r.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600"><FiTrash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'bookings' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="text-left p-4">ID</th>
                <th className="text-left p-4">Guest</th>
                <th className="text-left p-4">Hotel</th>
                <th className="text-left p-4">Dates</th>
                <th className="text-right p-4">Total</th>
                <th className="text-center p-4">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.length === 0 ? (
                <tr><td colSpan="7" className="p-10 text-center text-slate-500">No bookings yet.</td></tr>
              ) : bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="p-4 font-mono text-xs">{b.id.slice(0, 8).toUpperCase()}</td>
                  <td className="p-4 font-medium">{b.userName}</td>
                  <td className="p-4 text-slate-600">{b.hotelName}</td>
                  <td className="p-4 text-slate-600 text-xs">{new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}</td>
                  <td className="p-4 text-right font-semibold">${b.total}</td>
                  <td className="p-4 text-center">
                    <span className={`badge ${b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{b.status}</span>
                  </td>
                  <td className="p-4 text-right">
                    {b.status === 'confirmed' && (
                      <button onClick={() => cancelBooking(b.id)} className="text-xs text-red-600 hover:underline font-semibold">Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'offers' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setAddingOffer(true)} className="btn-primary"><FiPlus /> Add offer</button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.map((o) => (
              <div key={o.id} className="card p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold">{o.title}</h3>
                  <button onClick={() => deleteOffer(o.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600"><FiTrash2 size={14} /></button>
                </div>
                <p className="text-sm text-slate-500 mb-3">{o.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-mono font-bold">{o.code}</span>
                  <span className="badge bg-brand-50 text-brand-700">-{o.discount}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(adding || editing) && (
        <RoomFormModal
          room={editing}
          onClose={() => { setAdding(false); setEditing(null); }}
          onSave={onSaveRoom}
        />
      )}
      {addingOffer && (
        <OfferFormModal
          onClose={() => setAddingOffer(false)}
          onSave={(o) => { setOffers((os) => [o, ...os]); setAddingOffer(false); toast.success('Offer created'); }}
        />
      )}
    </div>
  );
};

export default Admin;
