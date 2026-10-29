import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import SmartImage from '../ui/SmartImage';
import Icon from '../ui/Icon';
import { DietMark, SpiceMeter, Tag } from '../ui/Badge';
import { formatPrice, cn } from '../../utils/format';

export default function DishCard({ dish, onOpen, index = 0 }) {
  const { addItem, quantityOfDish } = useCart();
  const { toast } = useToast();
  const inCart = quantityOfDish(dish.id);

  const handleAdd = (e) => {
    e.stopPropagation();
    const variant = dish.variants[0];
    addItem({ dishId: dish.id, variantId: variant.id, addonIds: [], quantity: 1 });
    toast({
      title: `${dish.name} added`,
      description: dish.hasPortions
        ? `${variant.label} · ${formatPrice(variant.price)}`
        : formatPrice(variant.price),
      image: dish.image,
    });
  };

  return (
    <article
      className="group surface relative flex h-full flex-col overflow-hidden rounded-4xl shadow-sm transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1.5 hover:shadow-plate"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      {/* Whole-card click target for the detail view, kept keyboard-accessible */}
      <button
        type="button"
        onClick={() => onOpen(dish)}
        className="absolute inset-0 z-10 cursor-pointer"
        aria-label={`View details for ${dish.name}`}
      />

      <div className="relative aspect-4/3 overflow-hidden">
        <SmartImage
          imageKey={dish.image}
          alt={dish.name}
          fallbackLabel={dish.name}
          wrapperClassName="h-full w-full"
          className="transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-107"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-char-950/70 to-transparent"
          aria-hidden="true"
        />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {dish.isSpecial && (
            <Tag tone="ember" icon="sparkle">
              Today&apos;s Special
            </Tag>
          )}
          {dish.isPopular && !dish.isSpecial && <Tag tone="dark">Popular</Tag>}
        </div>

        <span className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-lg bg-white/92 shadow-sm backdrop-blur dark:bg-char-900/90">
          <DietMark type={dish.type} size={14} />
        </span>

        <p className="absolute bottom-3 left-4 text-[11px] font-semibold tracking-[0.14em] text-white/85 uppercase">
          {dish.categoryName}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-pretty text-[1.0625rem] leading-snug font-semibold text-char-900 dark:text-char-50">
            {dish.name}
          </h3>
          <SpiceMeter level={dish.spice} showLabel={false} className="mt-1 shrink-0" />
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-char-500 dark:text-char-300">
          {dish.description}
        </p>

        {dish.ingredients.length > 0 && (
          <p className="line-clamp-1 text-xs text-char-400 dark:text-char-400">
            <span className="font-semibold text-char-500 dark:text-char-300">Ingredients: </span>
            {dish.ingredients.join(', ')}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div>
            {dish.hasPortions && (
              <p className="text-[10px] font-semibold tracking-wider text-char-400 uppercase">From</p>
            )}
            <p className="font-display text-xl font-semibold text-char-900 dark:text-char-50">
              {formatPrice(dish.basePrice)}
            </p>
            {dish.hasPortions && (
              <p className="text-[11px] text-char-400">
                {dish.variants.map((v) => v.label).join(' · ')}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={cn(
              'relative z-20 inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-semibold',
              'transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 active:translate-y-0',
              inCart
                ? 'bg-leaf/12 text-leaf hover:bg-leaf/20'
                : 'bg-char-900 text-white hover:bg-ember-500 dark:bg-char-50 dark:text-char-900 dark:hover:bg-ember-400'
            )}
            aria-label={
              dish.hasPortions
                ? `Add ${dish.name} (${dish.variants[0].label}) to cart`
                : `Add ${dish.name} to cart`
            }
          >
            <Icon name={inCart ? 'check' : 'plus'} size={15} strokeWidth={2.4} />
            {inCart ? `${inCart} in cart` : 'Add'}
          </button>
        </div>
      </div>
    </article>
  );
}
