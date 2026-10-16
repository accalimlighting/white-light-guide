import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Check, ExternalLink, Printer, Search, X } from 'lucide-react';
import { comparisonFilters, comparisonGroups, comparisonProducts } from '../data/coveComparison';
import { getIPBadgeClass } from '../utils/ipBadge';

/* ------------------------------------------------------------------ data */

const SORTABLE = {
  watts: (p) => p.watts?.value ?? -1,
  lumens: (p) => p.lumens?.value ?? -1,
  maxRun: (p) => p.maxRun?.value ?? -1,
};

const searchIndex = new Map(
  comparisonProducts.map((p) => [
    p.id,
    [
      p.name,
      p.subtitle,
      p.status,
      p.source,
      ...(p.badges || []),
      p.location?.dry,
      p.location?.wet,
      p.location?.note,
      p.watts?.label,
      p.lumens?.label,
      p.cri,
      p.tm30,
      p.maxRun?.label,
      p.maxRun?.note,
      ...Object.values(p.input || {}),
      ...Object.values(p.control || {}),
      p.quickShip ? 'quick ship ams' : '',
    ]
      .filter((v) => typeof v === 'string' && v)
      .join(' ')
      .toLowerCase(),
  ])
);

const defaultFilters = { type: 'all', location: 'all', input: 'all', control: 'all' };

export function useCoveComparison() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [quickShipOnly, setQuickShipOnly] = useState(false);
  const [sort, setSort] = useState({ key: null, dir: 'desc' });

  const setFilter = (group, value) => setFilters((prev) => ({ ...prev, [group]: value }));

  const toggleSort = (key) =>
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: 'desc' };
      if (prev.dir === 'desc') return { key, dir: 'asc' };
      return { key: null, dir: 'desc' };
    });

  const reset = () => {
    setSearchTerm('');
    setFilters(defaultFilters);
    setQuickShipOnly(false);
    setSort({ key: null, dir: 'desc' });
  };

  const results = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const list = comparisonProducts.filter((p) => {
      if (term && !(searchIndex.get(p.id) || '').includes(term)) return false;
      if (filters.type !== 'all' && p.group !== filters.type) return false;
      if (filters.location !== 'all' && !p.location?.[filters.location]) return false;
      if (filters.input !== 'all' && !p.input?.[filters.input]) return false;
      if (filters.control !== 'all') {
        const has = p.control?.[filters.control] || (filters.control === 'dmx' && p.control?.dali);
        if (!has) return false;
      }
      if (quickShipOnly && !p.quickShip) return false;
      return true;
    });

    if (sort.key && SORTABLE[sort.key]) {
      const pick = SORTABLE[sort.key];
      list.sort((a, b) => (sort.dir === 'asc' ? pick(a) - pick(b) : pick(b) - pick(a)));
    }
    return list;
  }, [searchTerm, filters, quickShipOnly, sort]);

  const filtersActive =
    Object.values(filters).some((v) => v !== 'all') || quickShipOnly || Boolean(searchTerm.trim());

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    quickShipOnly,
    setQuickShipOnly,
    sort,
    toggleSort,
    reset,
    filtersActive,
    results,
    total: comparisonProducts.length,
  };
}

/* -------------------------------------------------------------- controls */

