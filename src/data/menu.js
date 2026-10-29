/**
 * ============================================================================
 *  THE HUNGRY LAND — MENU (SINGLE SOURCE OF TRUTH)
 * ============================================================================
 *  Every dish, price and category below was transcribed from the restaurant's
 *  own printed menu cards. To update the site, edit ONLY this file.
 *
 *  Authoring format (all fields optional except `name`):
 *    name         — dish name as printed
 *    type         — 'veg' | 'egg' | 'nonveg'
 *    spice        — 'mild' | 'medium' | 'hot'   (omit if not applicable)
 *    price        — single price, in ₹
 *    half / full  — two-portion pricing, in ₹
 *    halfLabel /
 *    fullLabel    — override the portion names (defaults per category)
 *    portions     — [{ label, price }] for 3+ sizes (e.g. Tandoori Chicken)
 *    image        — key from imagePool.json, OR a full https:// URL of your own
 *    description  — one short, appetising line
 *    ingredients  — array of strings
 *    note         — small print shown on the dish page
 *    tags         — 'popular' | 'featured' | 'special' (Today's Special)
 *
 *  ⚠ PRICE VERIFICATION: the Veg, Dal, Roti and Chicken cards were photographed
 *  at an angle and their Half/Full columns did not line up perfectly with the
 *  dish names. Those sections are marked `// verify` below. Please check them
 *  against the printed card once — everything else is read cleanly.
 * ============================================================================
 */

export const CATEGORIES = [
  { id: 'thali', name: 'Lunch Thali & Combos', blurb: 'Full meals, served through lunch service.', image: 'thali' },
  { id: 'biryani', name: 'Biryani', blurb: 'Our signature handi, with unlimited rice when you dine in.', image: 'biryani' },
  { id: 'snacks', name: 'Snacks', blurb: 'Pakora, momos, lollipops and mughlai paratha.', image: 'chickenPakora' },
  { id: 'barbeque', name: 'Barbeque', blurb: 'Straight off the coals.', image: 'barbecueChicken' },
  { id: 'tandoor', name: 'Tandoor', blurb: 'Clay-oven chicken, tikka and kababs.', image: 'tandooriChicken' },
  { id: 'rolls', name: 'Rolls', blurb: 'Rolled hot in a fresh paratha.', image: 'roll' },
  { id: 'chicken', name: 'Chicken', blurb: 'Gravies by the half or full plate.', image: 'butterChicken' },
  { id: 'mutton', name: 'Mutton', blurb: 'Slow-cooked, full plate only.', image: 'muttonCurry' },
  { id: 'veg', name: 'Veg Main Course', blurb: 'Paneer, mushroom and everyday sabji.', image: 'paneerButterMasala' },
  { id: 'dal', name: 'Dal', blurb: 'Tempered fresh, to order.', image: 'dal' },
  { id: 'rice', name: 'Rice', blurb: 'Jeera, fried and speciality rice.', image: 'friedRice' },
  { id: 'chowmein', name: 'Chinese & Chowmein', blurb: 'Wok-tossed noodles.', image: 'chowmein' },
  { id: 'breads', name: 'Roti & Breads', blurb: 'Tawa, tandoor and stuffed.', image: 'naan' },
  { id: 'beverages', name: 'Tea', blurb: 'Brewed strong. Served hot.', image: 'tea' },
];

/** Add-ons offered alongside dishes — all are real menu items at menu price. */
export const ADDONS = {
  'tawa-roti': { id: 'tawa-roti', name: 'Tawa Roti', price: 6 },
  'tandoori-roti': { id: 'tandoori-roti', name: 'Tandoori Roti', price: 8 },
  'butter-naan': { id: 'butter-naan', name: 'Butter Naan', price: 20 },
  'garlic-naan': { id: 'garlic-naan', name: 'Garlic Naan', price: 30 },
  'jeera-rice': { id: 'jeera-rice', name: 'Jeera Rice', price: 70 },
  'special-tea': { id: 'special-tea', name: 'Special Tea', price: 10 },
  'tandoori-tea': { id: 'tandoori-tea', name: 'Tandoori Tea', price: 15 },
};

const BREADS_AND_RICE = ['tawa-roti', 'tandoori-roti', 'butter-naan', 'garlic-naan', 'jeera-rice'];
const DRINKS = ['special-tea', 'tandoori-tea'];

/** Which add-ons appear for which category. */
const ADDONS_BY_CATEGORY = {
  chicken: [...BREADS_AND_RICE, ...DRINKS],
  mutton: [...BREADS_AND_RICE, ...DRINKS],
  veg: [...BREADS_AND_RICE, ...DRINKS],
  dal: [...BREADS_AND_RICE, ...DRINKS],
  tandoor: ['tandoori-roti', 'butter-naan', 'garlic-naan', ...DRINKS],
  barbeque: ['tandoori-roti', 'butter-naan', ...DRINKS],
  biryani: DRINKS,
  thali: DRINKS,
  snacks: DRINKS,
  rolls: DRINKS,
  rice: DRINKS,
  chowmein: DRINKS,
  breads: [],
  beverages: [],
};

/** Default Half/Full wording per category. */
const PORTION_LABELS = {
  chicken: { half: 'Half · 2 pcs', full: 'Full · 4 pcs' },
  mutton: { half: 'Half', full: 'Full' },
  veg: { half: 'Half', full: 'Full' },
  dal: { half: 'Half', full: 'Full' },
};

// ============================================================================
//  DISHES, grouped by category
// ============================================================================

