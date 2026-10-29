import Icon from './Icon';
import { cn } from '../../utils/format';

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  label = 'Quantity',
  className,
}) {
  const sizes = {
    sm: { btn: 'h-8 w-8', text: 'w-8 text-sm', icon: 14 },
    md: { btn: 'h-10 w-10', text: 'w-10 text-base', icon: 16 },
    lg: { btn: 'h-12 w-12', text: 'w-12 text-lg', icon: 18 },
  }[size];

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-char-200 bg-white dark:border-white/15 dark:bg-char-900',
        className
      )}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Decrease ${label.toLowerCase()}`}
        className={cn(
          sizes.btn,
          'flex items-center justify-center rounded-full text-char-600 transition-colors hover:bg-ember-50 hover:text-ember-700 disabled:opacity-35 disabled:hover:bg-transparent dark:text-char-300 dark:hover:bg-white/10 dark:hover:text-ember-300'
        )}
      >
        <Icon name="minus" size={sizes.icon} strokeWidth={2.2} />
      </button>

      <span
        className={cn(sizes.text, 'text-center font-bold tabular-nums')}
        aria-live="polite"
        aria-atomic="true"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Increase ${label.toLowerCase()}`}
        className={cn(
          sizes.btn,
          'flex items-center justify-center rounded-full text-char-600 transition-colors hover:bg-ember-50 hover:text-ember-700 disabled:opacity-35 disabled:hover:bg-transparent dark:text-char-300 dark:hover:bg-white/10 dark:hover:text-ember-300'
        )}
      >
        <Icon name="plus" size={sizes.icon} strokeWidth={2.2} />
      </button>
    </div>
  );
}
