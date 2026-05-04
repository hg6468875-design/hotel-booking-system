import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import RoomCard from '../components/RoomCard';
import Loader from '../components/Loader';

const Favorites = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/favorites').then((r) => setRooms(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="section py-10">
      <h1 className="text-3xl font-bold mb-2">Favorites</h1>
      <p className="text-slate-500 mb-8">Rooms you've saved for later.</p>

      {loading ? (
        <Loader />
      ) : rooms.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-3xl mb-2">💜</p>
          <h3 className="font-bold text-lg mb-1">No favorites yet</h3>
          <p className="text-slate-500 mb-4">Tap the heart on any room to save it here.</p>
          <Link to="/rooms" className="btn-primary">Discover rooms</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((r, i) => <RoomCard key={r.id} room={r} index={i} />)}
        </div>
      )}
    </div>
  );
};

export default Favorites;
