import { useState, useRef, useMemo } from 'react';
import { Search, Printer, ExternalLink, X } from 'lucide-react';
import { products, categories, ipRatings } from './data/products.generated';
import lastUpdated from './lastUpdated';
import ProductCard from './components/ProductCard';

const hidePricing = import.meta.env.VITE_HIDE_PRICING === 'true';

const getLowestPricePerFoot = (product) => {
  if (!product?.variants?.length) return Number.POSITIVE_INFINITY;
  return product.variants.reduce((min, v) => {
    const price = Number.isFinite(v.pricePer) ? v.pricePer : Number.POSITIVE_INFINITY;
    return price > 0 && price < min ? price : min;
  }, Number.POSITIVE_INFINITY);
};

const sortByNumberThenAlpha = (values = []) => {
  const parseFirstNumber = (val) => {
    const match = `${val}`.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : Number.NaN;
  };
  return [...values].sort((a, b) => {
    const na = parseFirstNumber(a);
    const nb = parseFirstNumber(b);
    const aIsNum = !Number.isNaN(na);
    const bIsNum = !Number.isNaN(nb);
    if (aIsNum && bIsNum && na !== nb) return na - nb;
    return `${a}`.localeCompare(`${b}`, undefined, { sensitivity: 'base' });
  });
};

const sortCCTs = (values = []) => {
  const parseCct = (val) => {
    const match = `${val}`.match(/([\d.]+)\s*K?/i);
    return match ? parseFloat(match[1]) : Number.NaN;
  };
  return [...values].sort((a, b) => {
    const na = parseCct(a);
    const nb = parseCct(b);
    const aIsNum = !Number.isNaN(na);
    const bIsNum = !Number.isNaN(nb);
    if (aIsNum && bIsNum && na !== nb) return na - nb;
    return `${a}`.localeCompare(`${b}`, undefined, { sensitivity: 'base' });
  });
};

const uniqueWattages = sortByNumberThenAlpha(
  Array.from(
    new Set(
      products
        .map((product) => product.specs?.wattage)
        .filter((watt) => watt && watt !== 'TBD')
    )
  )
);

const uniqueCCTs = sortCCTs(
  Array.from(
    new Set(
      products.flatMap((product) => (product.ccts || []).filter((cct) => cct && cct !== 'TBD'))
    )
  )
);

const wattageFilters = [
  { value: 'all', label: 'Watts p/f' },
  ...uniqueWattages.map((watt) => ({ value: watt, label: watt })),
];

const cctFilters = [
  { value: 'all', label: 'CCT' },
  ...uniqueCCTs.map((cct) => ({ value: cct, label: cct })),
];

const buildAccessoryValues = (accessories = {}) =>
  Object.values(accessories)
    .filter(Boolean)
    .reduce((acc, items) => {
      if (Array.isArray(items)) {
        items.forEach((item) => {
          acc.push(
            item?.name,
            item?.sku,
            item?.note,
            item?.price?.toString(),
            item?.pricePer?.toString()
          );
        });
      }
      return acc;
    }, []);

