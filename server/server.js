import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

import { seedData } from './data/seed.js';
import { authRequired, adminRequired, JWT_SECRET } from './middleware/auth.js';

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length === 0 ? true : allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));

const db = seedData();

const sanitizeUser = (u) => {
  if (!u) return null;
  const { password, ...rest } = u;
  return rest;
};

const nightsBetween = (a, b) => {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(1, Math.round(ms / 86400000));
};

// ===== Payment helpers =====
const luhn = (digits) => {
  if (!/^\d{12,19}$/.test(digits)) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};

const isFutureExpiry = (expiry) => {
  const m = /^(\d{2})\/(\d{2})$/.exec((expiry || '').trim());
  if (!m) return false;
  const month = parseInt(m[1], 10);
  const year = 2000 + parseInt(m[2], 10);
  if (month < 1 || month > 12) return false;
  const exp = new Date(year, month, 0, 23, 59, 59);
  return exp >= new Date();
};

const validatePayment = (payload) => {
  const errors = {};
  const { method, amount, card, upiId } = payload || {};
  if (!Number.isFinite(amount) || amount < 0) errors.amount = 'Invalid amount';
  if (!['card', 'upi', 'wallet'].includes(method)) errors.method = 'Unsupported payment method';
  if (method === 'card') {
    if (!card) {
      errors.card = 'Card details required';
    } else {
      const number = String(card.number || '').replace(/\D/g, '');
      if (!card.name || !String(card.name).trim()) errors.cardName = 'Name on card is required';
      if (!luhn(number)) errors.cardNumber = 'Invalid card number';
      if (!isFutureExpiry(card.expiry)) errors.cardExpiry = 'Card is expired or expiry is invalid';
      if (!/^\d{3,4}$/.test(String(card.cvv || ''))) errors.cardCvv = 'CVV must be 3 or 4 digits';
    }
  } else if (method === 'upi') {
    if (!/^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/.test(String(upiId || '').trim())) {
      errors.upiId = 'Invalid UPI ID';
    }
  }
  return errors;
};

const last4 = (digits) => String(digits || '').slice(-4);

const hasOverlap = (roomId, checkIn, checkOut) => {
  return db.bookings.some((b) => {
    if (b.roomId !== roomId) return false;
    if (b.status === 'cancelled') return false;
    const inA = new Date(checkIn).getTime();
    const outA = new Date(checkOut).getTime();
    const inB = new Date(b.checkIn).getTime();
    const outB = new Date(b.checkOut).getTime();
    return inA < outB && inB < outA;
  });
};

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// ===== Auth =====
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  const errors = {};
  if (!name || !String(name).trim()) errors.name = 'Name is required';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email))) errors.email = 'Enter a valid email';
  if (!password || String(password).length < 6) errors.password = 'Password must be at least 6 characters';
  if (Object.keys(errors).length) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  if (db.users.some((u) => u.email === email.toLowerCase())) {
    return res.status(409).json({ message: 'Email already registered', errors: { email: 'Email already registered' } });
  }
  const user = {
    id: uuid(),
    name,
    email: email.toLowerCase(),
    password: bcrypt.hashSync(password, 8),
    role: 'user',
    avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: sanitizeUser(user) });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = db.users.find((u) => u.email === (email || '').toLowerCase());
  if (!user || !bcrypt.compareSync(password || '', user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: sanitizeUser(user) });
});

app.get('/api/auth/me', authRequired, (req, res) => {
  const user = db.users.find((u) => u.id === req.user.id);
  res.json({ user: sanitizeUser(user) });
});

app.put('/api/auth/me', authRequired, (req, res) => {
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { name, avatar } = req.body || {};
  if (name) user.name = name;
  if (avatar) user.avatar = avatar;
  res.json({ user: sanitizeUser(user) });
});

// ===== Hotels & Rooms =====
app.get('/api/hotels', (_req, res) => res.json(db.hotels));

