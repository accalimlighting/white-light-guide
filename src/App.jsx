import { useState, useRef } from 'react';
import { Search, ChevronDown, ChevronUp, Filter, Printer, ExternalLink, X } from 'lucide-react';
import { products, categories, ipRatings } from './data/products';
import ProductCard from './components/ProductCard';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProducts, setExpandedProducts] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIP, setSelectedIP] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const printRef = useRef();

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

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.subtitle && product.subtitle.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    const matchesIP = selectedIP === 'all' || 
      (product.specs.ip && product.specs.ip.toLowerCase().includes(selectedIP.toLowerCase()));
    
    return matchesSearch && matchesCategory && matchesIP;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-acclaim-fog">
      {/* Hero */}
      <header className="relative hero-gradient text-white pb-24">
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_60%_20%,rgba(242,108,95,0.4),transparent_55%)]" />
        <div className="relative max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.4em] text-acclaim-teal/80">Acclaim Lighting</p>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">White Light Guide</h1>
              <p className="text-base md:text-lg text-white/75 max-w-2xl">
                A quick-reference companion for the White Light Linear family with DN pricing, specs, and accessories presented in the refined Acclaim brand system highlighted in the current style guide.
              </p>
            </div>
            <div className="bg-white/10 border border-white/15 rounded-2xl px-6 py-4 backdrop-blur max-w-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">Prepared for</p>
              <p className="text-2xl font-semibold">ARDD + Winter</p>
              <p className="text-sm text-white/70">Updated November 2025</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 text-sm">
            {[
              { label: 'Guide Focus', value: 'White Light Linear Portfolio' },
              { label: 'Pricing Format', value: 'Dealer Net (DN)' },
              { label: 'Support', value: 'standards@acclaimlighting.com' },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 backdrop-blur">
                <p className="text-white/60 uppercase text-[11px] tracking-[0.3em]">{item.label}</p>
                <p className="text-base font-medium mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Controls Bar */}
      <section className="relative -mt-12 px-4 no-print z-20">
        <div className="glass-panel max-w-6xl mx-auto p-6 sticky top-4">
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

            {/* Filters & Actions */}
            <div className="flex flex-wrap items-center gap-3 justify-end">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-acclaim-cloud bg-acclaim-mist text-sm text-acclaim-slate focus:outline-none focus:ring-2 focus:ring-acclaim-accent/30"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <select
                value={selectedIP}
                onChange={(e) => setSelectedIP(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-acclaim-cloud bg-acclaim-mist text-sm text-acclaim-slate focus:outline-none focus:ring-2 focus:ring-acclaim-accent/30"
              >
                {ipRatings.map(ip => (
                  <option key={ip.id} value={ip.id}>{ip.name}</option>
                ))}
              </select>

              <div className="flex flex-wrap gap-2">
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
                  Collapse
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 text-sm rounded-xl bg-acclaim-navy text-white font-medium flex items-center gap-2 shadow-sm hover:-translate-y-0.5 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Print</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-acclaim-steel flex flex-wrap items-center gap-3">
            <span className="font-medium text-acclaim-slate">
              Showing {filteredProducts.length} of {products.length} products
            </span>
            {(selectedCategory !== 'all' || selectedIP !== 'all' || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedIP('all');
                  setSearchTerm('');
                }}
                className="text-acclaim-accent font-medium hover:underline"
              >
                Clear filters
              </button>
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
              onClick={() => {
                setSelectedCategory('all');
                setSelectedIP('all');
                setSearchTerm('');
              }}
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
            <p>All prices shown are DN (Dealer Net) • November 2025</p>
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
