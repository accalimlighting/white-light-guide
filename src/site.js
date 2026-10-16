// Site-wide registry: every guide or comparison chart published on acclaim.guide.
// Add a new page here (and a route in App.jsx) and it appears in the top nav and on the home page.

export const siteName = 'Acclaim Guide';
export const siteDomain = 'acclaim.guide';
export const quoteEmail = import.meta.env.VITE_QUOTE_EMAIL || 'quotes@acclaimlighting.com';
export const logoSrc = import.meta.env.VITE_LOGO_SRC || '/Acclaim_Horizontal_Logo_Dark.svg';
export const hidePricing = import.meta.env.VITE_HIDE_PRICING === 'true';

export const pageKinds = {
  guide: { label: 'Reference guide', className: 'bg-acclaim-teal/15 text-acclaim-teal' },
  comparison: { label: 'Comparison chart', className: 'bg-acclaim-accent/10 text-acclaim-accent' },
};

export const pages = [
  {
    id: 'white-light-guide',
    path: '/white-light-guide',
    navLabel: 'White Light Guide',
    title: 'Linear White Light Guide',
    kind: 'guide',
    description:
      "Acclaim's white light linear portfolio with specifications, variants, accessories and typical wiring, searchable and filterable by series, rating, output and CCT.",
  },
  {
    id: 'cove-comparison',
    path: '/cove-comparison',
    navLabel: 'Cove Comparison',
    title: 'Cove Lights Comparison',
    kind: 'comparison',
    description:
      'Cove and linear fixtures side by side: dry and wet ratings, watts and lumens per foot, CRI / TM30, maximum run length, power input and control options.',
  },
];

export const findPage = (pathname) => pages.find((p) => p.path === pathname);
