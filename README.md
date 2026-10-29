# The Hungry Land

The Hungry Land is a React website and online-ordering frontend for the restaurant in
Sahid Kshudiram Nagar, Haldia, Purba Medinipur. It showcases the menu, supports
filterable dish discovery, provides a persistent cart, and includes checkout and
contact flows.

## Requirements

- Node.js 20.19+ (or Node.js 22.12+)
- npm

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) after Vite starts.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create the production bundle in `dist/`. |
| `npm run preview` | Preview the production bundle with Vite. Run `npm run build` first. |
| `npm run serve:dist` | Serve `dist/` with a small Python server and SPA fallback. |
| `npm run check:menu` | Check menu IDs, prices, descriptions, ingredients, and image references. |
| `npm run images:fetch` | Refresh the image pool from Wikimedia Commons. |

## Before going live

Several values are intentionally marked for owner verification.

### Menu prices

The price columns in the source photos were difficult to align for these sections.
Confirm the values marked `// verify` in [`src/data/menu.js`](./src/data/menu.js)
against the printed menu:

- Veg Main Course — all 15 Half/Full pairs
- Dal — all 6 Half/Full pairs
- Roti & Breads — all 15 prices
- Chicken — Chicken Curry, Chicken Kasha, Chilli Chicken, Chicken Masala, Kadai
  Chicken, and Palak Chicken

In particular, verify that Chicken Kasha is `₹100 / ₹160`.

### Restaurant details and copy

The following values are marked `// TODO(owner)` in
[`src/data/restaurant.js`](./src/data/restaurant.js):

- Opening hours and the lunch/thali service window
- Email address
- Chef name
- Restaurant story and philosophy copy

The reviews in [`src/data/reviews.js`](./src/data/reviews.js) are sample content.
Replace them with real, attributed reviews or connect the page to a reviews service.

The phone numbers, address, social handles, delivery partners, and daily-specials
note are taken from the supplied menu/listing data. Confirm all public-facing
details before publishing.

## Editing the menu

[`src/data/menu.js`](./src/data/menu.js) is the single source of truth for dishes,
categories, variants, add-ons, and highlights. A dish can use a single price,
Half/Full prices, or named portions:

```js
{
  name: 'Kadai Chicken',
  type: 'nonveg',          // 'veg' | 'egg' | 'nonveg'
  spice: 'hot',            // 'mild' | 'medium' | 'hot'
  half: 80,
  full: 140,
  image: 'chickenKasha',   // imagePool.json key or an https:// URL
  description: 'Finished in the kadai with crushed coriander seed.',
  ingredients: ['Chicken', 'Capsicum', 'Onion'],
  tags: ['popular'],       // 'popular' | 'featured' | 'special'
}
```

Use `portions: [{ label: '1 pc', price: 120 }, ...]` for more than two sizes.
Prices, GST, delivery, packaging, and the free-delivery threshold are in
`restaurant.charges`. Add-ons are declared in `ADDONS` and assigned through
`ADDONS_BY_CATEGORY`.

Run the integrity check after editing:

```bash
npm run check:menu
```

## Images

The project uses freely licensed placeholder photography from Wikimedia Commons.
Credits are shown in the dish detail view and on `/about#credits`.

To replace a photo, either update its entry in
[`src/data/imagePool.json`](./src/data/imagePool.json), or set an absolute URL
directly on a dish in `menu.js`:

```js
image: 'https://your-cdn.example/chicken-kasha.jpg'
```

`SmartImage` displays a branded fallback when an image cannot be loaded. The
`mushroomCurry` pool entry currently reuses a mixed-vegetable image because a
usable Commons image was not available.

## Application routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/menu` | Menu, filters, search, and dish details |
| `/cart` | Cart |
| `/checkout` | Checkout form |
| `/order-confirmed` | Order confirmation |
| `/about` | Restaurant story and image credits |
| `/contact` | Contact details and contact form |

Menu filters are URL-driven, so filtered views can be shared. For example:
`/menu?category=tandoor&diet=nonveg&sort=price-asc`.

## Project structure

```text
src/
  data/           menu.js, restaurant.js, reviews.js, imagePool.json
  context/        cart, theme, and toast state
  components/
    layout/       navigation, footer, logo, and mobile order bar
    menu/         dish cards, filters, rails, and detail modal
    cart/         cart drawer, lines, summary, and empty state
    home/         hero, specials, reviews, about preview, and visit-us sections
    ui/           buttons, fields, modal, images, icons, and feedback
  pages/          home, menu, cart, checkout, about, contact, and fallback pages
  hooks/          SEO and local-storage hooks
  utils/          formatting helpers
scripts/
  check-menu.mjs  menu data-integrity check
  fetch-images.mjs
  pick-images.mjs
  preview-server.py
```

## Production integration work

The checkout page validates the form, opens a pre-filled WhatsApp message to the
restaurant, and keeps the resulting order in memory for the confirmation page.
The restaurant WhatsApp number is configured as `restaurant.whatsapp` in
[`src/data/restaurant.js`](./src/data/restaurant.js); replace the placeholder
number with the correct WhatsApp-enabled number before publishing.

The app does **not** process payments or persist orders to a backend. The online
payment option is currently informational. Before accepting online payments,
connect `placeOrder()` in [`src/pages/Checkout.jsx`](./src/pages/Checkout.jsx) to
an order API and payment provider such as Razorpay, PhonePe, or Cashfree.

The contact form also needs a server-side endpoint. Do not put payment secrets,
API keys, or other credentials in this frontend repository.

## License and attribution

Application code and restaurant content belong to the project owner. Individual
food images retain their original Wikimedia Commons licenses and creator
attributions; see `/about#credits` before redistributing the image assets.
