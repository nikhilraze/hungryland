import SmartImage from '../components/ui/SmartImage';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import { restaurant } from '../data/restaurant';
import { DISHES, CATEGORIES_WITH_COUNTS } from '../data/menu';
import { allCredits } from '../data/images';
import { useSeo } from '../hooks/useSeo';

export default function About() {
  useSeo({
    title: 'About us',
    description:
      'The story behind The Hungry Land in Haldia — our kitchen, our chefs, and why we cook everything to order with fresh ingredients.',
  });

  const credits = allCredits();

  return (
    <>
      {/* ------------------------------------------------------------ hero -- */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <SmartImage imageKey="restaurantInterior" alt="" eager wrapperClassName="h-full w-full" />
          <div
            className="absolute inset-0 bg-linear-to-b from-char-950/85 via-char-950/75 to-char-950/95"
            aria-hidden="true"
          />
        </div>

        <div className="container-page py-24 lg:py-32">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.22em] text-ember-300 uppercase">
              <span className="h-px w-7 bg-ember-400/60" aria-hidden="true" />
              About us
            </p>
            <h1 className="mt-5 text-balance font-display text-4xl leading-[1.04] font-semibold text-white sm:text-5xl lg:text-6xl">
              A kitchen that never really closes
            </h1>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-white/75">
              {restaurant.qualityStatement}
            </p>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- story -- */}
      <section className="container-page py-20 lg:py-24" aria-labelledby="story">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Our story" title="How The Hungry Land started" as="h2" />
            <div className="mt-6 flex flex-col gap-5 text-lg leading-relaxed text-char-600 dark:text-char-300">
              {restaurant.story.map((p, i) => (
                <p key={i} className="text-pretty">
                  {p}
                </p>
              ))}
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-char-200/80 pt-8 sm:grid-cols-3 dark:border-white/10">
              {[
                { value: `${DISHES.length}`, label: 'Dishes on the card' },
                { value: `${CATEGORIES_WITH_COUNTS.length}`, label: 'Sections of the menu' },
                { value: '3', label: 'Phone lines, always open' },
              ].map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block font-display text-3xl font-semibold text-ember-600 dark:text-ember-400">
                      {s.value}
                    </span>
                    <span className="mt-1 block text-sm leading-snug text-char-500 dark:text-char-400">
                      {s.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <SmartImage
            imageKey="tandoorFire"
            alt="The tandoor, fired through the day"
            wrapperClassName="aspect-4/5 w-full rounded-5xl shadow-plate"
          />
        </div>
      </section>

      {/* ------------------------------------------------------------ chef -- */}
      <section
        className="border-y border-char-200/70 bg-white py-20 lg:py-24 dark:border-white/8 dark:bg-char-900/40"
        aria-labelledby="chef"
      >
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <SmartImage
            imageKey={restaurant.chef.imageKey}
            alt={`${restaurant.chef.name} at work`}
            wrapperClassName="aspect-4/3 w-full rounded-5xl shadow-plate"
          />
          <div>
            <SectionHeading eyebrow="The kitchen" title="Who cooks your food" as="h2" />
            <p className="mt-5 font-display text-xl font-semibold text-char-900 dark:text-char-50">
              {restaurant.chef.name}
            </p>
            <p className="text-sm font-semibold tracking-wide text-ember-600 uppercase dark:text-ember-400">
              {restaurant.chef.role}
            </p>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-char-600 dark:text-char-300">
              {restaurant.chef.bio}
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ philosophy -- */}
      <section className="container-page py-20 lg:py-24" aria-labelledby="philosophy">
        <SectionHeading
          eyebrow="What we believe"
          title="Four rules we don't break"
          description="They are unglamorous, and they are the whole reason people come back."
          align="center"
          as="h2"
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {restaurant.philosophy.map((p, i) => (
            <li
              key={p.title}
              className="surface flex flex-col gap-4 rounded-4xl p-7 shadow-sm transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1.5 hover:shadow-plate animate-fade-up"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ember-100 font-display text-lg font-bold text-ember-700 dark:bg-ember-500/15 dark:text-ember-300"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-lg leading-snug font-semibold text-char-900 dark:text-char-50">
                {p.title}
              </h3>
              <p className="text-sm leading-relaxed text-char-500 dark:text-char-300">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------- fresh + quality -- */}
      <section className="container-page pb-20 lg:pb-24" aria-labelledby="quality">
        <div className="surface overflow-hidden rounded-5xl shadow-plate">
          <div className="grid lg:grid-cols-2">
            <SmartImage
              imageKey="spices"
              alt="Whole spices, ground in-house"
              wrapperClassName="min-h-64 lg:min-h-full"
            />
            <div className="flex flex-col justify-center gap-5 p-8 sm:p-12 lg:p-14">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf/12 text-leaf">
                <Icon name="leaf" size={22} />
              </span>
              <h2
                id="quality"
                className="text-balance font-display text-3xl leading-tight font-semibold text-char-900 dark:text-char-50"
              >
                Fresh ingredients, no shortcuts
              </h2>
              <p className="text-pretty leading-relaxed text-char-600 dark:text-char-300">
                Vegetables and paneer arrive every morning. Chicken is cut the same day it is served.
                Our masalas are roasted and ground in our own kitchen rather than bought as ready-made
                paste — which is why the kasha tastes like kasha and the korma tastes like korma.
              </p>
              <p className="border-l-2 border-ember-500 pl-5 text-pretty font-display text-lg leading-relaxed text-char-800 italic dark:text-char-100">
                “{restaurant.qualityStatement}”
              </p>
              <Button to="/menu" size="lg" className="self-start">
                See what&apos;s cooking
                <Icon name="arrowRight" size={17} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- photo credits -- */}
      <section
        id="credits"
        className="border-t border-char-200/70 py-16 dark:border-white/8"
        aria-labelledby="credits-heading"
      >
        <div className="container-page">
          <h2
            id="credits-heading"
            className="font-display text-lg font-semibold text-char-900 dark:text-char-50"
          >
            Photography credits
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-char-500 dark:text-char-400">
            Dish photography on this site is Creative-Commons licensed placeholder imagery, credited
            below. Replace it with your own photos by editing{' '}
            <code className="rounded bg-char-100 px-1.5 py-0.5 font-semibold dark:bg-white/10">
              src/data/imagePool.json
            </code>
            .
          </p>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-char-400">
            {credits.map((c) => (
              <li key={c.creator}>
                <a
                  href={c.creatorUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-semibold text-char-500 underline hover:text-ember-600 dark:text-char-300"
                >
                  {c.creator}
                </a>{' '}
                <a
                  href={c.licenseUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline hover:text-ember-600"
                >
                  {c.license}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