const RAW = {
  // --------------------------------------------------------------- BIRYANI --
  biryani: [
    {
      name: 'Chicken Biryani with Egg & Raita',
      type: 'nonveg',
      spice: 'medium',
      price: 130,
      image: 'biryani',
      description:
        'Our house biryani — long-grain rice layered with chicken, finished with a boiled egg and a bowl of cooling raita.',
      ingredients: ['Basmati rice', 'Chicken', 'Boiled egg', 'Onion', 'Yogurt raita', 'Whole spices', 'Ghee'],
      note: 'Unlimited rice for dining in. Not shareable.',
      tags: ['popular', 'featured', 'special'],
    },
  ],

  // ------------------------------------------------- LUNCH THALI & COMBOS --
  thali: [
    {
      name: 'Veg Thali',
      type: 'veg',
      spice: 'mild',
      price: 40,
      image: 'vegThali',
      description: 'The full lunch plate — rice, dal, two sabji, alu bhujia, pakora, chatni and papad.',
      ingredients: ['Rice', 'Dal', 'Alu bhujia', 'Pakora', 'Two types of sabji', 'Chatni', 'Papad'],
      tags: ['popular'],
    },
    {
      name: 'Egg Thali',
      type: 'egg',
      spice: 'mild',
      price: 50,
      image: 'eggCurry',
      description: 'The veg thali with a bowl of egg curry added on the side.',
      ingredients: ['Rice', 'Dal', 'Alu bhujia', 'Pakora', 'Two types of sabji', 'Egg curry', 'Chatni', 'Papad'],
    },
    {
      name: 'Chicken Thali',
      type: 'nonveg',
      spice: 'medium',
      price: 90,
      image: 'thali',
      description: 'Lunch, sorted — three pieces of chicken alongside rice, dal, two sabji, pakora and papad.',
      ingredients: ['Rice', 'Dal', 'Alu bhujia', 'Pakora', 'Two types of sabji', 'Chicken (3 pcs)', 'Chatni', 'Papad'],
      tags: ['popular', 'featured'],
    },
    {
      name: 'Fish Thali',
      type: 'nonveg',
      spice: 'medium',
      price: 70,
      image: 'fishThali',
      description: 'A Bengali lunch plate built around the day’s fish.',
      ingredients: ['Rice', 'Dal', 'Fish curry', 'Sabji', 'Chatni', 'Papad'],
      note: 'Starting at ₹70 — final price depends on the day’s catch. Please ask your server.',
    },
    {
      name: 'Rajma Chawal',
      type: 'veg',
      spice: 'mild',
      price: 60,
      image: 'rajmaChawal',
      description: 'Slow-simmered kidney beans over rice, with pakora, aachar and papad.',
      ingredients: ['Rice', 'Rajma', 'Pakora', 'Aachar', 'Papad'],
      tags: ['popular'],
    },
    {
      name: 'Kadi Chawal',
      type: 'veg',
      spice: 'mild',
      price: 60,
      image: 'kadhiChawal',
      description: 'Tangy yogurt kadi ladled over hot rice, with pakora, aachar and papad.',
      ingredients: ['Rice', 'Kadi', 'Pakora', 'Aachar', 'Papad'],
    },
    {
      name: 'Hungry Land Special Combo',
      type: 'veg',
      spice: 'mild',
      price: 50,
      image: 'vegThali',
      description:
        'Our own combo — rice and two rotis with alu bhujia, pakora, two sabji, chatni and papad.',
      ingredients: ['Rice', 'Roti (2 pcs)', 'Alu bhujia', 'Pakora', 'Two types of sabji', 'Chatni', 'Papad'],
      tags: ['special', 'featured', 'popular'],
    },
  ],

  // ---------------------------------------------------------------- SNACKS --
  snacks: [
    {
      name: 'Chicken Pakora',
      type: 'nonveg',
      spice: 'medium',
      price: 30,
      image: 'chickenPakora',
      description: 'Spiced chicken in a crisp gram-flour batter, fried to order.',
      ingredients: ['Chicken', 'Gram flour', 'Ginger-garlic', 'Green chilli', 'Spices'],
      note: '1 plate.',
      tags: ['popular'],
    },
    {
      name: 'Chicken Lolipop Fry',
      type: 'nonveg',
      spice: 'hot',
      price: 30,
      image: 'lollipop',
      description: 'Frenched chicken wings marinated red-hot and deep fried dry.',
      ingredients: ['Chicken wings', 'Ginger-garlic', 'Red chilli', 'Corn flour', 'Spices'],
    },
    {
      name: 'Ch. Lolipop Gravy',
      type: 'nonveg',
      spice: 'hot',
      price: 140,
      image: 'chilliChicken',
      description: 'The same lollipops, tossed through a glossy chilli-garlic gravy.',
      ingredients: ['Chicken wings', 'Onion', 'Capsicum', 'Chilli-garlic sauce', 'Soy sauce'],
    },
    {
      name: 'Ch. Steam Momo',
      type: 'nonveg',
      spice: 'mild',
      price: 50,
      image: 'momo',
      description: 'Hand-pleated chicken dumplings, steamed and served with fiery chutney.',
      ingredients: ['Refined flour', 'Minced chicken', 'Onion', 'Garlic', 'Coriander'],
      note: '4 pcs.',
      tags: ['popular'],
    },
    {
      name: 'Ch. Fry Momo',
      type: 'nonveg',
      spice: 'mild',
      price: 70,
      image: 'momo',
      description: 'Steamed chicken momos taken back to the pan until golden and crisp.',
      ingredients: ['Refined flour', 'Minced chicken', 'Onion', 'Garlic', 'Coriander'],
      note: '5 pcs.',
    },
    {
      name: 'Egg Mughlai Paratha',
      type: 'egg',
      spice: 'mild',
      price: 80,
      image: 'mughlaiParatha',
      description: 'Flaky paratha stuffed with beaten egg and onion, shallow fried flat.',
      ingredients: ['Refined flour', 'Egg', 'Onion', 'Green chilli', 'Coriander'],
    },
    {
      name: 'Chicken Mughlai Paratha',
      type: 'nonveg',
      spice: 'mild',
      price: 100,
      image: 'mughlaiParatha',
      description: 'The classic Bengali mughlai — egg and minced chicken folded into a crisp paratha.',
      ingredients: ['Refined flour', 'Egg', 'Minced chicken', 'Onion', 'Green chilli'],
      tags: ['featured'],
    },
    {
      name: 'Crispy Chicken',
      type: 'nonveg',
      spice: 'medium',
      price: 130,
      image: 'friedChicken',
      description: 'Batter-fried chicken strips, crunchy outside and still juicy in.',
      ingredients: ['Chicken', 'Corn flour', 'Egg', 'Pepper', 'Spices'],
      tags: ['popular'],
    },
    {
      name: 'Chicken 65',
      type: 'nonveg',
      spice: 'hot',
      price: 120,
      image: 'friedChicken',
      description: 'South Indian style chicken, deep fried and tossed with curry leaf and chilli.',
      ingredients: ['Chicken', 'Curry leaves', 'Red chilli', 'Yogurt', 'Ginger-garlic'],
      note: '5 pcs.',
    },
  ],

  // -------------------------------------------------------------- BARBEQUE --
  barbeque: [
    {
      name: 'Chicken Barbeque',
      type: 'nonveg',
      spice: 'medium',
      price: 120,
      image: 'barbecueChicken',
      description: 'Chicken marinated overnight and grilled slowly over coals.',
      ingredients: ['Chicken', 'Yogurt', 'Ginger-garlic', 'Barbeque spices', 'Mustard oil'],
      tags: ['popular', 'featured'],
    },
    {
      name: 'Barbeque Chicken Tikka',
      type: 'nonveg',
      spice: 'medium',
      price: 120,
      image: 'chickenTikka',
      description: 'Boneless tikka cubes charred on the grill, served with onion and chutney.',
      ingredients: ['Boneless chicken', 'Yogurt', 'Red chilli', 'Ginger-garlic', 'Garam masala'],
    },
    {
      name: 'Barbeque Chicken Reshmi Kabab',
      type: 'nonveg',
      spice: 'mild',
      price: 130,
      image: 'kebab',
      description: 'Silky cream-and-cashew marinade, grilled pale gold. The gentle one.',
      ingredients: ['Boneless chicken', 'Cream', 'Cashew paste', 'Cheese', 'White pepper'],
      tags: ['popular'],
    },
  ],

  // --------------------------------------------------------------- TANDOOR --
  tandoor: [
    {
      name: 'Tandoori Chicken',
      type: 'nonveg',
      spice: 'medium',
      portions: [
        { label: '1 pc', price: 120 },
        { label: 'Half', price: 240 },
        { label: 'Full', price: 460 },
      ],
      image: 'tandooriChicken',
      description: 'Bone-in chicken in a red yogurt marinade, blistered in the clay oven.',
      ingredients: ['Chicken', 'Yogurt', 'Kashmiri chilli', 'Ginger-garlic', 'Lemon', 'Tandoori masala'],
      tags: ['popular', 'featured'],
    },
    {
      name: 'Chicken Tikka',
      type: 'nonveg',
      spice: 'medium',
      price: 120,
      image: 'chickenTikka',
      description: 'Boneless chicken skewered and cooked hard against the tandoor wall.',
      ingredients: ['Boneless chicken', 'Yogurt', 'Red chilli', 'Ginger-garlic', 'Garam masala'],
      note: '5 pcs.',
      tags: ['popular'],
    },
    {
      name: 'Reshmi Kabab',
      type: 'nonveg',
      spice: 'mild',
      price: 130,
      image: 'kebab',
      description: 'Cream, cashew and cheese marinade — soft, rich and barely spiced.',
      ingredients: ['Boneless chicken', 'Cream', 'Cashew paste', 'Cheese', 'White pepper'],
      note: '5 pcs.',
    },
    {
      name: 'Chicken Tikka Masala',
      type: 'nonveg',
      spice: 'medium',
      price: 160,
      image: 'butterChicken',
      description: 'Tandoori tikka simmered into a deep tomato-and-butter gravy.',
      ingredients: ['Chicken tikka', 'Tomato', 'Onion', 'Butter', 'Cream', 'Garam masala'],
      tags: ['featured'],
    },
    {
      name: 'Reshmi Butter Masala',
      type: 'nonveg',
      spice: 'mild',
      price: 180,
      image: 'butterChicken',
      description: 'Reshmi kabab folded into our richest makhani gravy. The full-dress order.',
      ingredients: ['Reshmi kabab', 'Tomato', 'Butter', 'Cream', 'Cashew paste', 'Kasuri methi'],
      tags: ['popular'],
    },
  ],

  // ----------------------------------------------------------------- ROLLS --
  rolls: [
    {
      name: 'Veg Roll',
      type: 'veg',
      spice: 'mild',
      price: 30,
      image: 'vegRoll',
      description: 'Crunchy vegetables and onion rolled into a hot paratha.',
      ingredients: ['Paratha', 'Cabbage', 'Carrot', 'Onion', 'Green chilli', 'Sauces'],
    },
    {
      name: 'Egg Roll',
      type: 'egg',
      spice: 'mild',
      price: 40,
      image: 'roll',
      description: 'Egg cooked straight onto the paratha, with onion, chilli and a squeeze of lemon.',
      ingredients: ['Paratha', 'Egg', 'Onion', 'Green chilli', 'Lemon', 'Sauces'],
      tags: ['popular'],
    },
    {
      name: 'Chicken Roll',
      type: 'nonveg',
      spice: 'medium',
      price: 70,
      image: 'roll',
      description: 'Spiced chicken, sliced onion and chutney wrapped tight to go.',
      ingredients: ['Paratha', 'Chicken', 'Onion', 'Green chilli', 'Chutney'],
      tags: ['popular', 'featured'],
    },
    {
      name: 'Paneer Roll',
      type: 'veg',
      spice: 'medium',
      price: 80,
      image: 'vegRoll',
      description: 'Tandoori-spiced paneer batons rolled with onion and mint chutney.',
      ingredients: ['Paratha', 'Paneer', 'Onion', 'Capsicum', 'Mint chutney'],
    },
    {
      name: 'Egg Chicken Roll',
      type: 'nonveg',
      spice: 'medium',
      price: 80,
      image: 'roll',
      description: 'Both at once — egg-coated paratha loaded with spiced chicken.',
      ingredients: ['Paratha', 'Egg', 'Chicken', 'Onion', 'Green chilli', 'Chutney'],
      tags: ['popular'],
    },
  ],

  // --------------------------------------------------------------- CHICKEN --
  // verify: Half/Full columns on the Chicken card were misaligned in the photo.
  chicken: [
    {
      name: 'Chicken Curry',
      type: 'nonveg',
      spice: 'medium',
      half: 80,
      full: 140,
      image: 'chickenCurry',
      description: 'The everyday one — chicken on the bone in a light onion-tomato gravy.',
      ingredients: ['Chicken', 'Onion', 'Tomato', 'Ginger-garlic', 'Turmeric', 'Garam masala'],
      tags: ['popular'],
    },
    {
      name: 'Chicken Kasha',
      type: 'nonveg',
      spice: 'hot',
      half: 100,
      full: 160,
      image: 'chickenKasha',
      description: 'Bengali kasha — chicken cooked down until the masala clings dark and dry.',
      ingredients: ['Chicken', 'Onion paste', 'Mustard oil', 'Ginger-garlic', 'Whole garam masala'],
      tags: ['popular', 'featured'],
    },
    {
      name: 'Chilli Chicken',
      type: 'nonveg',
      spice: 'hot',
      half: 80,
      full: 140,
      image: 'chilliChicken',
      description: 'Indo-Chinese chilli chicken with onion, capsicum and plenty of green chilli.',
      ingredients: ['Chicken', 'Onion', 'Capsicum', 'Green chilli', 'Soy sauce', 'Vinegar'],
      tags: ['popular'],
    },
    {
      name: 'Chilli Chicken (Dry)',
      type: 'nonveg',
      spice: 'hot',
      price: 120,
      image: 'chilliChicken',
      description: 'Same heat, no gravy — tossed dry so every piece stays crisp.',
      ingredients: ['Chicken', 'Onion', 'Capsicum', 'Green chilli', 'Soy sauce', 'Corn flour'],
    },
    {
      name: 'Chicken Masala',
      type: 'nonveg',
      spice: 'medium',
      half: 70,
      full: 120,
      image: 'chickenCurry',
      description: 'A thicker, spicier house masala built on browned onions.',
      ingredients: ['Chicken', 'Onion', 'Tomato', 'Yogurt', 'Ginger-garlic', 'Masala blend'],
    },
    {
      name: 'Kadai Chicken',
      type: 'nonveg',
      spice: 'hot',
      half: 80,
      full: 140,
      image: 'chickenKasha',
      description: 'Finished in the kadai with crushed coriander seed, capsicum and onion petals.',
      ingredients: ['Chicken', 'Capsicum', 'Onion', 'Tomato', 'Coriander seed', 'Kadai masala'],
      tags: ['featured'],
    },
    {
      name: 'Palak Chicken',
      type: 'nonveg',
      spice: 'medium',
      half: 70,
      full: 120,
      image: 'palakPaneer',
      description: 'Chicken braised into a smooth, garlicky spinach gravy.',
      ingredients: ['Chicken', 'Spinach', 'Garlic', 'Onion', 'Cream', 'Spices'],
    },
    {
      name: 'Chicken Chaap',
      type: 'nonveg',
      spice: 'mild',
      price: 100,
      image: 'chickenKorma',
      description: 'A leg quarter cooked low in a fragrant, nut-thickened Mughlai gravy.',
      ingredients: ['Chicken leg', 'Yogurt', 'Cashew-poppy paste', 'Ghee', 'Kewra', 'Shahi garam masala'],
      note: '1 pc.',
      tags: ['featured'],
    },
    {
      name: 'Chicken Bharta',
      type: 'nonveg',
      spice: 'medium',
      half: 90,
      full: 150,
      image: 'butterChicken',
      description: 'Shredded chicken in a creamy, buttery gravy with boiled egg stirred through.',
      ingredients: ['Shredded chicken', 'Egg', 'Onion', 'Cream', 'Butter', 'Spices'],
      tags: ['popular'],
    },
    {
      name: 'Chicken Do Pyaza',
      type: 'nonveg',
      spice: 'medium',
      half: 80,
      full: 140,
      image: 'chickenCurry',
      description: 'Onion twice over — once cooked into the gravy, once thrown in at the end.',
      ingredients: ['Chicken', 'Onion', 'Tomato', 'Yogurt', 'Ginger-garlic', 'Garam masala'],
    },
    {
      name: 'Butter Chicken',
      type: 'nonveg',
      spice: 'mild',
      half: 90,
      full: 150,
      image: 'butterChicken',
      description: 'Tandoori chicken in a velvety tomato-butter gravy. Order a naan with it.',
      ingredients: ['Chicken', 'Tomato', 'Butter', 'Cream', 'Cashew paste', 'Kasuri methi'],
      tags: ['popular', 'featured'],
    },
    {
      name: 'Chicken Korma',
      type: 'nonveg',
      spice: 'mild',
      half: 80,
      full: 140,
      image: 'chickenKorma',
      description: 'Pale, perfumed and gentle — yogurt and cashew, no chilli heat.',
      ingredients: ['Chicken', 'Yogurt', 'Cashew paste', 'Onion paste', 'Green cardamom', 'Ghee'],
    },
    {
      name: 'Ch. Manchurian',
      type: 'nonveg',
      spice: 'hot',
      half: 70,
      full: 130,
      image: 'chickenManchurian',
      description: 'Fried chicken in a dark, tangy garlic-soy Manchurian sauce.',
      ingredients: ['Chicken', 'Garlic', 'Spring onion', 'Soy sauce', 'Vinegar', 'Chilli sauce'],
    },
  ],

  // ---------------------------------------------------------------- MUTTON --
  mutton: [
    {
      name: 'Mutton Kasha',
      type: 'nonveg',
      spice: 'hot',
      price: 200,
      image: 'muttonCurry',
      description: 'Mutton cooked the long way in mustard oil until the masala turns almost black.',
      ingredients: ['Mutton', 'Onion paste', 'Mustard oil', 'Ginger-garlic', 'Whole garam masala', 'Bay leaf'],
      tags: ['popular', 'featured'],
    },
    {
      name: 'Kadai Mutton',
      type: 'nonveg',
      spice: 'hot',
      price: 250,
      image: 'muttonCurry',
      description: 'Our biggest plate — mutton finished in the kadai with capsicum and crushed spice.',
      ingredients: ['Mutton', 'Capsicum', 'Onion', 'Tomato', 'Coriander seed', 'Kadai masala'],
      tags: ['featured'],
    },
  ],

  // ------------------------------------------------------- VEG MAIN COURSE --
  // verify: Half/Full columns on the Veg card were misaligned in the photo.
  veg: [
    {
      name: 'Kashmiri Alu Dum',
      type: 'veg',
      spice: 'mild',
      half: 35,
      full: 50,
      image: 'aluDum',
      description: 'Baby potatoes simmered in a lightly sweet, deep-red Kashmiri gravy.',
      ingredients: ['Potato', 'Tomato', 'Kashmiri chilli', 'Yogurt', 'Fennel', 'Ginger'],
      tags: ['popular'],
    },
    {
      name: 'Chana Masala',
      type: 'veg',
      spice: 'medium',
      half: 35,
      full: 50,
      image: 'chanaMasala',
      description: 'Chickpeas cooked down with onion, tomato and a sharp, tangy masala.',
      ingredients: ['Chickpeas', 'Onion', 'Tomato', 'Amchur', 'Chana masala', 'Coriander'],
    },
    {
      name: 'Mix Veg',
      type: 'veg',
      spice: 'mild',
      half: 35,
      full: 50,
      image: 'mixVeg',
      description: 'Whatever came in fresh that morning, in a light everyday gravy.',
      ingredients: ['Seasonal vegetables', 'Onion', 'Tomato', 'Ginger-garlic', 'Turmeric', 'Garam masala'],
    },
    {
      name: 'Matar Paneer',
      type: 'veg',
      spice: 'mild',
      half: 60,
      full: 100,
      image: 'paneerCurry',
      description: 'Soft paneer and green peas in a mellow tomato gravy.',
      ingredients: ['Paneer', 'Green peas', 'Tomato', 'Onion', 'Cream', 'Garam masala'],
      tags: ['popular'],
    },
    {
      name: 'Paneer Chilly',
      type: 'veg',
      spice: 'hot',
      half: 60,
      full: 110,
      image: 'paneerCurry',
      description: 'Paneer, capsicum and onion tossed hot in a chilli-soy glaze.',
      ingredients: ['Paneer', 'Capsicum', 'Onion', 'Green chilli', 'Soy sauce', 'Vinegar'],
      tags: ['popular'],
    },
    {
      name: 'Kadai Paneer',
      type: 'veg',
      spice: 'hot',
      half: 70,
      full: 130,
      image: 'paneerCurry',
      description: 'Paneer with capsicum and onion petals in a coarse, coriander-heavy masala.',
      ingredients: ['Paneer', 'Capsicum', 'Onion', 'Tomato', 'Coriander seed', 'Kadai masala'],
      tags: ['featured'],
    },
    {
      name: 'Paneer Masala',
      type: 'veg',
      spice: 'medium',
      half: 70,
      full: 120,
      image: 'paneerCurry',
      description: 'Everyday paneer in a thick, well-spiced onion-tomato masala.',
      ingredients: ['Paneer', 'Onion', 'Tomato', 'Ginger-garlic', 'Cream', 'Masala blend'],
    },
    {
      name: 'Paneer Do Pyaza',
      type: 'veg',
      spice: 'medium',
      half: 80,
      full: 140,
      image: 'paneerCurry',
      description: 'Paneer with onions added twice — slow-cooked, then tossed in fresh at the finish.',
      ingredients: ['Paneer', 'Onion', 'Tomato', 'Yogurt', 'Ginger-garlic', 'Garam masala'],
    },
    {
      name: 'Paneer Butter Masala',
      type: 'veg',
      spice: 'mild',
      half: 80,
      full: 130,
      image: 'paneerButterMasala',
      description: 'The crowd-pleaser — paneer in a smooth, buttery tomato-cashew gravy.',
      ingredients: ['Paneer', 'Tomato', 'Butter', 'Cream', 'Cashew paste', 'Kasuri methi'],
      tags: ['popular', 'featured'],
    },
    {
      name: 'Palaak Paneer',
      type: 'veg',
      spice: 'mild',
      half: 80,
      full: 130,
      image: 'palakPaneer',
      description: 'Paneer cubes folded into a bright, garlicky spinach purée.',
      ingredients: ['Paneer', 'Spinach', 'Garlic', 'Onion', 'Cream', 'Cumin'],
      tags: ['popular'],
    },
    {
      name: 'Paneer Bharta',
      type: 'veg',
      spice: 'medium',
      half: 90,
      full: 150,
      image: 'paneerButterMasala',
      description: 'Grated paneer in a rich, buttery gravy — scoop it up with a hot roti.',
      ingredients: ['Grated paneer', 'Onion', 'Tomato', 'Butter', 'Cream', 'Spices'],
    },
    {
      name: 'Mushroom Masala',
      type: 'veg',
      spice: 'medium',
      half: 60,
      full: 100,
      image: 'mushroomCurry',
      description: 'Button mushrooms in a dark, earthy onion-tomato masala.',
      ingredients: ['Mushroom', 'Onion', 'Tomato', 'Ginger-garlic', 'Coriander', 'Garam masala'],
    },
    {
      name: 'Mushroom Chilly',
      type: 'veg',
      spice: 'hot',
      half: 90,
      full: 150,
      image: 'mushroomCurry',
      description: 'Mushrooms seared hard, then tossed with capsicum in a chilli-garlic sauce.',
      ingredients: ['Mushroom', 'Capsicum', 'Onion', 'Green chilli', 'Soy sauce', 'Garlic'],
    },
    {
      name: 'Veg Manchurian',
      type: 'veg',
      spice: 'hot',
      half: 40,
      full: 60,
      image: 'chickenManchurian',
      description: 'Fried vegetable dumplings in a tangy, dark garlic Manchurian sauce.',
      ingredients: ['Cabbage', 'Carrot', 'Corn flour', 'Garlic', 'Soy sauce', 'Chilli sauce'],
      tags: ['popular'],
    },
    {
      name: 'Paneer Manchurian',
      type: 'veg',
      spice: 'hot',
      half: 70,
      full: 120,
      image: 'chickenManchurian',
      description: 'Batter-fried paneer in the same sharp Manchurian sauce.',
      ingredients: ['Paneer', 'Corn flour', 'Garlic', 'Spring onion', 'Soy sauce', 'Vinegar'],
    },
  ],

  // ------------------------------------------------------------------- DAL --
  // verify: Half/Full columns on the Dal card were misaligned in the photo.
  dal: [
    {
      name: 'Dal Fry',
      type: 'veg',
      spice: 'mild',
      half: 40,
      full: 60,
      image: 'dal',
      description: 'Yellow lentils finished with a cumin-and-garlic tempering.',
      ingredients: ['Arhar dal', 'Cumin', 'Garlic', 'Onion', 'Tomato', 'Coriander'],
      tags: ['popular'],
    },
    {
      name: 'Dal Makhni',
      type: 'veg',
      spice: 'mild',
      half: 50,
      full: 80,
      image: 'dalMakhani',
      description: 'Black urad and rajma simmered for hours with butter and cream.',
      ingredients: ['Urad dal', 'Rajma', 'Butter', 'Cream', 'Tomato', 'Ginger'],
      tags: ['popular', 'featured'],
    },
    {
      name: 'Tadka',
      type: 'veg',
      spice: 'mild',
      half: 35,
      full: 50,
      image: 'dal',
      description: 'Plain dal, big tempering — ghee, cumin, dried chilli, poured over at the table.',
      ingredients: ['Arhar dal', 'Ghee', 'Cumin', 'Dried red chilli', 'Garlic', 'Turmeric'],
    },
    {
      name: 'Egg Tadka',
      type: 'egg',
      spice: 'medium',
      half: 40,
      full: 60,
      image: 'eggCurry',
      description: 'Tadka dal with egg stirred through until it sets in ribbons.',
      ingredients: ['Arhar dal', 'Egg', 'Ghee', 'Cumin', 'Onion', 'Green chilli'],
    },
    {
      name: 'Chicken Tadka',
      type: 'nonveg',
      spice: 'medium',
      half: 70,
      full: 110,
      image: 'dal',
      description: 'Dal cooked with shredded chicken and a heavy garlic tempering.',
      ingredients: ['Arhar dal', 'Chicken', 'Garlic', 'Cumin', 'Onion', 'Spices'],
      tags: ['popular'],
    },
    {
      name: 'Paneer Tadka',
      type: 'veg',
      spice: 'medium',
      half: 70,
      full: 110,
      image: 'dalMakhani',
      description: 'Tadka dal with cubes of paneer folded in at the end.',
      ingredients: ['Arhar dal', 'Paneer', 'Ghee', 'Cumin', 'Garlic', 'Coriander'],
    },
  ],

  // ------------------------------------------------------------------ RICE --
  rice: [
    {
      name: 'Jeera Rice',
      type: 'veg',
      spice: 'mild',
      price: 70,
      image: 'jeeraRice',
      description: 'Long-grain rice tossed in ghee with toasted cumin.',
      ingredients: ['Basmati rice', 'Cumin', 'Ghee', 'Bay leaf'],
      tags: ['popular'],
    },
    {
      name: 'Veg Fried Rice',
      type: 'veg',
      spice: 'mild',
      price: 70,
      image: 'friedRice',
      description: 'Rice wok-tossed on high heat with diced vegetables and spring onion.',
      ingredients: ['Rice', 'Carrot', 'Beans', 'Cabbage', 'Spring onion', 'Soy sauce'],
    },
    {
      name: 'Egg Fried Rice',
      type: 'egg',
      spice: 'mild',
      price: 80,
      image: 'eggFriedRice',
      description: 'Fried rice with scrambled egg folded right through it.',
      ingredients: ['Rice', 'Egg', 'Spring onion', 'Soy sauce', 'Pepper'],
      tags: ['popular'],
    },
    {
      name: 'Chicken Fried Rice',
      type: 'nonveg',
      spice: 'mild',
      price: 100,
      image: 'chickenFriedRice',
      description: 'Shredded chicken and vegetables tossed through hot wok rice.',
      ingredients: ['Rice', 'Chicken', 'Carrot', 'Spring onion', 'Soy sauce', 'Pepper'],
      tags: ['popular', 'featured'],
    },
    {
      name: 'Egg Chicken Fried Rice',
      type: 'nonveg',
      spice: 'mild',
      price: 110,
      image: 'chickenFriedRice',
      description: 'Both egg and chicken, in one generous plate of fried rice.',
      ingredients: ['Rice', 'Egg', 'Chicken', 'Spring onion', 'Soy sauce', 'Pepper'],
    },
    {
      name: 'Paneer Rice',
      type: 'veg',
      spice: 'mild',
      price: 100,
      image: 'friedRice',
      description: 'Fried rice studded with pan-seared cubes of paneer.',
      ingredients: ['Rice', 'Paneer', 'Capsicum', 'Spring onion', 'Soy sauce'],
    },
    {
      name: 'Mushroom Rice',
      type: 'veg',
      spice: 'mild',
      price: 110,
      image: 'friedRice',
      description: 'Mushrooms browned hard in the wok, then tossed with rice and pepper.',
      ingredients: ['Rice', 'Mushroom', 'Spring onion', 'Garlic', 'Soy sauce', 'Pepper'],
    },
    {
      name: 'Paneer Mushroom Rice',
      type: 'veg',
      spice: 'mild',
      price: 150,
      image: 'friedRice',
      description: 'Our loaded veg plate — paneer and mushroom together over wok rice.',
      ingredients: ['Rice', 'Paneer', 'Mushroom', 'Capsicum', 'Spring onion', 'Soy sauce'],
      tags: ['featured'],
    },
  ],

  // ------------------------------------------------------ CHINESE/CHOWMEIN --
  chowmein: [
    {
      name: 'Veg Chowmein',
      type: 'veg',
      spice: 'mild',
      price: 40,
      image: 'chowmein',
      description: 'Noodles tossed with shredded cabbage, carrot and capsicum.',
      ingredients: ['Noodles', 'Cabbage', 'Carrot', 'Capsicum', 'Onion', 'Soy sauce'],
      tags: ['popular'],
    },
    {
      name: 'Egg Chowmein',
      type: 'egg',
      spice: 'mild',
      price: 50,
      image: 'chowmein',
      description: 'Veg chowmein with egg scrambled into the wok.',
      ingredients: ['Noodles', 'Egg', 'Cabbage', 'Carrot', 'Onion', 'Soy sauce'],
      tags: ['popular'],
    },
    {
      name: 'Chicken Chowmein',
      type: 'nonveg',
      spice: 'mild',
      price: 70,
      image: 'chowmein',
      description: 'Shredded chicken and vegetables through hot, smoky noodles.',
      ingredients: ['Noodles', 'Chicken', 'Cabbage', 'Carrot', 'Onion', 'Soy sauce'],
      tags: ['popular', 'featured'],
    },
    {
      name: 'Paneer Chowmein',
      type: 'veg',
      spice: 'mild',
      price: 80,
      image: 'chowmein',
      description: 'Noodles tossed with seared paneer and crisp vegetables.',
      ingredients: ['Noodles', 'Paneer', 'Capsicum', 'Cabbage', 'Onion', 'Soy sauce'],
    },
    {
      name: 'Egg Chicken Chowmein',
      type: 'nonveg',
      spice: 'mild',
      price: 80,
      image: 'chowmein',
      description: 'The full plate — egg and chicken both, tossed through the noodles.',
      ingredients: ['Noodles', 'Egg', 'Chicken', 'Cabbage', 'Carrot', 'Soy sauce'],
    },
  ],

  // -------------------------------------------------------- ROTI & BREADS --
  // verify: the Roti column on the card was misaligned in the photo.
  breads: [
    {
      name: 'Tawa Roti with any dishes',
      type: 'veg',
      price: 5,
      image: 'roti',
      description: 'Soft tawa roti, at the with-a-dish price.',
      ingredients: ['Whole wheat flour', 'Water', 'Salt'],
      note: 'Price applies when ordered alongside a curry.',
    },
    {
      name: 'Tawa Roti only',
      type: 'veg',
      price: 6,
      image: 'roti',
      description: 'Plain tawa roti, on its own.',
      ingredients: ['Whole wheat flour', 'Water', 'Salt'],
    },
    {
      name: 'Tandoori Roti with any dishes',
      type: 'veg',
      price: 7,
      image: 'roti',
      description: 'Clay-oven roti, at the with-a-dish price.',
      ingredients: ['Whole wheat flour', 'Water', 'Salt'],
      note: 'Price applies when ordered alongside a curry.',
      tags: ['popular'],
    },
    {
      name: 'Tandoori Roti only',
      type: 'veg',
      price: 8,
      image: 'roti',
      description: 'Blistered straight off the tandoor wall.',
      ingredients: ['Whole wheat flour', 'Water', 'Salt'],
    },
    {
      name: 'Butter Tandoori Roti',
      type: 'veg',
      price: 10,
      image: 'roti',
      description: 'Tandoori roti, brushed generously with butter.',
      ingredients: ['Whole wheat flour', 'Butter', 'Water', 'Salt'],
      tags: ['popular'],
    },
    {
      name: 'Naan',
      type: 'veg',
      price: 15,
      image: 'naan',
      description: 'Leavened white-flour naan, pulled and slapped into the tandoor.',
      ingredients: ['Refined flour', 'Yogurt', 'Yeast', 'Salt'],
    },
    {
      name: 'Butter Naan',
      type: 'veg',
      price: 20,
      image: 'naan',
      description: 'Naan finished with a heavy hand of butter. The default order.',
      ingredients: ['Refined flour', 'Butter', 'Yogurt', 'Yeast'],
      tags: ['popular', 'featured'],
    },
    {
      name: 'Garlic Naan',
      type: 'veg',
      price: 30,
      image: 'garlicNaan',
      description: 'Naan pressed with chopped garlic and coriander before it hits the oven.',
      ingredients: ['Refined flour', 'Garlic', 'Coriander', 'Butter', 'Yogurt'],
      tags: ['popular'],
    },
    {
      name: 'Cheese Naan',
      type: 'veg',
      price: 40,
      image: 'naan',
      description: 'Stuffed with melting cheese, sealed and baked in the tandoor.',
      ingredients: ['Refined flour', 'Cheese', 'Butter', 'Yogurt'],
    },
    {
      name: 'Masala Kulcha',
      type: 'veg',
      price: 40,
      image: 'kulcha',
      description: 'Kulcha stuffed with spiced potato and onion masala.',
      ingredients: ['Refined flour', 'Potato', 'Onion', 'Green chilli', 'Spices'],
    },
    {
      name: 'Paneer Kulcha',
      type: 'veg',
      price: 50,
      image: 'kulcha',
      description: 'Crumbled paneer and coriander stuffed into a soft tandoori kulcha.',
      ingredients: ['Refined flour', 'Paneer', 'Coriander', 'Green chilli', 'Butter'],
      tags: ['featured'],
    },
    {
      name: 'Rumali Roti with any dishes',
      type: 'veg',
      price: 8,
      image: 'roti',
      description: 'Handkerchief-thin roti, at the with-a-dish price.',
      ingredients: ['Refined flour', 'Whole wheat flour', 'Water', 'Salt'],
      note: 'Price applies when ordered alongside a curry.',
    },
    {
      name: 'Rumali Roti only',
      type: 'veg',
      price: 9,
      image: 'roti',
      description: 'Stretched paper-thin over the inverted tawa and folded like cloth.',
      ingredients: ['Refined flour', 'Whole wheat flour', 'Water', 'Salt'],
    },
    {
      name: 'Alu Paratha',
      type: 'veg',
      price: 20,
      image: 'paratha',
      description: 'Stuffed with spiced mashed potato and griddled in oil.',
      ingredients: ['Whole wheat flour', 'Potato', 'Onion', 'Green chilli', 'Spices'],
      tags: ['popular'],
    },
    {
      name: 'Laccha Paratha',
      type: 'veg',
      price: 15,
      image: 'paratha',
      description: 'Layer upon flaky layer, crushed open at the table.',
      ingredients: ['Refined flour', 'Ghee', 'Water', 'Salt'],
    },
  ],

  // ------------------------------------------------------------------- TEA --
  beverages: [
    {
      name: 'Special Tea',
      type: 'veg',
      price: 10,
      image: 'tea',
      description: 'Brewed strong with milk, ginger and cardamom.',
      ingredients: ['Tea leaves', 'Milk', 'Sugar', 'Ginger', 'Cardamom'],
      tags: ['popular'],
    },
    {
      name: 'Tandoori Tea',
      type: 'veg',
      price: 15,
      image: 'tandooriTea',
      description: 'Poured over a red-hot clay cup so it hisses and turns smoky. Worth the extra ₹5.',
      ingredients: ['Tea leaves', 'Milk', 'Sugar', 'Cardamom', 'Clay kulhad'],
      tags: ['popular', 'featured'],
    },
  ],
};

