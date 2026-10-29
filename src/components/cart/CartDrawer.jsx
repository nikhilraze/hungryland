import { useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import CartLine from './CartLine';
import OrderSummary from './OrderSummary';
import EmptyCart from './EmptyCart';
import { useCart } from '../../context/CartContext';
import { formatPriceExact } from '../../utils/format';

export default function CartDrawer() {
  const { isOpen, closeCart, items, totals, clearCart } = useCart();
  const navigate = useNavigate();

  const go = (path) => {
    closeCart();
    navigate(path);
  };

  return (
    <Modal
      open={isOpen}
      onClose={closeCart}
      position="right"
      labelledBy="cart-drawer-title"
      closeLabel="Close cart"
      panelClassName="flex h-full w-full max-w-md flex-col bg-char-50 shadow-plate dark:bg-char-950 animate-fade-in"
    >
      <header className="flex items-center gap-3 border-b border-char-200/80 px-6 py-5 pr-16 dark:border-white/10">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ember-100 text-ember-700 dark:bg-ember-500/15 dark:text-ember-300">
          <Icon name="cart" size={19} />
        </span>
        <div>
          <h2
            id="cart-drawer-title"
            className="text-lg font-semibold text-char-900 dark:text-char-50"
          >
            Your order
          </h2>
          <p className="text-xs text-char-500 dark:text-char-400">
            {totals.itemCount === 0
              ? 'Nothing here yet'
              : `${totals.itemCount} ${totals.itemCount === 1 ? 'item' : 'items'}`}
          </p>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <EmptyCart onBrowse={() => go('/menu')} />
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto scroll-slim px-6">
            <ul className="divide-y divide-char-200/70 dark:divide-white/8">
              {items.map((item) => (
                <CartLine key={item.key} item={item} compact />
              ))}
            </ul>

            <button
              type="button"
              onClick={clearCart}
              className="my-4 inline-flex items-center gap-1.5 text-xs font-semibold text-char-400 transition-colors hover:text-chilli"
            >
              <Icon name="trash" size={13} />
              Empty cart
            </button>
          </div>

          <footer className="border-t border-char-200/80 bg-white px-6 py-5 dark:border-white/10 dark:bg-char-900/60">
            <OrderSummary />
            <div className="mt-5 grid gap-2">
              <Button size="lg" onClick={() => go('/checkout')}>
                Checkout · {formatPriceExact(totals.total)}
                <Icon name="arrowRight" size={17} />
              </Button>
              <Button variant="ghost" size="md" onClick={() => go('/cart')}>
                View full cart
              </Button>
            </div>
          </footer>
        </>
      )}
    </Modal>
  );
}
