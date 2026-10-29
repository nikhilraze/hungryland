/**
 * Builds src/data/imagePool.json from Wikimedia Commons.
 *
 *   node scripts/fetch-images.mjs                 # fill in anything missing
 *   node scripts/fetch-images.mjs --force         # refetch everything
 *   node scripts/fetch-images.mjs --only=biryani  # refetch specific keys
 *
 * Commons is used because its hand-curated *categories* map cleanly onto named
 * Indian dishes, and every file carries machine-readable licence + author data,
 * which we surface as a credit in the UI and on the About page.
 *
 * THE OWNER DOES NOT NEED THIS SCRIPT. To use real photos of your own food,
 * either edit the URLs in src/data/imagePool.json, or set
 * `image: 'https://your-photo.jpg'` on a dish in src/data/menu.js.
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'the-hungry-land-site/1.0 (menu placeholder imagery)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const args = process.argv.slice(2);
const onlyArg = args.find((a) => a.startsWith('--only='));
const ONLY = onlyArg ? onlyArg.slice('--only='.length).split(',').filter(Boolean) : null;
const FORCE = args.includes('--force');

/**
 * For each image key:
 *   cats  — Commons categories, tried in order (most specific first)
 *   terms — full-text search fallbacks
 *   must  — at least one of these tokens must appear in the file name, which
 *           keeps full-text search from returning something unrelated
 */