// ============================================================================
//  NORMALISATION — turns the authoring format above into what the UI consumes
// ============================================================================

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function buildVariants(dish, categoryId) {
  if (dish.portions?.length) {
    return dish.portions.map((p) => ({ id: slug(p.label), label: p.label, price: p.price }));
  }
  if (dish.half != null || dish.full != null) {
    const labels = PORTION_LABELS[categoryId] ?? { half: 'Half', full: 'Full' };
    const out = [];
    if (dish.half != null) out.push({ id: 'half', label: dish.halfLabel ?? labels.half, price: dish.half });
    if (dish.full != null) out.push({ id: 'full', label: dish.fullLabel ?? labels.full, price: dish.full });
    return out;
  }
  return [{ id: 'regular', label: dish.portionLabel ?? 'Regular', price: dish.price }];
}

export const DISHES = Object.entries(RAW).flatMap(([categoryId, dishes]) =>
  dishes.map((dish) => {
    const variants = buildVariants(dish, categoryId);
    const tags = dish.tags ?? [];
    return {
      id: `${categoryId}-${slug(dish.name)}`,
      name: dish.name,
      categoryId,
      categoryName: CATEGORIES.find((c) => c.id === categoryId)?.name ?? categoryId,
      type: dish.type ?? 'veg',
      spice: dish.spice ?? null,
      description: dish.description ?? '',
      ingredients: dish.ingredients ?? [],
      note: dish.note ?? null,
      image: dish.image ?? CATEGORIES.find((c) => c.id === categoryId)?.image ?? 'heroSpread',
      variants,
      basePrice: Math.min(...variants.map((v) => v.price)),
      maxPrice: Math.max(...variants.map((v) => v.price)),
      hasPortions: variants.length > 1,
      addons: (ADDONS_BY_CATEGORY[categoryId] ?? []).map((id) => ADDONS[id]).filter(Boolean),
      tags,
      isPopular: tags.includes('popular'),
      isFeatured: tags.includes('featured'),
      isSpecial: tags.includes('special'),
    };
  })
);

export const getDishById = (id) => DISHES.find((d) => d.id === id);
export const getVariant = (dish, variantId) =>
  dish?.variants.find((v) => v.id === variantId) ?? dish?.variants[0];

export const POPULAR_DISHES = DISHES.filter((d) => d.isPopular);
export const FEATURED_DISHES = DISHES.filter((d) => d.isFeatured);
export const TODAYS_SPECIALS = DISHES.filter((d) => d.isSpecial);

export const CATEGORIES_WITH_COUNTS = CATEGORIES.map((c) => ({
  ...c,
  count: DISHES.filter((d) => d.categoryId === c.id).length,
})).filter((c) => c.count > 0);

export const DIET_TYPES = {
  veg: { id: 'veg', label: 'Veg', short: 'Veg', color: 'leaf' },
  egg: { id: 'egg', label: 'Contains Egg', short: 'Egg', color: 'ember' },
  nonveg: { id: 'nonveg', label: 'Non-Veg', short: 'Non-Veg', color: 'chilli' },
};

export const SPICE_LEVELS = {
  mild: { id: 'mild', label: 'Mild', flames: 1 },
  medium: { id: 'medium', label: 'Medium', flames: 2 },
  hot: { id: 'hot', label: 'Hot', flames: 3 },
};
