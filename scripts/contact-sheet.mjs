/**
 * Renders a labelled contact sheet of image candidates (or the live pool) to a
 * standalone HTML file, so the picks can be eyeballed in a browser.
 *
 *   node scripts/contact-sheet.mjs candidates  > /tmp/sheet.html
 *   node scripts/contact-sheet.mjs pool        > /tmp/sheet.html
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const which = process.argv[2] ?? 'candidates';

const file =
  which === 'pool'
    ? resolve(__dirname, '../src/data/imagePool.json')
    : resolve(__dirname, '../src/data/imageCandidates.json');

const all = JSON.parse(readFileSync(file, 'utf8'));

/** Optional `--keys=a,b,c` to render a readable subset. */
const keysArg = process.argv.find((a) => a.startsWith('--keys='));
const wanted = keysArg ? keysArg.slice('--keys='.length).split(',').filter(Boolean) : null;
const data = wanted
  ? Object.fromEntries(Object.entries(all).filter(([k]) => wanted.includes(k)))
  : all;

/** Normalise both shapes into rows of { label, url }. */
const rows =
  which === 'pool'
    ? Object.entries(data)
        .filter(([, v]) => v)
        .map(([key, entry]) => ({ key, items: [{ label: key, url: entry.url }] }))
    : Object.entries(data).map(([key, list]) => ({
        key,
        items: list.map((entry, i) => ({ label: `${key}#${i}`, url: entry.url })),
      }));

const tiles = rows
  .map(
    (row) => `
  <section>
    <h2>${row.key}</h2>
    <div class="row">
      ${row.items
        .map(
          (it) => `<figure><img src="${it.url}" loading="eager" referrerpolicy="no-referrer" />
          <figcaption>${it.label}</figcaption></figure>`
        )
        .join('')}
    </div>
  </section>`
  )
  .join('');

process.stdout.write(`<!doctype html>
<html><head><meta charset="utf-8"><title>contact sheet — ${which}</title>
<style>
  body { margin:0; background:#121010; color:#ffb950; font:13px/1.3 system-ui, sans-serif; }
  section { border-bottom:1px solid #2a2522; padding:6px 10px; }
  h2 { margin:2px 0 6px; font-size:13px; color:#ffd79a; font-weight:700; }
  .row { display:flex; gap:6px; }
  figure { margin:0; width:250px; }
  img { width:250px; height:170px; object-fit:cover; background:#242020; display:block; border-radius:4px; }
  figcaption { font-size:11px; color:#c9b39a; padding-top:2px; }
</style></head>
<body>${tiles}</body></html>
`);
