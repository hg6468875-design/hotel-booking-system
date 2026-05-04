# 🏨 StayLuxe — Hotel Booking System

A full-stack MERN-style hotel booking platform with attractive UI, admin panel, and mocked payments.

## ✨ Features

### 👤 Users
- Search rooms by destination, dates, guests
- Browse curated rooms with filters (price, type, amenities, rating) and sorting
- Detailed room pages with image gallery, amenities, reviews
- 3-step booking flow with mocked payment (card / UPI / wallet)
- Apply coupon codes (`SUMMER25`, `WEEKEND15`, `EARLY10`)
- Booking history with upcoming/past/cancelled tabs and cancellation
- Save favorites, leave 1–5 star reviews
- Auth: register / login / profile

### 🛡️ Admin
- Dashboard with KPIs (revenue, occupancy, bookings, users)
- CRUD: rooms, offers
- View all bookings, cancel any booking

## 🧩 Tech Stack

| Layer       | Stack                                                     |
|-------------|-----------------------------------------------------------|
| Frontend    | React 18 + Vite + Tailwind + React Router + react-icons + react-hot-toast |
| Backend     | Node + Express + JWT + bcrypt + in-memory store           |
| Payments    | Mocked stub (Stripe/Razorpay-ready)                       |

> Data is in-memory (resets on server restart). MongoDB-ready — swap `server/data/seed.js` calls for Mongoose models.

## 🚀 Quick start

```bash
# Terminal 1 — backend (port 5001)
cd server
npm install
npm run dev

# Terminal 2 — frontend (port 5173)
cd client
npm install
npm run dev
```

Then open http://localhost:5173

### 🔑 Demo credentials
| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@stayluxe.com     | admin123   |
| User  | demo@stayluxe.com      | demo123    |

## 📁 Structure

```
hotel-booking/
├── client/                 # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/     # Navbar, Footer, RoomCard, SearchBar, …
│   │   ├── context/        # AuthContext
│   │   ├── pages/          # Home, Rooms, RoomDetails, Booking, Admin, …
│   │   ├── services/api.js # Axios instance
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── …
└── server/                 # Express API
    ├── data/seed.js        # In-memory data
    ├── middleware/auth.js  # JWT + role guards
    ├── server.js           # All routes
    └── package.json
```

## 🔌 API surface

| Method | Path                     | Auth | Notes                     |
|--------|--------------------------|------|---------------------------|
| POST   | /api/auth/register       | —    | Returns `{ token, user }` |
| POST   | /api/auth/login          | —    |                           |
| GET    | /api/auth/me             | ✓    |                           |
| PUT    | /api/auth/me             | ✓    | Update name/avatar        |
| GET    | /api/hotels              | —    |                           |
| GET    | /api/rooms               | —    | Query: q, city, guests, minPrice, maxPrice, type, amenities, rating |
| GET    | /api/rooms/:id           | —    | Includes reviews          |
| POST   | /api/rooms               | admin|                           |
| PUT    | /api/rooms/:id           | admin|                           |
| DELETE | /api/rooms/:id           | admin|                           |
| POST   | /api/bookings            | ✓    |                           |
| GET    | /api/bookings            | ✓    | Mine                      |
| GET    | /api/bookings/all        | admin|                           |
| PUT    | /api/bookings/:id/cancel | ✓    |                           |
| POST   | /api/reviews             | ✓    |                           |
| GET    | /api/reviews/:roomId     | —    |                           |
| GET    | /api/offers              | —    |                           |
| POST   | /api/offers/validate     | —    | `{ code, total }`         |
| POST   | /api/offers              | admin|                           |
| DELETE | /api/offers/:id          | admin|                           |
| POST   | /api/favorites/:roomId   | ✓    | Toggle                    |
| GET    | /api/favorites           | ✓    |                           |
| GET    | /api/admin/stats         | admin|                           |
| POST   | /api/payments/checkout   | ✓    | Mock                      |

## 🎨 Design

- Brand: violet (#7c3aed) → pink gradients with gold accents
- Typography: **Inter** (body) + **Playfair Display** (headings)
- Components: `card`, `btn-primary`, `btn-outline`, `chip`, `badge`, `gradient-text`, `glass`
- Animations: `animate-slide-up`, `animate-fade-in`

## 🔮 Future enhancements

- Swap in MongoDB / Mongoose
- Wire Stripe checkout
- Email notifications (Nodemailer)
- Cloudinary image uploads
- Internationalization
