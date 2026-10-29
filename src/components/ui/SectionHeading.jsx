import { cn } from '../../utils/format';

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  children,
  as: Tag = 'h2',
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        align === 'between' && 'sm:flex-row sm:items-end sm:justify-between sm:gap-8',
        className
      )}
    >
      <div className={cn('flex flex-col gap-3', align === 'center' && 'items-center')}>
        {eyebrow && (
          <span className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.22em] text-ember-600 uppercase dark:text-ember-400">
            <span className="h-px w-7 bg-ember-500/60" aria-hidden="true" />
            {eyebrow}
          </span>
        )}
        <Tag className="text-balance text-3xl leading-[1.08] font-semibold text-char-900 sm:text-4xl lg:text-[2.75rem] dark:text-char-50">
          {title}
        </Tag>
        {description && (
          <p className="max-w-2xl text-pretty leading-relaxed text-char-500 dark:text-char-300">
            {description}
          </p>
        )}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}
