import { useMemo, useState } from 'react';
import Field from '../components/ui/Field';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import SectionHeading from '../components/ui/SectionHeading';
import { useToast } from '../context/ToastContext';
import { restaurant, formatAddress, mapsEmbedUrl } from '../data/restaurant';
import { formatPhone, telHref, cn } from '../utils/format';
import { useSeo } from '../hooks/useSeo';

const EMPTY = { name: '', email: '', phone: '', subject: 'general', message: '' };

const SUBJECTS = [
  { id: 'general', label: 'General enquiry' },
  { id: 'catering', label: 'Bulk order / catering' },
  { id: 'feedback', label: 'Feedback about a visit' },
  { id: 'order', label: 'Question about an order' },
];

function validate(v) {
  const errors = {};
  if (!v.name.trim()) errors.name = 'Please tell us your name.';
  if (!v.email.trim()) errors.email = 'We need an email to reply to.';
  else if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.email.trim()))
    errors.email = 'That email address does not look right.';
  if (v.phone.trim() && !/^(\+91)?[6-9]\d{9}$/.test(v.phone.replace(/[\s-]/g, '')))
    errors.phone = 'Enter a valid 10-digit Indian mobile number.';
  if (!v.message.trim()) errors.message = 'Let us know what this is about.';
  else if (v.message.trim().length < 10) errors.message = 'A little more detail would help.';
  return errors;
}

