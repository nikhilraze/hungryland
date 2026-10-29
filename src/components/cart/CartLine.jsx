import SmartImage from '../ui/SmartImage';
import Icon from '../ui/Icon';
import QuantityStepper from '../ui/QuantityStepper';
import { DietMark } from '../ui/Badge';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice, cn } from '../../utils/format';

export default function CartLine({ item, compact = false }) {
  const { setQuantity, removeItem } = useCart();
  const { toast } = useToast();

  const remove = () => {
    removeItem(item.key);
    toast({
      title: 'Removed from cart',
      description: item.dish.name,
      variant: 'error',
      duration: 2400,
    });
  };

  return (
    <li className={cn('flex gap-3.5', compact ? 'py-3.5' : 'py-5')}>
      <SmartImage
        imageKey={item.dish.image}
        alt={item.dish.name}
        fallbackLabel={item.dish.name}
        wrapperClassName={cn(
          'shrink-0 rounded-2xl',
          compact ? 'h-16 w-16' : 'h-20 w-20 sm:h-24 sm:w-24'
        )}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-bold text-char-900 sm:text-base dark:text-char-50">
              <DietMark type={item.dish.type} size={13} />
              <span className="truncate">{item.dish.name}</span>
            </p>
            <p className="mt-0.5 text-xs text-char-400">
              {item.dish.categoryName}
              {item.dish.hasPortions && ` · ${item.variant.label}`}
            </p>
          </div>

          <button
            type="button"
            onClick={remove}
            aria-label={`Remove ${item.dish.name} from cart`}
            className="shrink-0 rounded-full p-1.5 text-char-400 transition-colors hover:bg-chilli/10 hover:text-chilli"
          >
            <Icon name="trash" size={15} />
          </button>
        </div>

        {item.addons.length > 0 && (
          <ul className="flex flex-wrap gap-1">
            {item.addons.map((a) => (
              <li
                key={a.id}
                className="rounded-full bg-ember-50 px-2 py-0.5 text-[11px] font-medium text-ember-800 dark:bg-ember-500/12 dark:text-ember-200"
              >
                + {a.name}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-1.5 flex items-center justify-between gap-3">
          <QuantityStepper
            value={item.quantity}
            onChange={(q) => setQuantity(item.key, q)}
            min={1}
            size="sm"
            label={`Quantity of ${item.dish.name}`}
          />
          <div className="text-right">
            <p className="text-sm font-bold text-char-900 tabular-nums dark:text-char-50">
              {formatPrice(item.lineTotal)}
            </p>
            {item.quantity > 1 && (
              <p className="text-[11px] text-char-400 tabular-nums">
                {formatPrice(item.unitPrice)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