app.get('/api/rooms', (req, res) => {
  const { city, guests, minPrice, maxPrice, type, amenities, rating, q } = req.query;
  let rooms = [...db.rooms];

  if (q) {
    const ql = q.toString().toLowerCase();
    rooms = rooms.filter(
      (r) =>
        r.hotelName.toLowerCase().includes(ql) ||
        r.city.toLowerCase().includes(ql) ||
        r.country.toLowerCase().includes(ql) ||
        r.type.toLowerCase().includes(ql)
    );
  }
  if (city) rooms = rooms.filter((r) => r.city.toLowerCase() === city.toString().toLowerCase());
  if (guests) rooms = rooms.filter((r) => r.maxGuests >= Number(guests));
  if (minPrice) rooms = rooms.filter((r) => r.pricePerNight >= Number(minPrice));
  if (maxPrice) rooms = rooms.filter((r) => r.pricePerNight <= Number(maxPrice));
  if (type) {
    const types = type.toString().split(',');
    rooms = rooms.filter((r) => types.some((t) => r.type.toLowerCase().includes(t.toLowerCase())));
  }
  if (amenities) {
    const list = amenities.toString().split(',');
    rooms = rooms.filter((r) => list.every((a) => r.amenities.includes(a)));
  }
  if (rating) rooms = rooms.filter((r) => r.rating >= Number(rating));

  res.json(rooms);
});

app.get('/api/rooms/:id', (req, res) => {
  const room = db.rooms.find((r) => r.id === req.params.id);
  if (!room) return res.status(404).json({ message: 'Room not found' });
  const reviews = db.reviews.filter((rv) => rv.roomId === room.id);
  res.json({ ...room, reviews });
});

app.post('/api/rooms', authRequired, adminRequired, (req, res) => {
  const room = { id: uuid(), ...req.body, available: true };
  db.rooms.push(room);
  res.status(201).json(room);
});

app.put('/api/rooms/:id', authRequired, adminRequired, (req, res) => {
  const idx = db.rooms.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Room not found' });
  db.rooms[idx] = { ...db.rooms[idx], ...req.body };
  res.json(db.rooms[idx]);
});

app.delete('/api/rooms/:id', authRequired, adminRequired, (req, res) => {
  const idx = db.rooms.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Room not found' });
  db.rooms.splice(idx, 1);
  res.json({ ok: true });
});

