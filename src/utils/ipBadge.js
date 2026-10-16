// Shared IP-rating badge colors used by the product guide and the comparison table.
export const getIPBadgeClass = (ip) => {
  if (!ip) return 'bg-acclaim-mist text-acclaim-slate';
  const normalized = ip.toLowerCase();
  if (normalized.includes('ip6')) return 'bg-acclaim-teal text-white'; // IP66 / IP67 / IP68
  if (normalized.includes('ip20') || normalized.includes('ip40')) return 'bg-[#002A41] text-white';
  if (normalized.includes('dry')) return 'bg-[#002A41] text-white';
  return 'bg-acclaim-slate text-white';
};
