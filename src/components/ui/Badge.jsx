import { DIET_TYPES, SPICE_LEVELS } from '../../data/menu';
import { SolidIcon } from './Icon';
import { cn } from '../../utils/format';

/**
 * The square veg/non-veg mark used on Indian menus — a coloured dot inside a
 * matching outline. Screen-reader label spells out the meaning.
 */
export function DietMark({ type, size = 16, className }) {
  const meta = DIET_TYPES[type] ?? DIET_TYPES.veg;
  const color =
    meta.id === 'veg' ? 'text-leaf' : meta.id === 'egg' ? 'text-ember-500' : 'text-chilli';

  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center rounded-[4px] border-[1.5px] border-current', color, className)}
      style={{ width: size, height: size }}
      title={meta.label}
    >
      <span className="sr-only">{meta.label}</span>
      <span
        className="rounded-full bg-current"
        style={{ width: size * 0.42, height: size * 0.42 }}
        aria-hidden="true"
      />
    </span>
  );
}

export function DietPill({ type, className }) {
  const meta = DIET_TYPES[type] ?? DIET_TYPES.veg;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider',
        meta.id === 'veg' && 'bg-leaf/12 text-leaf',
        meta.id === 'egg' && 'bg-ember-500/14 text-ember-700 dark:text-ember-300',
        meta.id === 'nonveg' && 'bg-chilli/12 text-chilli',
        className
      )}
    >
      <DietMark type={type} size={12} />
      {meta.short}
    </span>
  );
}

export function SpiceMeter({ level, className, showLabel = true }) {
  if (!level || !SPICE_LEVELS[level]) return null;
  const meta = SPICE_LEVELS[level];
  return (
    <span
      className={cn('inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-char-500 dark:text-char-300', className)}
      title={`Spice level: ${meta.label}`}
    >
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3].map((i) => (
          <SolidIcon
            key={i}
            name="flame"
            size={11}
            className={i <= meta.flames ? 'text-chilli' : 'text-char-300 dark:text-char-600'}
          />
        ))}
      </span>
      {showLabel && <span className="sr-only sm:not-sr-only">{meta.label}</span>}
      {!showLabel && <span className="sr-only">Spice level: {meta.label}</span>}
    </span>
  );
}

export function Tag({ children, tone = 'ember', className, icon }) {
  const tones = {
    ember: 'bg-ember-500 text-white',
    soft: 'bg-ember-100 text-ember-800 dark:bg-ember-500/18 dark:text-ember-200',
    dark: 'bg-char-900/85 text-white backdrop-blur-sm dark:bg-white/15',
    leaf: 'bg-leaf text-white',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em]',
        tones[tone],
        className
      )}
    >
      {icon && <SolidIcon name={icon} size={11} />}
      {children}
    </span>
  );
}