// ===== Bookings =====
app.post('/api/bookings', authRequired, (req, res) => {
  const { roomId, checkIn, checkOut, guests, contact, specialRequest, couponCode, paymentId, paymentMethod } = req.body || {};
  const room = db.rooms.find((r) => r.id === roomId);
  if (!room) return res.status(404).json({ message: 'Room not found' });
  if (!checkIn || !checkOut) return res.status(400).json({ message: 'Dates required' });
  if (new Date(checkIn) >= new Date(checkOut)) {
    return res.status(400).json({ message: 'Check-out must be after check-in' });
  }
  if (hasOverlap(roomId, checkIn, checkOut)) {
    return res.status(409).json({ message: 'Room is not available for the selected dates' });
  }
  if (!contact?.name || !contact?.email) {
    return res.status(400).json({ message: 'Guest name and email are required' });
  }

  const payment = (db.payments || []).find((p) => p.paymentId === paymentId);
  if (!payment || payment.userId !== req.user.id || payment.status !== 'succeeded') {
    return res.status(402).json({ message: 'Payment is required before booking' });
  }

  const nights = nightsBetween(checkIn, checkOut);
  let total = nights * room.pricePerNight;
  let discount = 0;
  let appliedCode = null;
  if (couponCode) {
    const offer = db.offers.find((o) => o.code.toLowerCase() === couponCode.toLowerCase());
    if (offer) {
      discount = Math.round(total * (offer.discount / 100));
      total = total - discount;
      appliedCode = offer.code;
    }
  }
  const booking = {
    id: uuid(),
    userId: req.user.id,
    userName: db.users.find((u) => u.id === req.user.id)?.name,
    roomId,
    roomType: room.type,
    hotelName: room.hotelName,
    image: room.images[0],
    city: room.city,
    checkIn,
    checkOut,
    nights,
    guests: guests || 1,
    contact: contact || {},
    specialRequest: specialRequest || '',
    pricePerNight: room.pricePerNight,
    discount,
    couponCode: appliedCode,
    total,
    paymentId,
    paymentMethod: paymentMethod || payment.method,
    paymentLast4: payment.last4,
    paymentStatus: 'paid',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  db.bookings.push(booking);
  res.status(201).json(booking);
});

app.get('/api/bookings', authRequired, (req, res) => {
  const list = db.bookings
    .filter((b) => b.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(list);
});

app.get('/api/bookings/all', authRequired, adminRequired, (_req, res) => {
  res.json([...db.bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.put('/api/bookings/:id/cancel', authRequired, (req, res) => {
  const booking = db.bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  if (booking.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  booking.status = 'cancelled';
  booking.paymentStatus = 'refunded';
  res.json(booking);
});

// ===== Reviews =====
app.get('/api/reviews/:roomId', (req, res) => {
  const reviews = db.reviews
    .filter((r) => r.roomId === req.params.roomId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(reviews);
});

app.post('/api/reviews', authRequired, (req, res) => {
  const { roomId, rating, comment } = req.body || {};
  if (!roomId || !rating || !comment) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const user = db.users.find((u) => u.id === req.user.id);
  const review = {
    id: uuid(),
    roomId,
    userId: req.user.id,
    userName: user.name,
    avatar: user.avatar,
    rating: Number(rating),
    comment,
    createdAt: new Date().toISOString(),
  };
  db.reviews.push(review);
  res.status(201).json(review);
});

// ===== Offers =====
app.get('/api/offers', (_req, res) => res.json(db.offers));

app.post('/api/offers', authRequired, adminRequired, (req, res) => {
  const offer = { id: uuid(), ...req.body };
  db.offers.push(offer);
  res.status(201).json(offer);
});

app.delete('/api/offers/:id', authRequired, adminRequired, (req, res) => {
  const idx = db.offers.findIndex((o) => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Offer not found' });
  db.offers.splice(idx, 1);
  res.json({ ok: true });
});

app.post('/api/offers/validate', (req, res) => {
  const { code, total } = req.body || {};
  const offer = db.offers.find((o) => o.code.toLowerCase() === (code || '').toLowerCase());
  if (!offer) return res.status(404).json({ message: 'Invalid coupon code' });
  const discount = Math.round((total || 0) * (offer.discount / 100));
  res.json({ offer, discount });
});

// ===== Favorites =====
app.get('/api/favorites', authRequired, (req, res) => {
  const ids = db.favorites[req.user.id] || [];
  const rooms = db.rooms.filter((r) => ids.includes(r.id));
  res.json(rooms);
});

app.post('/api/favorites/:roomId', authRequired, (req, res) => {
  if (!db.favorites[req.user.id]) db.favorites[req.user.id] = [];
  const list = db.favorites[req.user.id];
  const idx = list.indexOf(req.params.roomId);
  if (idx === -1) list.push(req.params.roomId);
  else list.splice(idx, 1);
  res.json({ favorites: list });
});

// ===== Admin Analytics =====
app.get('/api/admin/stats', authRequired, adminRequired, (_req, res) => {
  const totalBookings = db.bookings.length;
  const activeBookings = db.bookings.filter((b) => b.status === 'confirmed').length;
  const cancelled = db.bookings.filter((b) => b.status === 'cancelled').length;
  const revenue = db.bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((s, b) => s + b.total, 0);
  const occupied = new Set(
    db.bookings.filter((b) => b.status === 'confirmed').map((b) => b.roomId)
  ).size;
  const occupancy = db.rooms.length ? Math.round((occupied / db.rooms.length) * 100) : 0;
  res.json({
    totalBookings,
    activeBookings,
    cancelled,
    revenue,
    occupancy,
    rooms: db.rooms.length,
    users: db.users.length,
  });
});

// ===== Payments =====
// Mocked gateway — validates the same way Stripe/Razorpay would (Luhn, expiry,
// CVV, amount) and returns a paymentId that booking creation can reference.
// Test card 4000 0000 0000 0002 simulates a declined charge.
app.post('/api/payments/checkout', authRequired, (req, res) => {
  const errors = validatePayment(req.body);
  if (Object.keys(errors).length) {
    return res.status(400).json({ message: 'Payment validation failed', errors });
  }

  const { method, amount, card, upiId } = req.body;
  const number = method === 'card' ? String(card.number || '').replace(/\D/g, '') : null;

  if (number === '4000000000000002') {
    return res.status(402).json({ message: 'Card was declined by the issuing bank', errors: { cardNumber: 'Card declined' } });
  }

  const payment = {
    paymentId: `pay_${uuid()}`,
    method,
    amount,
    status: 'succeeded',
    last4: number ? last4(number) : undefined,
    upiId: method === 'upi' ? upiId : undefined,
    createdAt: new Date().toISOString(),
    userId: req.user.id,
  };
  db.payments = db.payments || [];
  db.payments.push(payment);
  res.json(payment);
});

app.get('/api/payments/:id', authRequired, (req, res) => {
  const list = db.payments || [];
  const payment = list.find((p) => p.paymentId === req.params.id);
  if (!payment) return res.status(404).json({ message: 'Payment not found' });
  if (payment.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.json(payment);
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`\n🏨 StayLuxe API running on http://localhost:${PORT}\n`);
  console.log('Demo credentials:');
  console.log('  Admin: admin@stayluxe.com / admin123');
  console.log('  User:  demo@stayluxe.com / demo123\n');
});
