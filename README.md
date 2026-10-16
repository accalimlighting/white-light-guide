# Acclaim Guide (acclaim.guide)

Sales reference guides and comparison charts for Acclaim Lighting, published as one multi-page
site. Pages today:

| Path | Page |
|------|------|
| `/` | Overview hub listing every guide and chart |
| `/white-light-guide` | Linear White Light Guide (specs, DN pricing, accessories) |
| `/cove-comparison` | Cove Lights Comparison chart |

### Adding a page

1. Create the page component in `src/pages/` (use `PageHero` for the banner).
2. Register it in `src/site.js` — this drives the top nav, footer and the overview cards.
3. Add its `<Route>` in `src/App.jsx`.

Routing is client-side (`react-router-dom`); `vercel.json` rewrites every path to `index.html`
and redirects the legacy `white-linear*.acclaim.guide` roots to the guide page. Old `#compare`
links are redirected to `/cove-comparison` in `App.jsx`.

## Features

- 🔍 **Search** - Filter by product name, SKU, or specifications
- 📂 **Category Filters** - Filter by Flex, Adapt, or Linear products
- 💧 **IP Rating Filters** - Filter by IP68, IP66, IP40, or Dry location
- 📊 **Expandable Cards** - Click to reveal full specs, variants, and accessories
- 🖨️ **Print Ready** - Print the entire guide or individual sections
- 🔗 **Spec Sheet Links** - Direct links to product specification sheets
- 📋 **Cove Comparison** - Web version of the Cove Lights comparison chart (`/cove-comparison`), with location / input / control filters, sortable output columns, and a card layout on small screens

## Products Included

### Flex Products
- Flex One HO (Interior/Exterior)
- Flex One SO (Interior/Exterior)
- Flex Eco (Interior/Exterior)
- Flex Tube SC G2
- Flex Tube HO *(placeholder)*
- Flex 120 *(placeholder)*
- Flex Graze HO SC *(placeholder)*

### Adapt Products
- Adapt Cove
- Adapt Linear

### Linear Products
- Linear One (Interior/Exterior)
- Nova Linear
- Linear XTR
- Linear XTR H1
- Terra Linear

### Cove Comparison (comparison tab only)
- Adapt Linear DMX, Linear One DMX (Interior/Exterior)
- Linear XTR S2 and H2 (September 2026 specs, launching November 2026)
- Aqua Linear, Ai Flex, Flex Tube Mini

## Cove Comparison Page

The comparison table lives in `src/components/CoveComparison.jsx` and reads from
`src/data/coveComparison.js`. Each row records dry/wet IP rating, watts and lumens per
foot, CRI / TM30, maximum run length, power input (120–277V / 24VDC), control options
(0-10V, TRIAC/ELV, DMX/RDM/DALI) and AMS Quick Ship status. Values are transcribed from the
current Acclaim spec sheets; the `source` field on each row names the sheet and date used.

Capability cells use three states: `true` (native, rendered as a check), a `'via …'`
string (requires the named driver or converter), or `false` (not available). Linear XTR S2
and H2 carry a `status` of "Launches November 2026" and have no product-page link until
the pages go live.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to Vercel

1. Push to GitHub repository
2. Connect repository to Vercel
3. Deploy with default Vite settings

Or use Vercel CLI:
```bash
npm i -g vercel
vercel
```

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Router** - Client-side routing between guide pages

## Updating Product Data

Product information is stored in `src/data/products.js`. To update:

1. Edit the `products` array with new pricing, SKUs, or specifications
2. Add new product images to the `public/` folder
3. Reference new images in the product data

## Placeholder Products

The following products have placeholder data that needs to be filled in:
- Flex Tube HO
- Flex 120
- Flex Graze HO SC

These are marked with an "Specs TBD" badge in the UI.

---

*Prepared for ARDD+Winter • DN Pricing November 2025*