const FilterGroup = ({ label, options, value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-acclaim-steel">{label}</span>
    <div className="inline-flex flex-wrap rounded-xl border border-acclaim-cloud bg-white/70 p-0.5">
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            aria-pressed={active}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              active ? 'bg-acclaim-teal text-white shadow-sm' : 'text-acclaim-slate hover:bg-acclaim-mist'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  </div>
);

export function CoveComparisonControls({
  searchTerm,
  setSearchTerm,
  filters,
  setFilter,
  quickShipOnly,
  setQuickShipOnly,
  reset,
  filtersActive,
  results,
  total,
  onPrint,
}) {
  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-acclaim-steel w-4 h-4" />
          <input
            type="text"
            placeholder="Search products, ratings, control options..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-10 py-3 rounded-2xl border border-acclaim-cloud bg-white/70 text-acclaim-slate placeholder:text-acclaim-steel/70 focus:border-acclaim-accent focus:ring-2 focus:ring-acclaim-accent/30 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-acclaim-steel hover:text-acclaim-navy"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={onPrint}
          className="self-end lg:self-auto px-4 py-2 text-sm rounded-xl bg-acclaim-navy text-white font-medium flex items-center gap-2 shadow-sm hover:-translate-y-0.5 transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print / PDF</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-4">
        <FilterGroup label="Type" options={comparisonFilters.type} value={filters.type} onChange={(v) => setFilter('type', v)} />
        <FilterGroup label="Location" options={comparisonFilters.location} value={filters.location} onChange={(v) => setFilter('location', v)} />
        <FilterGroup label="Input" options={comparisonFilters.input} value={filters.input} onChange={(v) => setFilter('input', v)} />
        <FilterGroup label="Control" options={comparisonFilters.control} value={filters.control} onChange={(v) => setFilter('control', v)} />
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-acclaim-steel">Availability</span>
          <button
            type="button"
            onClick={() => setQuickShipOnly(!quickShipOnly)}
            aria-pressed={quickShipOnly}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
              quickShipOnly
                ? 'border-acclaim-teal bg-acclaim-teal text-white shadow-sm'
                : 'border-acclaim-cloud bg-white/70 text-acclaim-slate hover:bg-acclaim-mist'
            }`}
          >
            <img src="/QuickShipLogo.svg" alt="" className={`h-4 w-auto ${quickShipOnly ? 'brightness-0 invert' : ''}`} />
            Quick Ship only
          </button>
        </div>
      </div>

      <div className="text-sm text-acclaim-steel flex flex-wrap items-center gap-3">
        <span className="font-medium text-acclaim-slate">
          Showing {results.length} of {total} products
        </span>
        {filtersActive && (
          <button onClick={reset} className="text-acclaim-accent font-medium hover:underline">
            Clear filters
          </button>
        )}
      </div>
    </>
  );
}

/* ----------------------------------------------------------------- cells */

const isVia = (value) => typeof value === 'string' && /^via\s/i.test(value);

const CheckMark = ({ className = '' }) => (
  <span
    className={`inline-flex h-6 w-6 items-center justify-center rounded-full bg-acclaim-teal/15 text-acclaim-teal ${className}`}
    aria-label="Yes"
  >
    <Check className="w-3.5 h-3.5" strokeWidth={3} />
  </span>
);

const Dash = () => (
  <span className="text-acclaim-cloud select-none" aria-label="Not available">
    —
  </span>
);

const ViaPill = ({ children }) => (
  <span className="inline-block max-w-[9.5rem] rounded-md border [text-wrap:balance] border-acclaim-cloud bg-acclaim-mist px-2 py-1 text-[11px] font-medium leading-snug text-acclaim-slate">
    {children}
  </span>
);

const Capability = ({ value, caption }) => {
  let body;
  if (value === true) body = <CheckMark />;
  else if (!value) body = <Dash />;
  else if (isVia(value)) body = <ViaPill>{value}</ViaPill>;
  else
    body = (
      <>
        <CheckMark />
        <span className="text-[11px] leading-tight text-acclaim-steel">{value}</span>
      </>
    );

  return (
    <div className="flex flex-col items-center gap-1 text-center">
      {body}
      {caption && <span className="text-[11px] leading-tight text-acclaim-steel">{caption}</span>}
    </div>
  );
};

const IPBadge = ({ ip }) =>
  ip ? (
    <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${getIPBadgeClass(ip)}`}>{ip}</span>
  ) : null;

