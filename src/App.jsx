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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">White Light Linear</h1>
                <p className="text-slate-400 text-sm">Quick Reference Guide • DN Pricing • November 2025</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400 hidden md:block">Prepared for ARDD+Winter</span>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-400 tracking-wider">ACCLAIM</div>
                <div className="text-[10px] text-slate-500 tracking-[0.3em]">LIGHTING</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Controls Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-[72px] z-40 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products, SKUs, specs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              {/* IP Rating Filter */}
              <select
                value={selectedIP}
                onChange={(e) => setSelectedIP(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm"
              >
                {ipRatings.map(ip => (
                  <option key={ip.id} value={ip.id}>{ip.name}</option>
                ))}
              </select>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={expandAll}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="px-4 py-2 text-sm bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-medium"
                >
                  Collapse
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition font-medium flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Print / PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-3 text-sm text-slate-500">
            Showing {filteredProducts.length} of {products.length} products
            {(selectedCategory !== 'all' || selectedIP !== 'all' || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedIP('all');
                  setSearchTerm('');
                }}
                className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product List */}
      <main className="max-w-7xl mx-auto px-4 py-6" ref={printRef}>
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
          <div className="text-center py-16">
            <div className="text-slate-400 text-lg mb-2">No products match your criteria</div>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedIP('all');
                setSearchTerm('');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm">All prices shown are DN (Dealer Net) • November 2025</p>
              <p className="text-xs mt-1">Contact Acclaim Lighting for current availability and lead times</p>
            </div>
            <div className="text-sm">
              <a 
                href="https://www.acclaimlighting.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                acclaimlighting.com
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