const productSearchIndex = new Map(
  products.map((product) => {
    const specValues = Object.values(product.specs || {});
    const variantValues =
      product.variants?.reduce((acc, variant) => {
        acc.push(
          variant.length,
          variant.cct,
          variant.sku,
          variant.output,
          variant.price?.toString(),
          variant.pricePer?.toString()
        );
        return acc;
      }, []) ?? [];
    const accessoryValues = buildAccessoryValues(product.accessories);

    const textFragments = [
      product.name,
      product.subtitle,
      product.tagline,
      product.category,
      ...specValues,
      ...(product.ccts || []),
      ...variantValues,
      ...accessoryValues,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return [product.id, textFragments];
  })
);

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProducts, setExpandedProducts] = useState(new Set());
  const [selectedSeries, setSelectedSeries] = useState('all');
  const [selectedEnvironment, setSelectedEnvironment] = useState('all');
  const [selectedWattage, setSelectedWattage] = useState('all');
  const [selectedCCT, setSelectedCCT] = useState('all');
  const [sortMode, setSortMode] = useState('alpha'); // 'alpha' | 'price'
  const printRef = useRef();

  const applyFilters = ({
    series = selectedSeries,
    environment = selectedEnvironment,
    wattage = selectedWattage,
    cct = selectedCCT,
    term = searchTerm,
  } = {}) => {
    const normalizedTerm = term.toLowerCase();
    const normalizedEnvironment = environment.toLowerCase();
    const normalizedWattage = wattage.toLowerCase();

    return products.filter((product) => {
      const searchText = productSearchIndex.get(product.id) || '';
      const matchesSearch =
        !normalizedTerm.length || searchText.includes(normalizedTerm);

      const matchesSeries = series === 'all' || product.category === series;

      const productEnvironment = (product.specs.ip || '').toLowerCase();
      const matchesEnvironment =
        environment === 'all' || productEnvironment.includes(normalizedEnvironment);

      const productWattage = (product.specs.wattage || '').toLowerCase();
      const matchesWattage =
        wattage === 'all' || productWattage === normalizedWattage;

      const matchesCCT = cct === 'all' || product.ccts?.includes(cct);

      return matchesSearch && matchesSeries && matchesEnvironment && matchesWattage && matchesCCT;
    });
  };

  const toggleProduct = (productId) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  const expandAll = () => {
    setExpandedProducts(new Set(products.map(p => p.id)));
  };

  const collapseAll = () => {
    setExpandedProducts(new Set());
  };

  const filteredProducts = useMemo(() => {
    const results = applyFilters();
    return [...results].sort((a, b) => {
      if (!hidePricing && sortMode === 'price') {
        return getLowestPricePerFoot(a) - getLowestPricePerFoot(b);
      }
      return a.name.localeCompare(b.name);
    });
  }, [selectedSeries, selectedEnvironment, selectedWattage, selectedCCT, searchTerm, sortMode]);

  const seriesOptions = useMemo(() => {
    const available = new Set(applyFilters({ series: 'all' }).map((product) => product.category));
    const baseOptions = categories.filter(
      (cat) => cat.id === 'all' || available.has(cat.id)
    );

    if (selectedSeries !== 'all' && !baseOptions.some((opt) => opt.id === selectedSeries)) {
      const current = categories.find((cat) => cat.id === selectedSeries);
      if (current) baseOptions.push(current);
    }

    return baseOptions;
  }, [selectedSeries, selectedEnvironment, selectedWattage, selectedCCT, searchTerm]);

  const environmentOptions = useMemo(() => {
    const availableProducts = applyFilters({ environment: 'all' });
    const baseOptions = ipRatings.filter((ip) => {
      if (ip.id === 'all') return true;
      return availableProducts.some((product) =>
        (product.specs.ip || '').toLowerCase().includes(ip.id)
      );
    });

    if (selectedEnvironment !== 'all' && !baseOptions.some((opt) => opt.id === selectedEnvironment)) {
      const current = ipRatings.find((ip) => ip.id === selectedEnvironment);
      if (current) baseOptions.push(current);
    }

    return baseOptions;
  }, [selectedSeries, selectedEnvironment, selectedWattage, selectedCCT, searchTerm]);

  const dynamicWattageFilters = useMemo(() => {
    const available = new Set(
      applyFilters({ wattage: 'all' })
        .map((product) => product.specs?.wattage)
        .filter((watt) => watt && watt !== 'TBD')
        .map((watt) => watt.toLowerCase())
    );

    const filtered = wattageFilters.filter(
      (option) => option.value === 'all' || available.has(option.value.toLowerCase())
    );

    const sorted = [
      filtered.find((o) => o.value === 'all'),
      ...sortByNumberThenAlpha(filtered.filter((o) => o.value !== 'all').map((o) => o.value)).map(
        (value) => ({ value, label: value })
      ),
    ].filter(Boolean);

    if (selectedWattage !== 'all' && !sorted.some((opt) => opt.value === selectedWattage)) {
      sorted.push({ value: selectedWattage, label: selectedWattage });
    }

    return sorted;
  }, [selectedSeries, selectedEnvironment, selectedWattage, selectedCCT, searchTerm]);

  const dynamicCctFilters = useMemo(() => {
    const available = new Set(
      applyFilters({ cct: 'all' })
        .reduce((acc, product) => {
          if (Array.isArray(product.ccts)) {
            product.ccts.forEach((cct) => {
              if (cct && cct !== 'TBD') acc.push(cct);
            });
          }
          return acc;
        }, [])
    );

    const filtered = cctFilters.filter(
      (option) => option.value === 'all' || available.has(option.value)
    );

    const sorted = [
      filtered.find((o) => o.value === 'all'),
      ...sortCCTs(filtered.filter((o) => o.value !== 'all').map((o) => o.value)).map((value) => ({
        value,
        label: value,
      })),
    ].filter(Boolean);

    if (selectedCCT !== 'all' && !sorted.some((opt) => opt.value === selectedCCT)) {
      sorted.push({ value: selectedCCT, label: selectedCCT });
    }

    return sorted;
  }, [selectedSeries, selectedEnvironment, selectedWattage, selectedCCT, searchTerm]);

  const handlePrint = () => {
    window.print();
  };

  const resetFilters = () => {
    setSelectedSeries('all');
    setSelectedEnvironment('all');
    setSelectedWattage('all');
    setSelectedCCT('all');
    setSearchTerm('');
  };

  const filtersActive = 
    selectedSeries !== 'all' ||
    selectedEnvironment !== 'all' ||
    selectedWattage !== 'all' ||
    selectedCCT !== 'all';

  return (
    <div className="min-h-screen bg-acclaim-fog">
      {/* Hero */}
      <header className="relative hero-gradient text-white pb-24">
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_60%_20%,rgba(242,108,95,0.4),transparent_55%)]" />
        <div className="relative max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <img
                src="/Acclaim_Horizontal_Logo_Dark.svg"
                alt="Acclaim Lighting"
                className="w-48 h-auto drop-shadow-[0_4px_20px_rgba(1,21,42,0.35)]"
              />
              <h1 className="pt-3 text-3xl md:text-4xl font-semibold tracking-tight">
                Linear White Light Guide
              </h1>
              <p className="text-base md:text-lg text-white/75 max-w-2xl">
                A quick reference companion for Acclaim&apos;s white light linear products and associated accessories.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 text-sm">
            {[
              { label: 'Guide Focus', value: 'White Light Linear Portfolio' },
              !hidePricing && { label: 'Pricing Format', value: 'USA Distributor Net (DN)' },
              { label: 'For official quotations', value: 'quotes@acclaimlighting.com', isMail: true },
            ]
              .filter(Boolean)
              .map((item) => (
                <div key={item.label} className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 backdrop-blur">
                  <p className="text-white/60 uppercase text-[11px] tracking-[0.3em]">{item.label}</p>
                  {item.isMail ? (
                    <a
                      href={`mailto:${item.value}`}
                      className="text-base font-medium mt-1 inline-flex items-center gap-1 text-white hover:text-acclaim-teal transition"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-base font-medium mt-1">{item.value}</p>
                  )}
                </div>
              ))}
          </div>
        </div>
      </header>

      {/* Controls Bar */}
      <section className="relative -mt-12 px-4 no-print z-20">
        <div className="glass-panel max-w-6xl mx-auto p-6 sticky top-4 space-y-4">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-acclaim-steel w-4 h-4" />
              <input
                type="text"
                placeholder="Search products, SKUs, specs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-acclaim-cloud bg-white/70 text-acclaim-slate placeholder:text-acclaim-steel/70 focus:border-acclaim-accent focus:ring-2 focus:ring-acclaim-accent/30 transition-all"
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

            {/* Actions */}
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={expandAll}
                className="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-acclaim-accent to-acclaim-coral text-white font-semibold tracking-wide shadow hover:opacity-95 transition"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-4 py-2 text-sm rounded-xl border border-acclaim-cloud text-acclaim-slate bg-white/60 hover:bg-acclaim-fog font-medium"
              >
                Collapse All
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 text-sm rounded-xl bg-acclaim-navy text-white font-medium flex items-center gap-2 shadow-sm hover:-translate-y-0.5 transition"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print / PDF</span>
              </button>
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <select
              value={selectedSeries}
              onChange={(e) => setSelectedSeries(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-acclaim-cloud bg-acclaim-mist text-sm text-acclaim-slate focus:outline-none focus:ring-2 focus:ring-acclaim-accent/30"
            >
              {seriesOptions.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <select
              value={selectedEnvironment}
              onChange={(e) => setSelectedEnvironment(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-acclaim-cloud bg-acclaim-mist text-sm text-acclaim-slate focus:outline-none focus:ring-2 focus:ring-acclaim-accent/30"
            >
              {environmentOptions.map((ip) => (
                <option key={ip.id} value={ip.id}>{ip.name}</option>
              ))}
            </select>

            <select
              value={selectedWattage}
              onChange={(e) => setSelectedWattage(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-acclaim-cloud bg-acclaim-mist text-sm text-acclaim-slate focus:outline-none focus:ring-2 focus:ring-acclaim-accent/30"
            >
              {dynamicWattageFilters.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <select
              value={selectedCCT}
              onChange={(e) => setSelectedCCT(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-acclaim-cloud bg-acclaim-mist text-sm text-acclaim-slate focus:outline-none focus:ring-2 focus:ring-acclaim-accent/30"
            >
              {dynamicCctFilters.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="text-sm text-acclaim-steel flex flex-wrap items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <span className="font-medium text-acclaim-slate">
                Showing {filteredProducts.length} of {products.length} products
              </span>
              {(filtersActive || searchTerm) && (
                <button
                  onClick={resetFilters}
                  className="text-acclaim-accent font-medium hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
            {!hidePricing && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-acclaim-steel">Sort:</span>
                <div className="flex rounded-xl overflow-hidden border border-acclaim-cloud bg-white/70">
                  <button
                    type="button"
                    onClick={() => setSortMode('alpha')}
                    className={`px-3 py-1 text-xs font-semibold ${
                      sortMode === 'alpha'
                        ? 'bg-acclaim-teal text-white'
                        : 'text-acclaim-slate hover:bg-acclaim-mist/70'
                    }`}
                    aria-pressed={sortMode === 'alpha'}
                  >
                    Alphabetical
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortMode('price')}
                    className={`px-3 py-1 text-xs font-semibold border-l border-acclaim-cloud ${
                      sortMode === 'price'
                        ? 'bg-acclaim-teal text-white'
                        : 'text-acclaim-slate hover:bg-acclaim-mist/70'
                    }`}
                    aria-pressed={sortMode === 'price'}
                  >
                    Price / ft
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Product List */}
      <main className="max-w-6xl mx-auto px-4 py-10" ref={printRef}>
        <div className="space-y-4">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              isExpanded={expandedProducts.has(product.id)}
              onToggle={() => toggleProduct(product.id)}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 glass-panel">
            <div className="text-acclaim-slate text-lg mb-3 font-medium">No products match your criteria</div>
            <button
              onClick={resetFilters}
              className="text-acclaim-accent font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-acclaim-midnight text-acclaim-cloud py-8 mt-20 no-print">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-4 text-sm">
          <div>
            <p className="text-acclaim-steel mt-1">Last updated: {lastUpdated}</p>
            <p className="text-acclaim-steel mt-1">Contact Acclaim Lighting for availability and lead times</p>
          </div>
          <a 
            href="https://www.acclaimlighting.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-acclaim-teal hover:text-white flex items-center gap-1 font-medium"
          >
            acclaimlighting.com
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
