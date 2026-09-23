// Real, publicly-sourced facts about the restaurant (TripAdvisor + other
// public restaurant listings). Prices in the menu are indicative estimates
// for this demo — actual menu items were confirmed, but public prices were
// not available, so contact the restaurant to confirm current pricing.

/**
 * Absolute base URL, used by `metadataBase`, the sitemap and robots.txt so
 * social previews and crawlers resolve correctly.
 *
 * ⚠️ The fallback is a placeholder — this site has no domain yet. Set
 * NEXT_PUBLIC_SITE_URL in the deployment environment (no trailing slash), or
 * edit the fallback, before going live. Getting this wrong means share cards
 * and sitemap entries point at the wrong host.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://texas-steak-house.example.com";

export const restaurantInfo = {
  name: "Texas Steak House",
  tagline: "Rawalpindi's Home of Fire-Grilled Steaks",
  cuisine: "American Steakhouse",
  priceTier: "$$–$$$",
  address: "Shop # 35, Zarkon Plaza, Adamjee Road, Saddar, Rawalpindi, Pakistan",
  phone: "+92-51-5792132",
  hours: "9:00 AM – 10:00 PM, Daily",
  rating: 4.0,
  reviewCount: 99,
  ranking: "#4 of 118 restaurants in Rawalpindi",
  secondLocation: "Also at E-7, Shaheen Market, Islamabad",
  sourceUrl:
    "https://www.tripadvisor.com/Restaurant_Review-g298423-d817436-Reviews-Texas_steak_house-Rawalpindi_Punjab_Province.html",
  mapsQuery: "Texas Steak House, Zarkon Plaza, Adamjee Road, Saddar, Rawalpindi",
} as const;

/**
 * Both branches, shared by the homepage "Our Locations" section and the
 * footer so the two can't drift apart.
 */
export const locations = [
  {
    label: "Saddar, Rawalpindi",
    address: restaurantInfo.address,
    hours: restaurantInfo.hours,
    phone: restaurantInfo.phone as string | undefined,
    query: restaurantInfo.mapsQuery,
  },
  {
    label: "E-7, Islamabad",
    address: "Shaheen Market, Sector E-7, Islamabad, Pakistan",
    hours: restaurantInfo.hours,
    phone: undefined,
    query: "Texas Steak House, Shaheen Market, E-7, Islamabad",
  },
] as const;

/**
 * Social profiles shown in the footer.
 *
 * ⚠️ PLACEHOLDER URLs — these point at handles we have not verified as
 * belonging to this restaurant. Replace each `href` with the real profile (or
 * delete the entry) before publishing; a wrong link sends customers to
 * somebody else's page.
 */
export const socialLinks = [
  { label: "Facebook", href: "https://facebook.com/", key: "facebook" },
  { label: "Instagram", href: "https://instagram.com/", key: "instagram" },
  { label: "WhatsApp", href: "https://wa.me/", key: "whatsapp" },
] as const;

/** Hero video (fire-grill flambé) shown on the homepage banner. */
export const heroVideo = {
  src: "/images/banner-web.mp4",
  poster: "/images/banner-poster.jpg",
};

export const ctaVideo = {
  src: "/images/cta-web.mp4",
  poster: "/images/cta-poster.jpg",
};

export const aboutHeroVideo = {
  src: "/images/about-banner-web.mp4",
  poster: "/images/about-banner-poster.jpg",
};

/**
 * Walkthrough video of the dining room (public/restaurant).
 *
 * ⚠️ This is the original 4K upload — roughly 22 MB. It is deliberately wired
 * up as click-to-play with `preload="none"` and a still poster, so a visitor
 * only downloads it if they ask for it. Do NOT move it into an autoplaying
 * banner until a compressed 1080p `-web.mp4` exists alongside it, the way
 * banner.mp4 / banner-web.mp4 are paired in public/images.
 */
export const tourVideo = {
  src: "/restaurant/13476222_3840_2160_25fps.mp4",
  poster: "/restaurant/pexels-ansar-muhammad-380085065-27626762.jpg",
};

