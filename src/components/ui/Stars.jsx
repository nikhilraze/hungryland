import { SolidIcon } from './Icon';
import { cn } from '../../utils/format';

export default function Stars({ rating, size = 14, className }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)}>
      <span className="sr-only">{rating} out of 5 stars</span>
      {[1, 2, 3, 4, 5].map((i) => (
        <SolidIcon
          key={i}
          name="star"
          size={size}
          className={i <= Math.round(rating) ? 'text-ember-400' : 'text-char-300 dark:text-char-600'}
        />
      ))}
    </span>
  );
}
