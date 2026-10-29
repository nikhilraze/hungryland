import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';
import { cn } from '../../utils/format';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible dialog: focus is moved in, trapped while open, and restored on
 * close. Escape and backdrop clicks both dismiss. Body scroll is locked.
 */
export default function Modal({
  open,
  onClose,
  labelledBy,
  children,
  className,
  panelClassName,
  position = 'center',
  closeLabel = 'Close',
}) {
  const panelRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const panel = panelRef.current;
    const first = panel?.querySelector(FOCUSABLE);
    (first ?? panel)?.focus({ preventScroll: true });

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;

      const nodes = [...panel.querySelectorAll(FOCUSABLE)].filter(
        (n) => n.offsetParent !== null || n === document.activeElement
      );
      if (!nodes.length) return;
      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];

      if (e.shiftKey && document.activeElement === firstNode) {
        e.preventDefault();
        lastNode.focus();
      } else if (!e.shiftKey && document.activeElement === lastNode) {
        e.preventDefault();
        firstNode.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      previouslyFocused.current?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  if (!open) return null;

  const positions = {
    center: 'items-end sm:items-center justify-center',
    right: 'items-stretch justify-end',
  };

  return createPortal(
    <div className={cn('fixed inset-0 z-80 flex', positions[position], className)}>
      <div
        className="absolute inset-0 bg-char-950/55 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={cn('relative z-10 outline-none', panelClassName)}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-char-800 shadow-lift backdrop-blur transition-transform hover:scale-105 dark:bg-char-800/90 dark:text-char-100"
        >
          <Icon name="close" size={17} strokeWidth={2} />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
