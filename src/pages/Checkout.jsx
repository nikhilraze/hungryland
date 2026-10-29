import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Field from '../components/ui/Field';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import SmartImage from '../components/ui/SmartImage';
import OrderSummary, { FulfilmentToggle } from '../components/cart/OrderSummary';
import EmptyCart from '../components/cart/EmptyCart';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { restaurant } from '../data/restaurant';
import { formatPrice, formatPriceExact, orderNumber, cn } from '../utils/format';
import { useSeo } from '../hooks/useSeo';

const PAYMENT_METHODS = [
  {
    id: 'cod',
    label: 'Cash on Delivery',
    description: 'Pay the rider, or at the counter for takeaway.',
    icon: 'bag',
  },
  {
    id: 'online',
    label: 'Online Payment',
    description: 'UPI, card or net banking on confirmation.',
    icon: 'sparkle',
  },
];

const EMPTY = { name: '', phone: '', email: '', address: '', landmark: '', notes: '' };

/** Returns an { field: message } object; empty means valid. */
function validate(values, { requireAddress }) {
  const errors = {};

  const name = values.name.trim();
  if (!name) errors.name = 'Please tell us your name.';
  else if (name.length < 2) errors.name = 'That name looks too short.';

  const phone = values.phone.replace(/[\s-]/g, '');
  if (!phone) errors.phone = 'We need a phone number to confirm your order.';
  else if (!/^(\+91)?[6-9]\d{9}$/.test(phone))
    errors.phone = 'Enter a valid 10-digit Indian mobile number.';

  const email = values.email.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email))
    errors.email = 'That email address does not look right.';

  if (requireAddress) {
    const address = values.address.trim();
    if (!address) errors.address = 'Where should we deliver?';
    else if (address.length < 12) errors.address = 'Please add a bit more detail — house, road, area.';
  }

  return errors;
}

