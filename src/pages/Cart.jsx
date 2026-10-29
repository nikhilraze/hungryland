import { useState } from 'react';
import { Link } from 'react-router-dom';
import CartLine from '../components/cart/CartLine';
import OrderSummary from '../components/cart/OrderSummary';
import EmptyCart from '../components/cart/EmptyCart';
import DishRail from '../components/menu/DishRail';
import DishDetailModal from '../components/menu/DishDetailModal';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import { useCart } from '../context/CartContext';
import { POPULAR_DISHES } from '../data/menu';
import { formatPriceExact } from '../utils/format';
import { useSeo } from '../hooks/useSeo';

export default function Cart() {
  const { items, totals, clearCart } = useCart();
  const [selected, setSelected] = useState(null);

  useSeo({
    title: 'Your cart',
    description: 'Review your order from The Hungry Land before checkout.',
  });

  const suggestions = POPULAR_DISHES.filter((d) => !items.some((i) => i.dishId === d.id)).slice(0, 8);

  return (
    <>
      <div className="container-page py-12 lg:py-16">
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-sm font-semibold text-char-500 transition-colors hover:text-ember-600 dark:text-char-400 dark:hover:text-ember-300"
          >
            <Icon name="arrowLeft" size={16} />
            Back to menu
          </Link>
        </nav>

        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-char-900 sm:text-4xl dark:text-char-50">
              Your cart
            </h1>
            <p className="mt-2 text-char-500 dark:text-char-400">
              {items.length === 0
                ? 'Nothing added yet.'
                : `${totals.itemCount} ${totals.itemCount === 1 ? 'item' : 'items'} from The Hungry Land.`}
            </p>
          </div>
          {items.length > 0 && (
            <Button variant="danger" size="sm" onClick={clearCart}>
              <Icon name="trash" size={15} />
              Empty cart
            </Button>
          )}
        </header>

        {items.length === 0 ? (
          <div className="flex justify-center py-20">
            <EmptyCart />
          </div>
        ) : (
          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
            <ul className="surface divide-y divide-char-200/70 rounded-4xl px-5 shadow-sm sm:px-7 dark:divide-white/8">
              {items.map((item) => (
                <CartLine key={item.key} item={item} />
              ))}
            </ul>

            <aside className="surface sticky top-28 rounded-4xl p-6 shadow-sm sm:p-7">
              <h2 className="font-display text-lg font-semibold text-char-900 dark:text-char-50">
                Order summary
              </h2>
              <div className="mt-5">
                <OrderSummary />
              </div>
              <Button to="/checkout" size="lg" className="mt-6 w-full">
                Proceed to checkout
                <Icon name="arrowRight" size={17} />
              </Button>
              <p className="mt-3.5 text-center text-xs leading-relaxed text-char-400">
                Cash on delivery and online payment both accepted.
              </p>
            </aside>
          </div>
        )}
      </div>

      {items.length > 0 && suggestions.length > 0 && (
        <section
          className="border-t border-char-200/70 bg-white py-16 dark:border-white/8 dark:bg-char-900/40"
          aria-labelledby="cart-suggestions"
        >
          <div className="container-page">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.22em] text-ember-600 uppercase dark:text-ember-400">
                  <span className="h-px w-7 bg-ember-500/60" aria-hidden="true" />
                  Add something else
                </p>
                <h2
                  id="cart-suggestions"
                  className="mt-3 font-display text-2xl font-semibold text-char-900 sm:text-3xl dark:text-char-50"
                >
                  Goes well with your order
                </h2>
              </div>
              <p className="text-sm text-char-500 dark:text-char-400">
                Total so far ·{' '}
                <strong className="text-char-800 dark:text-char-100">
                  {formatPriceExact(totals.total)}
                </strong>
              </p>
            </div>
            <DishRail dishes={suggestions} onOpen={setSelected} label="Suggested dishes" />
          </div>
        </section>
      )}

      <DishDetailModal dish={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
    </>
  );
}
