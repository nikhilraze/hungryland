import { Link } from 'react-router-dom';
import { cn } from '../../utils/format';

const base =
  'inline-flex items-center justify-center gap-2 font-semibold tracking-tight rounded-full ' +
  'transition-all duration-300 ease-[var(--ease-out-soft)] select-none ' +
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0';

const variants = {
  primary:
    'bg-ember-500 text-white shadow-lift hover:bg-ember-600 hover:-translate-y-0.5 hover:shadow-plate active:translate-y-0',
  dark: 'bg-char-900 text-char-50 hover:bg-char-800 hover:-translate-y-0.5 dark:bg-char-50 dark:text-char-900 dark:hover:bg-white',
  outline:
    'border border-char-300 text-char-800 hover:border-ember-500 hover:text-ember-700 hover:-translate-y-0.5 ' +
    'dark:border-white/20 dark:text-char-100 dark:hover:border-ember-400 dark:hover:text-ember-300',
  ghost:
    'text-char-700 hover:bg-char-100 dark:text-char-200 dark:hover:bg-white/10',
  glass:
    'bg-white/12 text-white ring-1 ring-white/30 backdrop-blur-md hover:bg-white/20 hover:-translate-y-0.5',
  danger:
    'text-chilli hover:bg-chilli/10 dark:hover:bg-chilli/15',
};

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-base',
  icon: 'h-10 w-10',
  iconSm: 'h-8 w-8',
};

export default function Button({
  as,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }
  const Tag = as ?? 'button';
  return (
    <Tag className={classes} type={Tag === 'button' ? (rest.type ?? 'button') : undefined} {...rest}>
      {children}
    </Tag>
  );
}
