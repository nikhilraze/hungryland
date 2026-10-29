import { useToast } from '../../context/ToastContext';
import SmartImage from './SmartImage';
import Icon from './Icon';
import { cn } from '../../utils/format';

export default function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      /* extra bottom padding on small screens so toasts clear the mobile order bar */
      className="pointer-events-none fixed inset-x-0 bottom-0 z-90 flex flex-col items-center gap-2 p-4 pb-24 sm:items-end sm:p-6 lg:pb-6"
      role="region"
      aria-label="Notifications"
    >
      <ol className="flex w-full max-w-sm flex-col gap-2" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <li
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-center gap-3 rounded-2xl border p-3 pr-2 shadow-plate backdrop-blur-xl animate-toast-in',
              t.variant === 'error'
                ? 'border-chilli/25 bg-white/95 dark:bg-char-900/95'
                : 'border-char-200/70 bg-white/95 dark:border-white/12 dark:bg-char-900/95'
            )}
          >
            {t.image ? (
              <SmartImage
                imageKey={t.image}
                alt=""
                wrapperClassName="h-11 w-11 shrink-0 rounded-xl"
              />
            ) : (
              <span
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                  t.variant === 'error' ? 'bg-chilli/12 text-chilli' : 'bg-leaf/12 text-leaf'
                )}
              >
                <Icon name={t.variant === 'error' ? 'alert' : 'check'} size={17} strokeWidth={2.4} />
              </span>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-char-900 dark:text-char-50">{t.title}</p>
              {t.description && (
                <p className="truncate text-xs text-char-500 dark:text-char-300">{t.description}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="shrink-0 rounded-full p-2 text-char-400 transition-colors hover:bg-char-100 hover:text-char-700 dark:hover:bg-white/10 dark:hover:text-char-100"
            >
              <Icon name="close" size={15} strokeWidth={2} />
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