/** Real interior photography of the dining room (public/restaurant). */
export const restaurantPhotos = {
  aisle: {
    src: "/restaurant/pexels-ansar-muhammad-380085065-27626762.jpg",
    alt: "View down the centre aisle of the dining room towards a brick archway framed with greenery",
  },
  floor: {
    src: "/restaurant/pexels-ansar-muhammad-380085065-27626757.jpg",
    alt: "Wide view of the dining room with sculpted ceiling panels, dome pendant lights, and leather booths along the windows",
  },
  laid: {
    src: "/restaurant/pexels-ansar-muhammad-380085065-27626758.jpg",
    alt: "Dining room tables laid with glassware and linen beside a lit dessert display case",
  },
  windows: {
    src: "/restaurant/pexels-ansar-muhammad-380085065-27626759.jpg",
    alt: "Rows of set tables under dome pendant lights beside a full-height window wall at night",
  },
  banquet: {
    src: "/restaurant/pexels-ansar-muhammad-380085065-27626761.jpg",
    alt: "A long banquet table set for a large group beneath the sculpted ceiling",
  },
  daytime: {
    src: "/restaurant/pexels-dpsinghbhullar-34252330.jpg",
    alt: "Bright daytime dining area with glass-top tables, wooden chairs, and a service counter at the back",
  },
} as const;

/** Real dining/food photography used for atmosphere sections (gallery, why-choose-us, locations). */
export const galleryPhotos = [
  {
    src: "/images/dessert7.jpg",
    alt: "Layered dessert with caramel drizzle and fresh berries",
  },
  {
    src: "/images/pexels-lpfstudio023-31771054.jpg",
    alt: "Chef-plated grilled platter with citrus and pomegranate garnish",
  },
  {
    src: "/images/pexels-neosiam-4985619.jpg",
    alt: "Rustic bread and charcuterie board",
  },
  {
    src: "/images/pexels-karan-mridha-17124288-32825910.jpg",
    alt: "Sauce being poured over a rice dish in a copper bowl",
  },
  {
    src: "/images/image.jpg",
    alt: "Elegant plated dinner course",
  },
  {
    src: "/images/pexels-shootsaga-36701461.jpg",
    alt: "Overhead view of a restaurant terrace with a plated dish",
  },
  {
    src: "/images/pexels-ahmetcotur-27626188.jpg",
    alt: "Elegant mezze spread laid out on a dining table",
  },
  {
    src: "/images/pexels-amine-kubranur-cakiroglu-689611212-38935439.jpg",
    alt: "Outdoor patio table set for dinner",
  },
  {
    src: "/images/pexels-ali-dashti-506667798-24206918.jpg",
    alt: "Server ladling a rice dish from a copper pot",
  },
  {
    src: "/images/pexels-ogutomacedo-18273978.jpg",
    alt: "Golden baked appetizer bites fresh from the kitchen",
  },
] as const;

/** Real photography used on the About page (kitchen action, spreads, ambiance). */
export const aboutPhotos = {
  kitchenAction: {
    src: "/images/pexels-madknoxxdeluxe-37923406.jpg",
    alt: "Chef searing a dish over an open flame",
  },
  spread: {
    src: "/images/pexels-saveurssecretes-10219670.jpg",
    alt: "Overhead spread of shared plates and rice dishes",
  },
  patio: {
    src: "/images/pexels-amine-kubranur-cakiroglu-689611212-38935439.jpg",
    alt: "Outdoor dining patio set for the evening",
  },
  pour: {
    src: "/images/pexels-ali-dashti-506667798-24206918.jpg",
    alt: "Server plating a rice dish tableside from a copper pot",
  },
  platter: {
    src: "/images/pexels-lpfstudio023-31771054.jpg",
    alt: "Signature grilled platter finished with citrus and pomegranate",
  },
  bites: {
    src: "/images/pexels-aayushrawat-8414643.jpg",
    alt: "Plated starter bites garnished tableside",
  },
  grill: {
    src: "/images/pexels-srijit-mudi-31301853-38464140.jpg",
    alt: "Sizzling skillet of chilli chicken and fried drumsticks on a laid table",
  },
  prep: {
    src: "/images/pexels-djvvadi-7160695.jpg",
    alt: "Bowl of spice-crusted cubes tossed with cabbage and cherry tomatoes",
  },
  service: {
    src: "/images/pexels-newman-photographs-234743505-31970812.jpg",
    alt: "Catering table laid with canapés, a charcuterie board, and dips",
  },
  sides: {
    src: "/images/pexels-kunal-lakhotia-781256899-34452171.jpg",
    alt: "Club sandwich quarters on a black plate beside a latte",
  },
  sweet: {
    src: "/images/pexels-nandamends-18301848.jpg",
    alt: "Slice of chocolate sponge cake on a dark plate with a spoon",
  },
} as const;

