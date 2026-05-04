const Loader = ({ label = 'Loading' }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-4 border-brand-100"></div>
      <div className="absolute inset-0 rounded-full border-4 border-brand-600 border-t-transparent animate-spin"></div>
    </div>
    <p className="text-sm text-slate-500">{label}…</p>
  </div>
);

export default Loader;
