import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="section py-24 text-center">
    <p className="text-9xl font-display font-bold gradient-text">404</p>
    <h1 className="text-2xl font-bold mt-4">We couldn't find that page</h1>
    <p className="text-slate-500 mt-2">It might have been moved or no longer exists.</p>
    <Link to="/" className="btn-primary mt-6 inline-flex">Take me home</Link>
  </div>
);

export default NotFound;
