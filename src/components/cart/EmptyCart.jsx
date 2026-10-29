import Button from '../ui/Button';
import Icon from '../ui/Icon';

export default function EmptyCart({ onBrowse }) {
  return (
    <div className="flex max-w-xs flex-col items-center gap-4 text-center animate-fade-up">
      <span
        className="flex h-20 w-20 items-center justify-center rounded-full bg-ember-100 text-ember-600 dark:bg-ember-500/12 dark:text-ember-400"
        aria-hidden="true"
      >
        <Icon name="bag" size={34} strokeWidth={1.4} />
      </span>
      <div>
        <h3 className="text-lg font-semibold text-char-900 dark:text-char-50">Your cart is empty</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-char-500 dark:text-char-400">
          Start with the biryani — unlimited rice when you dine in — or a ₹40 veg thali.
        </p>
      </div>
      {onBrowse ? (
        <Button onClick={onBrowse} size="lg">
          Browse the menu
          <Icon name="arrowRight" size={16} />
        </Button>
      ) : (
        <Button to="/menu" size="lg">
          Browse the menu
          <Icon name="arrowRight" size={16} />
        </Button>
      )}
    </div>
  );
}
