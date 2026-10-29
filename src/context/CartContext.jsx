import { createContext, useCallback, useContext, useMemo, useReducer, useEffect, useState } from 'react';
import { restaurant } from '../data/restaurant';
import { getDishById, getVariant } from '../data/menu';

const CartContext = createContext(null);

const STORAGE_KEY = 'hl.cart.v1';

/** A cart line is uniquely identified by dish + portion + chosen add-ons. */
const lineKey = (dishId, variantId, addonIds) =>
  [dishId, variantId, [...addonIds].sort().join('+')].join('__');

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { dishId, variantId, addonIds = [], quantity = 1 } = action.payload;
      const key = lineKey(dishId, variantId, addonIds);
      const existing = state.lines.find((l) => l.key === key);
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((l) =>
            l.key === key ? { ...l, quantity: Math.min(l.quantity + quantity, 99) } : l
          ),
        };
      }
      return {
        ...state,
        lines: [...state.lines, { key, dishId, variantId, addonIds, quantity }],
      };
    }

    case 'setQuantity': {
      const quantity = Math.max(0, Math.min(action.payload.quantity, 99));
      if (quantity === 0) {
        return { ...state, lines: state.lines.filter((l) => l.key !== action.payload.key) };
      }
      return {
        ...state,
        lines: state.lines.map((l) => (l.key === action.payload.key ? { ...l, quantity } : l)),
      };
    }

    case 'remove':
      return { ...state, lines: state.lines.filter((l) => l.key !== action.payload.key) };

    case 'setFulfilment':
      return { ...state, fulfilment: action.payload };

    case 'clear':
      return { ...state, lines: [] };

    case 'hydrate':
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

const initialState = { lines: [], fulfilment: 'delivery' };

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
    return {
      lines: Array.isArray(parsed.lines) ? parsed.lines : [],
      fulfilment: parsed.fulfilment === 'takeaway' ? 'takeaway' : 'delivery',
    };
  } catch {
    return initialState;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, readStored);
  const [isOpen, setIsOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  /** Lines resolved against the menu, with prices computed. */
  const items = useMemo(
    () =>
      state.lines
        .map((line) => {
          const dish = getDishById(line.dishId);
          if (!dish) return null; // dish was removed from the menu
          const variant = getVariant(dish, line.variantId);
          const addons = line.addonIds
            .map((id) => dish.addons.find((a) => a.id === id))
            .filter(Boolean);
          const addonTotal = addons.reduce((s, a) => s + a.price, 0);
          const unitPrice = variant.price + addonTotal;
          return {
            ...line,
            dish,
            variant,
            addons,
            unitPrice,
            lineTotal: unitPrice * line.quantity,
          };
        })
        .filter(Boolean),
    [state.lines]
  );

  const totals = useMemo(() => {
    const { taxRate, deliveryFee, freeDeliveryAbove, packagingFee } = restaurant.charges;
    const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
    const itemCount = items.reduce((s, i) => s + i.quantity, 0);
    const isDelivery = state.fulfilment === 'delivery';

    const taxes = Math.round(subtotal * taxRate * 100) / 100;
    const packaging = subtotal > 0 ? packagingFee : 0;
    const deliveryQualifiesFree = subtotal >= freeDeliveryAbove;
    const delivery = !isDelivery || subtotal === 0 ? 0 : deliveryQualifiesFree ? 0 : deliveryFee;

    return {
      subtotal,
      itemCount,
      taxes,
      taxRate,
      packaging,
      delivery,
      deliveryQualifiesFree: isDelivery && deliveryQualifiesFree && subtotal > 0,
      amountToFreeDelivery: Math.max(0, freeDeliveryAbove - subtotal),
      total: Math.round((subtotal + taxes + packaging + delivery) * 100) / 100,
      isDelivery,
    };
  }, [items, state.fulfilment]);

  const addItem = useCallback((payload) => dispatch({ type: 'add', payload }), []);
  const setQuantity = useCallback(
    (key, quantity) => dispatch({ type: 'setQuantity', payload: { key, quantity } }),
    []
  );
  const removeItem = useCallback((key) => dispatch({ type: 'remove', payload: { key } }), []);
  const clearCart = useCallback(() => dispatch({ type: 'clear' }), []);
  const setFulfilment = useCallback((mode) => dispatch({ type: 'setFulfilment', payload: mode }), []);

  /** Quantity of a dish across all portions/add-on combinations. */
  const quantityOfDish = useCallback(
    (dishId) => items.filter((i) => i.dishId === dishId).reduce((s, i) => s + i.quantity, 0),
    [items]
  );

  const placeOrder = useCallback(
    (details) => {
      const order = {
        ...details,
        items: items.map((i) => ({
          name: i.dish.name,
          portion: i.dish.hasPortions ? i.variant.label : null,
          addons: i.addons.map((a) => a.name),
          quantity: i.quantity,
          lineTotal: i.lineTotal,
        })),
        totals,
        fulfilment: state.fulfilment,
        placedAt: new Date().toISOString(),
      };
      setLastOrder(order);
      clearCart();
      return order;
    },
    [items, totals, state.fulfilment, clearCart]
  );

  const value = useMemo(
    () => ({
      items,
      totals,
      fulfilment: state.fulfilment,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      setFulfilment,
      quantityOfDish,
      placeOrder,
      lastOrder,
    }),
    [
      items,
      totals,
      state.fulfilment,
      isOpen,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      setFulfilment,
      quantityOfDish,
      placeOrder,
      lastOrder,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
