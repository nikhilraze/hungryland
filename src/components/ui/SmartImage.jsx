import { useEffect, useState } from 'react';
import { resolveImage } from '../../data/images';
import { cn } from '../../utils/format';

/**
 * Image with a warm shimmer while loading and a graceful branded fallback if
 * the source ever 404s — so a missing photo never looks like a broken site.
 *
 * `imageKey` is either a key in imagePool.json or a full URL.
 */
export default function SmartImage({
  imageKey,
  alt,
  className,
  wrapperClassName,
  fallbackLabel,
  eager = false,
  ...rest
}) {
  const entry = resolveImage(imageKey);
  const [status, setStatus] = useState(entry?.url ? 'loading' : 'error');

  useEffect(() => {
    setStatus(entry?.url ? 'loading' : 'error');
  }, [entry?.url]);

  return (
    <span className={cn('relative block overflow-hidden bg-char-200 dark:bg-char-800', wrapperClassName)}>
      {status === 'loading' && (
        <span className="absolute inset-0 skeleton text-char-400" aria-hidden="true" />
      )}

      {status !== 'error' && (
        <img
          src={entry.url}
          alt={alt ?? entry.alt ?? ''}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={eager ? 'high' : 'auto'}
          onLoad={() => setStatus('ready')}
          onError={() => setStatus('error')}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-700',
            status === 'ready' ? 'opacity-100' : 'opacity-0',
            className
          )}
          {...rest}
        />
      )}

      {status === 'error' && (
        <span
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-linear-to-br from-ember-200 via-ember-100 to-char-200 p-4 text-center dark:from-char-800 dark:via-char-900 dark:to-char-800"
          role="img"
          aria-label={alt ?? fallbackLabel ?? 'Dish photo unavailable'}
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-ember-600 dark:text-ember-400" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 13h18M5 13a7 7 0 0 1 14 0M4 17h16" strokeLinecap="round" />
          </svg>
          {fallbackLabel && (
            <span className="font-display text-xs leading-tight font-semibold text-char-700 dark:text-char-200">
              {fallbackLabel}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
