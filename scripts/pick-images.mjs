/**
 * Candidate browser for the image pool.
 *
 *   node scripts/pick-images.mjs list  key[,key…]   -> writes imageCandidates.json
 *   node scripts/pick-images.mjs apply key=3 key2=0 -> copies a candidate into imagePool.json
 *
 * `list` gathers several usable Commons photos per key so a human can compare
 * them, and `apply` promotes the chosen one into the real pool.
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'the-hungry-land-site/1.0 (menu placeholder imagery)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const poolPath = resolve(__dirname, '../src/data/imagePool.json');
const candPath = resolve(__dirname, '../src/data/imageCandidates.json');

/** Extra, broader places to look for the slots that are hard to fill. */
const SOURCES = {
  heroSpread: {
    cats: ['North Indian cuisine', 'Punjabi cuisine', 'Indian cuisine', 'Butter chicken', 'Tandoori chicken'],
    terms: ['Indian food spread table restaurant', 'North Indian curry naan spread'],
    must: ['curry', 'thali', 'naan', 'chicken', 'paneer', 'indian', 'tandoori', 'masala', 'biryani'],
  },
  tandoorFire: {
    cats: ['Tandoors', 'Tandoor', 'Naan'],
    terms: ['Tandoor oven fire naan baking', 'Tandoori roti baking oven'],
    must: ['tandoor', 'naan', 'roti', 'oven'],
  },
  restaurantInterior: {
    cats: ['Dhabas', 'Restaurant interiors', 'Restaurants in West Bengal', 'Restaurants in India'],
    terms: ['Indian restaurant interior dining', 'Dhaba interior India'],
    must: ['restaurant', 'dhaba', 'interior', 'dining', 'eatery', 'cafe'],
  },
  chefCooking: {
    cats: ['Tandoors', 'Cooks from India', 'Cooking in India', 'Street food of India'],
    terms: ['Cook making naan tandoor', 'Chef cooking Indian kitchen wok'],
    must: ['cook', 'chef', 'tandoor', 'kitchen', 'making', 'naan', 'roti', 'kadai', 'wok'],
  },
  spices: {
    cats: ['Spices of India', 'Garam masala', 'Spice markets in India', 'Spices'],
    terms: ['Indian spices bowls assorted', 'Masala powder bowls'],
    must: ['spice', 'masala', 'turmeric', 'chilli', 'cumin', 'coriander'],
  },
  biryani: {
    cats: ['Chicken biryani', 'Hyderabadi biryani', 'Biryani'],
    terms: ['Chicken biryani plate raita', 'Dum biryani handi'],
    must: ['biryani', 'biriyani', 'biriani'],
  },
  jeeraRice: {
    cats: ['Jeera rice', 'Pulao', 'Rice dishes of India'],
    terms: ['Jeera rice cumin cooked', 'Ghee rice pulao plate'],
    must: ['jeera', 'cumin', 'pulao', 'pilaf', 'ghee rice'],
  },
  chickenCurry: {
    cats: ['Chicken curry', 'Chicken curries of India', 'Chicken dishes of India'],
    terms: ['Chicken curry gravy bowl India', 'Murgh curry Indian'],
    must: ['curry', 'masala', 'murgh', 'chicken gravy', 'kari'],
  },
  chickenKorma: {
    cats: ['Korma', 'Mughlai cuisine'],
    terms: ['Chicken korma gravy', 'Chicken chaap Kolkata'],
    must: ['korma', 'qorma', 'chaap', 'mughlai'],
  },
  chickenPakora: {
    cats: ['Pakora', 'Fritters'],
    terms: ['Chicken pakora fried', 'Pakoda plate chutney'],
    must: ['pakora', 'pakoda', 'fritter'],
  },
  friedChicken: {
    cats: ['Chicken 65', 'Fried chicken', 'Chicken dishes of India'],
    terms: ['Crispy fried chicken plate', 'Chicken 65 plate'],
    must: ['fried chicken', 'chicken 65', 'crispy', 'chicken fry'],
  },
  kebab: {
    cats: ['Seekh kebab', 'Kebabs of India', 'Chicken kebabs', 'Tangdi kebab'],
    terms: ['Malai kebab chicken skewer', 'Reshmi kebab plate'],
    must: ['kebab', 'kabab', 'tikka', 'malai', 'seekh', 'tangdi'],
  },
  barbecueChicken: {
    cats: ['Grilled chicken', 'Tandoori chicken', 'Chicken kebabs'],
    terms: ['Barbecue chicken grill skewer', 'Grilled chicken tikka charcoal'],
    must: ['grill', 'barbecue', 'bbq', 'tandoori', 'kebab', 'tikka', 'charcoal'],
  },
  paneerCurry: {
    cats: ['Matar paneer', 'Kadai paneer', 'Paneer dishes'],
    terms: ['Matar paneer bowl', 'Kadai paneer gravy'],
    must: ['paneer'],
  },
  palakPaneer: {
    cats: ['Palak paneer', 'Saag'],
    terms: ['Palak paneer bowl spinach', 'Saag paneer'],
    must: ['palak', 'saag', 'spinach'],
  },
  mushroomCurry: {
    cats: ['Mushroom dishes', 'Mushrooms as food'],
    terms: ['Mushroom masala gravy India', 'Mushroom curry bowl'],
    must: ['mushroom'],
  },
  chowmein: {
    cats: ['Chow mein', 'Noodle dishes of India', 'Hakka noodles'],
    terms: ['Chowmein plate street food India', 'Hakka noodles plate'],
    must: ['chow mein', 'chowmein', 'chow-mein', 'noodle', 'hakka'],
  },
  momo: {
    cats: ['Momos', 'Momo (food)'],
    terms: ['Steamed momo plate chutney', 'Chicken momo steamed'],
    must: ['momo'],
  },
  roti: {
    cats: ['Roti', 'Chapati', 'Tandoori roti'],
    terms: ['Tandoori roti plate', 'Chapati stack roti'],
    must: ['roti', 'chapati', 'phulka', 'rumali'],
  },
  kulcha: {
    cats: ['Kulcha', 'Naan'],
    terms: ['Amritsari kulcha plate', 'Kulcha stuffed bread'],
    must: ['kulcha', 'naan'],
  },
  rajmaChawal: {
    cats: ['Rajma', 'Kidney bean dishes'],
    terms: ['Rajma chawal plate', 'Rajma curry bowl rice'],
    must: ['rajma', 'chawal', 'kidney bean curry'],
  },
  kadhiChawal: {
    cats: ['Kadhi', 'Gujarati cuisine'],
    terms: ['Kadhi pakora bowl', 'Kadhi chawal plate'],
    must: ['kadhi', 'kadi'],
  },
  vegThali: {
    cats: ['Vegetarian thali', 'Thali'],
    terms: ['Veg thali plate India', 'Vegetarian thali steel plate'],
    must: ['thali'],
  },
  thali: {
    cats: ['Thali', 'Bengali cuisine'],
    terms: ['Non vegetarian thali chicken', 'Chicken thali plate'],
    must: ['thali'],
  },
};