/**
 * The dining room's theme, as described by the owner — the interior is dressed
 * like a Hollywood Western film set, the floor staff are in costume, and there
 * is a country soundtrack running.
 *
 * These are real details about the restaurant, unlike the written-for-the-page
 * block below. Keep them on this side of that line.
 */
export const ambiance = [
  {
    key: "set",
    title: "The Set",
    text: "The room is dressed like a Hollywood Western film set. Coiled rope, metal horse saddles and cowboy belts hang along the walls, alongside vintage ammunition — unloaded, and fixed in place as display.",
  },
  {
    key: "cast",
    title: "The Cast",
    text: "The floor staff are in costume too: khakis, checkered shirts, and a cowboy hat each. You get a “Howdy” on the way in, and it is meant.",
  },
  {
    key: "score",
    title: "The Score",
    text: "Country plays steadily under all of it. Loud enough to set the room, quiet enough that the table next to you is still having its own conversation.",
  },
] as const;

/* ------------------------------------------------------------------------ *
 * ⚠️  UNVERIFIED COPY — REVIEW BEFORE PUBLISHING
 *
 * Everything below this line is written page copy, not sourced fact. Public
 * listings (TripAdvisor et al.) do not state a founding year, milestone
 * dates, ownership, staff counts, or any food-safety certification for this
 * restaurant, so the values here are placeholders that read plausibly for a
 * demo build. Replace them with the real details — especially `foundedYear`,
 * the `milestones` dates, and anything in `hygienePledges` — before this
 * goes anywhere a customer can read it. Deliberately avoided: named third-
 * party certifications (HACCP, ISO, municipal grades) and named staff, since
 * inventing those would be a false claim rather than marketing copy.
 * ------------------------------------------------------------------------ */

/**
 * ⚠️ PLACEHOLDER — this is NOT a real phone number. It's wired to the
 * floating "Book a Table" hub so the flow can be demoed, and the 0000000
 * subscriber part is deliberately un-dialable so nobody reaches a stranger.
 * Replace both fields with the real booking line before publishing.
 * (`restaurantInfo.phone` above is the publicly listed number and is left
 * alone — swap this one, or point it at that, whichever you want callers to
 * reach.)
 */
export const bookingPhone = {
  display: "+92 300 0000000",
  href: "tel:+923000000000",
};

export const heritage = {
  foundedYear: 2011,
  /** Rendered as "Est. 2011" badges and "since 2011" copy across the About page. */
  establishedLabel: "Est. 2011",
  openingLine:
    "One grill, eight tables, and a conviction that a steak should never meet a freezer.",
};

export const milestones = [
  {
    year: "2011",
    title: "The First Grill",
    text: "Texas Steak House opens on Adamjee Road in Saddar with a single charcoal grill, eight tables, and a short menu built entirely around fire-cooked beef.",
    photo: aboutPhotos.kitchenAction,
  },
  {
    year: "2014",
    title: "The Texas Fire Steak",
    text: "Our house spice rub is finalised after three years of tinkering. The Texas Fire Steak goes on the menu and quietly becomes the dish regulars order without looking.",
    photo: aboutPhotos.platter,
  },
  {
    year: "2017",
    title: "The Room Gets Dressed",
    text: "The Saddar branch is fitted out as a Western film set — rope, saddles, belts and cased vintage ammunition go up on the walls, and the floor staff get their hats. The steak never changed; the room around it did.",
    photo: aboutPhotos.service,
  },
  {
    year: "2020",
    title: "Delivery, Done Properly",
    text: "Rather than hand our food to anyone with a bike, we build our own packing standard — sealed, heat-held, and checked — so a delivered steak arrives the way it left the grill.",
    photo: aboutPhotos.sides,
  },
  {
    year: "2023",
    title: "Islamabad",
    text: "A second kitchen opens at Shaheen Market, E-7 — same recipes, same grill discipline, same spice rub measured to the gram.",
    photo: aboutPhotos.spread,
  },
] as const;

