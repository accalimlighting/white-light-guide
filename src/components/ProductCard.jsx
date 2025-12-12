import { useState } from 'react';
import { ChevronDown, ChevronUp, Zap, ExternalLink, AlertTriangle, X } from 'lucide-react';

const warmChip = 'bg-[#FCE3DB] text-[#8C2C19] border-[#F7C6B7]';
const neutralChip = 'bg-[#E6EEF6] text-[#1F3550] border-[#C8D5E4]';
const coolChip = 'bg-[#DCEFF4] text-[#0C3E57] border-[#B4E0EA]';

const cctColorMap = {
  '1800K': '#FFAA50',
  '2100K': '#FF9B3D',
  '2200K': '#FFC477',
  '2400K': '#FFD494',
  '2700K': '#FFE0B2',
  '3000K': '#FFE8CC',
  '3500K': '#FFF2E5',
  '4000K': '#FFFFFF',
  '4500K': '#F1F6FF',
  '5000K': '#E3EEFF',
  '5500K': '#D4E8FF',
};

const cctBorderMap = {
  '4000K': '#D1D6E0',
};

const getCCTClass = (cct) => {
  if (!cct) return 'bg-acclaim-mist text-acclaim-slate border-acclaim-cloud';
  if (cct.includes('RGB')) return 'bg-gradient-to-r from-acclaim-accent/40 via-acclaim-teal/30 to-acclaim-accent/40 text-acclaim-slate border-transparent';
  if (cct === 'TBD') return 'bg-acclaim-mist text-acclaim-slate border-acclaim-cloud';
  if (cctColorMap[cct]) return 'text-acclaim-slate';
  const value = parseInt(cct.replace('K', ''), 10);
  if (!Number.isNaN(value)) {
    if (value <= 3200) return warmChip;
    if (value <= 4500) return neutralChip;
    return coolChip;
  }
  return 'bg-acclaim-mist text-acclaim-slate border-acclaim-cloud';
};

const getCCTStyle = (cct) => {
  const color = cctColorMap[cct];
  if (!color) return undefined;
  return {
    backgroundColor: color,
    borderColor: cctBorderMap[cct] || color,
    borderWidth: cctBorderMap[cct] ? '1px' : undefined,
    borderStyle: cctBorderMap[cct] ? 'solid' : undefined,
  };
};

