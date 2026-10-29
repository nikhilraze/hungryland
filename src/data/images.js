import pool from './imagePool.json';

/**
 * Resolves a dish's `image` field to a real URL.
 *
 * A dish's `image` can be either:
 *   1. a key in imagePool.json  (e.g. 'butterChicken') — the default, or
 *   2. any full https:// URL    — drop the restaurant's own photo in directly.
 *
 * To swap in your own photography, either edit imagePool.json (one line per
 * dish type) or set `image: 'https://...'` on individual dishes in menu.js.
 */
export function resolveImage(key) {
  if (!key) return null;
  if (/^(https?:)?\/\//.test(key) || key.startsWith('/')) {
    return { url: key, alt: '', creator: null };
  }
  return pool[key] ?? null;
}

export const imageUrl = (key) => resolveImage(key)?.url ?? null;

/** Credit line for a photo, or null when the owner supplied their own image. */
export function imageCredit(key) {
  const entry = resolveImage(key);
  if (!entry?.creator) return null;
  return {
    creator: entry.creator,
    creatorUrl: entry.creatorUrl,
    license: entry.license,
    licenseUrl: entry.licenseUrl,
    source: entry.source,
  };
}

/** Every distinct credit used on the site, for the About/Contact footer. */
export function allCredits() {
  const seen = new Map();
  for (const entry of Object.values(pool)) {
    if (entry?.creator && !seen.has(entry.creator)) {
      seen.set(entry.creator, {
        creator: entry.creator,
        creatorUrl: entry.creatorUrl,
        license: entry.license,
        licenseUrl: entry.licenseUrl,
      });
    }
  }
  return [...seen.values()];
}