export const missionVision = {
  mission: {
    title: "Our Mission",
    text: "To serve Rawalpindi and Islamabad the most honest steak in the city — cooked fresh over open fire, priced fairly, and served in a room where families feel comfortable staying for a second round of dessert.",
    points: [
      "Cook every order from raw, to order, over real flame",
      "Buy the best cut available that day, not the cheapest",
      "Charge a price we would be happy to pay ourselves",
    ],
    photo: {
      src: "/images/pexels-pexels-user-1368186290-25884474.jpg",
      alt: "Chicken cooking down in a black iron pan with green chilli and coriander",
    },
  },
  vision: {
    title: "Our Vision",
    text: "To be the name people give when a visitor asks where to eat in Rawalpindi — a steakhouse that competes on craft rather than discounts, and that trains the next generation of grill cooks in the twin cities.",
    points: [
      "Grow only as fast as we can train grill cooks properly",
      "Keep both kitchens indistinguishable in taste and standard",
      "Keep the theme a welcome, never a gimmick",
    ],
    photo: {
      src: "/images/pexels-saveurssecretes-5410401.jpg",
      alt: "Large sharing pan of spiced rice and meat surrounded by raita, chutney, and salad",
    },
  },
} as const;

export const hygienePledges = [
  {
    title: "The Props Get Cleaned Too",
    text: "Rope, saddles, belts and cased ammunition are dusted and wiped down on a set rota. A themed room collects more surfaces, so it takes more cleaning, not less.",
  },
  {
    title: "Daily Deep Clean",
    text: "Grills, extraction hoods, prep surfaces, and floors are stripped down and sanitised at close every night — not weekly, not when an inspection is due.",
  },
  {
    title: "Separate Prep Zones",
    text: "Raw beef, poultry, and vegetables each get their own boards, knives, and section of the line. Nothing crosses over, ever.",
  },
  {
    title: "Temperature Discipline",
    text: "Chillers are logged morning and night, and cooked meat is probed before it leaves the pass. Anything outside range is thrown, not served.",
  },
  {
    title: "Gloves, Aprons, Hand Stations",
    text: "Dedicated hand-wash stations on the line, gloves changed between tasks, and fresh aprons per shift for every cook on the grill.",
  },
  {
    title: "Sealed for Delivery",
    text: "Every delivery order leaves tamper-sealed and heat-held, with the packing cook's initials on the ticket so any issue traces back to a person.",
  },
] as const;

export const sourcingPledges = [
  {
    title: "Beef",
    text: "Sourced from a small set of trusted local suppliers and butchered in-house. Cuts are hand-trimmed daily — we never carry frozen steak.",
  },
  {
    title: "Produce",
    text: "Vegetables and salad greens come in fresh each morning from the Rawalpindi market and are prepped the same day they arrive.",
  },
  {
    title: "Spice & Sauce",
    text: "Our rubs, chili, and house sauces are blended in our own kitchen from whole spices — no pre-mixed bases, no bought-in gravy.",
  },
  {
    title: "Bread & Dessert",
    text: "Burger buns, garlic bread, and desserts are baked in small batches through the day rather than stocked ahead.",
  },
] as const;

export const aboutFaqs = [
  {
    q: "How long has Texas Steak House been open?",
    a: `We opened in ${heritage.foundedYear} in Saddar, Rawalpindi, and added our E-7 Islamabad kitchen in 2023.`,
  },
  {
    q: "Is the meat halal?",
    a: "Yes. All meat is sourced from halal suppliers and prepared in a halal kitchen. No pork or alcohol is used anywhere on the premises.",
  },
  {
    q: "Do you have vegetarian options?",
    a: "We do — nachos, garlic bread, the harvest salad, and our desserts are all vegetarian, and they're prepped on separate boards from the meat line.",
  },
  {
    q: "Is the ammunition on the walls real?",
    a: "It's genuine vintage casing, and it is completely unloaded and fixed in place as display. It's set dressing, the same as the rope and the saddles.",
  },
  {
    q: "Is the Western theme a kids' thing?",
    a: "It's a steakhouse first — the room is dressed, not a costume party. Children tend to love the hats and the saddles, but it's a normal dinner for everyone else.",
  },
  {
    q: "Do you take large bookings?",
    a: "Yes. Family gatherings and group dinners are welcome — book a table through the site and add your party size, or call the Saddar branch directly.",
  },
] as const;

/**
 * Homepage autoplaying carousel. Each slide is a real dish from the menu
 * (see `src/lib/data.ts`), paired with its own photo and a short line of
 * written copy overlaid on the image.
 */
