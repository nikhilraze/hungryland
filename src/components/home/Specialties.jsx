import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';
import SmartImage from '../ui/SmartImage';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import { CATEGORIES_WITH_COUNTS } from '../../data/menu';

/** The kitchen's specialities, as browsable category tiles. */
export default function Specialties() {
  const highlighted = CATEGORIES_WITH_COUNTS.filter((c) =>
    ['tandoor', 'biryani', 'chicken', 'thali', 'chowmein', 'veg', 'rolls', 'breads'].includes(c.id)
  );

  return (
    <section className="container-page py-20 lg:py-24" aria-labelledby="specialties">
      <SectionHeading
        eyebrow="What we do best"
        title="Four kitchens, one counter"
        description="A live tandoor, a biryani handi, a Chinese wok and a full curry line — all running at once. Pick a section and start building your order."
        align="between"
        as="h2"
      >
        <Button to="/menu" variant="outline">
          See the full menu
          <Icon name="arrowRight" size={16} />
        </Button>
      </SectionHeading>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {highlighted.map((c, i) => (
          <li key={c.id}>
            <Link
              to={`/menu?category=${c.id}`}
              className="group surface relative flex h-64 flex-col justify-end overflow-hidden rounded-4xl p-6 shadow-sm transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1.5 hover:shadow-plate animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <SmartImage
                imageKey={c.image}
                alt=""
                wrapperClassName="absolute inset-0 h-full w-full"
                className="transition-transform duration-[1.1s] ease-[var(--ease-out-soft)] group-hover:scale-110"
              />
              <div
                className="absolute inset-0 bg-linear-to-t from-char-950/90 via-char-950/45 to-char-950/10"
                aria-hidden="true"
              />

              <div className="relative flex flex-col gap-1.5">
                <span className="text-[11px] font-bold tracking-[0.16em] text-ember-300 uppercase">
                  {c.count} {c.count === 1 ? 'dish' : 'dishes'}
                </span>
                <h3 className="text-xl leading-tight font-semibold text-white">{c.name}</h3>
                <p className="text-sm leading-snug text-white/70">{c.blurb}</p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-transform duration-300 group-hover:translate-x-1">
                  Browse
                  <Icon name="arrowRight" size={15} />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
