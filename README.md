# The Hungry Land — website & online ordering

A production-ready React site for **The Hungry Land**, Sahid Kshudiram Nagar, Haldia, Purba
Medinipur. Every dish, price and category comes from the restaurant's own printed menu cards.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production bundle in dist/
npm run check:menu # data-integrity report for the menu
```

---

## ⚠ Please verify before going live

Two kinds of detail need a human check.

### 1. Four menu sections had misaligned price columns in the photos

The **Veg**, **Dal**, **Roti** and **Chicken** cards were photographed at an angle, so the
Half / Full columns did not line up perfectly with the dish names. Those sections are marked
`// verify` in `src/data/menu.js`. Everything else (Biryani, Thali, Snacks, Barbeque, Tandoor,
Rolls, Mutton, Rice, Chowmein, Tea) was read cleanly.

Please check these against the printed card:

| Section | Dishes to confirm |
| --- | --- |
| Veg Main Course | all 15 Half/Full pairs |
| Dal | all 6 Half/Full pairs |
| Roti & Breads | the 15 single prices |
| Chicken | Chicken Curry, Chicken Kasha, Chilli Chicken, Chicken Masala, Kadai Chicken, Palak Chicken |

`Chicken Kasha` in particular is listed at **₹100 / ₹160** — the full-plate price was the least
legible number on the card.

### 2. Details that were not printed on the menu

These are sensible placeholders, marked `// TODO(owner)` in `src/data/restaurant.js`:

- **Opening hours** — currently 11:00 AM – 10:30 PM (11:00 PM Fri–Sun), lunch thali 12–4 PM.
- **Email** — `hello@thehungryland.in`.
- **Chef name** — the About page currently credits "The Hungry Land Kitchen" rather than a person.
- **Customer reviews** in `src/data/reviews.js` are placeholders written in the style of the
  Google Maps feedback. Replace them with real, attributed reviews (or wire the array to the
  Google Places API).
- **Restaurant story / philosophy copy** on the About page.

Taken straight from the menu card and verified: the three phone numbers, the address, the
Instagram and Facebook handles, Swiggy/Zomato delivery, the "unlimited rice" note on the biryani,
and "Ask your server for our daily specials!".

---

## Updating the menu

`src/data/menu.js` is the single source of truth. Add or edit a dish inside the right category:

```js
{
  name: 'Kadai Chicken',
  type: 'nonveg',          // 'veg' | 'egg' | 'nonveg'
  spice: 'hot',            // 'mild' | 'medium' | 'hot'  (omit if n/a)
  half: 80, full: 140,     // or: price: 120
  image: 'chickenKasha',   // key from imagePool.json, or a full https:// URL
  description: 'Finished in the kadai with crushed coriander seed.',
  ingredients: ['Chicken', 'Capsicum', 'Onion'],
  tags: ['popular'],       // 'popular' | 'featured' | 'special' (Today's Special)
  note: 'Unlimited rice for dining in.',
}
```

- **Three sizes?** Use `portions: [{ label: '1 pc', price: 120 }, …]` — see Tandoori Chicken.
- **Prices, GST, delivery fee, free-delivery threshold** live in `restaurant.charges`.
- **Add-ons** are defined once in `ADDONS` and attached per category in `ADDONS_BY_CATEGORY`.
  They all reuse real menu prices.
- Run `npm run check:menu` afterwards — it reports duplicate IDs, missing descriptions,
  unresolved images and bad prices.

## Replacing the food photos

The site currently ships **freely-licensed placeholder photography from Wikimedia Commons**,
credited in the dish detail view and in full on `/about#credits`.

To use the restaurant's own photos, either:

1. edit the `url` for a key in `src/data/imagePool.json` (one entry per dish type), or
2. set `image: 'https://your-cdn/butter-chicken.jpg'` directly on a dish in `menu.js`.

Setting `creator: null` on a pool entry removes its credit line. `SmartImage` shows a branded
fallback tile if a URL ever breaks, so a missing photo never looks like a broken page.

Note: Commons has no usable photo of an Indian mushroom curry, so `mushroomCurry` currently
reuses the mixed-vegetable image — worth replacing first.

`npm run images:fetch` refetches the whole pool from Commons; `scripts/pick-images.mjs` can list
and compare candidates per slot.

---

## Project structure

```
src/
  data/           menu.js · restaurant.js · reviews.js · imagePool.json   ← edit these
  context/        CartContext (cart + totals) · ThemeContext · ToastContext
  components/
    layout/       Navbar · Footer · Layout · MobileOrderBar · Logo
    menu/         DishCard · DishDetailModal · DishRail · MenuFilters · DishCardSkeleton
    cart/         CartDrawer · CartLine · OrderSummary · EmptyCart
    home/         Hero · TodaysSpecial · Specialties · AboutPreview · Reviews · VisitUs
    ui/           Button · Field · Modal · Icon · Badge · SmartImage · QuantityStepper · Toaster
  pages/          Home · Menu · Cart · Checkout · OrderConfirmation · About · Contact · NotFound
  hooks/          useSeo · useLocalStorage
  utils/          format.js (₹ formatting, phone, cn)
```

### How a few things work

- **Cart** — `CartContext` keys each line by dish + portion + add-ons, so a Half and a Full of the
  same curry are separate lines. State persists to `localStorage` (`hl.cart.v1`) and survives a
  reload. Totals (GST, packaging, delivery, free-delivery progress) are derived, never stored.
- **Menu filters** — category, diet, highlight and sort live in the URL, so
  `/menu?category=tandoor&diet=nonveg&sort=price-asc` is shareable. The search box is local state
  synced to `?q=` on a debounce, so typing stays responsive.
- **Theme** — class-based dark mode on `<html>`, seeded from `prefers-color-scheme` and remembered.
- **Accessibility** — skip link, focus-visible rings, a focus-trapped dialog that restores focus on
  close, `aria-pressed` filter chips, `aria-invalid` + `aria-describedby` on form errors, live
  regions for result counts and toasts, and veg/non-veg marks that announce their meaning.

### Not wired up

`Checkout.jsx` validates and builds the order object, then hands it to `placeOrder()`, which keeps
it in memory for the confirmation page. There is **no payment gateway and no backend** — connect
Razorpay/PhonePe/Cashfree and your order API there. The contact form likewise needs an endpoint.