export default function Contact() {
  const { toast } = useToast();
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  useSeo({
    title: 'Contact & directions',
    description: `Find The Hungry Land at ${formatAddress()}. Call ${restaurant.phones.join(', ')}, see opening hours, or send us a message.`,
  });

  const errors = useMemo(() => validate(values), [values]);
  const showError = (f) => (touched[f] || submitted ? errors[f] : undefined);
  const update = (f) => (e) => setValues((v) => ({ ...v, [f]: e.target.value }));
  const blur = (f) => () => setTouched((t) => ({ ...t, [f]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (Object.keys(errors).length > 0) {
      toast({ title: 'Please check the form', variant: 'error' });
      const bad = document.querySelector('[aria-invalid="true"]');
      bad?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      bad?.focus({ preventScroll: true });
      return;
    }

    setIsSending(true);
    // Stand-in for a real form endpoint — wire this to your inbox or CRM.
    await new Promise((r) => setTimeout(r, 800));
    setIsSending(false);
    setSent(true);
    setValues(EMPTY);
    setTouched({});
    setSubmitted(false);
    toast({ title: 'Message sent', description: 'We usually reply within a day.' });
  };

  const contactCards = [
    {
      icon: 'pin',
      title: 'Address',
      body: (
        <address className="text-sm leading-relaxed not-italic">
          <strong className="block font-display text-base font-bold text-char-900 dark:text-char-50">
            {restaurant.name}
          </strong>
          {formatAddress()}
        </address>
      ),
      action: {
        label: 'Get directions',
        href: restaurant.mapsUrl,
        external: true,
      },
    },
    {
      icon: 'phone',
      title: 'Phone',
      body: (
        <ul className="flex flex-col gap-1.5 text-sm">
          {restaurant.phones.map((p) => (
            <li key={p}>
              <a
                href={telHref(p)}
                className="font-semibold text-char-700 transition-colors hover:text-ember-600 dark:text-char-200 dark:hover:text-ember-300"
              >
                {formatPhone(p)}
              </a>
            </li>
          ))}
        </ul>
      ),
    },
    {
      icon: 'mail',
      title: 'Email',
      body: (
        <a
          href={`mailto:${restaurant.email}`}
          className="text-sm font-semibold break-all text-char-700 transition-colors hover:text-ember-600 dark:text-char-200 dark:hover:text-ember-300"
        >
          {restaurant.email}
        </a>
      ),
    },
    {
      icon: 'clock',
      title: 'Opening hours',
      body: (
        <dl className="flex flex-col gap-2 text-sm">
          {restaurant.hours.map((h) => (
            <div key={h.days}>
              <dt className="text-char-500 dark:text-char-400">{h.days}</dt>
              <dd className="font-semibold text-char-800 tabular-nums dark:text-char-100">
                {h.open} – {h.close}
              </dd>
            </div>
          ))}
          <div className="border-t border-dashed border-char-200 pt-2 dark:border-white/12">
            <dt className="text-char-500 dark:text-char-400">Lunch thali</dt>
            <dd className="font-semibold text-ember-700 dark:text-ember-300">
              {restaurant.lunchWindow}
            </dd>
          </div>
        </dl>
      ),
    },
  ];

  return (
    <>
      {/* ------------------------------------------------------------ head -- */}
      <section className="border-b border-char-200/70 bg-linear-to-b from-ember-50 to-char-50 dark:border-white/8 dark:from-char-900 dark:to-char-950">
        <div className="container-page py-14 lg:py-18">
          <p className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.22em] text-ember-600 uppercase dark:text-ember-400">
            <span className="h-px w-7 bg-ember-500/60" aria-hidden="true" />
            Get in touch
          </p>
          <h1 className="mt-4 text-balance font-display text-4xl leading-[1.05] font-semibold text-char-900 sm:text-5xl lg:text-6xl dark:text-char-50">
            Come and eat with us
          </h1>
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-char-600 dark:text-char-300">
            We are on the main stretch in Sahid Kshudiram Nagar, Haldia. Call ahead for takeaway, drop
            in for the lunch thali, or message us about a bulk order.
          </p>
        </div>
      </section>

      {/* --------------------------------------------------- contact cards -- */}
      <section className="container-page py-14" aria-label="Contact details">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {contactCards.map((c, i) => (
            <li
              key={c.title}
              className="surface flex flex-col gap-4 rounded-4xl p-6 shadow-sm animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ember-100 text-ember-700 dark:bg-ember-500/15 dark:text-ember-300">
                <Icon name={c.icon} size={19} />
              </span>
              <h2 className="font-display text-sm font-bold tracking-wider text-char-400 uppercase">
                {c.title}
              </h2>
              <div className="text-char-600 dark:text-char-300">{c.body}</div>
              {c.action && (
                <a
                  href={c.action.href}
                  target={c.action.external ? '_blank' : undefined}
                  rel={c.action.external ? 'noreferrer noopener' : undefined}
                  className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-ember-600 hover:text-ember-700 dark:text-ember-400"
                >
                  {c.action.label}
                  <Icon name="arrowRight" size={15} />
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------ form + map -- */}
      <section className="container-page pb-20 lg:pb-24" aria-labelledby="contact-form-heading">
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          {/* ------------------------------------------------------- form -- */}
          <div className="surface rounded-4xl p-7 shadow-sm sm:p-9">
            <SectionHeading
              eyebrow="Message us"
              title="Send us a note"
              description="Bulk orders, feedback, or anything else — we read every message."
              as="h2"
              className="mb-8"
            />
            <h2 id="contact-form-heading" className="sr-only">
              Contact form
            </h2>

            {sent && (
              <p className="mb-6 flex items-start gap-2.5 rounded-2xl bg-leaf/10 p-4 text-sm leading-relaxed text-leaf">
                <Icon name="check" size={17} strokeWidth={2.4} className="mt-px shrink-0" />
                <span>
                  <strong>Thanks — message received.</strong> We usually reply within a day. For
                  anything urgent, please call {formatPhone(restaurant.phones[0])}.
                </span>
              </p>
            )}

            <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
              <Field
                id="contact-name"
                label="Your name"
                required
                autoComplete="name"
                value={values.name}
                onChange={update('name')}
                onBlur={blur('name')}
                error={showError('name')}
              />
              <Field
                id="contact-phone"
                label="Phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={values.phone}
                onChange={update('phone')}
                onBlur={blur('phone')}
                error={showError('phone')}
              />
              <Field
                id="contact-email"
                label="Email"
                type="email"
                required
                autoComplete="email"
                className="sm:col-span-2"
                value={values.email}
                onChange={update('email')}
                onBlur={blur('email')}
                error={showError('email')}
              />

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label
                  htmlFor="contact-subject"
                  className="text-sm font-semibold text-char-700 dark:text-char-200"
                >
                  What is this about?
                </label>
                <div className="relative">
                  <select
                    id="contact-subject"
                    value={values.subject}
                    onChange={update('subject')}
                    className="h-12 w-full cursor-pointer appearance-none rounded-2xl border border-char-200 bg-white px-4 pr-11 text-sm font-medium text-char-800 focus:border-ember-400 dark:border-white/12 dark:bg-white/6 dark:text-char-100"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <Icon
                    name="chevronDown"
                    size={16}
                    className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-char-400"
                  />
                </div>
              </div>

              <Field
                id="contact-message"
                label="Message"
                as="textarea"
                required
                rows={5}
                className="sm:col-span-2"
                placeholder="Tell us what you need…"
                value={values.message}
                onChange={update('message')}
                onBlur={blur('message')}
                error={showError('message')}
              />

              <Button
                type="submit"
                size="lg"
                disabled={isSending}
                className={cn('sm:col-span-2', isSending && 'pointer-events-none')}
              >
                {isSending ? (
                  <>
                    <span
                      className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                      aria-hidden="true"
                    />
                    Sending…
                  </>
                ) : (
                  <>
                    <Icon name="mail" size={17} />
                    Send message
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* -------------------------------------------------------- map -- */}
          <div className="flex flex-col gap-5">
            <div className="surface overflow-hidden rounded-4xl shadow-sm">
              <iframe
                title={`Map showing ${restaurant.name} in Haldia`}
                src={mapsEmbedUrl()}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-80 w-full border-0 sm:h-96"
              />
              <div className="flex flex-wrap items-center justify-between gap-4 p-6">
                <div className="flex gap-2.5">
                  <Icon name="pin" size={17} className="mt-0.5 shrink-0 text-ember-600" />
                  <p className="text-sm leading-relaxed text-char-600 dark:text-char-300">
                    <strong className="block font-display text-base font-bold text-char-900 dark:text-char-50">
                      {restaurant.name}
                    </strong>
                    {formatAddress()}
                  </p>
                </div>
                <Button
                  href={restaurant.mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  variant="outline"
                  size="sm"
                >
                  Open in Google Maps
                  <Icon name="arrowRight" size={15} />
                </Button>
              </div>
            </div>

            {/* ----------------------------------------------------- social -- */}
            <div className="surface rounded-4xl p-7 shadow-sm">
              <h2 className="font-display text-lg font-semibold text-char-900 dark:text-char-50">
                Follow the kitchen
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-char-500 dark:text-char-400">
                Daily specials, new dishes and the occasional tandoor close-up.
              </p>

              <ul className="mt-5 flex flex-col gap-2.5">
                {restaurant.socials.map((s) => (
                  <li key={s.id}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex items-center gap-3.5 rounded-2xl border border-char-200 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-ember-300 dark:border-white/12 dark:hover:border-ember-500/40"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-char-100 text-char-700 transition-colors group-hover:bg-ember-100 group-hover:text-ember-700 dark:bg-white/8 dark:text-char-200">
                        <Icon name={s.id} size={18} />
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-bold text-char-900 dark:text-char-50">
                          {s.label}
                        </span>
                        <span className="block text-xs text-char-400">{s.handle}</span>
                      </span>
                      <Icon
                        name="arrowRight"
                        size={16}
                        className="text-char-300 transition-transform group-hover:translate-x-1"
                      />
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-char-200/70 pt-5 dark:border-white/10">
                <span className="text-[11px] font-semibold tracking-wider text-char-400 uppercase">
                  Order delivery on
                </span>
                {restaurant.deliveryPartners.map((p) => (
                  <span
                    key={p.id}
                    className="rounded-full bg-char-100 px-3 py-1 text-xs font-bold text-char-600 dark:bg-white/8 dark:text-char-300"
                  >
                    {p.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
