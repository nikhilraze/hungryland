import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import Logo from './Logo';
import { restaurant, formatAddress } from '../../data/restaurant';
import { CATEGORIES_WITH_COUNTS } from '../../data/menu';
import { formatPhone, telHref } from '../../utils/format';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-char-200/80 bg-white dark:border-white/8 dark:bg-char-900/40">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
        {/* -------------------------------------------------------- brand -- */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2.5" aria-label={`${restaurant.name} — home`}>
            <Logo className="h-11 w-11" />
            <span className="font-display text-lg font-bold text-char-900 dark:text-char-50">
              The Hungry Land
            </span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-char-500 dark:text-char-400">
            {restaurant.tagline}. Dine in, take away, or order home delivery in Haldia.
          </p>

          <div className="flex gap-2">
            {restaurant.socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${restaurant.name} on ${s.label}`}
                className="flex h-10 w-10 items-center justify-center rounded-full text-char-500 ring-1 ring-char-200 transition-all hover:-translate-y-0.5 hover:text-ember-600 hover:ring-ember-300 dark:text-char-300 dark:ring-white/12 dark:hover:text-ember-300"
              >
                <Icon name={s.id} size={17} />
              </a>
            ))}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold tracking-wider text-char-400 uppercase">
              Also on
            </span>
            {restaurant.deliveryPartners.map((p) => (
              <span
                key={p.id}
                className="rounded-full bg-char-100 px-2.5 py-1 text-[11px] font-bold text-char-600 dark:bg-white/8 dark:text-char-300"
              >
                {p.label}
              </span>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------- explore -- */}
        <nav aria-labelledby="footer-explore" className="flex flex-col gap-3">
          <h2
            id="footer-explore"
            className="font-display text-sm font-bold tracking-wider text-char-900 uppercase dark:text-char-100"
          >
            Explore
          </h2>
          <ul className="flex flex-col gap-2.5 text-sm">
            {[
              { to: '/', label: 'Home' },
              { to: '/menu', label: 'Full menu' },
              { to: '/about', label: 'About us' },
              { to: '/contact', label: 'Contact' },
              { to: '/cart', label: 'Your cart' },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-char-500 transition-colors hover:text-ember-600 dark:text-char-400 dark:hover:text-ember-300"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ------------------------------------------------------ the menu -- */}
        <nav aria-labelledby="footer-menu" className="flex flex-col gap-3">
          <h2
            id="footer-menu"
            className="font-display text-sm font-bold tracking-wider text-char-900 uppercase dark:text-char-100"
          >
            The menu
          </h2>
          <ul className="flex flex-col gap-2.5 text-sm">
            {CATEGORIES_WITH_COUNTS.slice(0, 8).map((c) => (
              <li key={c.id}>
                <Link
                  to={`/menu?category=${c.id}`}
                  className="text-char-500 transition-colors hover:text-ember-600 dark:text-char-400 dark:hover:text-ember-300"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ------------------------------------------------------- contact -- */}
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-sm font-bold tracking-wider text-char-900 uppercase dark:text-char-100">
            Find us
          </h2>
          <address className="flex flex-col gap-3 text-sm not-italic">
            <a
              href={restaurant.mapsUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="flex gap-2.5 text-char-500 transition-colors hover:text-ember-600 dark:text-char-400 dark:hover:text-ember-300"
            >
              <Icon name="pin" size={16} className="mt-0.5 shrink-0" />
              <span>{formatAddress()}</span>
            </a>

            <div className="flex gap-2.5 text-char-500 dark:text-char-400">
              <Icon name="phone" size={16} className="mt-0.5 shrink-0" />
              <span className="flex flex-col gap-1">
                {restaurant.phones.map((p) => (
                  <a key={p} href={telHref(p)} className="transition-colors hover:text-ember-600 dark:hover:text-ember-300">
                    {formatPhone(p)}
                  </a>
                ))}
              </span>
            </div>

            <a
              href={`mailto:${restaurant.email}`}
              className="flex gap-2.5 text-char-500 transition-colors hover:text-ember-600 dark:text-char-400 dark:hover:text-ember-300"
            >
              <Icon name="mail" size={16} className="mt-0.5 shrink-0" />
              {restaurant.email}
            </a>

            <div className="flex gap-2.5 text-char-500 dark:text-char-400">
              <Icon name="clock" size={16} className="mt-0.5 shrink-0" />
              <span className="flex flex-col gap-1">
                {restaurant.hours.map((h) => (
                  <span key={h.days}>
                    {h.days}
                    <br />
                    <span className="font-semibold text-char-700 dark:text-char-200">
                      {h.open} – {h.close}
                    </span>
                  </span>
                ))}
              </span>
            </div>
          </address>
        </div>
      </div>

      <div className="border-t border-char-200/70 dark:border-white/8">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-char-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {restaurant.name}, Haldia. All rights reserved.
          </p>
          <p>
            Dish photography is Creative-Commons licensed placeholder imagery —{' '}
            <Link to="/about#credits" className="underline hover:text-ember-600">
              see credits
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
