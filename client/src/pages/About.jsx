import { FiHeart, FiGlobe, FiAward, FiUsers } from 'react-icons/fi';

const About = () => (
  <div>
    <section className="relative">
      <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80" alt="" className="w-full h-[420px] object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/30 flex items-center">
        <div className="section text-white">
          <h1 className="text-5xl font-bold font-display max-w-2xl">Crafting unforgettable journeys since 2018.</h1>
          <p className="text-xl opacity-90 mt-4 max-w-xl">A boutique hotel platform built by travelers, for travelers.</p>
        </div>
      </div>
    </section>

    <section className="section py-16 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <p className="text-brand-600 text-sm font-semibold uppercase tracking-wider mb-2">Our story</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Where hospitality meets craft.</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          StayLuxe was born from a simple frustration — that booking unique, soulful stays online felt clinical
          and impersonal. We set out to build something different: a place where every property is hand-picked,
          every photo is real, and every stay feels like a curated discovery.
        </p>
        <p className="text-slate-600 leading-relaxed">
          Today we partner with over 500 boutique hotels across 40 countries, helping travelers find places
          that surprise, delight, and inspire — with transparent pricing and instant confirmation.
        </p>
      </div>
      <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80" alt="" className="rounded-3xl shadow-glow aspect-[4/5] object-cover" />
    </section>

    <section className="section py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { icon: FiAward, value: '500+', label: 'Curated properties' },
        { icon: FiGlobe, value: '40+', label: 'Countries' },
        { icon: FiUsers, value: '120k', label: 'Happy guests' },
        { icon: FiHeart, value: '4.9', label: 'Average rating' },
      ].map((s, i) => (
        <div key={i} className="card p-6 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
            <s.icon size={24} />
          </div>
          <p className="text-4xl font-bold mb-1">{s.value}</p>
          <p className="text-sm text-slate-500">{s.label}</p>
        </div>
      ))}
    </section>
  </div>
);

export default About;