const SOURCES = {
  // ---------------------------------------------------- hero / atmosphere --
  heroSpread: {
    cats: ['Thali', 'Indian cuisine'],
    terms: ['North Indian thali platter'],
    must: ['thali', 'indian', 'curry', 'meal'],
  },
  tandoorFire: {
    cats: ['Tandoor', 'Tandoors'],
    terms: ['Tandoor oven bread'],
    must: ['tandoor', 'naan', 'oven'],
  },
  restaurantInterior: {
    cats: ['Dhabas', 'Restaurants in India'],
    terms: ['Dhaba restaurant India interior'],
    must: ['dhaba', 'restaurant', 'eatery', 'hotel'],
  },
  chefCooking: {
    cats: ['Tandoor', 'Cooking in India'],
    terms: ['Tandoori roti making tandoor'],
    must: ['tandoor', 'cook', 'kitchen', 'chef', 'naan', 'roti'],
  },
  spices: {
    cats: ['Spices of India', 'Spice markets', 'Spices'],
    terms: ['Indian spices bowls market'],
    must: ['spice', 'masala'],
  },

  // -------------------------------------------------------- rice & biryani --
  biryani: { cats: ['Chicken biryani', 'Biryani'], terms: ['Chicken biryani'], must: ['biryani', 'biriyani'] },
  jeeraRice: { cats: ['Jeera rice', 'Rice dishes of India'], terms: ['Jeera rice cumin'], must: ['jeera', 'cumin', 'rice'] },
  friedRice: { cats: ['Fried rice'], terms: ['Vegetable fried rice'], must: ['fried rice'] },
  chickenFriedRice: { cats: ['Fried rice'], terms: ['Chicken fried rice'], must: ['fried rice'] },
  eggFriedRice: { cats: ['Fried rice'], terms: ['Egg fried rice'], must: ['fried rice'] },

  // ---------------------------------------------------------------- chicken --
  butterChicken: { cats: ['Butter chicken'], terms: ['Butter chicken murgh makhani'], must: ['butter chicken', 'makhani'] },
  chickenCurry: { cats: ['Chicken curry', 'Chicken dishes of India'], terms: ['Indian chicken curry'], must: ['chicken'] },
  chickenKasha: { cats: ['Bengali cuisine', 'Chicken dishes of India'], terms: ['Kosha mangsho chicken kasha'], must: ['kosha', 'kasha', 'chicken', 'mangsho'] },
  chilliChicken: { cats: ['Chilli chicken', 'Indian Chinese cuisine'], terms: ['Chilli chicken'], must: ['chilli chicken', 'chilly chicken', 'chili chicken'] },
  chickenManchurian: { cats: ['Manchurian (dish)', 'Indian Chinese cuisine'], terms: ['Chicken Manchurian'], must: ['manchurian'] },
  chickenKorma: { cats: ['Korma'], terms: ['Chicken korma'], must: ['korma', 'qorma'] },
  friedChicken: { cats: ['Chicken 65', 'Fried chicken'], terms: ['Chicken 65 fried'], must: ['chicken'] },
  chickenPakora: { cats: ['Pakora'], terms: ['Chicken pakora'], must: ['pakora', 'pakoda'] },
  lollipop: { cats: ['Chicken lollipop'], terms: ['Chicken lollipop'], must: ['lollipop', 'lolipop'] },

  // ----------------------------------------------------------------- mutton --
  muttonCurry: { cats: ['Mutton curry', 'Rogan josh', 'Lamb dishes'], terms: ['Mutton curry India'], must: ['mutton', 'rogan', 'lamb', 'gosht', 'mangsho'] },

  // --------------------------------------------------------- tandoor & grill --
  tandooriChicken: { cats: ['Tandoori chicken'], terms: ['Tandoori chicken'], must: ['tandoori'] },
  chickenTikka: { cats: ['Chicken tikka'], terms: ['Chicken tikka skewers'], must: ['tikka'] },
  kebab: { cats: ['Kebabs of India', 'Seekh kebab', 'Kebabs'], terms: ['Reshmi kebab chicken malai'], must: ['kebab', 'kabab'] },
  barbecueChicken: { cats: ['Grilled chicken', 'Tangdi kebab'], terms: ['Grilled barbecue chicken skewer'], must: ['grill', 'barbecue', 'bbq', 'roast', 'tangdi', 'kebab'] },

  // -------------------------------------------------------------- paneer/veg --
  paneerCurry: { cats: ['Matar paneer', 'Paneer dishes'], terms: ['Matar paneer kadai paneer'], must: ['paneer'] },
  paneerButterMasala: { cats: ['Shahi paneer', 'Paneer dishes'], terms: ['Paneer butter masala'], must: ['paneer'] },
  palakPaneer: { cats: ['Palak paneer'], terms: ['Palak paneer saag'], must: ['palak', 'saag', 'spinach'] },
  mushroomCurry: { cats: ['Mushroom dishes', 'Vegetable curries'], terms: ['Mushroom masala curry India'], must: ['mushroom'] },
  aluDum: { cats: ['Dum aloo', 'Potato dishes of India'], terms: ['Dum aloo Kashmiri'], must: ['aloo', 'alu', 'potato', 'dum'] },
  chanaMasala: { cats: ['Chana masala', 'Chole'], terms: ['Chana masala chickpea'], must: ['chana', 'chole', 'chickpea'] },
  mixVeg: { cats: ['Vegetable curries', 'Sabzi'], terms: ['Mixed vegetable curry India'], must: ['veg', 'sabzi', 'sabji', 'curry'] },
  eggCurry: { cats: ['Egg curry', 'Egg dishes of India'], terms: ['Egg curry India anda'], must: ['egg', 'anda', 'dimer'] },

  // --------------------------------------------------------------------- dal --
  dal: { cats: ['Dal (food)', 'Dal'], terms: ['Dal fry tadka'], must: ['dal', 'daal', 'dhal', 'lentil'] },
  dalMakhani: { cats: ['Dal makhani'], terms: ['Dal makhani'], must: ['makhani', 'makhni', 'dal'] },

  // ----------------------------------------------------------------- chinese --
  chowmein: { cats: ['Chow mein', 'Hakka noodles'], terms: ['Chow mein noodles'], must: ['chow mein', 'chowmein', 'noodle', 'hakka'] },
  momo: { cats: ['Momo (food)', 'Momos'], terms: ['Momo dumplings steamed'], must: ['momo'] },

  // ------------------------------------------------------------------ breads --
  roti: { cats: ['Roti', 'Chapati'], terms: ['Tandoori roti chapati'], must: ['roti', 'chapati', 'phulka'] },
  naan: { cats: ['Naan'], terms: ['Butter naan bread'], must: ['naan'] },
  garlicNaan: { cats: ['Naan'], terms: ['Garlic naan'], must: ['naan'] },
  kulcha: { cats: ['Kulcha'], terms: ['Amritsari kulcha'], must: ['kulcha'] },
  paratha: { cats: ['Paratha', 'Aloo paratha'], terms: ['Aloo paratha lachha'], must: ['paratha', 'parantha'] },
  mughlaiParatha: { cats: ['Mughlai paratha', 'Paratha'], terms: ['Mughlai paratha'], must: ['paratha', 'mughlai'] },

  // ------------------------------------------------------------------- rolls --
  roll: { cats: ['Kathi rolls', 'Kathi roll'], terms: ['Kathi roll Kolkata'], must: ['roll', 'kathi', 'wrap'] },
  vegRoll: { cats: ['Kathi rolls', 'Wraps (food)'], terms: ['Paneer kathi roll vegetable'], must: ['roll', 'kathi', 'wrap', 'paneer'] },

  // -------------------------------------------------------- thalis & combos --
  thali: { cats: ['Thali'], terms: ['Chicken thali non vegetarian'], must: ['thali'] },
  vegThali: { cats: ['Vegetarian thali', 'Thali'], terms: ['Veg thali India'], must: ['thali'] },
  rajmaChawal: { cats: ['Rajma', 'Kidney bean dishes'], terms: ['Rajma chawal'], must: ['rajma', 'kidney bean'] },
  kadhiChawal: { cats: ['Kadhi'], terms: ['Kadhi chawal pakora'], must: ['kadhi', 'kadi'] },
  fishThali: { cats: ['Fish curries', 'Bengali cuisine'], terms: ['Macher jhol Bengali fish curry'], must: ['fish', 'macher', 'machher', 'jhol', 'curry'] },

  // --------------------------------------------------------------------- tea --
  tea: { cats: ['Masala chai', 'Tea of India'], terms: ['Masala chai India'], must: ['chai', 'tea'] },
  tandooriTea: { cats: ['Kulhar', 'Masala chai'], terms: ['Kulhad chai clay cup'], must: ['kulhad', 'kulhar', 'chai', 'tea'] },
};