const TITLE_BLOCKLIST = [
  'logo', 'map', 'diagram', 'chart', 'poster', 'signboard', 'menu card', 'graphical',
  'packet', 'package', 'packaging', 'wrapper', 'uncooked', 'ingredient', 'engraving',
  'stamp', 'coin', 'portrait', 'wikipedia', 'wikimedia', 'screenshot', 'drawing',
  'painting', 'illustration', 'sketch', 'dried', 'seeds', 'raw ', 'plant', 'shop',
  'signage', 'board', 'exterior', 'street with',
];

async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', origin: '*', ...params })}`;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    if (attempt > 0) await sleep(1500 * attempt);
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      if (!res.ok) continue;
      const json = await res.json();
      if (json?.error) continue;
      return json;
    } catch {
      /* retry */
    }
  }
  return null;
}

const categoryFiles = async (category) =>
  (
    (await api({
      action: 'query',
      list: 'categorymembers',
      cmtitle: `Category:${category}`,
      cmtype: 'file',
      cmlimit: '50',
    }))?.query?.categorymembers ?? []
  ).map((m) => m.title);

const searchFiles = async (term) =>
  (
    (await api({
      action: 'query',
      list: 'search',
      srsearch: `filetype:bitmap ${term}`,
      srnamespace: '6',
      srlimit: '30',
    }))?.query?.search ?? []
  ).map((m) => m.title);

async function imageInfo(titles) {
  const out = [];
  for (let i = 0; i < titles.length; i += 50) {
    const json = await api({
      action: 'query',
      titles: titles.slice(i, i + 50).join('|'),
      prop: 'imageinfo',
      iiprop: 'url|size|extmetadata',
      iiurlwidth: '1200',
    });
    out.push(
      ...Object.values(json?.query?.pages ?? {})
        .map((p) => ({ title: p.title, info: p.imageinfo?.[0] }))
        .filter((p) => p.info)
    );
    await sleep(300);
  }
  return out;
}

