/**
 * Customer reviews.
 *
 * TODO(owner): these are placeholders written to match the style of feedback
 * left on the Google Maps listing — swap them for real, attributed reviews
 * (or wire this array up to the Google Places API) before going live.
 */
export const reviews = [
  {
    id: 'r1',
    name: 'Arindam S.',
    initials: 'AS',
    rating: 5,
    context: 'Dined in · Lunch',
    text: 'The chicken thali at ₹90 is unbeatable in Haldia. Three pieces of chicken, dal, two sabji — and they refill the rice without being asked.',
  },
  {
    id: 'r2',
    name: 'Payel M.',
    initials: 'PM',
    rating: 5,
    context: 'Dined in · Dinner',
    text: 'Came for the biryani after seeing it on their Instagram. Unlimited rice is not a gimmick — they genuinely keep serving. The raita and egg make it a full meal.',
  },
  {
    id: 'r3',
    name: 'Sourav D.',
    initials: 'SD',
    rating: 4,
    context: 'Takeaway',
    text: 'Reshmi butter masala with two butter naans is my standard order. Rich, not too spicy, and always hot by the time I reach home.',
  },
  {
    id: 'r4',
    name: 'Ritika B.',
    initials: 'RB',
    rating: 5,
    context: 'Dined in',
    text: 'Tandoori tea is the reason I keep coming back. They pour it over a burning clay cup right in front of you — smoky and completely different.',
  },
  {
    id: 'r5',
    name: 'Imran H.',
    initials: 'IH',
    rating: 5,
    context: 'Delivery via Swiggy',
    text: 'Chicken kasha is properly Bengali — dark, dry masala and mustard oil. Not the watered-down version you get everywhere else.',
  },
  {
    id: 'r6',
    name: 'Debolina R.',
    initials: 'DR',
    rating: 4,
    context: 'Dined in · Lunch',
    text: 'Veg thali for ₹40 is honestly the best value around here. Add a tandoori roti and you are done for the afternoon.',
  },
];

export const averageRating =
  Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;
