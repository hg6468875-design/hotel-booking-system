import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiAward, FiShield, FiHeadphones, FiTrendingUp, FiStar } from 'react-icons/fi';
import api from '../services/api';
import SearchBar from '../components/SearchBar';
import RoomCard from '../components/RoomCard';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    api.get('/rooms')
      .then((r) => setRooms(Array.isArray(r.data) ? r.data.slice(0, 6) : []))
      .catch(() => setRooms([]));
    api.get('/hotels')
      .then((r) => setHotels(Array.isArray(r.data) ? r.data : []))
      .catch(() => setHotels([]));
    api.get('/offers')
      .then((r) => setOffers(Array.isArray(r.data) ? r.data : []))
      .catch(() => setOffers([]));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=80"
            alt="luxury hotel"
            className="w-full h-full object-cover opacity-70"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
        </div>
        <div className="relative section py-24 md:py-36">
          <div className="max-w-2xl text-white animate-fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-medium mb-6">
              <FiAward size={14} /> Awarded Best Boutique Stay 2025
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] mb-6 font-display">
              Where every stay <br />
              <span className="bg-gradient-to-r from-gold-400 to-pink-400 bg-clip-text text-transparent">becomes a memory.</span>
            </h1>
            <p className="text-lg text-slate-200 mb-8 max-w-lg leading-relaxed">
              Hand-picked hotels in the world's most extraordinary destinations.
              Real-time availability, transparent pricing, instant confirmation.
            </p>
            <div className="flex gap-3">
              <Link to="/rooms" className="btn-primary">
                Explore Rooms <FiArrowRight />
              </Link>
              <Link to="/offers" className="btn-outline bg-white/10 border-white/30 text-white hover:bg-white hover:text-brand-700">
                View Offers
              </Link>
            </div>
          </div>
        </div>
        <div className="relative section -mt-12 pb-12">
          <SearchBar />
        </div>
      </section>

      {/* FEATURES STRIP */}
      <section className="section py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: FiShield, title: 'Secure Payments', desc: 'Bank-grade encryption' },
          { icon: FiAward, title: 'Award-winning', desc: '500+ luxury partners' },
          { icon: FiHeadphones, title: '24/7 Support', desc: 'Always here for you' },
          { icon: FiTrendingUp, title: 'Best Price', desc: 'Guaranteed lowest rates' },
        ].map((f, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
              <f.icon size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-sm">{f.title}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* DESTINATIONS */}
      <section className="section py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-600 text-sm font-semibold uppercase tracking-wider mb-2">Destinations</p>
            <h2 className="text-3xl md:text-4xl font-bold">Iconic places, unforgettable stays.</h2>
          </div>
          <Link to="/rooms" className="text-brand-600 text-sm font-semibold hidden md:flex items-center gap-1 hover:gap-2 transition-all">
            View all <FiArrowRight />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {hotels.map((h, i) => (
            <Link
              key={h.id}
              to={`/rooms?q=${encodeURIComponent(h.city)}`}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-soft hover:shadow-glow transition animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <img src={h.image} alt={h.city} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <div className="flex items-center gap-1 text-xs mb-1">
                  <FiStar className="text-gold-400 fill-current" size={12} />
                  <span className="opacity-90">{h.rating}</span>
                </div>
                <h3 className="font-display text-xl font-bold">{h.city}</h3>
                <p className="text-sm opacity-80">{h.country}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED ROOMS */}
      <section className="section py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-600 text-sm font-semibold uppercase tracking-wider mb-2">Featured Stays</p>
            <h2 className="text-3xl md:text-4xl font-bold">Handpicked rooms loved by guests.</h2>
          </div>
          <Link to="/rooms" className="text-brand-600 text-sm font-semibold hidden md:flex items-center gap-1 hover:gap-2 transition-all">
            View all rooms <FiArrowRight />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((r, i) => <RoomCard key={r.id} room={r} index={i} />)}
        </div>
      </section>

      {/* OFFER BANNER */}
      {offers[0] && (
        <section className="section py-10">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-pink-500 text-white">
            <div className="absolute inset-0 opacity-20">
              <img src={offers[0].image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative grid md:grid-cols-2 gap-8 p-10 md:p-16 items-center">
              <div>
                <span className="badge bg-white/20 text-white border border-white/20 mb-3">
                  Limited time
                </span>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">{offers[0].title}</h2>
                <p className="text-white/90 mb-6 text-lg">{offers[0].description}</p>
                <div className="flex flex-wrap gap-3 items-center">
                  <span className="px-4 py-2 rounded-xl bg-white text-brand-700 font-bold tracking-wider">
                    Code: {offers[0].code}
                  </span>
                  <Link to="/offers" className="btn bg-white/10 backdrop-blur border border-white/30 text-white hover:bg-white hover:text-brand-700">
                    See all offers <FiArrowRight />
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-9xl font-black opacity-20 text-right">-{offers[0].discount}%</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="section py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-brand-600 text-sm font-semibold uppercase tracking-wider mb-2">Loved by travelers</p>
          <h2 className="text-3xl md:text-4xl font-bold">From our guests around the world.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: 'Ananya Iyer',
              role: 'Travel Blogger',
              avatar: 'https://ui-avatars.com/api/?name=Ananya+Iyer&background=8b5cf6&color=fff&size=150&bold=true',
              quote: 'The booking experience was effortless and the property exceeded every expectation. Will definitely return!',
            },
            {
              name: 'Rohan Mehta',
              role: 'Architect',
              avatar: 'https://ui-avatars.com/api/?name=Rohan+Mehta&background=ec4899&color=fff&size=150&bold=true',
              quote: 'StayLuxe found us a hidden gem in Kyoto. Outstanding curation and seamless service throughout.',
            },
            {
              name: 'Priya Sharma',
              role: 'Photographer',
              avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=f59e0b&color=fff&size=150&bold=true',
              quote: 'Real photos, accurate descriptions, transparent prices. This is how travel platforms should work.',
            },
          ].map((t, i) => (
            <div key={i} className="card p-6 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-center gap-1 text-gold-500 mb-4">
                {[...Array(5)].map((_, j) => <FiStar key={j} className="fill-current" size={16} />)}
              </div>
              <p className="text-slate-700 leading-relaxed mb-5">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
