import Icon from '../ui/Icon';
import { DietMark } from '../ui/Badge';
import { CATEGORIES_WITH_COUNTS } from '../../data/menu';
import { cn } from '../../utils/format';

const DIET_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'veg', label: 'Veg' },
  { id: 'egg', label: 'Egg' },
  { id: 'nonveg', label: 'Non-Veg' },
];

const HIGHLIGHT_OPTIONS = [
  { id: 'all', label: 'Everything' },
  { id: 'popular', label: 'Popular' },
  { id: 'featured', label: 'Featured' },
  { id: 'special', label: "Today's Special" },
];

const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'name-asc', label: 'Name: A – Z' },
];

const chip = (active) =>
  cn(
    'shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-300 ease-[var(--ease-out-soft)]',
    active
      ? 'bg-char-900 text-white shadow-lift dark:bg-ember-400 dark:text-char-900'
      : 'bg-white text-char-600 ring-1 ring-char-200 hover:ring-ember-400 hover:text-ember-700 dark:bg-white/6 dark:text-char-300 dark:ring-white/12 dark:hover:text-ember-300'
  );

export default function MenuFilters({ filters, onChange, onQueryChange, resultCount, onReset }) {
  const set = (patch) => onChange({ ...filters, ...patch });
  const isFiltered =
    filters.query ||
    filters.category !== 'all' ||
    filters.diet !== 'all' ||
    filters.highlight !== 'all' ||
    filters.sort !== 'recommended';

  return (
    <div className="flex flex-col gap-4">
      {/* --------------------------------------------------- search + sort -- */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <label htmlFor="menu-search" className="sr-only">
            Search the menu
          </label>
          <Icon
            name="search"
            size={18}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-char-400"
          />
          <input
            id="menu-search"
            type="search"
            value={filters.query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search dishes, ingredients — try “paneer” or “tandoori”"
            className="h-12 w-full rounded-full border border-char-200 bg-white pr-4 pl-11 text-sm text-char-800 shadow-sm transition-colors placeholder:text-char-400 focus:border-ember-400 dark:border-white/12 dark:bg-white/6 dark:text-char-100 dark:placeholder:text-char-500"
          />
        </div>

        <div className="relative shrink-0">
          <label htmlFor="menu-sort" className="sr-only">
            Sort dishes
          </label>
          <Icon
            name="sortDown"
            size={17}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-char-400"
          />
          <select
            id="menu-sort"
            value={filters.sort}
            onChange={(e) => set({ sort: e.target.value })}
            className="h-12 w-full cursor-pointer appearance-none rounded-full border border-char-200 bg-white pr-11 pl-11 text-sm font-semibold text-char-700 shadow-sm focus:border-ember-400 sm:w-60 dark:border-white/12 dark:bg-white/6 dark:text-char-200"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
          <Icon
            name="chevronDown"
            size={16}
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-char-400"
          />
        </div>
      </div>

      {/* --------------------------------------------- diet + highlight row -- */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="sr-only">Filter by dietary type</legend>
          <span className="text-[11px] font-bold tracking-[0.14em] text-char-400 uppercase">
            Diet
          </span>
          {DIET_OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => set({ diet: o.id })}
              aria-pressed={filters.diet === o.id}
              className={cn(chip(filters.diet === o.id), 'inline-flex items-center gap-1.5 !py-1.5')}
            >
              {o.id !== 'all' && <DietMark type={o.id} size={12} />}
              {o.label}
            </button>
          ))}
        </fieldset>

        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="sr-only">Filter by highlight</legend>
          <span className="text-[11px] font-bold tracking-[0.14em] text-char-400 uppercase">
            Show
          </span>
          {HIGHLIGHT_OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => set({ highlight: o.id })}
              aria-pressed={filters.highlight === o.id}
              className={cn(chip(filters.highlight === o.id), '!py-1.5')}
            >
              {o.label}
            </button>
          ))}
        </fieldset>
      </div>

      {/* -------------------------------------------------- category chips --
          Scrolls horizontally on small screens (with a fade to hint at it),
          and wraps onto two rows from `lg` up so every category is visible. */}
      <div
        className="-mx-5 overflow-x-auto no-scrollbar px-5 pb-1 sm:-mx-8 sm:px-8 lg:-mx-10 lg:overflow-visible lg:px-10 lg:[mask-image:none] [mask-image:linear-gradient(to_right,transparent_0,black_1.25rem,black_calc(100%-2.5rem),transparent_100%)]"
      >
        <fieldset className="flex w-max gap-2 lg:w-full lg:flex-wrap">
          <legend className="sr-only">Filter by category</legend>
          <button
            type="button"
            onClick={() => set({ category: 'all' })}
            aria-pressed={filters.category === 'all'}
            className={chip(filters.category === 'all')}
          >
            All dishes
          </button>
          {CATEGORIES_WITH_COUNTS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => set({ category: c.id })}
              aria-pressed={filters.category === c.id}
              className={chip(filters.category === c.id)}
            >
              {c.name}
              <span className="ml-1.5 opacity-55">{c.count}</span>
            </button>
          ))}
        </fieldset>
      </div>

      {/* ------------------------------------------------------ result line -- */}
      <div className="flex items-center justify-between gap-4 border-t border-char-200/70 pt-3 dark:border-white/8">
        <p className="text-sm text-char-500 dark:text-char-400" aria-live="polite">
          <span className="font-bold text-char-800 dark:text-char-100">{resultCount}</span>{' '}
          {resultCount === 1 ? 'dish' : 'dishes'}
        </p>
        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ember-600 transition-colors hover:text-ember-700 dark:text-ember-400"
          >
            <Icon name="close" size={14} strokeWidth={2.2} />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
