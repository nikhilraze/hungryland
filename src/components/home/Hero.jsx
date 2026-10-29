import Button from '../ui/Button';
import Icon from '../ui/Icon';
import Stars from '../ui/Stars';
import SmartImage from '../ui/SmartImage';
import { restaurant, formatAddress } from '../../data/restaurant';
import { DISHES } from '../../data/menu';
import { averageRating, reviews } from '../../data/reviews';

const stats = [
  { value: `${DISHES.length}+`, label: 'Dishes on the menu' },
  { value: '₹40', label: 'Veg thali, all lunch' },
  { value: 'Unlimited', label: 'Rice with biryani' },
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* ------------------------------------------------ background photo -- */}
      <div className="absolute inset-0 -z-10">
        <SmartImage imageKey="heroSpread" alt="" eager wrapperClassName="h-full w-full" className="scale-105" />
        <div
          className="absolute inset-0 bg-linear-to-b from-char-950/82 via-char-950/72 to-char-950/95"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-radial-[at_20%_25%] from-ember-600/28 via-transparent to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="container-page flex min-h-[38rem] flex-col justify-center py-20 sm:min-h-[44rem] lg:min-h-[46rem] lg:py-28">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-bold tracking-[0.16em] text-ember-200 uppercase ring-1 ring-white/20 backdrop-blur">
              <Icon name="pin" size={13} />
              {formatAddress()}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/90 ring-1 ring-white/20 backdrop-blur">
              <Stars rating={averageRating} size={12} />
              {averageRating} · {reviews.length} reviews
            </span>
          </div>

          <h1
            className="mt-6 text-balance font-display text-[2.75rem] leading-[0.98] font-semibold text-white animate-fade-up sm:text-6xl lg:text-7xl"
            style={{ animationDelay: '80ms' }}
          >
            The Hungry Land
          </h1>

          <p
            className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-white/80 animate-fade-up sm:text-xl"
            style={{ animationDelay: '160ms' }}
          >
            {restaurant.tagline} — cooked to order in Sahid Kshudiram Nagar, and served the way
            Haldia likes it: hot, generous and honestly priced.
          </p>

          <div
            className="mt-9 flex flex-wrap items-center gap-3 animate-fade-up"
            style={{ animationDelay: '240ms' }}
          >
            <Button to="/menu" size="lg" className="min-w-40">
              View Menu
              <Icon name="arrowRight" size={18} />
            </Button>
            <Button to="/menu?highlight=popular" variant="glass" size="lg" className="min-w-40">
              <Icon name="bag" size={17} />
              Order Now
            </Button>
          </div>

          <dl
            className="mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/15 pt-7 animate-fade-up"
            style={{ animationDelay: '320ms' }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block font-display text-2xl font-semibold text-ember-300 sm:text-3xl">
                    {s.value}
                  </span>
                  <span className="mt-1 block text-xs leading-snug text-white/60 sm:text-sm">
                    {s.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* --------------------------------------------- delivery partner bar -- */}
      <div className="relative border-t border-white/10 bg-char-950/50 backdrop-blur-sm">
        <div className="container-page flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-4 text-center text-xs text-white/65 sm:text-sm">
          <span className="inline-flex items-center gap-2">
            <Icon name="scooter" size={16} className="text-ember-400" />
            Home delivery available on{' '}
            <strong className="text-white">
              {restaurant.deliveryPartners.map((p) => p.label).join(' & ')}
            </strong>
          </span>
          <span className="inline-flex items-center gap-2">
            <Icon name="sparkle" size={15} className="text-ember-400" />
            {restaurant.dailySpecialsNote}
          </span>
        </div>
      </div>
    </section>
  );
}
