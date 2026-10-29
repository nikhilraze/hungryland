import { Navigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import { useCart } from '../context/CartContext';
import { restaurant, formatAddress } from '../data/restaurant';
import { formatPrice, formatPriceExact, formatPhone, telHref } from '../utils/format';
import { useSeo } from '../hooks/useSeo';

export default function OrderConfirmation() {
  const { lastOrder } = useCart();

  useSeo({
    title: 'Order confirmed',
    description: 'Your order from The Hungry Land is confirmed.',
  });

  // Nothing to show on a direct visit or hard refresh.
  if (!lastOrder) return <Navigate to="/menu" replace />;

  const { id, customer, payment, items, totals, fulfilment, placedAt } = lastOrder;
  const isDelivery = fulfilment === 'delivery';
  const placed = new Date(placedAt);

  return (
    <div className="container-page py-14 lg:py-20">
      <div className="mx-auto max-w-2xl">
        {/* ------------------------------------------------------ headline -- */}
        <div className="flex flex-col items-center text-center animate-fade-up">
          <span
            className="flex h-20 w-20 items-center justify-center rounded-full bg-leaf/12 text-leaf"
            aria-hidden="true"
          >
            <Icon name="check" size={38} strokeWidth={2.4} />
          </span>
          <h1 className="mt-6 text-balance font-display text-3xl font-semibold text-char-900 sm:text-4xl dark:text-char-50">
            Order confirmed, {customer.name.split(' ')[0]}!
          </h1>
          <p className="mt-3 max-w-md text-pretty leading-relaxed text-char-500 dark:text-char-400">
            The kitchen has your order. We&apos;ll call{' '}
            <strong className="text-char-700 dark:text-char-200">{customer.phone}</strong> if we need
            anything.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full bg-char-900 px-4 py-2 font-display text-sm font-bold text-white dark:bg-char-50 dark:text-char-900">
              Order {id}
            </span>
            <span className="rounded-full bg-ember-100 px-4 py-2 text-sm font-semibold text-ember-800 dark:bg-ember-500/15 dark:text-ember-200">
              {isDelivery ? 'Delivery' : 'Takeaway'} · {payment.label}
            </span>
          </div>
        </div>

        {/* -------------------------------------------------------- receipt -- */}
        <div className="surface mt-10 rounded-4xl p-6 shadow-plate sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-dashed border-char-200 pb-5 dark:border-white/12">
            <h2 className="font-display text-lg font-semibold text-char-900 dark:text-char-50">
              Order details
            </h2>
            <p className="text-xs text-char-400">
              Placed{' '}
              {placed.toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          </div>

          <ul className="flex flex-col gap-3.5 py-5">
            {items.map((item, i) => (
              <li key={i} className="flex items-baseline justify-between gap-4 text-sm">
                <span className="text-char-700 dark:text-char-200">
                  <span className="font-bold">{item.quantity} ×</span> {item.name}
                  {item.portion && (
                    <span className="text-char-400"> · {item.portion}</span>
                  )}
                  {item.addons.length > 0 && (
                    <span className="block text-xs text-char-400">+ {item.addons.join(', ')}</span>
                  )}
                </span>
                <span className="shrink-0 font-semibold tabular-nums text-char-800 dark:text-char-100">
                  {formatPrice(item.lineTotal)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="flex flex-col gap-2.5 border-t border-dashed border-char-200 pt-5 text-sm dark:border-white/12">
            {[
              { label: 'Subtotal', value: formatPrice(totals.subtotal) },
              { label: `GST (${Math.round(totals.taxRate * 100)}%)`, value: formatPriceExact(totals.taxes) },
              { label: 'Packaging', value: formatPrice(totals.packaging) },
              ...(isDelivery
                ? [
                    {
                      label: 'Delivery',
                      value: totals.deliveryQualifiesFree ? 'Free' : formatPrice(totals.delivery),
                    },
                  ]
                : []),
            ].map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-4">
                <dt className="text-char-500 dark:text-char-400">{row.label}</dt>
                <dd className="shrink-0 font-semibold tabular-nums text-char-700 dark:text-char-200">
                  {row.value}
                </dd>
              </div>
            ))}
            <div className="mt-2 flex items-baseline justify-between gap-4 border-t border-char-200 pt-4 dark:border-white/12">
              <dt className="font-bold text-char-900 dark:text-char-50">
                {payment.id === 'cod' ? 'Pay on delivery' : 'Amount payable'}
              </dt>
              <dd className="shrink-0 font-display text-2xl font-semibold tabular-nums text-char-900 dark:text-char-50">
                {formatPriceExact(totals.total)}
              </dd>
            </div>
          </dl>

          {/* -------------------------------------------------- where/how -- */}
          <div className="mt-6 grid gap-4 border-t border-dashed border-char-200 pt-6 sm:grid-cols-2 dark:border-white/12">
            <div>
              <h3 className="text-[11px] font-bold tracking-[0.16em] text-char-400 uppercase">
                {isDelivery ? 'Delivering to' : 'Collect from'}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-char-600 dark:text-char-300">
                {isDelivery ? (
                  <>
                    {customer.address}
                    {customer.landmark && (
                      <>
                        <br />
                        <span className="text-char-400">Near {customer.landmark}</span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <strong className="text-char-800 dark:text-char-100">{restaurant.name}</strong>
                    <br />
                    {formatAddress()}
                  </>
                )}
              </p>
            </div>
            <div>
              <h3 className="text-[11px] font-bold tracking-[0.16em] text-char-400 uppercase">
                Questions about this order?
              </h3>
              <ul className="mt-2 flex flex-col gap-1.5 text-sm">
                {restaurant.phones.slice(0, 2).map((p) => (
                  <li key={p}>
                    <a
                      href={telHref(p)}
                      className="inline-flex items-center gap-2 font-semibold text-ember-600 hover:text-ember-700 dark:text-ember-400"
                    >
                      <Icon name="phone" size={14} />
                      {formatPhone(p)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {customer.notes && (
            <p className="mt-5 flex items-start gap-2 rounded-2xl bg-char-100 p-3.5 text-xs leading-relaxed text-char-600 dark:bg-white/6 dark:text-char-300">
              <Icon name="info" size={15} className="mt-px shrink-0" />
              <span>
                <strong>Note for the kitchen:</strong> {customer.notes}
              </span>
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to="/menu" size="lg">
            Order something else
            <Icon name="arrowRight" size={17} />
          </Button>
          <Button to="/" variant="outline" size="lg">
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
}
