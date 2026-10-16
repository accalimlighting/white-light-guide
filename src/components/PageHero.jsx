// Shared hero banner used at the top of every page.
const tileGrid = { 1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3' };

export default function PageHero({ eyebrow, title, description, tiles = [], width = 'max-w-6xl', size = 'default' }) {
  const large = size === 'large';
  return (
    <header className="relative hero-gradient text-white pb-24">
      <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_60%_20%,rgba(242,108,95,0.4),transparent_55%)]" />
      <div className={`relative ${width} mx-auto px-4 ${large ? 'pt-14 pb-6' : 'pt-10 pb-2'}`}>
        <div className="space-y-4">
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/60">{eyebrow}</p>
          )}
          <h1 className={`font-semibold tracking-tight ${large ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'}`}>
            {title}
          </h1>
          {description && (
            <p className={`text-white/75 max-w-2xl ${large ? 'text-lg md:text-xl' : 'text-base md:text-lg'}`}>{description}</p>
          )}
        </div>

        {tiles.length > 0 && (
          <div className={`grid grid-cols-1 ${tileGrid[Math.min(tiles.length, 3)]} gap-4 mt-10 text-sm`}>
            {tiles.map((item) => (
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
        )}
      </div>
    </header>
  );
}
