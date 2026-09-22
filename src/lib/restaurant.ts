// Real, publicly-sourced facts about the restaurant (TripAdvisor + other
// public restaurant listings). Prices in the menu are indicative estimates
// for this demo — actual menu items were confirmed, but public prices were
// not available, so contact the restaurant to confirm current pricing.

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
} as const;