const LocationCell = ({ ip, note }) => {
  if (!ip) return <Dash />;
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <IPBadge ip={ip} />
      {note && <span className="text-[11px] leading-tight text-acclaim-steel max-w-[8rem]">{note}</span>}
    </div>
  );
};

const Metric = ({ value, unit, note, prefix }) => (
  <div className="flex flex-col items-center text-center leading-tight">
    {prefix && <span className="text-[10px] uppercase tracking-[0.2em] text-acclaim-steel">{prefix}</span>}
    <span className="font-semibold text-acclaim-slate">
      {value}
      {unit && <span className="text-xs font-medium text-acclaim-steel">{unit}</span>}
    </span>
    {note && <span className="text-[11px] text-acclaim-steel mt-0.5 max-w-[8.5rem]">{note}</span>}
  </div>
);

const QualityCell = ({ cri, criNote, tm30 }) => (
  <div className="flex flex-col items-center gap-0.5 text-center leading-tight">
    <span className="text-xs">
      <span className="text-acclaim-steel">CRI </span>
      <span className="font-semibold text-acclaim-slate">{cri || '—'}</span>
    </span>
    {criNote && <span className="text-[10px] text-acclaim-steel">{criNote}</span>}
    <span className="text-xs">
      <span className="text-acclaim-steel">TM30 </span>
      <span className="font-semibold text-acclaim-slate">{tm30 || '—'}</span>
    </span>
  </div>
);

const QuickShipCell = ({ quickShip, note }) =>
  quickShip ? (
    <div className="flex flex-col items-center gap-1 text-center">
      <img src="/QuickShipLogo.svg" alt="Quick Ship" className="h-5 w-auto" />
      {note && <span className="text-[11px] text-acclaim-steel">{note}</span>}
    </div>
  ) : (
    <Dash />
  );

