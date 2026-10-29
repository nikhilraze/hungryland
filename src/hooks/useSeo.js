import { useEffect } from 'react';

const BASE_TITLE = 'The Hungry Land';

function setMeta(selector, attr, value) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    const [, name] = selector.match(/\[(?:name|property)="([^"]+)"\]/) ?? [];
    if (!name) return;
    el.setAttribute(selector.includes('property') ? 'property' : 'name', name);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

/** Per-route document title & description, for crawlers and shared links. */
export function useSeo({ title, description }) {
  useEffect(() => {
    const full = title ? `${title} — ${BASE_TITLE}` : BASE_TITLE;
    document.title = full;
    setMeta('meta[property="og:title"]', 'content', full);
    if (description) {
      setMeta('meta[name="description"]', 'content', description);
      setMeta('meta[property="og:description"]', 'content', description);
    }
  }, [title, description]);
}
