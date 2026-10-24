Make my Vintage Collections storefront fully responsive so the interface auto-adapts and auto-aligns on every device: phones, tablets, laptops, desktops and large monitors. Use ONE codebase with fluid layouts. No separate mobile and desktop versions, and no fixed pixel widths. Keep the current design language (dark green + gold, dark/light toggle).

CORE APPROACH: MOBILE-FIRST + FLUID

1. Foundation
- Viewport meta: <meta name="viewport" content="width=device-width, initial-scale=1">
- Global: *, *::before, *::after { box-sizing: border-box; } html { -webkit-text-size-adjust: 100%; } img, video { max-width: 100%; height: auto; display: block; }
- Wrap all page content in a centered container: width: min(100% - 2rem, 1280px); margin-inline: auto;
- Every flex child that holds text gets min-width: 0 so nothing overflows.
- Use rem, %, fr, vw and clamp() instead of fixed px for widths, spacing and fonts.
- Fluid type: h1 clamp(1.5rem, 1rem + 2.5vw, 2.75rem); body clamp(0.9rem, 0.85rem + 0.3vw, 1.05rem).

2. Breakpoints (min-width, mobile-first)
- Base (under 480px): phones, 1 column
- 480px: large phones, 2-column product grid
- 768px: tablets, 2-3 columns, inline header search
- 1024px: laptops, 3-4 columns, full header with text links
- 1280px+: desktops, 4 columns, container capped at 1280px
- 1920px+: large monitors, centered content, never stretch edge to edge

3. Header (auto-adapts)
- Mobile: row 1 = logo + brand name on the left, cart (with badge) + theme toggle + hamburger on the right. Row 2 = full-width search bar. Track Orders and the Govt. emblem badge go inside the hamburger menu.
- Tablet/laptop (768px+): single row = logo | search (flex: 1, max-width 600px) | Track Orders (icon + text) | theme toggle | cart. The hamburger disappears and nav links show inline.
- Desktop (1024px+): show the Govt. of Tamil Nadu / Govt. of India badge beside the logo, and the full tagline "INDIAN MAKER-EXPORTER • EU DIRECT".
- Header is sticky, never wider than 100%, with no horizontal overflow.

4. Category nav
- Mobile: horizontally scrollable pill row (overflow-x: auto; scroll-snap-type: x proximity; hidden scrollbar; fade on the right edge).
- 1024px+: pills wrap or sit in a centered row with no scrolling needed.

5. Hero/title card
- Mobile: stacked layout; Filters button and sort dropdown side by side at 50% each.
- Laptop and up: title on the left, Filters + sort aligned to the right on the same row (flex, justify-content: space-between, align-items: center).

6. Product grid (auto-fit, no manual column math)
- display: grid; gap: clamp(12px, 2vw, 24px); grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));
- This gives 1 column on small phones, 2 on large phones, 3-4 on laptops, and 4-5 on wide monitors automatically.
- Cards: equal height (display: flex; flex-direction: column; the Add to Cart button pinned to the bottom with margin-top: auto).
- Images: aspect-ratio: 1 / 1; object-fit: cover.
- Title: 2-line clamp. Badges: smaller font, max-width 70%, ellipsis, never overlapping.
- Add to Cart: full width of the card, minimum 44px tall.

7. Sidebar filters
- Mobile: Filters opens a bottom-sheet or slide-in drawer.
- 1024px+: show filters as a persistent left sidebar (grid-template-columns: 260px 1fr) next to the product grid.

8. Cart, checkout and other pages
- Cart: a drawer or full page on mobile; a 2-column layout (items | order summary, sticky) from 1024px.
- Forms: single column on mobile, 2 columns from 768px, inputs 44px tall with a 16px+ font so iOS doesn't zoom.
- Footer: stacked on mobile, 3-4 columns from 768px.

9. Input and device adaptation
- Hover effects only inside @media (hover: hover); tap feedback on touch devices.
- Respect prefers-color-scheme for the default theme and keep the manual toggle.
- Add safe-area padding: padding-bottom: env(safe-area-inset-bottom).
- Tap targets at least 44x44px on touch devices.

ACCEPTANCE CHECKLIST
- No horizontal scroll at 360, 390, 412, 768, 1024, 1366, 1440 and 1920px widths (document.documentElement.scrollWidth === window.innerWidth).
- Test with browser DevTools device mode, and by resizing the window continuously from 320px to 2560px. The layout must reflow smoothly with no broken in-between states.
- Header, grid, filters and cart align correctly in portrait and landscape.
- Dark and light themes both work at all sizes.
- Run Lighthouse for mobile and desktop and fix any layout or tap-target warnings.

Deliver: the list of changed files, the root cause of the previous overflow, and a short note on which breakpoints change what.