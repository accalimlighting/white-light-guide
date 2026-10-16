import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageHero from '../components/PageHero';
import { pageKinds, pages, quoteEmail, siteDomain } from '../site';
import { products } from '../data/products.generated';
import { comparisonProducts } from '../data/coveComparison';

const pageStats = {
  'white-light-guide': `${products.length} products · variants, accessories & wiring`,
  'cove-comparison': `${comparisonProducts.length} products · 11 capability columns`,
};

export default function Home() {
  const guides = pages.filter((p) => p.kind === 'guide');
  const charts = pages.filter((p) => p.kind === 'comparison');

  return (
    <>
      <PageHero
        size="large"
        eyebrow={siteDomain}
        title="Acclaim product guides"
        description="Sales reference guides and comparison charts for Acclaim Lighting's product families, kept in step with the current specification sheets."
        tiles={[
          { label: 'Reference guides', value: `${guides.length}` },
          { label: 'Comparison charts', value: `${charts.length}` },
          { label: 'For official quotations', value: quoteEmail, isMail: true },
        ]}
      />

      <main className="relative -mt-12 z-10 max-w-6xl mx-auto px-4 pb-10">
        <div className="grid gap-5 md:grid-cols-2">
          {pages.map((page) => {
            const kind = pageKinds[page.kind];
            return (
              <Link
                key={page.id}
                to={page.path}
                className="group glass-panel p-7 flex flex-col gap-4 transition hover:-translate-y-0.5 hover:shadow-[0_24px_50px_rgba(3,35,63,0.14)] focus:outline-none focus:ring-2 focus:ring-acclaim-accent/40"
              >
                <span className={`self-start rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${kind.className}`}>
                  {kind.label}
                </span>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold tracking-tight text-acclaim-slate">{page.title}</h2>
                  <p className="text-sm text-acclaim-steel leading-relaxed">{page.description}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2 text-sm">
                  <span className="text-acclaim-steel">{pageStats[page.id]}</span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-acclaim-accent group-hover:gap-2.5 transition-all">
                    Open
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
