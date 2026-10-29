/** Data-integrity check for the menu. Run: node scripts/check-menu.mjs */
import {
  DISHES,
  CATEGORIES_WITH_COUNTS,
  POPULAR_DISHES,
  FEATURED_DISHES,
  TODAYS_SPECIALS,
} from '../src/data/menu.js';
import pool from '../src/data/imagePool.json' with { type: 'json' };

const show = (label, list) => console.log(`${label}:`, list.length ? list : 'none');

console.log('total dishes:', DISHES.length);
console.log('categories:', CATEGORIES_WITH_COUNTS.map((c) => `${c.name}(${c.count})`).join(', '));
console.log(
  'popular:', POPULAR_DISHES.length,
  '| featured:', FEATURED_DISHES.length,
  '| specials:', TODAYS_SPECIALS.length
);

const seen = new Set();
show('duplicate ids', DISHES.filter((d) => (seen.has(d.id) ? true : (seen.add(d.id), false))).map((d) => d.id));
show('unresolved images', DISHES.filter((d) => !/^https?:/.test(d.image) && !pool[d.image]).map((d) => `${d.name} -> ${d.image}`));
show('missing description', DISHES.filter((d) => !d.description).map((d) => d.name));
show('missing ingredients', DISHES.filter((d) => !d.ingredients.length).map((d) => d.name));
show('bad prices', DISHES.filter((d) => d.variants.some((v) => !Number.isFinite(v.price) || v.price <= 0)).map((d) => d.name));

console.log('dishes with half/full:', DISHES.filter((d) => d.hasPortions).length);
console.log('price range: Rs', Math.min(...DISHES.map((d) => d.basePrice)), '-', Math.max(...DISHES.map((d) => d.maxPrice)));
console.log(
  'diet split:',
  Object.entries(DISHES.reduce((a, d) => ((a[d.type] = (a[d.type] ?? 0) + 1), a), {}))
    .map(([k, v]) => `${k}:${v}`)
    .join('  ')
);