export const dishCarouselSlides = [
  {
    kicker: "The Signature",
    title: "Texas Fire Steak",
    text: "Fresh, never frozen, finished with our house smoke rub and sent out straight off the flame.",
    price: 2200,
    src: "/images/pexels-madknoxxdeluxe-37923406.jpg",
    alt: "Steak searing over an open flame in the kitchen",
    href: "/menu",
  },
  {
    kicker: "Hand-Cut Classic",
    title: "New York Strip",
    text: "A proper strip steak, trimmed in-house each morning and char-grilled exactly to your liking.",
    price: 2600,
    src: "/images/pexels-lunajoie-19285833.jpg",
    alt: "Char-grilled strip steak plated with sides",
    href: "/menu",
  },
  {
    kicker: "Best of Both",
    title: "Twin Steak Combo",
    text: "Beef and chicken steak on one plate with grilled vegetables — the order to settle an argument.",
    price: 2400,
    src: "/images/pexels-nosh-caterers-2148640437-30203310.jpg",
    alt: "Platter of beef and chicken steak with grilled vegetables",
    href: "/menu",
  },
  {
    kicker: "Fan Favourite",
    title: "Texas Chili Burger",
    text: "A hearty beef patty under spiced chili and melted cheese, stacked in a house-baked bun.",
    price: 950,
    src: "/images/pexels-abdelilah-hibat-allah-1652683667-33408979.jpg",
    alt: "Loaded beef burger with chili and melted cheese",
    href: "/menu",
  },
  {
    kicker: "Straight From The Pan",
    title: "Iron Skillet Steak",
    text: "Served sizzling in the skillet with sautéed onions — you'll hear it arrive before you see it.",
    price: 2100,
    src: "/images/pexels-drmkhawarnazir-34193415.jpg",
    alt: "Steak served sizzling in a cast-iron skillet with onions",
    href: "/menu",
  },
  {
    kicker: "Lighter Plate",
    title: "Black & Blue Sirloin Salad",
    text: "Blackened sirloin strips over crisp greens with a blue cheese crumble.",
    price: 1450,
    src: "/images/pexels-kamrujjamanjewel-24866519.jpg",
    alt: "Sirloin strips over a fresh green salad with cheese crumble",
    href: "/menu",
  },
  {
    kicker: "To Start",
    title: "Loaded Nachos",
    text: "Crisp tortilla chips piled with melted cheese, jalapeños, salsa, and sour cream.",
    price: 650,
    src: "/images/pexels-himanuuu-36989884.jpg",
    alt: "Tortilla chips loaded with melted cheese and jalapeños",
    href: "/menu",
  },
  {
    kicker: "Save Room",
    title: "New York Cheesecake",
    text: "Rich and creamy on a buttery biscuit base, baked in small batches through the day.",
    price: 480,
    src: "/images/dessert5.jpg",
    alt: "Slice of New York cheesecake on a plate",
    href: "/menu",
  },
] as const;

/**
 * Second homepage carousel — the room itself, shot at our own tables, rather
 * than the food. Same component as the dish carousel, no prices.
 */
export const roomCarouselSlides = [
  {
    kicker: "Walk In",
    title: "The Long View",
    text: "Straight down the middle of the room to the brick arch at the back — the seat everyone asks for once they've seen it.",
    ...restaurantPhotos.aisle,
    href: "/book-table",
  },
  {
    kicker: "The Main Floor",
    title: "Room to Breathe",
    text: "Sculpted ceiling panels, warm dome lighting, and deep leather booths along the window wall. Space between tables, so a conversation stays yours.",
    ...restaurantPhotos.floor,
    href: "/book-table",
  },
  {
    kicker: "Ready Before You Arrive",
    title: "Every Table Laid",
    text: "Glassware polished, linen pressed, and the dessert case stocked — the floor is reset between every single booking.",
    ...restaurantPhotos.laid,
    href: "/book-table",
  },
  {
    kicker: "After Dark",
    title: "Window Seats",
    text: "The full-height glass runs the length of the room, so the evening outside becomes part of dinner inside.",
    ...restaurantPhotos.windows,
    href: "/book-table",
  },
  {
    kicker: "Bring Everyone",
    title: "Tables for Ten",
    text: "Family dinners, birthdays, and office nights — we join the long tables and set them properly for the whole group.",
    ...restaurantPhotos.banquet,
    href: "/book-table",
  },
  {
    kicker: "Open From 9 AM",
    title: "Daylight Hours",
    text: "The room works just as well over a quiet lunch as it does for a full evening service.",
    ...restaurantPhotos.daytime,
    href: "/book-table",
  },
] as const;
