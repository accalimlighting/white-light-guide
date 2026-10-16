import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { pages } from '../site';

export default function NotFound() {
  return (
    <>
      <PageHero eyebrow="404" title="Page not found" description="That guide or chart doesn't exist (yet). Pick one of the published pages below." />
      <main className="relative -mt-12 z-10 max-w-6xl mx-auto px-4">
        <div className="glass-panel p-6 flex flex-wrap gap-3">
          {[{ path: '/', navLabel: 'Overview' }, ...pages].map((p) => (
            <Link key={p.path} to={p.path} className="px-4 py-2 rounded-xl bg-acclaim-navy text-white text-sm font-medium hover:-translate-y-0.5 transition">
              {p.navLabel}
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
