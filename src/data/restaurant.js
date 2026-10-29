/**
 * SINGLE SOURCE OF TRUTH for everything about the restaurant itself.
 * Edit this file to update contact details, hours, story, socials, fees.
 *
 * Fields marked `// TODO(owner)` were NOT printed on the menu cards and are
 * sensible placeholders — please confirm them before going live.
 */

export const restaurant = {
  name: 'The Hungry Land',
  shortName: 'Hungry Land',
  tagline: 'Tandoori grills, unlimited biryani & hearty thalis',
  // Straight off the printed menu card:
  dailySpecialsNote: 'Ask your server for our daily specials!',

  address: {
    line1: 'Sahid Kshudiram Nagar',
    line2: 'Haldia, Purba Medinipur',
    region: 'West Bengal',
    country: 'India',
  },

  // From the Google Maps listing for The Hungry Land, Haldia
  geo: { lat: 22.0493475, lng: 88.0677735 },
  mapsUrl:
    'https://www.google.com/maps/place/The+Hungry+Land/@22.0493475,88.0651986,17z/data=!3m1!4b1!4m6!3m5!1s0x3a02f1cdf9f39e2f:0x7b8f20eda0eb9eb7!8m2!3d22.0493475!4d88.0677735',

  phones: ['8972686679', '8116292286', '7384324637'],

  email: 'hello@thehungryland.in', // TODO(owner): confirm or replace

  // TODO(owner): opening hours were not on the menu card — confirm these.
  hours: [
    { days: 'Monday – Thursday', open: '11:00 AM', close: '10:30 PM' },
    { days: 'Friday – Sunday', open: '11:00 AM', close: '11:00 PM' },
  ],
  lunchWindow: '12:00 PM – 4:00 PM', // TODO(owner): thali/lunch service window

  socials: [
    { id: 'instagram', label: 'Instagram', handle: '@thehungryland', url: 'https://www.instagram.com/thehungryland/' },
    { id: 'facebook', label: 'Facebook', handle: '@TheHungryLand', url: 'https://www.facebook.com/TheHungryLand' },
  ],

  deliveryPartners: [
    { id: 'swiggy', label: 'Swiggy' },
    { id: 'zomato', label: 'Zomato' },
  ],

  /** Order maths. Edit freely. */
  charges: {
    currency: '₹',
    taxRate: 0.05, // 5% GST on food
    deliveryFee: 30,
    freeDeliveryAbove: 399,
    packagingFee: 10,
  },

  /** About page copy. TODO(owner): replace with your own words. */
  story: [
    'The Hungry Land began as a small kitchen in Sahid Kshudiram Nagar with one stubborn belief — that a plate of honest, well-spiced food should never be a luxury.',
    'Today the same kitchen runs a live tandoor, a biryani handi that never seems to empty, and a lunch counter where students, steel-plant crews and families from across Haldia sit shoulder to shoulder.',
    'Nothing here is precious. It is just cooked properly, served hot, and priced so you can come back tomorrow.',
  ],

  philosophy: [
    {
      title: 'Cooked to order',
      body: 'The tandoor is fired fresh through the day. Kebabs, rotis and tikkas go from skewer to table, never from a warming tray.',
    },
    {
      title: 'Fresh ingredients',
      body: 'Vegetables and paneer come in daily, chicken is cut the same morning, and our masalas are ground in-house rather than bought as paste.',
    },
    {
      title: 'Portions that feed you',
      body: 'Half and full plates on almost everything, and unlimited rice with our biryani when you dine in. You should leave full, not calculating.',
    },
    {
      title: 'Priced for every day',
      body: 'A veg thali at ₹40 and a chicken thali at ₹90 are not loss-leaders — they are the point of the place.',
    },
  ],

  chef: {
    name: 'The Hungry Land Kitchen', // TODO(owner): add your head chef's name
    role: 'Tandoor & Curry Kitchen',
    bio: 'Our kitchen is run by cooks who learned the trade on the highway dhabas of Purba Medinipur — where a gravy is judged by how fast the roti disappears. They handle the tandoor, the handi and the wok in one open kitchen, all day, every day.',
    imageKey: 'chefCooking',
  },

  qualityStatement:
    'Every plate leaves our kitchen the way we would serve it at our own table: hot, generously portioned, and made from ingredients we bought that morning.',
};

export const formatAddress = (a = restaurant.address) =>
  [a.line1, a.line2, a.region].filter(Boolean).join(', ');

export const mapsEmbedUrl = () => {
  const { lat, lng } = restaurant.geo;
  const d = 0.008;
  const bbox = `${lng - d}%2C${lat - d / 2}%2C${lng + d}%2C${lat + d / 2}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
};
