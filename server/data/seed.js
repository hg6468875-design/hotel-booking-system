import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

const hash = (pw) => bcrypt.hashSync(pw, 8);

export const seedData = () => {
  const users = [
    {
      id: 'u-admin',
      name: 'Admin',
      email: 'admin@stayluxe.com',
      password: hash('admin123'),
      role: 'admin',
      avatar: 'https://i.pravatar.cc/150?img=12',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'u-demo',
      name: 'Demo User',
      email: 'demo@stayluxe.com',
      password: hash('demo123'),
      role: 'user',
      avatar: 'https://i.pravatar.cc/150?img=47',
      createdAt: new Date().toISOString(),
    },
  ];

  const hotels = [
    {
      id: 'h-1',
      name: 'The Azure Bay Resort',
      city: 'Maldives',
      country: 'Maldives',
      rating: 4.9,
      description:
        'Overwater villas with panoramic sunset views, infinity pools, and world-class spa treatments along untouched white-sand beaches.',
      image:
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1600&q=80',
    },
    {
      id: 'h-2',
      name: 'Aurora Mountain Lodge',
      city: 'Banff',
      country: 'Canada',
      rating: 4.7,
      description:
        'A cozy alpine retreat surrounded by towering pine forests, glacial lakes, and stunning northern lights views in winter.',
      image:
        'https://images.unsplash.com/photo-1455587734955-081b22074882?w=1600&q=80',
    },
    {
      id: 'h-3',
      name: 'Grand Riviera Palace',
      city: 'Nice',
      country: 'France',
      rating: 4.8,
      description:
        'A timeless Belle Époque palace overlooking the French Riviera, offering Michelin dining and rooftop infinity pools.',
      image:
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80',
    },
    {
      id: 'h-4',
      name: 'Sakura Garden Ryokan',
      city: 'Kyoto',
      country: 'Japan',
      rating: 4.9,
      description:
        'Traditional tatami suites with private onsen, cherry-blossom courtyards, and an authentic kaiseki dining experience.',
      image:
        'https://images.unsplash.com/photo-1545158539-1709fb4f8d2c?w=1600&q=80',
    },
  ];

  const amenitiesPool = [
    'Free WiFi',
    'Air Conditioning',
    'Smart TV',
    'Mini Bar',
    'Room Service',
    'Pool Access',
    'Spa & Wellness',
    'Ocean View',
    'Mountain View',
    'King Bed',
    'Balcony',
    'Free Breakfast',
    'Parking',
    'Pet Friendly',
  ];

  const roomTypes = [
    { type: 'Deluxe Suite', size: 45, beds: 'King Bed' },
    { type: 'Premium Double', size: 32, beds: 'Queen Bed' },
    { type: 'Family Room', size: 60, beds: '2 Queen Beds' },
    { type: 'Presidential Suite', size: 95, beds: 'King Bed + Sofa' },
    { type: 'Garden View Room', size: 28, beds: 'Queen Bed' },
    { type: 'Ocean View Suite', size: 55, beds: 'King Bed' },
  ];

  const roomImages = [
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=80',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80',
    'https://images.unsplash.com/photo-1551776235-dde6d482980b?w=1200&q=80',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80',
    'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1200&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80',
  ];

  const rooms = [];
  let imgIdx = 0;
  hotels.forEach((hotel, hIdx) => {
    const variants = roomTypes.slice(0, 3 + (hIdx % 2));
    variants.forEach((rt, i) => {
      const basePrice = 120 + hIdx * 60 + i * 80;
      const gallery = [
        roomImages[imgIdx % roomImages.length],
        roomImages[(imgIdx + 1) % roomImages.length],
        roomImages[(imgIdx + 2) % roomImages.length],
      ];
      imgIdx += 3;
      rooms.push({
        id: `r-${hotel.id}-${i}`,
        hotelId: hotel.id,
        hotelName: hotel.name,
        city: hotel.city,
        country: hotel.country,
        type: rt.type,
        beds: rt.beds,
        size: rt.size,
        maxGuests: rt.type.includes('Family') ? 4 : rt.type.includes('Presidential') ? 4 : 2,
        pricePerNight: basePrice,
        rating: hotel.rating - Math.random() * 0.3,
        amenities: [...amenitiesPool]
          .sort(() => 0.5 - Math.random())
          .slice(0, 7),
        images: gallery,
        description: `${rt.type} at ${hotel.name}, featuring a ${rt.beds.toLowerCase()}, ${rt.size}m² of refined space, and curated amenities for an unforgettable stay.`,
        available: true,
      });
    });
  });

  const reviews = [
    {
      id: uuid(),
      roomId: rooms[0].id,
      userId: 'u-demo',
      userName: 'Demo User',
      avatar: 'https://i.pravatar.cc/150?img=47',
      rating: 5,
      comment: 'Absolutely magical stay. The villa was beyond expectations.',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: uuid(),
      roomId: rooms[1].id,
      userId: 'u-demo',
      userName: 'Demo User',
      avatar: 'https://i.pravatar.cc/150?img=47',
      rating: 4,
      comment: 'Lovely service and clean rooms. Breakfast was excellent.',
      createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    },
  ];

  const offers = [
    {
      id: 'o-1',
      code: 'SUMMER25',
      title: 'Summer Escape',
      description: 'Get 25% off on stays of 3+ nights at any beachside resort.',
      discount: 25,
      validTill: '2026-09-30',
      image:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
    },
    {
      id: 'o-2',
      code: 'WEEKEND15',
      title: 'Weekend Getaway',
      description: '15% off weekend bookings — recharge in style.',
      discount: 15,
      validTill: '2026-12-31',
      image:
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80',
    },
    {
      id: 'o-3',
      code: 'EARLY10',
      title: 'Early Bird',
      description: 'Book 30 days ahead and save 10% on any room.',
      discount: 10,
      validTill: '2026-12-31',
      image:
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80',
    },
  ];

  const bookings = [];

  const favorites = {};

  return { users, hotels, rooms, reviews, offers, bookings, favorites };
};
