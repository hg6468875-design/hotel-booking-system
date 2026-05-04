import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiTag, FiCopy, FiCalendar } from 'react-icons/fi';
import api from '../services/api';
import Loader from '../components/Loader';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/offers')
      .then((r) => setOffers(Array.isArray(r.data) ? r.data : []))
      .catch(() => setOffers([]))
      .finally(() => setLoading(false));
  }, []);

  const copy = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied ${code}`);
  };

  return (
    <div>
      <div className="bg-gradient-to-br from-pink-500 via-brand-600 to-brand-800 text-white">
        <div className="section py-16 text-center">
          <span className="badge bg-white/15 border border-white/20 mb-3">Limited time deals</span>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-3">Exclusive offers, just for you.</h1>
          <p className="text-white/80 max-w-2xl mx-auto">Save big on dream stays — discover hand-curated deals updated weekly.</p>
        </div>
      </div>

      <div className="section py-12">
        {loading ? (
          <Loader />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((o, i) => (
              <div
                key={o.id}
                style={{ animationDelay: `${i * 80}ms` }}
                className="card overflow-hidden group hover:shadow-glow transition animate-slide-up"
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={o.image} alt={o.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                  <div className="absolute top-3 right-3 badge bg-white text-brand-700 font-bold text-sm">
                    -{o.discount}%
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-display text-xl font-bold text-white">{o.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-slate-600 mb-4">{o.description}</p>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs text-slate-400 flex items-center gap-1"><FiTag size={12} /> Code</p>
                      <p className="font-mono font-bold tracking-wider">{o.code}</p>
                    </div>
                    <button onClick={() => copy(o.code)} className="btn-outline text-sm py-2">
                      <FiCopy size={14} /> Copy
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                    <FiCalendar size={12} /> Valid till {new Date(o.validTill).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;
