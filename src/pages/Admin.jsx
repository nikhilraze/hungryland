import { useMemo, useState } from 'react';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import { useAvailability } from '../context/AvailabilityContext';
import { CATEGORIES, DISHES } from '../data/menu';
import { formatPrice } from '../utils/format';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD?.trim();
const SESSION_KEY = 'hl.admin.session.v1';

function hasSession() {
  return sessionStorage.getItem(SESSION_KEY) === 'authenticated';
}

export default function Admin() {
  const { getDishState, setAvailability } = useAvailability();
  const [authenticated, setAuthenticated] = useState(hasSession);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const groupedDishes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return CATEGORIES.map((category) => ({
      ...category,
      dishes: DISHES.filter(
        (dish) =>
          dish.categoryId === category.id &&
          (!normalizedQuery || dish.name.toLowerCase().includes(normalizedQuery))
      ),
    })).filter((category) => category.dishes.length > 0);
  }, [query]);

  const login = (event) => {
    event.preventDefault();
    if (!ADMIN_PASSWORD) {
      setError('Admin access is not configured. Set VITE_ADMIN_PASSWORD and rebuild the app.');
      return;
    }
    if (password !== ADMIN_PASSWORD) {
      setError('Incorrect password.');
      return;
    }
    sessionStorage.setItem(SESSION_KEY, 'authenticated');
    setAuthenticated(true);
    setPassword('');
    setError('');
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthenticated(false);
  };

  if (!authenticated) {
    return (
      <div className="container-page flex min-h-[70dvh] items-center justify-center py-12">
        <form onSubmit={login} className="surface w-full max-w-md rounded-4xl p-7 shadow-sm sm:p-9">
          <p className="text-[11px] font-bold tracking-[0.22em] text-ember-600 uppercase dark:text-ember-400">
            Owner access
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-char-900 dark:text-char-50">
            Menu control
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-char-500 dark:text-char-400">
            Sign in to change which meals can be ordered.
          </p>
          <label className="mt-6 block text-sm font-semibold text-char-700 dark:text-char-200" htmlFor="admin-password">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 h-12 w-full rounded-2xl border border-char-200 bg-white px-4 text-sm dark:border-white/12 dark:bg-white/6 dark:text-char-100"
            autoComplete="current-password"
            required
          />
          {error && <p className="mt-2 text-sm font-semibold text-chilli">{error}</p>}
          <Button type="submit" size="lg" className="mt-6 w-full">
            Sign in
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="container-page py-12 lg:py-16">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-[11px] font-bold tracking-[0.22em] text-ember-600 uppercase dark:text-ember-400">
            Owner dashboard
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-char-900 sm:text-4xl dark:text-char-50">
            Menu availability
          </h1>
          <p className="mt-2 text-char-500 dark:text-char-400">
            Turn ordering on or off for any meal. Changes apply on this browser immediately.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          <Icon name="arrowLeft" size={15} />
          Sign out
        </Button>
      </header>

      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search meals..."
        className="mt-8 h-12 w-full rounded-2xl border border-char-200 bg-white px-4 text-sm dark:border-white/12 dark:bg-white/6 dark:text-char-100"
        aria-label="Search meals"
      />

      <div className="mt-8 flex flex-col gap-8">
        {groupedDishes.map((category) => (
          <section key={category.id} aria-labelledby={`admin-${category.id}`}>
            <h2 id={`admin-${category.id}`} className="font-display text-xl font-semibold text-char-900 dark:text-char-50">
              {category.name}
            </h2>
            <ul className="surface mt-3 divide-y divide-char-200/70 rounded-3xl px-5 dark:divide-white/8">
              {category.dishes.map((dish) => {
                const currentDish = getDishState(dish);
                return (
                  <li key={dish.id} className="flex items-center justify-between gap-4 py-4">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-char-800 dark:text-char-100">{dish.name}</p>
                      <p className="mt-1 text-xs text-char-400">
                        From {formatPrice(dish.basePrice)} · {currentDish.available ? 'Available' : 'Out of stock'}
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={currentDish.available}
                      onClick={() => setAvailability(dish.id, !currentDish.available)}
                      className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${
                        currentDish.available ? 'bg-leaf' : 'bg-char-300 dark:bg-char-700'
                      }`}
                      aria-label={`${currentDish.available ? 'Disable' : 'Enable'} ${dish.name}`}
                    >
                      <span
                        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                          currentDish.available ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
