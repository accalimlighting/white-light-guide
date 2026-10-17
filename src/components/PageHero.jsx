// Shared hero banner used at the top of every page.
export default function PageHero({ eyebrow, title, description, width = 'max-w-6xl', size = 'default' }) {
  const large = size === 'large';
  return (
    <header className="relative hero-gradient text-white pb-24">
      <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_60%_20%,rgba(242,108,95,0.4),transparent_55%)]" />
      <div className={`relative ${width} mx-auto px-4 ${large ? 'pt-14 pb-4' : 'pt-10 pb-2'}`}>
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
      </div>
    </header>
  );
}
