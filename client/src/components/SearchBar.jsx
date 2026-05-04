import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiUsers, FiSearch } from 'react-icons/fi';

const today = () => new Date().toISOString().split('T')[0];
const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

const SearchBar = ({ embedded = false }) => {
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState(today());
  const [checkOut, setCheckOut] = useState(tomorrow());
  const [guests, setGuests] = useState(2);
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (city) qs.set('q', city);
    if (checkIn) qs.set('checkIn', checkIn);
    if (checkOut) qs.set('checkOut', checkOut);
    if (guests) qs.set('guests', guests);
    navigate(`/rooms?${qs.toString()}`);
  };

  return (
    <form
      onSubmit={submit}
      className={`grid md:grid-cols-[1.3fr_1fr_1fr_0.7fr_auto] gap-2 p-2 ${
        embedded ? 'bg-white text-slate-900 rounded-2xl shadow-soft border border-slate-100' : 'glass rounded-2xl shadow-2xl'
      }`}
    >
      <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition">
        <FiMapPin className="text-brand-500 shrink-0" size={20} />
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-700">Destination</label>
          <input
            type="text"
            placeholder="Where to?"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-transparent outline-none text-sm placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition">
        <FiCalendar className="text-brand-500 shrink-0" size={20} />
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-700">Check-in</label>
          <input
            type="date"
            min={today()}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition">
        <FiCalendar className="text-brand-500 shrink-0" size={20} />
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-700">Check-out</label>
          <input
            type="date"
            min={checkIn}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition">
        <FiUsers className="text-brand-500 shrink-0" size={20} />
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-700">Guests</label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full bg-transparent outline-none text-sm"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" className="btn-primary px-6">
        <FiSearch size={18} /> <span className="hidden md:inline">Search</span>
      </button>
    </form>
  );
};

export default SearchBar;
