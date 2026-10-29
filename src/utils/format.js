import { restaurant } from '../data/restaurant';

const { currency } = restaurant.charges;

export const formatPrice = (amount) =>
  `${currency}${Number(amount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export const formatPriceExact = (amount) =>
  `${currency}${Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const formatPhone = (p) => p.replace(/(\d{5})(\d{5})/, '$1 $2');

export const telHref = (p) => `tel:+91${p.replace(/\D/g, '')}`;

/** Simple `cn` helper — filters falsey values and joins. */
export const cn = (...parts) => parts.filter(Boolean).join(' ');

export const orderNumber = () =>
  `HL${Date.now().toString(36).toUpperCase().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;
