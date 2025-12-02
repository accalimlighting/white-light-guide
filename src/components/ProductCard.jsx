import { useState } from 'react';
import { ChevronDown, ChevronUp, Zap, Droplets, Sun, ExternalLink, AlertTriangle } from 'lucide-react';

// CCT color mapping
const cctColors = {
  '2400K': 'bg-amber-100 text-amber-800 border-amber-200',
  '2700K': 'bg-orange-100 text-orange-800 border-orange-200',
  '3000K': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  '3500K': 'bg-lime-100 text-lime-800 border-lime-200',
  '4000K': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  '5000K': 'bg-blue-100 text-blue-800 border-blue-200',
  '6500K': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'RGBW': 'bg-gradient-to-r from-red-100 via-green-100 to-blue-100 text-slate-800 border-purple-200',
  'Dynamic RGBW': 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200',
  'TBD': 'bg-slate-100 text-slate-500 border-slate-200',
};

const getCCTClass = (cct) => cctColors[cct] || 'bg-slate-100 text-slate-700 border-slate-200';

// IP Rating badge colors
const getIPBadgeClass = (ip) => {
  if (!ip) return 'bg-slate-100 text-slate-600';
  if (ip.includes('IP68')) return 'bg-blue-600 text-white';
  if (ip.includes('IP66')) return 'bg-blue-500 text-white';
  if (ip.includes('IP40')) return 'bg-emerald-500 text-white';
  if (ip.toLowerCase().includes('dry')) return 'bg-amber-500 text-white';
  return 'bg-slate-500 text-white';
};

// Format price
const formatPrice = (price) => {
  if (price === 0) return 'TBD';
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Accessory Section Component
const AccessorySection = ({ title, items }) => {
  if (!items || items.length === 0) return null;
  
  return (
    <div className="bg-slate-50 rounded-lg p-4">
      <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">{title}</h5>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-start text-sm">
            <div className="flex-1">
              <span className="text-slate-700">{item.name}</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{item.sku}</span>
                {item.note && <span className="text-xs text-blue-600">{item.note}</span>}
              </div>
            </div>
            <div className="text-right ml-3">
              <span className="font-semibold text-emerald-600">{formatPrice(item.price)}</span>
              {item.pricePer && (
                <span className="block text-xs text-slate-500">{formatPrice(item.pricePer)}/ft</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ProductCard({ product, isExpanded, onToggle }) {
  const lowestPrice = product.variants.reduce((min, v) => 
    v.pricePer > 0 && v.pricePer < min ? v.pricePer : min, 
    product.variants[0]?.pricePer || 0
  );

  return (
    <div className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-200 hover:shadow-md ${product.isPlaceholder ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200'}`}>
      {/* Card Header - Always Visible */}
      <div className="p-5 cursor-pointer" onClick={onToggle}>
        <div className="flex items-start gap-5">
          {/* Product Image */}
          <div className="flex-shrink-0 w-32 h-24 bg-white rounded-lg overflow-hidden border border-slate-100">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-contain p-2"
              onError={(e) => {
                e.target.src = '/placeholder.png';
              }}
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-bold text-slate-900">{product.name}</h3>
                  {product.subtitle && (
                    <span className="text-lg text-slate-500 font-medium">{product.subtitle}</span>
                  )}
                  {product.isPlaceholder && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                      <AlertTriangle className="w-3 h-3" />
                      Specs TBD
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-sm mt-1">{product.tagline}</p>
              </div>
              
              <div className="ml-4 flex items-center text-slate-400">
                {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
              </div>
            </div>

            {/* Quick Specs Row */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              {/* IP Rating Badge */}
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getIPBadgeClass(product.specs.ip)}`}>
                {product.specs.ip}
              </span>
              
              {/* Wattage */}
              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>{product.specs.wattage}</span>
              </div>

              {/* CRI if available */}
              {product.specs.cri && product.specs.cri !== 'N/A' && (
                <span className="text-sm text-purple-600 font-medium">
                  CRI {product.specs.cri}
                </span>
              )}

              {/* CCT Chips */}
              <div className="flex flex-wrap gap-1.5">
                {product.ccts.slice(0, 5).map(cct => (
                  <span 
                    key={cct} 
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getCCTClass(cct)}`}
                  >
                    {cct}
                  </span>
                ))}
                {product.ccts.length > 5 && (
                  <span className="text-xs text-slate-500">+{product.ccts.length - 5} more</span>
                )}
              </div>

              {/* Price Per Foot */}
              {lowestPrice > 0 && (
                <div className="ml-auto flex items-center gap-1">
                  <span className="text-sm text-slate-500">from</span>
                  <span className="text-lg font-bold text-emerald-600">${lowestPrice.toFixed(2)}/ft</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-slate-100">
          {/* Specifications */}
          <div className="p-5 bg-slate-50/50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-slate-700">SPECIFICATIONS</h4>
              <a 
                href={product.specSheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View Spec Sheet
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-xs text-slate-500 uppercase tracking-wide">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                  <dd className="text-sm font-medium text-slate-900 mt-0.5">{value}</dd>
                </div>
              ))}
            </div>
          </div>

          {/* Variants & Pricing */}
          <div className="p-5">
            <h4 className="text-sm font-semibold text-slate-700 mb-4">VARIANTS & DN PRICING</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-200">
                    {product.variants[0]?.length && <th className="pb-2 font-medium">Length</th>}
                    <th className="pb-2 font-medium">CCT</th>
                    <th className="pb-2 font-medium">SKU</th>
                    {product.variants[0]?.output && <th className="pb-2 font-medium">Output</th>}
                    <th className="pb-2 font-medium text-right">DN Price</th>
                    <th className="pb-2 font-medium text-right">$/ft</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {product.variants.map((variant, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      {variant.length && <td className="py-2.5 font-medium text-slate-900">{variant.length}</td>}
                      <td className="py-2.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getCCTClass(variant.cct)}`}>
                          {variant.cct}
                        </span>
                      </td>
                      <td className="py-2.5">
                        <span className="font-mono text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {variant.sku}
                        </span>
                      </td>
                      {variant.output && <td className="py-2.5 text-slate-600">{variant.output}</td>}
                      <td className="py-2.5 text-right font-semibold text-emerald-600">{formatPrice(variant.price)}</td>
                      <td className="py-2.5 text-right font-bold text-emerald-700">{formatPrice(variant.pricePer)}/ft</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Accessories */}
          {product.accessories && Object.keys(product.accessories).length > 0 && (
            <div className="p-5 border-t border-slate-100">
              <h4 className="text-sm font-semibold text-slate-700 mb-4">ACCESSORIES</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AccessorySection title="Channels" items={product.accessories.channels} />
                <AccessorySection title="Lenses" items={product.accessories.lenses} />
                <AccessorySection title="Connectors" items={product.accessories.connectors} />
                <AccessorySection title="Cables" items={product.accessories.cables} />
                <AccessorySection title="Mounting" items={product.accessories.mounting} />
                <AccessorySection title="Beam Control" items={product.accessories.beamControl} />
                <AccessorySection title="Drivers & Power" items={product.accessories.drivers} />
                <AccessorySection title="Control" items={product.accessories.control} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
