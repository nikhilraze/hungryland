import { useEffect, useMemo, useState } from 'react';
import Modal from '../ui/Modal';
import SmartImage from '../ui/SmartImage';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import QuantityStepper from '../ui/QuantityStepper';
import { DietPill, SpiceMeter, Tag } from '../ui/Badge';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { imageCredit } from '../../data/images';
import { formatPrice, cn } from '../../utils/format';

export default function DishDetailModal({ dish, open, onClose }) {
  const { addItem, openCart } = useCart();
  const { toast } = useToast();

  const [variantId, setVariantId] = useState(null);
  const [addonIds, setAddonIds] = useState([]);
  const [quantity, setQuantity] = useState(1);

  // Reset the form each time a different dish is opened
  useEffect(() => {
    if (!dish) return;
    setVariantId(dish.variants[0].id);
    setAddonIds([]);
    setQuantity(1);
  }, [dish]);

  const variant = useMemo(
    () => dish?.variants.find((v) => v.id === variantId) ?? dish?.variants[0],
    [dish, variantId]
  );

  const addonTotal = useMemo(
    () => addonIds.reduce((s, id) => s + (dish?.addons.find((a) => a.id === id)?.price ?? 0), 0),
    [addonIds, dish]
  );

  if (!dish || !variant) return null;

  const unitPrice = variant.price + addonTotal;
  const total = unitPrice * quantity;
  const credit = imageCredit(dish.image);

  const toggleAddon = (id) =>
    setAddonIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const handleAdd = () => {
    addItem({ dishId: dish.id, variantId: variant.id, addonIds, quantity });
    toast({
      title: `${quantity} × ${dish.name}`,
      description: `Added · ${formatPrice(total)}`,
      image: dish.image,
    });
    onClose();
    openCart();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy="dish-detail-title"
      closeLabel="Close dish details"
      panelClassName="w-full max-w-4xl max-h-[92dvh] sm:max-h-[88dvh] overflow-hidden rounded-t-4xl sm:rounded-4xl bg-white shadow-plate dark:bg-char-900 animate-fade-up"
    >
      <div className="grid max-h-[92dvh] overflow-y-auto scroll-slim sm:max-h-[88dvh] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        {/* ---------------------------------------------------------- image -- */}
        <div className="relative lg:h-full">
          <SmartImage
            imageKey={dish.image}
            alt={dish.name}
            fallbackLabel={dish.name}
            eager
            wrapperClassName="h-56 w-full sm:h-72 lg:h-full lg:min-h-[32rem]"
          />
          <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
            {dish.isSpecial && (
              <Tag tone="ember" icon="sparkle">
                Today&apos;s Special
              </Tag>
            )}
            {dish.isPopular && <Tag tone="dark">Popular</Tag>}
          </div>

          {credit && (
            <p className="absolute bottom-0 inset-x-0 bg-linear-to-t from-char-950/75 to-transparent px-4 pt-8 pb-2 text-[10px] leading-tight text-white/65">
              Photo:{' '}
              <a href={credit.creatorUrl} target="_blank" rel="noreferrer noopener" className="underline">
                {credit.creator}
              </a>{' '}
              ·{' '}
              <a href={credit.licenseUrl} target="_blank" rel="noreferrer noopener" className="underline">
                {credit.license}
              </a>
            </p>
          )}
        </div>

        {/* --------------------------------------------------------- details -- */}
        <div className="flex flex-col gap-5 p-6 sm:p-8">
          <header className="flex flex-col gap-3">
            <p className="text-[11px] font-bold tracking-[0.2em] text-ember-600 uppercase dark:text-ember-400">
              {dish.categoryName}
            </p>
            <h2
              id="dish-detail-title"
              className="text-balance text-2xl leading-tight font-semibold text-char-900 sm:text-3xl dark:text-char-50"
            >
              {dish.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <DietPill type={dish.type} />
              <SpiceMeter level={dish.spice} />
            </div>
            <p className="text-pretty leading-relaxed text-char-600 dark:text-char-300">
              {dish.description}
            </p>
          </header>

          {dish.ingredients.length > 0 && (
            <section>
              <h3 className="mb-2.5 text-xs font-bold tracking-[0.16em] text-char-400 uppercase">
                Ingredients
              </h3>
              <ul className="flex flex-wrap gap-1.5">
                {dish.ingredients.map((ing) => (
                  <li
                    key={ing}
                    className="rounded-full bg-char-100 px-3 py-1.5 text-xs font-medium text-char-700 dark:bg-white/8 dark:text-char-200"
                  >
                    {ing}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {dish.note && (
            <p className="flex items-start gap-2 rounded-2xl bg-ember-50 p-3.5 text-sm leading-relaxed text-ember-900 dark:bg-ember-500/12 dark:text-ember-100">
              <Icon name="info" size={16} className="mt-0.5 shrink-0" />
              {dish.note}
            </p>
          )}

          {/* -------------------------------------------------------- portion -- */}
          {dish.hasPortions && (
            <fieldset>
              <legend className="mb-2.5 text-xs font-bold tracking-[0.16em] text-char-400 uppercase">
                Choose portion
              </legend>
              <div className="flex flex-wrap gap-2">
                {dish.variants.map((v) => (
                  <label
                    key={v.id}
                    className={cn(
                      'cursor-pointer rounded-2xl border px-4 py-2.5 text-sm transition-all duration-200 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ember-500',
                      v.id === variant.id
                        ? 'border-ember-500 bg-ember-50 text-ember-900 dark:bg-ember-500/15 dark:text-ember-100'
                        : 'border-char-200 text-char-600 hover:border-char-300 dark:border-white/15 dark:text-char-300'
                    )}
                  >
                    <input
                      type="radio"
                      name="portion"
                      value={v.id}
                      checked={v.id === variant.id}
                      onChange={() => setVariantId(v.id)}
                      className="sr-only"
                    />
                    <span className="font-semibold">{v.label}</span>
                    <span className="ml-2 text-char-500 dark:text-char-400">
                      {formatPrice(v.price)}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {/* --------------------------------------------------------- addons -- */}
          {dish.addons.length > 0 && (
            <fieldset>
              <legend className="mb-2.5 text-xs font-bold tracking-[0.16em] text-char-400 uppercase">
                Make it a meal <span className="font-medium normal-case tracking-normal">(optional)</span>
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {dish.addons.map((a) => {
                  const checked = addonIds.includes(a.id);
                  return (
                    <label
                      key={a.id}
                      className={cn(
                        'flex cursor-pointer items-center gap-2.5 rounded-2xl border px-3.5 py-2.5 text-sm transition-all duration-200 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ember-500',
                        checked
                          ? 'border-ember-500 bg-ember-50 dark:bg-ember-500/15'
                          : 'border-char-200 hover:border-char-300 dark:border-white/15'
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAddon(a.id)}
                        className="sr-only"
                      />
                      <span
                        className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors',
                          checked
                            ? 'border-ember-500 bg-ember-500 text-white'
                            : 'border-char-300 dark:border-white/25'
                        )}
                        aria-hidden="true"
                      >
                        {checked && <Icon name="check" size={12} strokeWidth={3} />}
                      </span>
                      <span className="flex-1 font-medium text-char-700 dark:text-char-200">
                        {a.name}
                      </span>
                      <span className="text-char-500 dark:text-char-400">+{formatPrice(a.price)}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* ----------------------------------------------------- add to cart -- */}
          <div className="mt-auto flex flex-col gap-4 border-t border-char-200/80 pt-5 dark:border-white/10">
            <div className="flex items-center justify-between gap-4">
              <QuantityStepper value={quantity} onChange={setQuantity} size="md" />
              <div className="text-right">
                <p className="text-[11px] font-semibold tracking-wider text-char-400 uppercase">
                  Total
                </p>
                <p className="font-display text-2xl font-semibold text-char-900 dark:text-char-50">
                  {formatPrice(total)}
                </p>
              </div>
            </div>

            <Button size="lg" onClick={handleAdd} className="w-full">
              <Icon name="cart" size={18} />
              Add {quantity > 1 ? `${quantity} ` : ''}to cart · {formatPrice(total)}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
