import Icon from '../ui/Icon';
import { useCart } from '../../context/CartContext';
import { restaurant } from '../../data/restaurant';
import { formatPrice, formatPriceExact, cn } from '../../utils/format';

function Row({ label, value, hint, strong, muted, success }) {
  return (
    <div className={cn('flex items-baseline justify-between gap-4 text-sm', strong && 'text-base')}>
      <span
        className={cn(
          strong ? 'font-bold text-char-900 dark:text-char-50' : 'text-char-500 dark:text-char-300',
          muted && 'text-char-400'
        )}
      >
        {label}
        {hint && <span className="ml-1 text-xs text-char-400">{hint}</span>}
      </span>
      <span
        className={cn(
          'shrink-0 tabular-nums',
          strong ? 'font-display text-xl font-semibold text-char-900 dark:text-char-50' : 'font-semibold text-char-700 dark:text-char-200',
          success && 'text-leaf'
        )}
      >
        {value}
      </span>
    </div>
  );
}

/** Fulfilment toggle — switches whether the delivery fee applies. */
export function FulfilmentToggle() {
  const { fulfilment, setFulfilment } = useCart();
  const options = [
    { id: 'delivery', label: 'Delivery', icon: 'scooter' },
    { id: 'takeaway', label: 'Takeaway', icon: 'bag' },
  ];

  return (
    <fieldset>
      <legend className="sr-only">Choose how to receive your order</legend>
      <div className="grid grid-cols-2 gap-1.5 rounded-full bg-char-100 p-1.5 dark:bg-white/8">
        {options.map((o) => (
          <label
            key={o.id}
            className={cn(
              'flex cursor-pointer items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-all duration-300',
              'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ember-500',
              fulfilment === o.id
                ? 'bg-white text-char-900 shadow-sm dark:bg-char-800 dark:text-char-50'
                : 'text-char-500 hover:text-char-700 dark:text-char-400'
            )}
          >
            <input
              type="radio"
              name="fulfilment"
              value={o.id}
              checked={fulfilment === o.id}
              onChange={() => setFulfilment(o.id)}
              className="sr-only"
            />
            <Icon name={o.icon} size={16} />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function OrderSummary({ className, showFulfilment = true }) {
  const { totals } = useCart();
  const { freeDeliveryAbove } = restaurant.charges;

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {showFulfilment && <FulfilmentToggle />}

      {totals.isDelivery && totals.amountToFreeDelivery > 0 && totals.subtotal > 0 && (
        <div className="rounded-2xl bg-ember-50 p-3.5 dark:bg-ember-500/12">
          <p className="flex items-start gap-2 text-xs leading-relaxed text-ember-900 dark:text-ember-100">
            <Icon name="scooter" size={15} className="mt-0.5 shrink-0" />
            <span>
              Add <strong>{formatPrice(totals.amountToFreeDelivery)}</strong> more for free delivery
              (orders over {formatPrice(freeDeliveryAbove)}).
            </span>
          </p>
          <div
            className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-ember-200/70 dark:bg-white/10"
            role="progressbar"
            aria-valuenow={Math.min(100, Math.round((totals.subtotal / freeDeliveryAbove) * 100))}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progress towards free delivery"
          >
            <div
              className="h-full rounded-full bg-ember-500 transition-all duration-700 ease-[var(--ease-out-soft)]"
              style={{ width: `${Math.min(100, (totals.subtotal / freeDeliveryAbove) * 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        <Row
          label="Subtotal"
          hint={`(${totals.itemCount} ${totals.itemCount === 1 ? 'item' : 'items'})`}
          value={formatPrice(totals.subtotal)}
        />
        <Row
          label="GST"
          hint={`(${Math.round(totals.taxRate * 100)}%)`}
          value={formatPriceExact(totals.taxes)}
        />
        <Row label="Packaging" value={formatPrice(totals.packaging)} />
        {totals.isDelivery && (
          <Row
            label="Delivery"
            value={totals.deliveryQualifiesFree ? 'Free' : formatPrice(totals.delivery)}
            success={totals.deliveryQualifiesFree}
          />
        )}
        {!totals.isDelivery && <Row label="Delivery" value="—" muted />}

        <div className="my-1 border-t border-dashed border-char-200 dark:border-white/12" />
        <Row label="Total to pay" value={formatPriceExact(totals.total)} strong />
      </div>
    </div>
  );
}
