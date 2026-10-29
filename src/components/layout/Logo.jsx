import { cn } from '../../utils/format';

/** Brand mark — a map pin cradling a dome of rice, echoing the menu card. */
export default function Logo({ className }) {
  return (
    <span
      className={cn(
        'flex items-center justify-center rounded-2xl bg-char-900 text-ember-400 dark:bg-ember-500 dark:text-char-950',
        className
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 32" className="h-[62%] w-[62%]" fill="none">
        <path
          d="M16 4c4.2 0 7.5 3.3 7.5 7.4 0 4.6-5.3 10.3-7 12a.7.7 0 0 1-1 0c-1.7-1.7-7-7.4-7-12C8.5 7.3 11.8 4 16 4z"
          fill="currentColor"
        />
        <circle cx="16" cy="11.4" r="2.9" className="fill-char-900 dark:fill-ember-500" />
        <path
          d="M9 27c0-2.9 3.1-5.2 7-5.2s7 2.3 7 5.2"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
