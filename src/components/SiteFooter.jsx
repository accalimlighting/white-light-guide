import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import lastUpdated from '../lastUpdated';
import { pages, siteDomain } from '../site';

export default function SiteFooter() {
  return (
    <footer className="bg-acclaim-midnight text-acclaim-cloud py-8 mt-20 no-print">
      <div className="max-w-[1400px] mx-auto px-4 flex flex-col md:flex-row md:items-start justify-between gap-6 text-sm">
        <div>
          <p className="font-semibold text-white">{siteDomain}</p>
          <p className="text-acclaim-steel mt-1">Last updated: {lastUpdated}</p>
          <p className="text-acclaim-steel mt-1">Contact Acclaim Lighting for availability and lead times</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {pages.map((p) => (
            <Link key={p.path} to={p.path} className="text-acclaim-cloud/80 hover:text-white">
              {p.navLabel}
            </Link>
          ))}
          <a
            href="https://www.acclaimlighting.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-acclaim-teal hover:text-white inline-flex items-center gap-1 font-medium"
          >
            acclaimlighting.com
            <ExternalLink className="w-3 h-3" />
          </a>
        </nav>
      </div>
    </footer>
  );
}
