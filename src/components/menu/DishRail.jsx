import { useRef } from 'react';
import DishCard from './DishCard';
import Icon from '../ui/Icon';

/** Horizontally scrollable row of dish cards, with snap points and arrows. */
export default function DishRail({ dishes, onOpen, label }) {
  const railRef = useRef(null);

  const scrollBy = (dir) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: dir * Math.min(rail.clientWidth * 0.8, 640), behavior: 'smooth' });
  };

  if (!dishes.length) return null;

  return (
    <div className="relative">
      <div className="absolute -top-14 right-0 hidden gap-2 sm:flex">
        {[
          { dir: -1, icon: 'arrowLeft', label: 'Scroll left' },
          { dir: 1, icon: 'arrowRight', label: 'Scroll right' },
        ].map((b) => (
          <button
            key={b.dir}
            type="button"
            onClick={() => scrollBy(b.dir)}
            aria-label={`${b.label} through ${label}`}
            className="flex h-10 w-10 items-center justify-center rounded-full text-char-600 ring-1 ring-char-200 transition-all hover:-translate-y-0.5 hover:text-ember-600 hover:ring-ember-300 dark:text-char-300 dark:ring-white/12 dark:hover:text-ember-300"
          >
            <Icon name={b.icon} size={17} />
          </button>
        ))}
      </div>

      <ul
        ref={railRef}
        className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto no-scrollbar px-5 pt-2 pb-6 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10"
        aria-label={label}
      >
        {dishes.map((dish, i) => (
          <li
            key={dish.id}
            className="w-[17rem] shrink-0 snap-start sm:w-[19rem]"
          >
            <DishCard dish={dish} onOpen={onOpen} index={i} />
          </li>
        ))}
      </ul>
    </div>
  );
}
