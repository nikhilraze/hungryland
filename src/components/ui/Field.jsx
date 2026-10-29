import { cn } from '../../utils/format';
import Icon from './Icon';

/**
 * Labelled form control with inline validation messaging wired up for screen
 * readers via aria-invalid / aria-describedby.
 */
export default function Field({
  id,
  label,
  type = 'text',
  as = 'input',
  error,
  hint,
  className,
  required,
  ...rest
}) {
  const Tag = as;
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-semibold text-char-700 dark:text-char-200">
        {label}
        {required && (
          <span className="ml-1 text-chilli" aria-hidden="true">
            *
          </span>
        )}
        {!required && <span className="ml-1.5 text-xs font-normal text-char-400">Optional</span>}
      </label>

      <Tag
        id={id}
        type={Tag === 'input' ? type : undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        className={cn(
          'w-full rounded-2xl border bg-white px-4 text-sm text-char-800 transition-colors',
          'placeholder:text-char-400 focus:border-ember-400',
          Tag === 'textarea' ? 'min-h-24 py-3 resize-y' : 'h-12',
          error
            ? 'border-chilli/60 bg-chilli/3'
            : 'border-char-200 dark:border-white/12',
          'dark:bg-white/6 dark:text-char-100 dark:placeholder:text-char-500'
        )}
        {...rest}
      />

      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-char-400">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-xs font-semibold text-chilli">
          <Icon name="alert" size={13} strokeWidth={2} />
          {error}
        </p>
      )}
    </div>
  );
}