function buildWhatsAppUrl(order) {
  const { customer, items, totals, fulfilment, payment } = order;
  const itemLines = items.map((item) => {
    const portion = item.portion ? ` (${item.portion})` : '';
    const addons = item.addons.length ? ` + ${item.addons.join(', ')}` : '';
    return `• ${item.quantity} × ${item.name}${portion}${addons} — ${formatPrice(item.lineTotal)}`;
  });
  const fulfilmentLabel = fulfilment === 'delivery' ? 'Delivery' : 'Takeaway';
  const address = fulfilment === 'delivery'
    ? `\nAddress: ${customer.address}${customer.landmark ? `\nLandmark: ${customer.landmark}` : ''}`
    : '';
  const notes = customer.notes ? `\nNotes: ${customer.notes}` : '';

  const message = [
    `*New order · ${order.id}*`,
    '',
    `Customer: ${customer.name}`,
    `Phone: ${customer.phone}`,
    customer.email ? `Email: ${customer.email}` : null,
    `Fulfilment: ${fulfilmentLabel}${address}`,
    `Payment: ${payment.label}`,
    '',
    '*Items*',
    ...itemLines,
    '',
    `Subtotal: ${formatPriceExact(totals.subtotal)}`,
    `GST: ${formatPriceExact(totals.taxes)}`,
    `Packaging: ${formatPrice(totals.packaging)}`,
    `Delivery: ${totals.isDelivery ? formatPrice(totals.delivery) : 'Takeaway'}`,
    `*Total: ${formatPriceExact(totals.total)}*`,
    notes,
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(message)}`;
}

export default function Checkout() {
  const { items, totals, fulfilment, placeOrder } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [payment, setPayment] = useState('cod');
  const [isPlacing, setIsPlacing] = useState(false);

  useSeo({
    title: 'Checkout',
    description: 'Complete your order from The Hungry Land — cash on delivery or online payment.',
  });

  const requireAddress = fulfilment === 'delivery';
  const errors = useMemo(() => validate(values, { requireAddress }), [values, requireAddress]);
  const showError = (field) => (touched[field] || submitted ? errors[field] : undefined);

  const update = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  const blur = (field) => () => setTouched((t) => ({ ...t, [field]: true }));

  if (items.length === 0) {
    return (
      <div className="container-page flex justify-center py-24">
        <EmptyCart />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (Object.keys(errors).length > 0) {
      toast({
        title: 'Please check the form',
        description: 'A few details still need fixing.',
        variant: 'error',
      });
      document
        .querySelector('[aria-invalid="true"]')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      document.querySelector('[aria-invalid="true"]')?.focus({ preventScroll: true });
      return;
    }

    setIsPlacing(true);

    const order = placeOrder({
      id: orderNumber(),
      customer: { ...values },
      payment: PAYMENT_METHODS.find((p) => p.id === payment),
    });

    const whatsappWindow = window.open(buildWhatsAppUrl(order), '_blank', 'noopener,noreferrer');
    setIsPlacing(false);
    toast({
      title: whatsappWindow ? 'Order ready to send!' : 'Order placed!',
      description: whatsappWindow
        ? 'Review the pre-filled WhatsApp message and tap send.'
        : 'WhatsApp was blocked. Your order is still confirmed.',
    });
    navigate('/order-confirmed', { replace: true });
  };

  return (
    <div className="container-page py-12 lg:py-16">
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm font-semibold text-char-500 transition-colors hover:text-ember-600 dark:text-char-400 dark:hover:text-ember-300"
        >
          <Icon name="arrowLeft" size={16} />
          Back to cart
        </Link>
      </nav>

      <header>
        <h1 className="font-display text-3xl font-semibold text-char-900 sm:text-4xl dark:text-char-50">
          Checkout
        </h1>
        <p className="mt-2 text-char-500 dark:text-char-400">
          Two minutes and the kitchen gets started.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-10 grid items-start gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12"
      >
        <div className="flex flex-col gap-6">
          {/* --------------------------------------------------- fulfilment -- */}
          <section className="surface rounded-4xl p-6 shadow-sm sm:p-7">
            <h2 className="mb-4 font-display text-lg font-semibold text-char-900 dark:text-char-50">
              How would you like it?
            </h2>
            <FulfilmentToggle />
            <p className="mt-3 text-xs leading-relaxed text-char-400">
              {requireAddress
                ? `Delivery across Haldia. Free over ${formatPrice(restaurant.charges.freeDeliveryAbove)}.`
                : `Collect from ${restaurant.address.line1}, ${restaurant.address.line2}.`}
            </p>
          </section>

          {/* ------------------------------------------------------ details -- */}
          <section className="surface rounded-4xl p-6 shadow-sm sm:p-7">
            <h2 className="mb-5 font-display text-lg font-semibold text-char-900 dark:text-char-50">
              Your details
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id="name"
                label="Full name"
                required
                autoComplete="name"
                placeholder="e.g. Ananya Ghosh"
                value={values.name}
                onChange={update('name')}
                onBlur={blur('name')}
                error={showError('name')}
              />
              <Field
                id="phone"
                label="Phone number"
                type="tel"
                required
                inputMode="numeric"
                autoComplete="tel"
                placeholder="10-digit mobile"
                value={values.phone}
                onChange={update('phone')}
                onBlur={blur('phone')}
                error={showError('phone')}
                hint="We only use this to confirm your order."
              />
              <Field
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={update('email')}
                onBlur={blur('email')}
                error={showError('email')}
                className="sm:col-span-2"
                hint="For your order receipt."
              />

              {requireAddress && (
                <>
                  <Field
                    id="address"
                    label="Delivery address"
                    as="textarea"
                    required
                    autoComplete="street-address"
                    placeholder="House / flat, road, area, Haldia"
                    value={values.address}
                    onChange={update('address')}
                    onBlur={blur('address')}
                    error={showError('address')}
                    className="sm:col-span-2"
                  />
                  <Field
                    id="landmark"
                    label="Landmark"
                    placeholder="Near…"
                    value={values.landmark}
                    onChange={update('landmark')}
                    className="sm:col-span-2"
                  />
                </>
              )}

              <Field
                id="notes"
                label="Notes for the kitchen"
                as="textarea"
                placeholder="Less spicy, extra raita, no onion…"
                value={values.notes}
                onChange={update('notes')}
                className="sm:col-span-2"
              />
            </div>
          </section>

          {/* ------------------------------------------------------ payment -- */}
          <section className="surface rounded-4xl p-6 shadow-sm sm:p-7">
            <fieldset>
              <legend className="mb-5 font-display text-lg font-semibold text-char-900 dark:text-char-50">
                Payment method
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {PAYMENT_METHODS.map((m) => {
                  const active = payment === m.id;
                  return (
                    <label
                      key={m.id}
                      className={cn(
                        'flex cursor-pointer gap-3.5 rounded-3xl border p-5 transition-all duration-300',
                        'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ember-500',
                        active
                          ? 'border-ember-500 bg-ember-50 dark:bg-ember-500/12'
                          : 'border-char-200 hover:border-char-300 dark:border-white/12'
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={m.id}
                        checked={active}
                        onChange={() => setPayment(m.id)}
                        className="sr-only"
                      />
                      <span
                        className={cn(
                          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors',
                          active ? 'border-ember-500 bg-ember-500 text-white' : 'border-char-300 dark:border-white/25'
                        )}
                        aria-hidden="true"
                      >
                        {active && <Icon name="check" size={11} strokeWidth={3} />}
                      </span>
                      <span>
                        <span className="flex items-center gap-2 font-display text-sm font-bold text-char-900 dark:text-char-50">
                          <Icon name={m.icon} size={16} className="text-ember-600 dark:text-ember-400" />
                          {m.label}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-char-500 dark:text-char-400">
                          {m.description}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {payment === 'online' && (
              <p className="mt-4 flex items-start gap-2 rounded-2xl bg-ember-50 p-3.5 text-xs leading-relaxed text-ember-900 dark:bg-ember-500/12 dark:text-ember-100">
                <Icon name="info" size={15} className="mt-px shrink-0" />
                This demo does not process payments. Connect a gateway (Razorpay, PhonePe, Cashfree)
                in <code className="font-semibold">Checkout.jsx</code> to take money online.
              </p>
            )}
          </section>
        </div>

        {/* ----------------------------------------------------- summary -- */}
        <aside className="surface sticky top-28 rounded-4xl p-6 shadow-sm sm:p-7">
          <h2 className="font-display text-lg font-semibold text-char-900 dark:text-char-50">
            Order summary
          </h2>

          <ul className="mt-5 flex max-h-72 flex-col gap-3 overflow-y-auto scroll-slim pr-1">
            {items.map((item) => (
              <li key={item.key} className="flex items-center gap-3">
                <SmartImage
                  imageKey={item.dish.image}
                  alt=""
                  wrapperClassName="h-12 w-12 shrink-0 rounded-xl"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-char-800 dark:text-char-100">
                    {item.quantity} × {item.dish.name}
                  </p>
                  <p className="truncate text-xs text-char-400">
                    {item.dish.hasPortions ? item.variant.label : item.dish.categoryName}
                    {item.addons.length > 0 && ` · +${item.addons.map((a) => a.name).join(', ')}`}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-bold tabular-nums text-char-800 dark:text-char-100">
                  {formatPrice(item.lineTotal)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-char-200/80 pt-5 dark:border-white/10">
            <OrderSummary showFulfilment={false} />
          </div>

          <Button type="submit" size="lg" className="mt-6 w-full" disabled={isPlacing}>
            {isPlacing ? (
              <>
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  aria-hidden="true"
                />
                Placing order…
              </>
            ) : (
              <>
                <Icon name="check" size={17} strokeWidth={2.4} />
                Place Order · {formatPriceExact(totals.total)}
              </>
            )}
          </Button>

          <p className="mt-3.5 text-center text-xs leading-relaxed text-char-400">
            By placing this order you agree to be contacted on the number above.
          </p>
        </aside>
      </form>
    </div>
  );
}
