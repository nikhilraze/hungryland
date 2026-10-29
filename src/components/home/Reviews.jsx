import SectionHeading from '../ui/SectionHeading';
import Stars from '../ui/Stars';
import { reviews, averageRating } from '../../data/reviews';
import { restaurant } from '../../data/restaurant';
import Button from '../ui/Button';
import Icon from '../ui/Icon';

export default function Reviews() {
  return (
    <section
      className="border-y border-char-200/70 bg-white py-20 lg:py-24 dark:border-white/8 dark:bg-char-900/40"
      aria-labelledby="reviews"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow="From our guests"
          title="What Haldia says about us"
          description={`Rated ${averageRating} out of 5 across ${reviews.length} reviews.`}
          align="between"
          as="h2"
        >
          <Button href={restaurant.mapsUrl} target="_blank" rel="noreferrer noopener" variant="outline">
            <Icon name="pin" size={16} />
            Review us on Maps
          </Button>
        </SectionHeading>

        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <li
              key={r.id}
              className="surface flex flex-col gap-4 rounded-4xl p-6 shadow-sm transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-lift animate-fade-up"
              style={{ animationDelay: `${i * 55}ms` }}
            >
              <Stars rating={r.rating} size={15} />

              <blockquote className="flex-1 text-pretty text-[0.9375rem] leading-relaxed text-char-600 dark:text-char-300">
                “{r.text}”
              </blockquote>

              <figcaption className="flex items-center gap-3 border-t border-char-200/70 pt-4 dark:border-white/8">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ember-100 font-display text-sm font-bold text-ember-800 dark:bg-ember-500/15 dark:text-ember-300"
                  aria-hidden="true"
                >
                  {r.initials}
                </span>
                <span>
                  <span className="block text-sm font-bold text-char-900 dark:text-char-50">
                    {r.name}
                  </span>
                  <span className="block text-xs text-char-400">{r.context}</span>
                </span>
              </figcaption>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
