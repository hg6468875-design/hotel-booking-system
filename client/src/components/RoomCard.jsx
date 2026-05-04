import { Link } from 'react-router-dom';
import { FiMapPin, FiStar, FiUsers } from 'react-icons/fi';

const RoomCard = ({ room, index = 0 }) => {
  return (
    <Link
      to={`/rooms/${room.id}`}
      style={{ animationDelay: `${index * 60}ms` }}
      className="card group hover:shadow-glow hover:-translate-y-1 transition-all duration-300 animate-slide-up"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={room.images[0]}
          alt={room.type}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 badge bg-white/90 text-slate-800 backdrop-blur">
          <FiStar className="text-gold-500 fill-current" size={12} />
          <span>{room.rating.toFixed(1)}</span>
        </div>
        <div className="absolute top-3 right-3 badge bg-brand-600 text-white">
          ${room.pricePerNight}
          <span className="font-normal opacity-80">/night</span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2 gap-2">
          <h3 className="font-display text-lg font-bold leading-tight group-hover:text-brand-700 transition">
            {room.hotelName}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-sm text-slate-500 mb-3">
          <FiMapPin size={14} />
          <span>{room.city}, {room.country}</span>
        </div>
        <p className="text-sm text-slate-600 font-medium mb-3">{room.type}</p>
        <div className="flex items-center gap-3 text-xs text-slate-500 pt-3 border-t border-slate-100">
          <span className="flex items-center gap-1"><FiUsers size={14} /> {room.maxGuests} guests</span>
          <span>•</span>
          <span>{room.size}m²</span>
          <span>•</span>
          <span className="truncate">{room.beds}</span>
        </div>
      </div>
    </Link>
  );
};

export default RoomCard;
