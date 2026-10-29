import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import { DISHES } from '../data/menu';
import { useSeo } from '../hooks/useSeo';

export default function NotFound() {
  useSeo({ title: 'Page not found' });

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <p className="font-display text-7xl font-semibold text-ember-500">404</p>
      <div>
        <h1 className="font-display text-2xl font-semibold text-char-900 sm:text-3xl dark:text-char-50">
          This page is off the menu
        </h1>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-char-500 dark:text-char-400">
          The link you followed does not exist — but there are {DISHES.length} dishes that do.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button to="/menu" size="lg">
          Browse the menu
          <Icon name="arrowRight" size={17} />
        </Button>
        <Button to="/" variant="outline" size="lg">
          Back to home
        </Button>
      </div>
    </div>
  );
}
