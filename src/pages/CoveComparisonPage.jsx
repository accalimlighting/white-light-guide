import PageHero from '../components/PageHero';
import CoveComparisonTable, { CoveComparisonControls, useCoveComparison } from '../components/CoveComparison';
import { quoteEmail } from '../site';

const width = 'max-w-[1400px]';

export default function CoveComparisonPage() {
  const compare = useCoveComparison();

  return (
    <>
      <style>{'@page { size: landscape; margin: 10mm; }'}</style>
      <PageHero
        width={width}
        eyebrow="Comparison chart"
        title="Cove Lights Comparison"
        description="Cove and linear fixtures for white light and static color, compared side by side: ratings, output, run lengths, power input and control options at a glance."
        tiles={[
          { label: 'Chart Focus', value: 'White Light + Static Color' },
          { label: 'Products Compared', value: `${compare.total} fixtures & flex` },
          { label: 'For official quotations', value: quoteEmail, isMail: true },
        ]}
      />

      <section className="relative -mt-12 px-4 no-print z-20">
        <div className={`glass-panel ${width} mx-auto p-6 md:sticky md:top-20 space-y-4`}>
          <CoveComparisonControls {...compare} onPrint={() => window.print()} />
        </div>
      </section>

      <main className={`${width} mx-auto px-4 py-10`}>
        <CoveComparisonTable {...compare} />
      </main>
    </>
  );
}
