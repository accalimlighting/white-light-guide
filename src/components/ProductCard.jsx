import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Zap, AlertTriangle, X } from 'lucide-react';

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

const multiColorLetters = {
  R: '#E53E3E',
  G: '#38A169',
  B: '#3182CE',
  L: '#84CC16',
  A: '#D97706',
};

const isMultiColorChip = (cct) => ['RGBL', 'RGBA', 'RGBW', 'RGBAL', 'DW'].includes(cct);

const multiColorGradients = {
  RGBL: 'linear-gradient(to right, #E53E3E, #38A169, #3182CE, #84CC16)',
  RGBA: 'linear-gradient(to right, #E53E3E, #38A169, #3182CE, #D97706)',
  RGBW: 'linear-gradient(to right, #E53E3E, #38A169, #3182CE, #E5E7EB)',
  RGBAL: 'linear-gradient(to right, #E53E3E, #38A169, #3182CE, #D97706, #84CC16)',
};

const MultiColorChip = ({ cct }) => {
  if (cct === 'DW') {
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-acclaim-slate border border-transparent"
        style={{ background: `linear-gradient(to right, ${cctColorMap['2400K']}, ${cctColorMap['4000K']})` }}
      >
        DW
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white border border-transparent"
      style={{ background: multiColorGradients[cct] }}
    >
      {cct}
    </span>
  );
};

const getCCTClass = (cct) => {
  if (!cct) return 'bg-acclaim-mist text-acclaim-slate border-acclaim-cloud';
  if (isMultiColorChip(cct)) return '';
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

// Lumen breakdown chip colors
const lumenChipStyles = {
  white: 'bg-amber-50 text-amber-800 border-amber-200',
  color: 'bg-purple-50 text-purple-800 border-purple-200',
  scs: 'bg-blue-50 text-blue-800 border-blue-200',
};

export default function ProductCard({ product }) {
  const lowestPrice = product.variants?.length
    ? product.variants.reduce((min, v) =>
        v.price > 0 && v.price < min ? v.price : min,
        product.variants[0]?.price || 0
      )
    : 0;
  const [imageModal, setImageModal] = useState(null);

  return (
    <div className={`glass-panel overflow-hidden transition-all duration-200 relative ${product.isPlaceholder ? 'ring-1 ring-amber-300/60' : ''}`}>
      {/* Card Content */}
      <div className="p-6">
        <div className="flex items-start gap-5">
          {/* Product Image */}
          <button
            type="button"
            className="flex-shrink-0 w-40 h-32 bg-white rounded-lg overflow-hidden border border-acclaim-cloud/80 shadow-inner cursor-zoom-in hover:ring-2 hover:ring-acclaim-accent/30 transition"
            onClick={(e) => {
              e.stopPropagation();
              setImageModal({ src: product.image, alt: product.name });
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-contain ${product.imageScale || 'scale-100'}`}
              onError={(e) => {
                e.target.src = '/placeholder.png';
              }}
            />
          </button>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-semibold text-acclaim-slate tracking-tight">
                    {product.name}
                  </h3>
                  {product.isPlaceholder && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                      <AlertTriangle className="w-3 h-3" />
                      Specs TBD
                    </span>
                  )}
                </div>
                {product.subtitle && <p className="text-acclaim-steel text-sm mt-1">{product.subtitle}</p>}
                {product.tagline && <p className="text-acclaim-steel text-sm mt-1">{product.tagline}</p>}
                {product.bulletPoints && (
                  <ul className="text-acclaim-steel text-sm mt-2 space-y-1 list-disc pl-4">
                    {product.bulletPoints.map((bp, i) => <li key={i}>{bp}</li>)}
                  </ul>
                )}
              </div>

            </div>

            {/* Quick Specs Row */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              {/* IP Rating Badge */}
              {product.specs.ip && product.specs.ip !== 'TBD' && (
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getIPBadgeClass(product.specs.ip)}`}>
                  {product.specs.ip}
                </span>
              )}

              {/* Power */}
              {product.specs.power && product.specs.power !== 'TBD' && (
                <div className="flex items-center gap-1.5 text-sm text-acclaim-slate">
                  <Zap className="w-4 h-4 text-acclaim-accent" />
                  <span>{product.specs.power}</span>
                </div>
              )}

              {/* Lumen Breakdown Chips */}
              {product.lumensBreakdown ? (
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(product.lumensBreakdown).map(([type, value]) => (
                    <span
                      key={type}
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${lumenChipStyles[type] || 'bg-acclaim-mist text-acclaim-slate border-acclaim-cloud'}`}
                    >
                      {type === 'scs' ? 'SCS' : type.charAt(0).toUpperCase() + type.slice(1)}: {value} lm
                    </span>
                  ))}
                </div>
              ) : product.specs.lumens && product.specs.lumens !== 'TBD' && product.specs.lumens !== 'N/A' && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-acclaim-mist text-acclaim-slate border border-acclaim-cloud">
                  {product.specs.lumens}
                </span>
              )}

            </div>

            {/* CCT Chips - own row */}
            {product.ccts?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {product.ccts.map(cct =>
                  isMultiColorChip(cct) ? (
                    <MultiColorChip key={cct} cct={cct} />
                  ) : (
                    <span
                      key={cct}
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getCCTClass(cct)}`}
                      style={getCCTStyle(cct)}
                    >
                      {cct}
                    </span>
                  )
                )}
              </div>
            )}

            {/* Technologies */}
            {product.technologies && (
              <div className="flex flex-wrap gap-2 mt-3">
                {product.technologies.map((tech, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-acclaim-ocean/10 border border-acclaim-ocean/20 text-sm">
                    <span className="font-semibold text-acclaim-ocean">{tech.name}</span>
                    <span className="text-acclaim-steel">— {tech.description}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Price - always last */}
            {!hidePricing && product.priceLines ? (
              <div className="flex justify-end mt-3 space-y-1">
                <div className="text-right">
                  {product.priceLines.map((line, i) => (
                    <div key={i}>
                      <span className="text-sm text-acclaim-steel">USA DN </span>
                      <span className="text-lg font-semibold text-acclaim-teal">${line.price.toFixed(2)}{product.priceUnit ? ` ${product.priceUnit}` : ''}</span>
                      {line.note && <span className="block text-xs text-acclaim-steel">{line.note}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ) : !hidePricing && lowestPrice > 0 && (
              <div className="flex justify-end mt-3">
                <div className="text-right">
                  <span className="text-sm text-acclaim-steel">USA DN </span>
                  <span className="text-lg font-semibold text-acclaim-teal">${lowestPrice.toFixed(2)}{product.priceUnit ? ` ${product.priceUnit}` : ''}</span>
                  {product.priceNote && (
                    <span className="block text-xs text-acclaim-steel">{product.priceNote}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {imageModal && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setImageModal(null)}
        >
          <div
            className="relative max-w-6xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setImageModal(null)}
              className="absolute -top-3 -right-3 bg-white text-acclaim-slate rounded-full shadow-lg p-2 hover:bg-acclaim-mist focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close image"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={imageModal.src}
              alt={imageModal.alt}
              className="w-full max-h-[80vh] object-contain rounded-2xl border border-acclaim-cloud/80 bg-white"
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
