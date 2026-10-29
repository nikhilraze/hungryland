import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MenuFilters from '../components/menu/MenuFilters';
import DishCard from '../components/menu/DishCard';
import DishCardSkeleton from '../components/menu/DishCardSkeleton';
import DishDetailModal from '../components/menu/DishDetailModal';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import { DISHES, CATEGORIES_WITH_COUNTS } from '../data/menu';
import { restaurant } from '../data/restaurant';
import { useSeo } from '../hooks/useSeo';

const DEFAULTS = { query: '', category: 'all', diet: 'all', highlight: 'all', sort: 'recommended' };

const HIGHLIGHT_MATCHERS = {
  popular: (d) => d.isPopular,
  featured: (d) => d.isFeatured,
  special: (d) => d.isSpecial,
};

function scoreForRecommended(dish) {
  return (dish.isSpecial ? 4 : 0) + (dish.isFeatured ? 2 : 0) + (dish.isPopular ? 1 : 0);
}

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  /**
   * The search box is driven by local state so typing always feels instant;
   * the URL catches up on a short debounce. Routing the keystrokes through
   * the URL directly drops characters when you type quickly.
   */
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');

  useSeo({
    title: 'Menu',
    description: `Browse all ${DISHES.length} dishes at The Hungry Land, Haldia — tandoor, biryani, thali, chicken and mutton curries, rice, chowmein, rolls and breads with live prices.`,
  });

  // Filters live in the URL, so any view can be shared or bookmarked.
  const filters = useMemo(
    () => ({
      query,
      category: searchParams.get('category') ?? DEFAULTS.category,
      diet: searchParams.get('diet') ?? DEFAULTS.diet,
      highlight: searchParams.get('highlight') ?? DEFAULTS.highlight,
      sort: searchParams.get('sort') ?? DEFAULTS.sort,
    }),
    [searchParams, query]
  );

  const writeParams = useCallback(
    (next) => {
      const params = new URLSearchParams();
      if (next.query) params.set('q', next.query);
      if (next.category !== 'all') params.set('category', next.category);
      if (next.diet !== 'all') params.set('diet', next.diet);
      if (next.highlight !== 'all') params.set('highlight', next.highlight);
      if (next.sort !== 'recommended') params.set('sort', next.sort);
      setSearchParams(params, { replace: true });
    },
    [setSearchParams]
  );

  /** Chips, selects and reset — these change one field at a time. */
  const setFilters = (next) => {
    setQuery(next.query);
    writeParams(next);
  };

  /**
   * The text box gets its own setter. Going through `setFilters` would spread a
   * `filters` object captured at render, so two keystrokes landing in the same
   * frame would lose the first one.
   */
  const onQueryChange = useCallback((value) => setQuery(value), []);

  // Keep ?q= in step with the box without blocking each keystroke.
  useEffect(() => {
    if ((searchParams.get('q') ?? '') === query) return;
    const t = setTimeout(() => writeParams({ ...filters, query }), 350);
    return () => clearTimeout(t);
  }, [query, filters, searchParams, writeParams]);

  // Reflect back/forward navigation into the box.
  useEffect(() => {
    const fromUrl = searchParams.get('q') ?? '';
    setQuery((current) => (current === fromUrl ? current : fromUrl));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('q')]);

  // Brief skeleton pass so the grid never pops in half-painted, and so this
  // swaps cleanly to a real fetch later.
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 320);
    return () => clearTimeout(t);
  }, [filters.category, filters.diet, filters.highlight]);

  const results = useMemo(() => {
    const q = filters.query.trim().toLowerCase();

    let list = DISHES.filter((d) => {
      if (filters.category !== 'all' && d.categoryId !== filters.category) return false;
      if (filters.diet !== 'all' && d.type !== filters.diet) return false;
      if (filters.highlight !== 'all' && !HIGHLIGHT_MATCHERS[filters.highlight]?.(d)) return false;
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.categoryName.toLowerCase().includes(q) ||
        d.ingredients.some((i) => i.toLowerCase().includes(q))
      );
    });

    const sorters = {
      'price-asc': (a, b) => a.basePrice - b.basePrice || a.name.localeCompare(b.name),
      'price-desc': (a, b) => b.basePrice - a.basePrice || a.name.localeCompare(b.name),
      'name-asc': (a, b) => a.name.localeCompare(b.name),
      recommended: (a, b) => scoreForRecommended(b) - scoreForRecommended(a),
    };
    list = [...list].sort(sorters[filters.sort] ?? sorters.recommended);
    return list;
  }, [filters]);

  /** Group into category sections only for the unfiltered, default view. */
  const grouped = useMemo(() => {
    const isDefaultView =
      filters.category === 'all' &&
      filters.diet === 'all' &&
      filters.highlight === 'all' &&
      filters.sort === 'recommended' &&
      !filters.query.trim();
    if (!isDefaultView) return null;

    return CATEGORIES_WITH_COUNTS.map((c) => ({
      ...c,
      dishes: results.filter((d) => d.categoryId === c.id),
    })).filter((g) => g.dishes.length > 0);
  }, [results, filters]);

  return (
    <>
      {/* ----------------------------------------------------------- head -- */}
      <section className="border-b border-char-200/70 bg-linear-to-b from-ember-50 to-char-50 dark:border-white/8 dark:from-char-900 dark:to-char-950">
        <div className="container-page py-14 lg:py-18">
          <p className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.22em] text-ember-600 uppercase dark:text-ember-400">
            <span className="h-px w-7 bg-ember-500/60" aria-hidden="true" />
            {DISHES.length} dishes · {CATEGORIES_WITH_COUNTS.length} sections
          </p>
          <h1 className="mt-4 text-balance font-display text-4xl leading-[1.05] font-semibold text-char-900 sm:text-5xl lg:text-6xl dark:text-char-50">
            The full menu
          </h1>
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-char-600 dark:text-char-300">
            Prices are exactly as printed on our menu card. Half and full portions are marked on every
            dish that offers both. {restaurant.dailySpecialsNote}
          </p>
        </div>
      </section>

      {/* -------------------------------------------------------- filters -- */}
      <div className="sticky top-18 z-50 border-b border-char-200/70 bg-char-50/92 backdrop-blur-xl dark:border-white/8 dark:bg-char-950/88">
        <div className="container-page py-5">
          <MenuFilters
            filters={filters}
            onChange={setFilters}
            onQueryChange={onQueryChange}
            resultCount={results.length}
            onReset={() => setFilters(DEFAULTS)}
          />
        </div>
      </div>

      {/* --------------------------------------------------------- dishes -- */}
      <section className="container-page py-12 lg:py-16" aria-label="Menu items" aria-busy={isLoading}>
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <DishCardSkeleton key={i} />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center gap-5 py-20 text-center animate-fade-up">
            <span
              className="flex h-20 w-20 items-center justify-center rounded-full bg-ember-100 text-ember-600 dark:bg-ember-500/12 dark:text-ember-400"
              aria-hidden="true"
            >
              <Icon name="search" size={32} strokeWidth={1.5} />
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold text-char-900 dark:text-char-50">
                No dishes match that
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-char-500 dark:text-char-400">
                Try a different spelling, or clear the filters to see all {DISHES.length} dishes.
              </p>
            </div>
            <Button onClick={() => setFilters(DEFAULTS)}>
              <Icon name="close" size={15} />
              Clear all filters
            </Button>
          </div>
        ) : grouped ? (
          <div className="flex flex-col gap-16">
            {grouped.map((group) => (
              <section key={group.id} id={group.id} aria-labelledby={`heading-${group.id}`}>
                <header className="mb-7 flex flex-wrap items-end justify-between gap-3 border-b border-char-200/80 pb-4 dark:border-white/8">
                  <div>
                    <h2
                      id={`heading-${group.id}`}
                      className="font-display text-2xl font-semibold text-char-900 sm:text-3xl dark:text-char-50"
                    >
                      {group.name}
                    </h2>
                    <p className="mt-1 text-sm text-char-500 dark:text-char-400">{group.blurb}</p>
                  </div>
                  <span className="text-sm font-semibold text-char-400">
                    {group.dishes.length} {group.dishes.length === 1 ? 'dish' : 'dishes'}
                  </span>
                </header>

                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.dishes.map((dish, i) => (
                    <li key={dish.id} className="animate-fade-up">
                      <DishCard dish={dish} onOpen={setSelected} index={i} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((dish, i) => (
              <li key={dish.id} className="animate-fade-up">
                <DishCard dish={dish} onOpen={setSelected} index={i} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <DishDetailModal dish={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
    </>
  );
}
