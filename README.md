# Acclaim Lighting - White Light Linear Reference

A quick reference guide for the ARDD+Winter quotes team, featuring Acclaim Lighting's white light linear product lineup with DN pricing, specifications, and accessories.

## Features

- 🔍 **Search** - Filter by product name, SKU, or specifications
- 📂 **Category Filters** - Filter by Flex, Adapt, or Linear products
- 💧 **IP Rating Filters** - Filter by IP68, IP66, IP40, or Dry location
- 📊 **Expandable Cards** - Click to reveal full specs, variants, and accessories
- 🖨️ **Print Ready** - Print the entire guide or individual sections
- 🔗 **Spec Sheet Links** - Direct links to product specification sheets

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
