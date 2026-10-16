import { Link, NavLink } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { logoSrc, pages, quoteEmail, siteName } from '../site';

const navItems = [{ path: '/', navLabel: 'Overview', end: true }, ...pages];

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-40 bg-acclaim-midnight/95 backdrop-blur border-b border-white/10 text-white no-print">
      <div className="max-w-[1400px] mx-auto px-4 flex flex-wrap items-center gap-x-6 gap-y-1 py-2 md:py-0 md:h-16">
        <Link to="/" className="order-1 flex items-center gap-3 shrink-0" aria-label={`${siteName} home`}>
          <img
            src={logoSrc}
            alt="Acclaim Lighting"
            className="h-7 w-auto"
            onError={(e) => {
              if (logoSrc !== '/Acclaim_Horizontal_Logo_Dark.svg') e.currentTarget.src = '/Acclaim_Horizontal_Logo_Dark.svg';
            }}
          />
          <span className="hidden sm:block text-sm font-semibold tracking-wide text-white/80 border-l border-white/20 pl-3">
            Guide
          </span>
        </Link>

        <a
          href={`mailto:${quoteEmail}`}
          className="order-2 md:order-3 ml-auto md:ml-0 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/85 hover:bg-white/10 hover:text-white transition"
        >
          <Mail className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Request a quote</span>
          <span className="sm:hidden">Quote</span>
        </a>

        <nav
          aria-label="Primary"
          className="order-3 md:order-2 w-full md:w-auto md:ml-auto flex items-center gap-1 overflow-x-auto -mx-1 px-1 pb-1 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition ${
                  isActive ? 'bg-white/12 text-white shadow-inner' : 'text-white/65 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {item.navLabel}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