function metaText(info, key) {
  const raw = info.extmetadata?.[key]?.value;
  if (!raw) return null;
  return String(raw)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

const cleanName = (t) => t.replace(/^File:/, '').replace(/\.[a-z]+$/i, '').replace(/_/g, ' ');

function isUsable({ title, info }, must) {
  const name = cleanName(title).toLowerCase();
  if (TITLE_BLOCKLIST.some((b) => name.includes(b))) return false;
  if (must?.length && !must.some((m) => name.includes(m))) return false;
  if ((info.width ?? 0) < 1000) return false;
  const ratio = (info.width ?? 1) / (info.height ?? 1);
  if (ratio < 1.0 || ratio > 2.2) return false; // landscape only
  return true;
}

const toEntry = ({ title, info }, via) => ({
  url: info.thumburl ?? info.url,
  alt: cleanName(title),
  creator: metaText(info, 'Artist') ?? 'Wikimedia Commons contributor',
  creatorUrl: info.descriptionurl,
  license: metaText(info, 'LicenseShortName') ?? 'See Commons',
  licenseUrl: metaText(info, 'LicenseUrl') ?? info.descriptionurl,
  source: info.descriptionurl,
  via,
});

// ---------------------------------------------------------------------------

const [mode, ...rest] = process.argv.slice(2);

if (mode === 'list') {
  const keys = (rest[0] ?? '').split(',').filter(Boolean);
  const out = existsSync(candPath) ? JSON.parse(readFileSync(candPath, 'utf8')) : {};

  for (const key of keys) {
    const source = SOURCES[key];
    if (!source) {
      console.log(`?    ${key} — no source defined`);
      continue;
    }

    const titles = new Set();
    for (const cat of source.cats ?? []) {
      for (const t of await categoryFiles(cat)) titles.add(t);
      await sleep(300);
    }
    for (const term of source.terms ?? []) {
      for (const t of await searchFiles(term)) titles.add(t);
      await sleep(300);
    }

    const candidates = (await imageInfo([...titles]))
      .filter((c) => isUsable(c, source.must))
      .sort((a, b) => (b.info.width ?? 0) - (a.info.width ?? 0))
      .slice(0, 6)
      .map((c) => toEntry(c, key));

    out[key] = candidates;
    console.log(`ok   ${key.padEnd(20)} ${candidates.length} candidates`);
    writeFileSync(candPath, JSON.stringify(out, null, 2) + '\n');
  }
  console.log(`\nWrote ${candPath}`);
} else if (mode === 'apply') {
  const pool = JSON.parse(readFileSync(poolPath, 'utf8'));
  const cands = JSON.parse(readFileSync(candPath, 'utf8'));

  for (const pair of rest) {
    // `poolKey=3` picks from its own list; `poolKey=otherKey#3` borrows another.
    const [key, ref] = pair.split('=');
    const [sourceKey, idxRaw] = ref.includes('#') ? ref.split('#') : [key, ref];
    const idx = Number(idxRaw);
    const chosen = cands[sourceKey]?.[idx];
    if (!chosen) {
      console.log(`skip ${key}=${ref} — no such candidate`);
      continue;
    }
    const { via, ...entry } = chosen;
    pool[key] = entry;
    console.log(`set  ${key.padEnd(20)} ${entry.alt.slice(0, 60)}`);
  }

  writeFileSync(poolPath, JSON.stringify(pool, null, 2) + '\n');
  console.log(`\nWrote ${poolPath}`);
} else if (mode !== 'title') {
  console.log(
    'Usage:\n' +
      '  pick-images.mjs list  key1,key2\n' +
      '  pick-images.mjs apply key1=0 key2=otherKey#3\n' +
      '  pick-images.mjs title key1="Some Commons File.jpg"'
  );
}

// ---------------------------------------------------------------------------
//  `title` mode — pin a slot to an exact Commons file, e.g.
//    node scripts/pick-images.mjs title mushroomCurry="Mushroom masala.jpg"
// ---------------------------------------------------------------------------
if (mode === 'title') {
  const pool = JSON.parse(readFileSync(poolPath, 'utf8'));

  for (const pair of rest) {
    const eq = pair.indexOf('=');
    const key = pair.slice(0, eq);
    const raw = pair.slice(eq + 1).replace(/^["']|["']$/g, '');
    const title = raw.startsWith('File:') ? raw : `File:${raw}`;

    const [found] = await imageInfo([title]);
    if (!found) {
      console.log(`skip ${key} — "${title}" not found`);
      continue;
    }
    const { via, ...entry } = toEntry(found, 'manual');
    pool[key] = entry;
    console.log(`set  ${key.padEnd(20)} ${entry.alt.slice(0, 60)}  ${found.info.width}x${found.info.height}`);
    await sleep(250);
  }

  writeFileSync(poolPath, JSON.stringify(pool, null, 2) + '\n');
  console.log(`\nWrote ${poolPath}`);
}
