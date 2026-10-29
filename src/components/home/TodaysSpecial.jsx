import SmartImage from '../ui/SmartImage';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import { DietPill, SpiceMeter, Tag } from '../ui/Badge';
import { TODAYS_SPECIALS } from '../../data/menu';
import { restaurant } from '../../data/restaurant';
import { formatPrice } from '../../utils/format';

export default function TodaysSpecial({ onOpen }) {
  const [hero, ...rest] = TODAYS_SPECIALS;
  if (!hero) return null;

  return (
    <section className="container-page py-20 lg:py-24" aria-labelledby="todays-special">
      <div className="surface overflow-hidden rounded-5xl shadow-plate">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-72 lg:min-h-[30rem]">
            <SmartImage
              imageKey={hero.image}
              alt={hero.name}
              fallbackLabel={hero.name}
              wrapperClassName="absolute inset-0 h-full w-full"
              className="transition-transform duration-[1.2s] ease-[var(--ease-out-soft)] hover:scale-105"
            />
            <div className="absolute top-5 left-5">
              <Tag tone="ember" icon="sparkle" className="!text-[11px] !px-3.5 !py-1.5">
                Today&apos;s Special
              </Tag>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-5 p-8 sm:p-12 lg:p-14">
            <span className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.22em] text-ember-600 uppercase dark:text-ember-400">
              <span className="h-px w-7 bg-ember-500/60" aria-hidden="true" />
              {hero.categoryName}
            </span>

            <h2
              id="todays-special"
              className="text-balance text-3xl leading-[1.08] font-semibold text-char-900 sm:text-4xl dark:text-char-50"
            >
              {hero.name}
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              <DietPill type={hero.type} />
              <SpiceMeter level={hero.spice} />
            </div>

            <p className="text-pretty leading-relaxed text-char-600 dark:text-char-300">
              {hero.description}
            </p>

            {hero.note && (
              <p className="flex items-start gap-2 rounded-2xl bg-ember-50 p-3.5 text-sm font-semibold text-ember-900 dark:bg-ember-500/12 dark:text-ember-100">
                <Icon name="info" size={16} className="mt-0.5 shrink-0" />
                {hero.note}
              </p>
            )}

            <div className="flex flex-wrap items-end justify-between gap-5 pt-2">
              <div>
                <p className="text-[11px] font-semibold tracking-wider text-char-400 uppercase">
                  Price
                </p>
                <p className="font-display text-4xl font-semibold text-char-900 dark:text-char-50">
                  {formatPrice(hero.basePrice)}
                </p>
              </div>
              <Button size="lg" onClick={() => onOpen(hero)}>
                <Icon name="cart" size={17} />
                Order this
              </Button>
            </div>

            {rest.length > 0 && (
              <div className="mt-2 border-t border-char-200/80 pt-5 dark:border-white/10">
                <p className="mb-3 text-xs font-bold tracking-[0.16em] text-char-400 uppercase">
                  Also today
                </p>
                <ul className="flex flex-col gap-2">
                  {rest.map((d) => (
                    <li key={d.id}>
                      <button
                        type="button"
                        onClick={() => onOpen(d)}
                        className="group flex w-full items-center justify-between gap-4 rounded-2xl px-1 py-2 text-left transition-colors hover:bg-char-100/70 dark:hover:bg-white/6"
                      >
                        <span className="text-sm font-semibold text-char-700 group-hover:text-ember-700 dark:text-char-200 dark:group-hover:text-ember-300">
                          {d.name}
                        </span>
                        <span className="shrink-0 text-sm font-bold text-char-900 tabular-nums dark:text-char-50">
                          {formatPrice(d.basePrice)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xs text-char-400">{restaurant.dailySpecialsNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
