import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiSliders } from 'react-icons/fi';
import api from '../services/api';
import RoomCard from '../components/RoomCard';
import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';

const TYPES = ['Deluxe', 'Premium', 'Family', 'Presidential', 'Garden', 'Ocean'];
const AMENITIES = ['Free WiFi', 'Pool Access', 'Spa & Wellness', 'Free Breakfast', 'Pet Friendly', 'Balcony', 'Ocean View'];

const Rooms = () => {
  const [params] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState('recommended');

  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
    types: [],
    amenities: [],
    rating: 0,
  });

  const q = params.get('q') || '';
  const guests = params.get('guests');

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (q) qs.set('q', q);
    if (guests) qs.set('guests', guests);
    api
      .get(`/rooms?${qs.toString()}`)
      .then((r) => setRooms(r.data))
      .finally(() => setLoading(false));
  }, [q, guests]);

  const filtered = useMemo(() => {
    let list = rooms.filter((r) => {
      if (r.pricePerNight < filters.minPrice || r.pricePerNight > filters.maxPrice) return false;
      if (filters.types.length && !filters.types.some((t) => r.type.toLowerCase().includes(t.toLowerCase()))) return false;
      if (filters.amenities.length && !filters.amenities.every((a) => r.amenities.includes(a))) return false;
      if (filters.rating && r.rating < filters.rating) return false;
      return true;
    });
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.pricePerNight - b.pricePerNight);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.pricePerNight - a.pricePerNight);
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [rooms, filters, sort]);

  const toggleArr = (key, val) => {
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter((v) => v !== val) : [...f[key], val],
    }));
  };

  const reset = () =>
    setFilters({ minPrice: 0, maxPrice: 1000, types: [], amenities: [], rating: 0 });

  return (
    <div>
      <div className="bg-gradient-to-br from-slate-900 via-brand-900 to-brand-700 text-white">
        <div className="section py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Find your perfect stay</h1>
          <p className="text-slate-300 mb-6">{rooms.length} rooms across our curated portfolio</p>
          <SearchBar embedded />
        </div>
      </div>

      <div className="section py-8 grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Filters Sidebar */}
        <aside className={`${showFilters ? 'block fixed inset-0 z-50 bg-black/50 lg:bg-transparent lg:relative lg:inset-auto lg:z-auto' : 'hidden'} lg:block`}>
          <div className={`${showFilters ? 'absolute right-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white p-6 overflow-y-auto lg:static lg:w-auto lg:p-0' : ''}`}>
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <FiX size={20} />
              </button>
            </div>

            <div className="card p-5 space-y-6 lg:sticky lg:top-24">
              <div className="flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2"><FiSliders size={16} /> Filters</h3>
                <button onClick={reset} className="text-xs text-brand-600 font-semibold hover:underline">Reset</button>
              </div>

              <div>
                <label className="label">Price per night</label>
                <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                  <span>${filters.minPrice}</span>
                  <span>${filters.maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))}
                  className="w-full accent-brand-600"
                />
              </div>

              <div>
                <label className="label">Room type</label>
                <div className="space-y-2">
                  {TYPES.map((t) => (
                    <label key={t} className="flex items-center gap-2 text-sm cursor-pointer hover:text-brand-600 transition">
                      <input
                        type="checkbox"
                        checked={filters.types.includes(t)}
                        onChange={() => toggleArr('types', t)}
                        className="w-4 h-4 accent-brand-600 rounded"
                      />
                      {t}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Amenities</label>
                <div className="space-y-2">
                  {AMENITIES.map((a) => (
                    <label key={a} className="flex items-center gap-2 text-sm cursor-pointer hover:text-brand-600 transition">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(a)}
                        onChange={() => toggleArr('amenities', a)}
                        className="w-4 h-4 accent-brand-600 rounded"
                      />
                      {a}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Minimum rating</label>
                <div className="flex gap-2">
                  {[0, 3, 4, 4.5].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFilters((f) => ({ ...f, rating: r }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        filters.rating === r ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {r === 0 ? 'Any' : `${r}+ ★`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-600">
              <span className="font-bold text-slate-900">{filtered.length}</span> rooms found
              {q && <> for "<span className="font-medium">{q}</span>"</>}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowFilters(true)} className="btn-outline text-sm py-2 lg:hidden">
                <FiFilter size={14} /> Filters
              </button>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="input py-2 text-sm w-auto">
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="rating">Top rated</option>
              </select>
            </div>
          </div>

          {loading ? (
            <Loader label="Loading rooms" />
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 card">
              <p className="text-2xl mb-2">🏝️</p>
              <h3 className="font-bold text-lg mb-2">No rooms match your filters</h3>
              <p className="text-slate-500 mb-4">Try adjusting your filters or search criteria.</p>
              <button onClick={reset} className="btn-primary">Reset filters</button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((r, i) => <RoomCard key={r.id} room={r} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rooms;
