import SmartImage from '../ui/SmartImage';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import SectionHeading from '../ui/SectionHeading';
import { restaurant } from '../../data/restaurant';

export default function AboutPreview() {
  return (
    <section className="container-page py-20 lg:py-24" aria-labelledby="about-preview">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* -------------------------------------------------- image collage -- */}
        <div className="relative">
          <SmartImage
            imageKey="tandoorFire"
            alt="The tandoor at The Hungry Land"
            wrapperClassName="aspect-4/5 w-full rounded-5xl shadow-plate sm:aspect-4/3 lg:aspect-4/5"
          />
          <SmartImage
            imageKey="spices"
            alt="Freshly ground masalas"
            wrapperClassName="absolute -bottom-8 -right-4 hidden h-44 w-44 rounded-4xl border-4 border-char-50 shadow-plate sm:block lg:-right-8 dark:border-char-950"
          />
          <div className="surface absolute -bottom-6 left-4 flex items-center gap-3 rounded-3xl px-5 py-4 shadow-plate sm:left-8">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ember-100 text-ember-700 dark:bg-ember-500/15 dark:text-ember-300">
              <Icon name="leaf" size={20} />
            </span>
            <div>
              <p className="font-display text-sm font-bold text-char-900 dark:text-char-50">
                Fresh in, daily
              </p>
              <p className="text-xs text-char-500 dark:text-char-400">
                Masalas ground in-house
              </p>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------------- copy -- */}
        <div>
          <SectionHeading eyebrow="Our story" title="Honest food, in Haldia since day one" as="h2" />

          <div className="mt-6 flex flex-col gap-4 leading-relaxed text-char-600 dark:text-char-300">
            <p className="text-pretty">{restaurant.story[0]}</p>
            <p className="text-pretty">{restaurant.story[1]}</p>
          </div>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {restaurant.philosophy.slice(0, 4).map((p) => (
              <li key={p.title} className="flex gap-3">
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf/12 text-leaf"
                  aria-hidden="true"
                >
                  <Icon name="check" size={13} strokeWidth={2.6} />
                </span>
                <div>
                  <p className="font-display text-sm font-bold text-char-900 dark:text-char-50">
                    {p.title}
                  </p>
                  <p className="mt-0.5 text-sm leading-snug text-char-500 dark:text-char-400">
                    {p.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <Button to="/about" variant="outline" size="lg" className="mt-9">
            Read our story
            <Icon name="arrowRight" size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
