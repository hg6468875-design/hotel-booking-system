import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMapPin, FiStar, FiUsers, FiHeart, FiCheck, FiArrowLeft } from 'react-icons/fi';
import api from '../services/api';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const today = () => new Date().toISOString().split('T')[0];
const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [checkIn, setCheckIn] = useState(today());
  const [checkOut, setCheckOut] = useState(tomorrow());
  const [guests, setGuests] = useState(2);
  const [favorited, setFavorited] = useState(false);

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/rooms/${id}`)
      .then((r) => setRoom(r.data))
      .catch(() => toast.error('Room not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const nights = Math.max(
    1,
    Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000)
  );
  const total = room ? nights * room.pricePerNight : 0;

  const handleBook = () => {
    if (!user) {
      toast.error('Please sign in to book');
      navigate('/login', { state: { from: { pathname: `/rooms/${id}` } } });
      return;
    }
    navigate('/booking', {
      state: { room, checkIn, checkOut, guests, nights },
    });
  };

  const toggleFav = async () => {
    if (!user) return toast.error('Sign in to save favorites');
    try {
      await api.post(`/favorites/${id}`);
      setFavorited((v) => !v);
      toast.success(favorited ? 'Removed from favorites' : 'Saved to favorites');
    } catch {
      toast.error('Could not update favorites');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Sign in to leave a review');
    if (!reviewForm.comment.trim()) return toast.error('Comment required');
    try {
      setSubmittingReview(true);
      const { data } = await api.post('/reviews', {
        roomId: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setRoom((r) => ({ ...r, reviews: [data, ...(r.reviews || [])] }));
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review posted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loader />;
  if (!room) return null;

  return (
    <div className="section py-8">
      <Link to="/rooms" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-brand-600 mb-4 font-medium">
        <FiArrowLeft size={14} /> Back to rooms
      </Link>

      <div className="grid md:grid-cols-[2fr_1fr] gap-3 mb-8">
        <div className="rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[16/10]">
          <img src={room.images[activeImg]} alt={room.type} className="w-full h-full object-cover" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
          {room.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`rounded-2xl overflow-hidden aspect-[4/3] md:aspect-auto md:h-[calc((100%-1rem)/2)] ${
                activeImg === i ? 'ring-4 ring-brand-500' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-10">
        <div>
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="badge bg-brand-50 text-brand-700 mb-2">{room.type}</span>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{room.hotelName}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1"><FiMapPin size={14} /> {room.city}, {room.country}</span>
                <span className="flex items-center gap-1"><FiStar size={14} className="text-gold-500 fill-current" /> {room.rating.toFixed(1)} · {room.reviews?.length || 0} reviews</span>
              </div>
            </div>
            <button onClick={toggleFav} className={`p-3 rounded-full border ${favorited ? 'bg-red-50 border-red-200 text-red-500' : 'border-slate-200 text-slate-500 hover:text-red-500'} transition`}>
              <FiHeart size={18} className={favorited ? 'fill-current' : ''} />
            </button>
          </div>

          <div className="flex flex-wrap gap-3 my-6">
            <div className="chip"><FiUsers size={12} /> {room.maxGuests} guests</div>
            <div className="chip">{room.size}m²</div>
            <div className="chip">{room.beds}</div>
          </div>

          <div className="card p-6 mb-6">
            <h2 className="text-xl font-bold mb-3">About this room</h2>
            <p className="text-slate-600 leading-relaxed">{room.description}</p>
          </div>

          <div className="card p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">What this room offers</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {room.amenities.map((a) => (
                <div key={a} className="flex items-center gap-2 text-sm">
                  <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
                    <FiCheck size={14} />
                  </div>
                  {a}
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Guest reviews</h2>

            {user && (
              <form onSubmit={submitReview} className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                <p className="text-sm font-medium mb-2">Share your experience</p>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setReviewForm((f) => ({ ...f, rating: n }))}
                      className={`text-2xl transition ${n <= reviewForm.rating ? 'text-gold-500' : 'text-slate-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  rows="3"
                  className="input mb-3"
                  placeholder="Tell others about your stay..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                />
                <button type="submit" disabled={submittingReview} className="btn-primary text-sm">
                  {submittingReview ? 'Posting…' : 'Post review'}
                </button>
              </form>
            )}

            {(!room.reviews || room.reviews.length === 0) ? (
              <p className="text-sm text-slate-500">No reviews yet — be the first to share your experience.</p>
            ) : (
              <div className="space-y-5">
                {room.reviews.map((r) => (
                  <div key={r.id} className="flex gap-3 pb-5 border-b border-slate-100 last:border-0">
                    <img src={r.avatar} alt={r.userName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{r.userName}</p>
                        <p className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-0.5 my-1">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} size={12} className={i < r.rating ? 'text-gold-500 fill-current' : 'text-slate-300'} />
                        ))}
                      </div>
                      <p className="text-sm text-slate-600">{r.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Booking widget */}
        <div>
          <div className="card p-6 sticky top-24">
            <div className="flex items-baseline gap-1 mb-5">
              <span className="text-3xl font-bold">${room.pricePerNight}</span>
              <span className="text-slate-500">/ night</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="label">Check-in</label>
                <input type="date" min={today()} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="input py-2 text-sm" />
              </div>
              <div>
                <label className="label">Check-out</label>
                <input type="date" min={checkIn} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="input py-2 text-sm" />
              </div>
            </div>

            <div className="mb-4">
              <label className="label">Guests</label>
              <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="input py-2 text-sm">
                {[...Array(room.maxGuests)].map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1} {i === 0 ? 'guest' : 'guests'}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 text-sm border-t border-slate-100 pt-4 mb-4">
              <div className="flex justify-between text-slate-600">
                <span>${room.pricePerNight} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                <span>${total}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-100">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>

            <button onClick={handleBook} className="btn-primary w-full">
              Reserve now
            </button>
            <p className="text-xs text-slate-500 text-center mt-3">You won't be charged until confirmed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