const ProductIdentity = ({ product, compact = false }) => {
  const title = (
    <span className="font-semibold text-acclaim-slate tracking-tight">
      {product.name}
      {product.subtitle && <span className="text-acclaim-steel font-medium"> {product.subtitle}</span>}
    </span>
  );
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className={`flex-shrink-0 bg-white rounded-lg overflow-hidden border border-acclaim-cloud/80 ${compact ? 'w-20 h-14' : 'w-[4.5rem] h-12'}`}>
        <img
          src={product.image}
          alt=""
          loading="lazy"
          className="w-full h-full object-contain p-1"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.png';
          }}
        />
      </div>
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-1.5 flex-wrap text-sm">
          {product.productUrl ? (
            <a
              href={product.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-1 hover:text-acclaim-accent"
              title="Open product page"
            >
              {title}
              <ExternalLink className="w-3 h-3 text-acclaim-cloud group-hover/link:text-acclaim-accent transition" />
            </a>
          ) : (
            title
          )}
          {product.status && (
            <span className="inline-flex items-center rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap">
              {product.status}
            </span>
          )}
        </div>
        {product.badges?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.badges.map((b) => (
              <span key={b} className="rounded border border-acclaim-cloud/70 bg-acclaim-mist px-1.5 py-0.5 text-[10px] font-medium text-acclaim-steel leading-tight">
                {b}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------- table */

const SortHeader = ({ label, sortKey, sort, onSort }) => {
  const active = sort.key === sortKey;
  const Icon = !active ? ArrowUpDown : sort.dir === 'asc' ? ArrowUp : ArrowDown;
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 -mx-1.5 transition hover:bg-acclaim-mist hover:text-acclaim-slate print:pointer-events-none ${
        active ? 'text-acclaim-teal' : ''
      }`}
      aria-label={`Sort by ${label}`}
      aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      {label}
      <Icon className={`w-3 h-3 print:hidden ${active ? 'opacity-100' : 'opacity-50'}`} />
    </button>
  );
};

const groupStart = 'border-l border-acclaim-cloud/70';
const headCell = 'px-2 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-acclaim-steel text-center align-bottom whitespace-nowrap';
const bodyCell = 'px-2.5 py-3.5 align-middle text-sm';

const columns = [
  { key: 'dry', label: 'Dry', width: 76, className: groupStart },
  { key: 'wet', label: 'Wet', width: 96 },
  { key: 'watts', label: 'Watts / ft', width: 100, sortable: true, className: groupStart },
  { key: 'lumens', label: 'Lumens / ft', width: 100, sortable: true },
  { key: 'quality', label: 'CRI / TM30', width: 92 },
  { key: 'maxRun', label: 'Max run', width: 112, sortable: true },
  { key: 'lineVoltage', label: '120–277V', width: 90, className: groupStart },
  { key: 'lowVoltage', label: '24VDC', width: 72 },
  { key: 'zeroToTen', label: '0-10V', width: 118, className: groupStart },
  { key: 'triac', label: 'TRIAC / ELV', width: 104 },
  { key: 'dmx', label: 'DMX / RDM / DALI', width: 124 },
];
const MODEL_WIDTH = 236;
const QUICK_SHIP_WIDTH = 84;

const renderCell = (product, key) => {
  switch (key) {
    case 'dry':
      return <LocationCell ip={product.location?.dry} note={product.location?.dry ? product.location?.note : null} />;
    case 'wet':
      return <LocationCell ip={product.location?.wet} note={product.location?.wet ? product.location?.note : null} />;
    case 'watts':
      return <Metric value={product.watts?.label} unit="/ft" note={product.watts?.note} />;
    case 'lumens':
      return <Metric prefix="up to" value={product.lumens?.label} unit=" lm/ft" note={product.lumens?.note} />;
    case 'quality':
      return <QualityCell cri={product.cri} criNote={product.criNote} tm30={product.tm30} />;
    case 'maxRun':
      return <Metric value={product.maxRun?.label} note={product.maxRun?.note} />;
    case 'lineVoltage':
      return <Capability value={product.input?.lineVoltage} />;
    case 'lowVoltage':
      return <Capability value={product.input?.lowVoltage} />;
    case 'zeroToTen':
      return <Capability value={product.control?.zeroToTen} />;
    case 'triac':
      return <Capability value={product.control?.triac} />;
    case 'dmx':
      return <Capability value={product.control?.dmx} caption={product.control?.dali ? `DALI ${product.control.dali}` : null} />;
    default:
      return null;
  }
};

const GroupRow = ({ group, count }) => (
  <tr className="bg-acclaim-mist/70">
    <th colSpan={columns.length + 2} scope="colgroup" className="p-0 text-left">
      <div className="sticky left-0 inline-flex items-baseline gap-3 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-acclaim-ocean">
        <span>{group.name}</span>
        <span className="normal-case tracking-normal font-medium text-acclaim-steel">
          {group.blurb} · {count}
        </span>
      </div>
    </th>
  </tr>
);

const ProductRow = ({ product }) => (
  <tr className="group border-t border-acclaim-cloud/60 hover:bg-acclaim-mist/40 transition-colors print:break-inside-avoid">
    <th
      scope="row"
      className={`${bodyCell} sticky left-0 z-10 bg-white group-hover:bg-[#F3F6FA] text-left font-normal border-r border-acclaim-cloud/60 shadow-[6px_0_12px_-8px_rgba(3,35,63,0.15)]`}
    >
      <ProductIdentity product={product} />
    </th>
    {columns.map((col) => (
      <td key={col.key} className={`${bodyCell} ${col.className || ''} text-center`}>
        {renderCell(product, col.key)}
      </td>
    ))}
    <td className={`${bodyCell} ${groupStart} text-center`}>
      <QuickShipCell quickShip={product.quickShip} note={product.quickShipNote} />
    </td>
  </tr>
);

/* ----------------------------------------------------------------- cards */

const CardField = ({ label, children }) => (
  <div>
    <dt className="text-[10px] uppercase tracking-[0.2em] text-acclaim-steel">{label}</dt>
    <dd className="mt-1 text-sm text-acclaim-slate">{children}</dd>
  </div>
);

const InlineCapability = ({ label, value, caption }) => (
  <div className="flex items-start justify-between gap-3 rounded-lg border border-acclaim-cloud/60 bg-white/70 px-3 py-2">
    <span className="text-xs font-medium text-acclaim-slate">{label}</span>
    <div className="text-right">
      {value === true ? (
        <CheckMark />
      ) : !value ? (
        <Dash />
      ) : isVia(value) ? (
        <ViaPill>{value}</ViaPill>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-xs text-acclaim-steel">
          <CheckMark />
          {value}
        </span>
      )}
      {caption && <div className="text-[11px] text-acclaim-steel mt-1">{caption}</div>}
    </div>
  </div>
);

const ProductCardCompact = ({ product }) => (
  <article className="glass-panel p-5 space-y-4">
    <div className="flex items-start justify-between gap-3">
      <ProductIdentity product={product} compact />
      <QuickShipCell quickShip={product.quickShip} note={product.quickShipNote} />
    </div>

    <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
      <CardField label="Location">
        <div className="flex flex-wrap items-center gap-1.5">
          {product.location?.dry && (
            <>
              <IPBadge ip={product.location.dry} /> <span className="text-xs text-acclaim-steel">Dry</span>
            </>
          )}
          {product.location?.wet && (
            <>
              <IPBadge ip={product.location.wet} /> <span className="text-xs text-acclaim-steel">Wet</span>
            </>
          )}
        </div>
        {product.location?.note && <p className="text-[11px] text-acclaim-steel mt-1">{product.location.note}</p>}
      </CardField>
      <CardField label="Watts / ft">
        <span className="font-semibold">{product.watts?.label}</span>
        {product.watts?.note && <p className="text-[11px] text-acclaim-steel">{product.watts.note}</p>}
      </CardField>
      <CardField label="Lumens / ft">
        <span className="font-semibold">up to {product.lumens?.label} lm</span>
        {product.lumens?.note && <p className="text-[11px] text-acclaim-steel">{product.lumens.note}</p>}
      </CardField>
      <CardField label="CRI / TM30">
        <span className="font-semibold">{product.cri || '—'}</span>
        <span className="text-acclaim-steel"> / </span>
        <span className="font-semibold">{product.tm30 || '—'}</span>
        {product.criNote && <p className="text-[11px] text-acclaim-steel">{product.criNote}</p>}
      </CardField>
      <CardField label="Max run">
        <span className="font-semibold">{product.maxRun?.label}</span>
        {product.maxRun?.note && <p className="text-[11px] text-acclaim-steel">{product.maxRun.note}</p>}
      </CardField>
    </dl>

    <div className="space-y-2">
      <p className="text-[10px] uppercase tracking-[0.2em] text-acclaim-steel">Input &amp; control</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <InlineCapability label="120–277V" value={product.input?.lineVoltage} />
        <InlineCapability label="24VDC" value={product.input?.lowVoltage} />
        <InlineCapability label="0-10V" value={product.control?.zeroToTen} />
        <InlineCapability label="TRIAC / ELV" value={product.control?.triac} />
        <InlineCapability
          label="DMX / RDM / DALI"
          value={product.control?.dmx}
          caption={product.control?.dali ? `DALI ${product.control.dali}` : null}
        />
      </div>
    </div>
  </article>
);

/* ------------------------------------------------------------------ view */

const Legend = () => (
  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-acclaim-steel">
    <span className="inline-flex items-center gap-2">
      <CheckMark /> Native / built-in
    </span>
    <span className="inline-flex items-center gap-2">
      <ViaPill>via …</ViaPill> Requires the listed driver or converter
    </span>
    <span className="inline-flex items-center gap-2">
      <Dash /> Not available
    </span>
  </div>
);

export default function CoveComparisonTable({ results, sort, toggleSort, reset, filtersActive }) {
  const grouped = !sort.key;
  const sections = grouped
    ? comparisonGroups
        .map((g) => ({ group: g, items: results.filter((p) => p.group === g.id) }))
        .filter((s) => s.items.length > 0)
    : [{ group: null, items: results }];

  if (results.length === 0) {
    return (
      <div className="text-center py-20 glass-panel">
        <div className="text-acclaim-slate text-lg mb-3 font-medium">No products match your criteria</div>
        {filtersActive && (
          <button onClick={reset} className="text-acclaim-accent font-semibold hover:underline">
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Desktop / print: comparison table */}
      <div className="hidden md:block glass-panel overflow-hidden print:block print:shadow-none print:border print:rounded-none">
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full min-w-[1300px] border-separate border-spacing-0 print:min-w-0 print:text-[10px]">
            <colgroup>
              <col style={{ width: MODEL_WIDTH }} />
              {columns.map((col) => (
                <col key={col.key} style={{ width: col.width }} />
              ))}
              <col style={{ width: QUICK_SHIP_WIDTH }} />
            </colgroup>
            <thead className="bg-white">
              <tr className="text-[10px] font-semibold uppercase tracking-[0.3em] text-acclaim-steel/80">
                <th rowSpan={2} scope="col" className={`${headCell} sticky left-0 z-20 bg-white text-left border-b border-r border-acclaim-cloud/70`}>
                  Model
                </th>
                <th colSpan={2} scope="colgroup" className={`${headCell} ${groupStart} pb-1 pt-3 border-b border-acclaim-cloud/40`}>
                  Location
                </th>
                <th colSpan={4} scope="colgroup" className={`${headCell} ${groupStart} pb-1 pt-3 border-b border-acclaim-cloud/40`}>
                  Performance (white light)
                </th>
                <th colSpan={2} scope="colgroup" className={`${headCell} ${groupStart} pb-1 pt-3 border-b border-acclaim-cloud/40`}>
                  Input
                </th>
                <th colSpan={3} scope="colgroup" className={`${headCell} ${groupStart} pb-1 pt-3 border-b border-acclaim-cloud/40`}>
                  Control
                </th>
                <th rowSpan={2} scope="col" className={`${headCell} ${groupStart} border-b border-acclaim-cloud/70`}>
                  <span className="block">AMS</span>
                  <span className="block normal-case tracking-normal text-[10px] font-medium">Quick Ship</span>
                </th>
              </tr>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} scope="col" className={`${headCell} ${col.className || ''} border-b border-acclaim-cloud/70`}>
                    {col.sortable ? <SortHeader label={col.label} sortKey={col.key} sort={sort} onSort={toggleSort} /> : col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sections.map(({ group, items }) => (
                <FragmentRows key={group?.id || 'flat'} group={group} items={items} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 border-t border-acclaim-cloud/60 bg-acclaim-mist/40 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <Legend />
          <p className="text-[11px] text-acclaim-steel">
            Values from current Acclaim spec sheets. Lumens are maximum white-light output per linear foot.
          </p>
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <div className="md:hidden space-y-6 print:hidden">
        {sections.map(({ group, items }) => (
          <section key={group?.id || 'flat'} className="space-y-3">
            {group && (
              <header className="px-1">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-acclaim-ocean">{group.name}</h3>
                <p className="text-xs text-acclaim-steel">{group.blurb}</p>
              </header>
            )}
            {items.map((p) => (
              <ProductCardCompact key={p.id} product={p} />
            ))}
          </section>
        ))}
        <div className="glass-panel p-4">
          <Legend />
        </div>
      </div>
    </div>
  );
}

const FragmentRows = ({ group, items }) => (
  <>
    {group && <GroupRow group={group} count={items.length} />}
    {items.map((p) => (
      <ProductRow key={p.id} product={p} />
    ))}
  </>
);
