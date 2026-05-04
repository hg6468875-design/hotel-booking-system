import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="section py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-300 flex items-center justify-center">
              <span className="text-white font-bold text-lg">SL</span>
            </div>
            <span className="font-display text-xl font-bold text-white">StayLuxe</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Curated boutique stays for discerning travelers. Experience hospitality reimagined.
          </p>
          <div className="flex items-center gap-3 mt-5">
            {[FiInstagram, FiTwitter, FiFacebook, FiMail].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-brand-600 flex items-center justify-center transition">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 font-sans text-sm uppercase tracking-wider">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/rooms" className="hover:text-white transition">Browse Rooms</Link></li>
            <li><Link to="/offers" className="hover:text-white transition">Special Offers</Link></li>
            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 font-sans text-sm uppercase tracking-wider">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition">Contact</a></li>
            <li><a href="#" className="hover:text-white transition">Cancellation</a></li>
            <li><a href="#" className="hover:text-white transition">Privacy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 font-sans text-sm uppercase tracking-wider">Get the latest deals</h4>
          <p className="text-sm text-slate-400 mb-3">Subscribe to weekly insider offers.</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input className="input bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" placeholder="Your email" />
            <button type="submit" className="btn-primary">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="section py-5 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-slate-500">
          <p>© 2026 StayLuxe. All rights reserved.</p>
          <p>Crafted with care for unforgettable journeys.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