// IP Rating badge colors
const getIPBadgeClass = (ip) => {
  if (!ip) return 'bg-acclaim-mist text-acclaim-slate';
  const normalized = ip.toLowerCase();
  if (normalized.includes('ip6')) return 'bg-acclaim-teal text-white'; // apply IP68 color to IP68/67/66
  if (normalized.includes('ip20') || normalized.includes('ip40')) return 'bg-[#002A41] text-white'; // apply IP20 color to IP20/IP40
  if (normalized.includes('dry')) return 'bg-[#002A41] text-white';
  return 'bg-acclaim-slate text-white';
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
    <div className="bg-acclaim-mist rounded-xl p-4 border border-acclaim-cloud/70">
      <h5 className="text-[11px] font-semibold text-acclaim-steel uppercase tracking-[0.3em] mb-3">{title}</h5>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-start text-sm">
            <div className="flex-1">
              <span className="text-acclaim-slate">{item.name}</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-semibold text-xs text-acclaim-slate bg-white/60 px-1.5 py-0.5 rounded border border-acclaim-cloud/70">{item.sku}</span>
                {item.note && <span className="text-xs text-acclaim-accent font-medium">{item.note}</span>}
              </div>
            </div>
            {!hidePricing && (
              <div className="text-right ml-3">
                <span className="font-semibold text-acclaim-teal">{formatPrice(item.price)}</span>
                {item.pricePer && (
                  <span className="block text-xs text-acclaim-steel">{formatPrice(item.pricePer)}/ft</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const hidePricing = import.meta.env.VITE_HIDE_PRICING === 'true';

export default function ProductCard({ product, isExpanded, onToggle }) {
  const lowestPrice = product.variants.reduce((min, v) => 
    v.pricePer > 0 && v.pricePer < min ? v.pricePer : min, 
    product.variants[0]?.pricePer || 0
  );
  const [wiringModal, setWiringModal] = useState(null);

  return (
    <div className={`glass-panel overflow-hidden transition-all duration-200 relative ${product.isPlaceholder ? 'ring-1 ring-amber-300/60' : ''}`}>
      {/* Card Header - Always Visible */}
      <div className="p-6 cursor-pointer" onClick={onToggle}>
        <div className="flex items-start gap-5">
          {/* Product Image */}
          <div className="flex-shrink-0 w-32 h-24 bg-white rounded-lg overflow-hidden border border-acclaim-cloud/80 shadow-inner">
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
                  <h3 className="text-xl font-semibold text-acclaim-slate tracking-tight">
                    {product.name}
                    {product.subtitle && (
                      <span className="text-xl font-semibold text-acclaim-slate tracking-tight"> {product.subtitle}</span>
                    )}
                  </h3>
                  {product.isPlaceholder && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                      <AlertTriangle className="w-3 h-3" />
                      Specs TBD
                    </span>
                  )}
                </div>
                <p className="text-acclaim-steel text-sm mt-1">{product.tagline}</p>
              </div>
              
              <div className="ml-4 flex items-center text-acclaim-steel">
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
              <div className="flex items-center gap-1.5 text-sm text-acclaim-slate">
                <Zap className="w-4 h-4 text-acclaim-accent" />
                <span>{product.specs.wattage}</span>
              </div>

              {/* Lumens */}
              {product.specs.lumens && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-acclaim-mist text-acclaim-slate border border-acclaim-cloud">
                  {product.displayOptions?.lumenChip || product.specs.lumens}
                </span>
              )}

              {/* CRI if available */}
              {product.displayOptions?.showCriBadge !== false && product.specs.cri && product.specs.cri !== 'N/A' && (
                <span className="text-sm text-acclaim-ocean font-semibold">
                  CRI {product.specs.cri}
                </span>
              )}

              {/* CCT Chips */}
              <div className="flex flex-wrap gap-1.5">
                {product.ccts.slice(0, 5).map(cct => (
                  <span 
                    key={cct} 
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getCCTClass(cct)}`}
                    style={getCCTStyle(cct)}
                  >
                    {cct}
                  </span>
                ))}
                {product.ccts.length > 5 && (
                  <span className="text-xs text-slate-500">+{product.ccts.length - 5} more</span>
                )}
              </div>

              {/* Quick Ship + Price Per Foot */}
              {(product.displayOptions?.quickShip || (!hidePricing && lowestPrice > 0)) && (
                <div className="ml-auto flex items-center gap-2">
                  {product.displayOptions?.quickShip && (
                    <img
                      src="/QuickShipLogo.svg"
                      alt="Quick Ship"
                      className="h-5 w-auto"
                    />
                  )}
                  {!hidePricing && lowestPrice > 0 && (
                    <>
                      <span className="text-sm text-acclaim-steel">from</span>
                      <span className="text-lg font-semibold text-acclaim-teal">${lowestPrice.toFixed(2)}/ft</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-acclaim-cloud/60 bg-white/80">
          {/* Specifications */}
          <div className="p-6 bg-acclaim-mist/50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[11px] font-semibold text-acclaim-steel tracking-[0.3em]">SPECIFICATIONS</h4>
              <a 
                href={product.specSheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-acclaim-accent hover:text-acclaim-coral font-semibold"
              >
                View Product Page
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-[11px] text-acclaim-steel uppercase tracking-[0.25em]">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                  <dd className="text-sm font-semibold text-acclaim-slate mt-1">{value}</dd>
                </div>
              ))}
            </div>
          </div>

          {/* Variants & Pricing */}
          <div className="p-6">
            <h4 className="text-[11px] font-semibold text-acclaim-steel tracking-[0.3em] mb-4">VARIANTS & DN PRICING</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-acclaim-steel border-b border-acclaim-cloud/70 uppercase text-[11px] tracking-[0.3em]">
                    {product.variants[0]?.length && <th className="pb-2">Length</th>}
                    <th className="pb-2">CCT</th>
                    <th className="pb-2">SKU</th>
                    {product.variants[0]?.output && <th className="pb-2">Output</th>}
                    {!hidePricing && <th className="pb-2 text-right">DN Price</th>}
                    {!hidePricing && <th className="pb-2 text-right">$/ft</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-acclaim-cloud/60">
                  {product.variants.map((variant, idx) => (
                    <tr key={idx} className="hover:bg-acclaim-mist/50">
                      {variant.length && <td className="py-2.5 font-medium text-acclaim-slate">{variant.length}</td>}
                      <td className="py-2.5">
                        <div className="flex flex-wrap gap-1.5">
                          {(variant.cct?.includes(',')
                            ? variant.cct.split(',').map(c => c.trim()).filter(Boolean)
                            : [variant.cct]
                          ).map((cctValue, idx) => (
                            <span
                              key={`${variant.sku || idx}-${cctValue}`}
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getCCTClass(cctValue)}`}
                              style={getCCTStyle(cctValue)}
                            >
                              {cctValue}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5">
                        <span className="font-semibold text-xs text-acclaim-slate bg-acclaim-mist px-1.5 py-0.5 rounded">
                          {variant.sku}
                        </span>
                        {variant.note && (
                          <span className="mt-1 inline-flex items-center rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-[11px] font-semibold">
                            {variant.note}
                          </span>
                        )}
                      </td>
                      {variant.output && <td className="py-2.5 text-acclaim-steel">{variant.output}</td>}
                      {!hidePricing && (
                        <>
                          <td className="py-2.5 text-right font-semibold text-acclaim-teal">{formatPrice(variant.price)}</td>
                          <td className="py-2.5 text-right font-bold text-acclaim-accent">{formatPrice(variant.pricePer)}/ft</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Wiring Overview */}
          {product.wiring && (
            <div className="p-6 border-t border-acclaim-cloud/70 space-y-4">
              <h4 className="text-[11px] font-semibold text-acclaim-steel tracking-[0.3em]">
                {(product.wiring && product.wiring.heading) ? product.wiring.heading.toUpperCase() : 'TYPICAL WIRING'}
              </h4>
              <div className="flex flex-col lg:flex-row gap-6 pt-2">
                {product.wiring.diagram && (
                  <div className="flex-shrink-0 lg:w-1/2 p-4">
                    <button
                      type="button"
                      onClick={() => setWiringModal({ src: product.wiring.diagram, alt: `Wiring diagram for ${product.name}` })}
                      className="block w-full focus:outline-none focus:ring-2 focus:ring-acclaim-accent/50 rounded-2xl"
                    >
                      <img
                        src={product.wiring.diagram}
                        alt={`Wiring diagram for ${product.name}`}
                        className="w-full rounded-2xl border border-acclaim-cloud/70 bg-white shadow-sm"
                      />
                    </button>
                  </div>
                )}
                <div className="flex-1 space-y-3 text-sm text-acclaim-slate">
                  {product.wiring.heading && (
                    <p className="text-acclaim-slate font-semibold">{product.wiring.heading}</p>
                  )}
                  {product.wiring.description && <p>{product.wiring.description}</p>}
                  {product.wiring.bullets && product.wiring.bullets.length > 0 && (
                    <ul className="list-disc pl-5 space-y-1">
                      {product.wiring.bullets.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {product.wiring.driverRuns && product.wiring.driverRuns.length > 0 && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {product.wiring.driverRuns.map(({ name, detail }) => (
                        <div key={name} className="rounded-xl border border-acclaim-cloud/70 bg-white/80 px-3 py-2">
                          <p className="text-xs text-acclaim-steel uppercase tracking-[0.25em]">{name}</p>
                          <p className="text-sm font-semibold text-acclaim-slate">{detail}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Accessories */}
          {product.accessories && Object.keys(product.accessories).length > 0 && (
            <div className="p-6 border-t border-acclaim-cloud/70">
              <h4 className="text-[11px] font-semibold text-acclaim-steel tracking-[0.3em] mb-4">ACCESSORIES</h4>
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

      {wiringModal && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setWiringModal(null)}
        >
          <div
            className="relative max-w-6xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setWiringModal(null)}
              className="absolute -top-3 -right-3 bg-white text-acclaim-slate rounded-full shadow-lg p-2 hover:bg-acclaim-mist focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close wiring diagram"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={wiringModal.src}
              alt={wiringModal.alt}
              className="w-full max-h-[80vh] object-contain rounded-2xl border border-acclaim-cloud/80 bg-white"
            />
          </div>
        </div>
      )}
    </div>
  );
}
