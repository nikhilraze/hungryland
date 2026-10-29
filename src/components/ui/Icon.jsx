/**
 * Small inline icon set — no icon-font or extra dependency.
 * Every icon inherits `currentColor` and sizes from the `size` prop.
 */
const paths = {
  cart: (
    <>
      <circle cx="9" cy="20" r="1.6" />
      <circle cx="18" cy="20" r="1.6" />
      <path d="M2.5 3.5h2.2l2.3 11.2h11.3l2.2-8H6.2" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  close: <path d="M5 5l14 14M19 5L5 19" />,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  trash: (
    <>
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  check: <path d="m4 13 5 5L20 6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  arrowLeft: <path d="M20 12H4m6-6-6 6 6 6" />,
  arrowRight: <path d="M4 12h16m-6-6 6 6-6 6" />,
  star: <path d="m12 3.5 2.7 5.6 6.1.8-4.5 4.3 1.2 6-5.5-3-5.5 3 1.2-6L3.2 9.9l6.1-.8z" />,
  flame: <path d="M12 3c3.5 3.4 5.5 6 5.5 9a5.5 5.5 0 0 1-11 0c0-3 2-5.6 5.5-9z" />,
  pin: (
    <>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  phone: (
    <path d="M6 3h3l2 5-2.2 1.6a12 12 0 0 0 5.6 5.6L16 13l5 2v3a2 2 0 0 1-2.2 2A16.8 16.8 0 0 1 4 6.2A2 2 0 0 1 6 3z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3.5 2" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />,
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: (
    <path d="M14.5 8.5h2.2V5.4h-2.4c-2.4 0-4 1.6-4 4v2.1H8.2v3.1h2.1V21h3.2v-6.4h2.3l.4-3.1h-2.7V9.9c0-.9.4-1.4 1-1.4z" />
  ),
  leaf: (
    <>
      <path d="M20 4C10 4 4 9 4 16v4" />
      <path d="M20 4c0 8-5 12-11 12H4" />
    </>
  ),
  bag: (
    <>
      <path d="M5 8h14l-1 12H6L5 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  sparkle: (
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18.5 15l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9z" />
  ),
  scooter: (
    <>
      <circle cx="6" cy="17" r="3" />
      <circle cx="18" cy="17" r="3" />
      <path d="M9 17h6M18 14V7h-3M15 7 13 4h-3" />
    </>
  ),
  filter: <path d="M3 6h18M6 12h12M10 18h4" />,
  sortDown: <path d="M7 4v16m0 0-3.5-3.5M7 20l3.5-3.5M13 6h8M13 11h6M13 16h4" />,
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 8h.01" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3.5 21 19H3z" />
      <path d="M12 9v4.5M12 16.5h.01" />
    </>
  ),
};

export default function Icon({ name, size = 20, className = '', strokeWidth = 1.6, ...rest }) {
  const d = paths[name];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {d}
    </svg>
  );
}

/** Solid-filled variant, for stars / flames / logos. */
export function SolidIcon({ name, size = 16, className = '' }) {
  const d = paths[name];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      stroke="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {d}
    </svg>
  );
}
