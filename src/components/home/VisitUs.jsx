import SectionHeading from '../ui/SectionHeading';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import { restaurant, formatAddress, mapsEmbedUrl } from '../../data/restaurant';
import { formatPhone, telHref } from '../../utils/format';

/** Opening hours + location/contact block for the home page. */
export default function VisitUs() {
  const todayIndex = new Date().getDay(); // 0 = Sunday
  const isWeekend = todayIndex === 0 || todayIndex === 5 || todayIndex === 6;
  const todayHours = restaurant.hours[isWeekend ? 1 : 0];

  return (
    <section className="container-page py-20 lg:py-24" aria-labelledby="visit-us">
      <SectionHeading
        eyebrow="Visit us"
        title="Open through lunch and late into the evening"
        description="Walk in, call ahead for takeaway, or order home delivery across Haldia."
        as="h2"
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_1fr_1.25fr]">
        {/* ------------------------------------------------------- hours -- */}
        <div className="surface flex flex-col gap-5 rounded-4xl p-7 shadow-sm">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ember-100 text-ember-700 dark:bg-ember-500/15 dark:text-ember-300">
            <Icon name="clock" size={20} />
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold text-char-900 dark:text-char-50">
              Opening hours
            </h3>
            <p className="mt-1 text-sm text-char-500 dark:text-char-400">
              Today · {todayHours.open} – {todayHours.close}
            </p>
          </div>

          <dl className="flex flex-col gap-3 border-t border-char-200/70 pt-4 text-sm dark:border-white/8">
            {restaurant.hours.map((h) => (
              <div key={h.days} className="flex items-baseline justify-between gap-4">
                <dt className="text-char-500 dark:text-char-400">{h.days}</dt>
                <dd className="shrink-0 font-semibold text-char-800 tabular-nums dark:text-char-100">
                  {h.open} – {h.close}
                </dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-4 border-t border-dashed border-char-200 pt-3 dark:border-white/10">
              <dt className="text-char-500 dark:text-char-400">Lunch thali</dt>
              <dd className="shrink-0 font-semibold text-ember-700 dark:text-ember-300">
                {restaurant.lunchWindow}
              </dd>
            </div>
          </dl>
        </div>

        {/* ----------------------------------------------------- contact -- */}
        <div className="surface flex flex-col gap-5 rounded-4xl p-7 shadow-sm">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ember-100 text-ember-700 dark:bg-ember-500/15 dark:text-ember-300">
            <Icon name="phone" size={20} />
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold text-char-900 dark:text-char-50">
              Order by phone
            </h3>
            <p className="mt-1 text-sm text-char-500 dark:text-char-400">
              Three lines — one of them will pick up.
            </p>
          </div>

          <ul className="flex flex-col gap-2 border-t border-char-200/70 pt-4 dark:border-white/8">
            {restaurant.phones.map((p) => (
              <li key={p}>
                <a
                  href={telHref(p)}
                  className="group flex items-center justify-between gap-3 rounded-xl py-1.5 text-sm font-semibold text-char-700 transition-colors hover:text-ember-700 dark:text-char-200 dark:hover:text-ember-300"
                >
                  {formatPhone(p)}
                  <Icon
                    name="chevronRight"
                    size={15}
                    className="text-char-300 transition-transform group-hover:translate-x-0.5"
                  />
                </a>
              </li>
            ))}
          </ul>

          <a
            href={`mailto:${restaurant.email}`}
            className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-ember-600 hover:text-ember-700 dark:text-ember-400"
          >
            <Icon name="mail" size={15} />
            {restaurant.email}
          </a>
        </div>

        {/* -------------------------------------------------------- map -- */}
        <div className="surface flex flex-col overflow-hidden rounded-4xl shadow-sm">
          <iframe
            title={`Map showing ${restaurant.name} in Haldia`}
            src={mapsEmbedUrl()}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-56 w-full border-0 grayscale-25 lg:h-full lg:min-h-64"
          />
          <div className="flex flex-col gap-3 p-6">
            <div className="flex gap-2.5">
              <Icon name="pin" size={17} className="mt-0.5 shrink-0 text-ember-600" />
              <address className="text-sm leading-relaxed text-char-600 not-italic dark:text-char-300">
                <strong className="block font-display text-base font-bold text-char-900 dark:text-char-50">
                  {restaurant.name}
                </strong>
                {formatAddress()}
              </address>
            </div>
            <Button
              href={restaurant.mapsUrl}
              target="_blank"
              rel="noreferrer noopener"
              variant="outline"
              size="sm"
              className="self-start"
            >
              Get directions
              <Icon name="arrowRight" size={15} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