const TITLE_BLOCKLIST = [
  'logo', 'map', 'diagram', 'chart', 'poster', 'signboard', 'menu card', 'graphical',
  'packet', 'package', 'packaging', 'wrapper', 'uncooked', 'ingredient', 'engraving',
  'stamp', 'coin', 'portrait', 'wikipedia', 'wikimedia', 'screenshot', 'drawing',
  'painting', 'illustration', 'sketch', '1850', '1856', 'qajar', 'era',
];

const MIN_WIDTH = 900;

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

/** File titles inside a Commons category. */
async function categoryFiles(category) {
  const json = await api({
    action: 'query',
    list: 'categorymembers',
    cmtitle: `Category:${category}`,
    cmtype: 'file',
    cmlimit: '40',
  });
  return (json?.query?.categorymembers ?? []).map((m) => m.title);
}

/** File titles from full-text search. */
async function searchFiles(term) {
  const json = await api({
    action: 'query',
    list: 'search',
    srsearch: `filetype:bitmap ${term}`,
    srnamespace: '6',
    srlimit: '25',
  });
  return (json?.query?.search ?? []).map((m) => m.title);
}

/** imageinfo for up to 50 titles in one request. */
async function imageInfo(titles) {
  if (!titles.length) return [];
  const json = await api({
    action: 'query',
    titles: titles.slice(0, 50).join('|'),
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata',
    iiurlwidth: '1200',
  });
  const pages = json?.query?.pages ?? {};
  return Object.values(pages)
    .map((p) => ({ title: p.title, info: p.imageinfo?.[0] }))
    .filter((p) => p.info);
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

const cleanName = (title) =>
  title.replace(/^File:/, '').replace(/\.[a-z]+$/i, '').replace(/_/g, ' ');

function isUsable({ title, info }, must) {
  const name = cleanName(title).toLowerCase();
  if (TITLE_BLOCKLIST.some((b) => name.includes(b))) return false;
  if (must?.length && !must.some((m) => name.includes(m))) return false;
  if ((info.width ?? 0) < MIN_WIDTH) return false;
  const ratio = (info.width ?? 1) / (info.height ?? 1);
  if (ratio < 0.9 || ratio > 2.4) return false; // avoid panoramas & tall crops
  return true;
}

/** Wider photos first — they crop better into our 4:3 and 16:9 frames. */
const byQuality = (a, b) => (b.info.width ?? 0) - (a.info.width ?? 0);

function toEntry({ title, info }, via) {
  return {
    url: info.thumburl ?? info.url,
    alt: cleanName(title),
    creator: metaText(info, 'Artist') ?? 'Wikimedia Commons contributor',
    creatorUrl: info.descriptionurl,
    license: metaText(info, 'LicenseShortName') ?? 'See Commons',
    licenseUrl: metaText(info, 'LicenseUrl') ?? info.descriptionurl,
    source: info.descriptionurl,
    via,
  };
}

async function reachable(url) {
  try {
    const res = await fetch(url, { headers: { Range: 'bytes=0-2047', 'User-Agent': UA } });
    return res.ok && (res.headers.get('content-type') ?? '').startsWith('image/');
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------

const outPath = resolve(__dirname, '../src/data/imagePool.json');
const pool = existsSync(outPath) ? JSON.parse(readFileSync(outPath, 'utf8')) : {};
const usedUrls = new Set(Object.values(pool).filter(Boolean).map((e) => e.url));
const save = () => writeFileSync(outPath, JSON.stringify(pool, null, 2) + '\n');

let misses = 0;

for (const [key, source] of Object.entries(SOURCES)) {
  if (ONLY && !ONLY.includes(key)) continue;
  if (!FORCE && pool[key]) {
    console.log(`skip ${key.padEnd(20)} (already set)`);
    continue;
  }

  let picked = null;

  const attempts = [
    ...(source.cats ?? []).map((c) => ({ kind: 'category', value: c })),
    ...(source.terms ?? []).map((t) => ({ kind: 'search', value: t })),
  ];

  for (const attempt of attempts) {
    await sleep(400);
    const titles =
      attempt.kind === 'category'
        ? await categoryFiles(attempt.value)
        : await searchFiles(attempt.value);
    if (!titles.length) continue;

    await sleep(400);
    const candidates = (await imageInfo(titles))
      .filter((c) => isUsable(c, source.must))
      .sort(byQuality);

    for (const candidate of candidates) {
      const entry = toEntry(candidate, `${attempt.kind}:${attempt.value}`);
      if (!entry.url || usedUrls.has(entry.url)) continue;
      if (!(await reachable(entry.url))) continue;
      picked = entry;
      usedUrls.add(entry.url);
      break;
    }
    if (picked) break;
  }

  pool[key] = picked;
  if (!picked) misses += 1;
  console.log(
    picked
      ? `ok   ${key.padEnd(20)} ${picked.alt.slice(0, 52).padEnd(52)} ${picked.via}`
      : `MISS ${key}`
  );
  save();
}

save();
console.log(`\nWrote ${outPath}${misses ? `  (${misses} missing — re-run to retry)` : ''}`);
