import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import Logo from './Logo';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { restaurant } from '../../data/restaurant';
import { telHref, formatPhone, cn } from '../../utils/format';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totals, openCart } = useCart();
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile sheet on navigation
  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navLinkClass = ({ isActive }) =>
    cn(
      'relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300',
      isActive
        ? 'text-ember-700 dark:text-ember-300'
        : 'text-char-600 hover:text-char-900 dark:text-char-300 dark:hover:text-white',
      isActive &&
        'after:absolute after:inset-x-4 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-ember-500'
    );

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:bg-char-900 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-70 transition-all duration-500 ease-[var(--ease-out-soft)]',
          scrolled
            ? 'border-b border-char-200/70 bg-char-50/85 backdrop-blur-xl dark:border-white/8 dark:bg-char-950/80'
            : 'border-b border-transparent bg-transparent'
        )}
      >
        <div className="container-page flex h-18 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5" aria-label={`${restaurant.name} — home`}>
            <Logo className="h-10 w-10" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-[0.9375rem] font-bold tracking-tight whitespace-nowrap text-char-900 sm:text-base dark:text-char-50">
                The Hungry Land
              </span>
              <span className="mt-0.5 text-[10px] font-semibold tracking-[0.16em] text-ember-600 uppercase dark:text-ember-400">
                Haldia
              </span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={navLinkClass} end={l.to === '/'}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={telHref(restaurant.phones[0])}
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-char-600 transition-colors hover:text-ember-700 xl:inline-flex dark:text-char-300 dark:hover:text-ember-300"
            >
              <Icon name="phone" size={16} />
              {formatPhone(restaurant.phones[0])}
            </a>

            <button
              type="button"
              onClick={toggle}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              className="flex h-10 w-10 items-center justify-center rounded-full text-char-600 ring-1 ring-char-200/80 transition-all hover:text-ember-600 hover:ring-ember-300 dark:text-char-300 dark:ring-white/12 dark:hover:text-ember-300"
            >
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} />
            </button>

            <button
              type="button"
              onClick={openCart}
              className="relative flex h-10 items-center gap-2 rounded-full bg-char-900 px-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-ember-500 dark:bg-char-50 dark:text-char-900 dark:hover:bg-ember-400"
              aria-label={`Open cart, ${totals.itemCount} ${totals.itemCount === 1 ? 'item' : 'items'}`}
            >
              <Icon name="cart" size={17} />
              <span className="hidden sm:inline">Cart</span>
              {totals.itemCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ember-500 px-1.5 text-[11px] font-bold text-white tabular-nums dark:bg-ember-600 dark:text-white">
                  {totals.itemCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              className="flex h-10 w-10 items-center justify-center rounded-full text-char-700 ring-1 ring-char-200/80 lg:hidden dark:text-char-200 dark:ring-white/12"
            >
              <Icon name={mobileOpen ? 'close' : 'menu'} size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------- mobile nav sheet -- */}
      {mobileOpen && (
        <div className="fixed inset-0 z-60 lg:hidden">
          <div
            className="absolute inset-0 bg-char-950/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <nav
            id="mobile-nav"
            aria-label="Mobile"
            className="relative mt-18 flex flex-col gap-1 border-b border-char-200/70 bg-char-50 p-5 shadow-plate animate-fade-up dark:border-white/8 dark:bg-char-950"
          >
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-semibold transition-colors',
                    isActive
                      ? 'bg-ember-50 text-ember-800 dark:bg-ember-500/15 dark:text-ember-200'
                      : 'text-char-700 hover:bg-char-100 dark:text-char-200 dark:hover:bg-white/8'
                  )
                }
              >
                {l.label}
                <Icon name="chevronRight" size={16} />
              </NavLink>
            ))}

            <div className="mt-3 grid gap-2">
              <Button to="/menu" size="lg">
                <Icon name="bag" size={17} />
                Order now
              </Button>
              <Button href={telHref(restaurant.phones[0])} variant="outline" size="lg">
                <Icon name="phone" size={16} />
                Call {formatPhone(restaurant.phones[0])}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
