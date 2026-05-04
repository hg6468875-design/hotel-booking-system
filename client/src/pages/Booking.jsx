import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiCreditCard, FiLock, FiTag } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Booking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!state?.room) navigate('/rooms', { replace: true });
  }, [state, navigate]);

  const room = state?.room;
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    specialRequest: '',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    couponCode: '',
  });
  const [coupon, setCoupon] = useState(null);
  const [step, setStep] = useState(1);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  const nights = state?.nights || 1;
  const subtotal = useMemo(() => (room ? room.pricePerNight * nights : 0), [room, nights]);
  const discount = coupon ? coupon.discount : 0;
  const total = Math.max(0, subtotal - discount);

  const applyCoupon = async () => {
    if (!form.couponCode.trim()) return;
    try {
      const { data } = await api.post('/offers/validate', { code: form.couponCode, total: subtotal });
      setCoupon(data);
      toast.success(`Code applied: ${data.offer.discount}% off`);
    } catch (err) {
      setCoupon(null);
      toast.error(err.response?.data?.message || 'Invalid code');
    }
  };

  const handleConfirm = async () => {
    if (step === 1) {
      if (!form.name || !form.email || !form.phone) return toast.error('Fill in all guest details');
      setStep(2);
      return;
    }
    if (form.paymentMethod === 'card') {
      if (!form.cardNumber || !form.cardExpiry || !form.cardCvv) return toast.error('Enter payment details');
    }
    setConfirming(true);
    try {
      await api.post('/payments/checkout', { amount: total });
      const { data } = await api.post('/bookings', {
        roomId: room.id,
        checkIn: state.checkIn,
        checkOut: state.checkOut,
        guests: state.guests,
        contact: { name: form.name, email: form.email, phone: form.phone },
        specialRequest: form.specialRequest,
        couponCode: coupon?.offer?.code,
      });
      setConfirmed(data);
      setStep(3);
      toast.success('Booking confirmed!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setConfirming(false);
    }
  };

  if (!room) return null;

  return (
    <div className="section py-10">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 mb-10 text-sm">
        {['Guest details', 'Payment', 'Confirmation'].map((label, i) => (
          <div key={i} className="flex items-center">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                step > i + 1 ? 'bg-emerald-50 text-emerald-600' : step === i + 1 ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-white/20' : 'bg-white'
              }`}>
                {step > i + 1 ? <FiCheckCircle size={14} /> : i + 1}
              </span>
              <span className="font-medium hidden sm:inline">{label}</span>
            </div>
            {i < 2 && <div className={`w-8 h-0.5 mx-1 ${step > i + 1 ? 'bg-emerald-300' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        <div>
          {step === 1 && (
            <div className="card p-6 animate-slide-up">
              <h2 className="text-xl font-bold mb-5">Guest information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full name *</label>
                  <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Phone *</label>
                  <input className="input" placeholder="+1 555 123 4567" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Special requests <span className="text-slate-400">(optional)</span></label>
                  <textarea rows="3" className="input" placeholder="Late check-in, dietary preferences, etc."
                    value={form.specialRequest} onChange={(e) => setForm({ ...form, specialRequest: e.target.value })} />
                </div>
              </div>
              <button onClick={handleConfirm} className="btn-primary w-full mt-6">
                Continue to payment
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="card p-6 animate-slide-up">
              <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                <FiLock className="text-emerald-500" /> Secure payment
              </h2>

              <div className="grid grid-cols-3 gap-2 mb-6">
                {[
                  { id: 'card', label: 'Card', icon: FiCreditCard },
                  { id: 'upi', label: 'UPI', icon: () => <span className="font-bold">U</span> },
                  { id: 'wallet', label: 'Wallet', icon: () => <span className="font-bold">W</span> },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setForm({ ...form, paymentMethod: m.id })}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition ${
                      form.paymentMethod === m.id ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <m.icon size={20} />
                    <span className="text-xs font-semibold">{m.label}</span>
                  </button>
                ))}
              </div>

              {form.paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="label">Card number</label>
                    <input
                      className="input"
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      value={form.cardNumber}
                      onChange={(e) => setForm({ ...form, cardNumber: e.target.value.replace(/(.{4})/g, '$1 ').trim() })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Expiry</label>
                      <input className="input" placeholder="MM/YY" maxLength={5}
                        value={form.cardExpiry} onChange={(e) => setForm({ ...form, cardExpiry: e.target.value })} />
                    </div>
                    <div>
                      <label className="label">CVV</label>
                      <input className="input" placeholder="123" maxLength={4} type="password"
                        value={form.cardCvv} onChange={(e) => setForm({ ...form, cardCvv: e.target.value })} />
                    </div>
                  </div>
                </div>
              )}
              {form.paymentMethod === 'upi' && (
                <div>
                  <label className="label">UPI ID</label>
                  <input className="input" placeholder="yourname@bank" />
                </div>
              )}
              {form.paymentMethod === 'wallet' && (
                <p className="text-sm text-slate-500">You will be redirected to your wallet provider after confirmation.</p>
              )}

              <p className="text-xs text-slate-500 flex items-center gap-1 mt-4">
                <FiLock size={12} /> Payments are mocked for demo — no real charges.
              </p>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="btn-outline flex-1">Back</button>
                <button onClick={handleConfirm} disabled={confirming} className="btn-primary flex-1">
                  {confirming ? 'Processing…' : `Pay $${total}`}
                </button>
              </div>
            </div>
          )}

          {step === 3 && confirmed && (
            <div className="card p-8 text-center animate-fade-in">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5">
                <FiCheckCircle size={40} />
              </div>
              <h2 className="text-3xl font-bold mb-2">Booking confirmed!</h2>
              <p className="text-slate-500 mb-6">A confirmation has been sent to {confirmed.contact?.email}.</p>
              <div className="bg-slate-50 rounded-xl p-5 text-left max-w-md mx-auto space-y-2 text-sm border border-slate-100">
                <div className="flex justify-between"><span className="text-slate-500">Booking ID</span><span className="font-mono font-semibold">{confirmed.id.slice(0, 8).toUpperCase()}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Hotel</span><span className="font-medium">{confirmed.hotelName}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Check-in</span><span className="font-medium">{new Date(confirmed.checkIn).toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Check-out</span><span className="font-medium">{new Date(confirmed.checkOut).toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Guests</span><span className="font-medium">{confirmed.guests}</span></div>
                <div className="flex justify-between border-t border-slate-200 pt-2"><span className="text-slate-500">Total paid</span><span className="font-bold text-base">${confirmed.total}</span></div>
              </div>
              <div className="flex gap-3 justify-center mt-6">
                <Link to="/my-bookings" className="btn-primary">View my bookings</Link>
                <Link to="/rooms" className="btn-outline">Book another</Link>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <aside>
          <div className="card overflow-hidden sticky top-24">
            <img src={room.images[0]} alt={room.type} className="w-full aspect-video object-cover" />
            <div className="p-5">
              <h3 className="font-bold text-lg">{room.hotelName}</h3>
              <p className="text-sm text-slate-500 mb-1">{room.type}</p>
              <p className="text-xs text-slate-400 mb-4">{room.city}, {room.country}</p>

              <div className="space-y-2 text-sm border-t border-slate-100 pt-4">
                <div className="flex justify-between"><span className="text-slate-500">Check-in</span><span>{new Date(state.checkIn).toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Check-out</span><span>{new Date(state.checkOut).toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Guests</span><span>{state.guests}</span></div>
              </div>

              {step !== 3 && (
                <div className="border-t border-slate-100 mt-4 pt-4">
                  <label className="label flex items-center gap-1"><FiTag size={12} /> Promo code</label>
                  <div className="flex gap-2">
                    <input className="input py-2 text-sm" placeholder="Enter code" value={form.couponCode} onChange={(e) => setForm({ ...form, couponCode: e.target.value })} />
                    <button onClick={applyCoupon} type="button" className="btn-outline text-sm py-2">Apply</button>
                  </div>
                  {coupon && <p className="text-xs text-emerald-600 mt-2 font-medium">✓ {coupon.offer.code} applied — ${discount} off</p>}
                </div>
              )}

              <div className="border-t border-slate-100 mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>${room.pricePerNight} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                  <span>${subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon discount</span>
                    <span>-${discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-100">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Booking;
