import { useLocation } from 'react-router-dom';
import Icon from '../ui/Icon';
import { useCart } from '../../context/CartContext';
import { formatPriceExact } from '../../utils/format';

/**
 * Persistent "N items · ₹X — View cart" bar on small screens.
 * Hidden on the cart/checkout routes where it would be redundant.
 */
export default function MobileOrderBar() {
  const { totals, openCart } = useCart();
  const { pathname } = useLocation();

  const hiddenOn = ['/cart', '/checkout', '/order-confirmed'];
  if (totals.itemCount === 0 || hiddenOn.includes(pathname)) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-60 p-3 lg:hidden">
      <button
        type="button"
        onClick={openCart}
        className="flex w-full items-center justify-between gap-3 rounded-full bg-char-900 px-5 py-3.5 text-white shadow-plate animate-toast-in dark:bg-ember-500"
      >
        <span className="flex items-center gap-2.5">
          <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white/18 px-2 text-xs font-bold tabular-nums">
            {totals.itemCount}
          </span>
          <span className="text-sm font-semibold">
            {totals.itemCount === 1 ? 'item' : 'items'} · {formatPriceExact(totals.total)}
          </span>
        </span>
        <span className="flex items-center gap-1.5 text-sm font-bold">
          View cart
          <Icon name="arrowRight" size={16} />
        </span>
      </button>
    </div>
  );
}
