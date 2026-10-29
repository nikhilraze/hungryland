import { useState } from 'react';
import Hero from '../components/home/Hero';
import TodaysSpecial from '../components/home/TodaysSpecial';
import Specialties from '../components/home/Specialties';
import AboutPreview from '../components/home/AboutPreview';
import Reviews from '../components/home/Reviews';
import VisitUs from '../components/home/VisitUs';
import DishRail from '../components/menu/DishRail';
import DishDetailModal from '../components/menu/DishDetailModal';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import { POPULAR_DISHES, FEATURED_DISHES } from '../data/menu';
import { useSeo } from '../hooks/useSeo';

export default function Home() {
  const [selected, setSelected] = useState(null);

  useSeo({
    title: 'Tandoor, Biryani & Thali in Haldia',
    description:
      'The Hungry Land, Sahid Kshudiram Nagar, Haldia. Tandoori grills, unlimited-rice chicken biryani, ₹40 veg thalis, rolls, momos and chowmein. Order online, takeaway or delivery.',
  });

  return (
    <>
      <Hero />

      {/* ------------------------------------------------- popular dishes -- */}
      <section className="container-page pt-20 lg:pt-24" aria-labelledby="popular">
        <SectionHeading
          eyebrow="Ordered most"
          title="Popular right now"
          description="The dishes Haldia keeps coming back for — tap any card for ingredients and portions."
          align="between"
          as="h2"
        >
          <Button to="/menu?highlight=popular" variant="outline">
            All popular dishes
            <Icon name="arrowRight" size={16} />
          </Button>
        </SectionHeading>
        <div className="mt-12">
          <DishRail
            dishes={POPULAR_DISHES.slice(0, 12)}
            onOpen={setSelected}
            label="Popular dishes"
          />
        </div>
      </section>

      <TodaysSpecial onOpen={setSelected} />

      <Specialties />

      {/* ------------------------------------------------ featured dishes -- */}
      <section
        className="border-y border-char-200/70 bg-white py-20 lg:py-24 dark:border-white/8 dark:bg-char-900/40"
        aria-labelledby="featured"
      >
        <div className="container-page">
          <SectionHeading
            eyebrow="Chef picks"
            title="Featured from the kitchen"
            description="If it is your first visit, order one of these."
            align="between"
            as="h2"
          >
            <Button to="/menu?highlight=featured" variant="outline">
              All featured dishes
              <Icon name="arrowRight" size={16} />
            </Button>
          </SectionHeading>
          <div className="mt-12">
            <DishRail
              dishes={FEATURED_DISHES.slice(0, 12)}
              onOpen={setSelected}
              label="Featured dishes"
            />
          </div>
        </div>
      </section>

      <AboutPreview />
      <Reviews />
      <VisitUs />

      <DishDetailModal dish={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
    </>
  );
}
