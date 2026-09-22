import Link from "next/link";
import Image from "next/image";
import { menuItems } from "@/lib/data";
import {
  restaurantInfo,
  heroVideo,
  ctaVideo,
  galleryPhotos,
  aboutPhotos,
  dishCarouselSlides,
  roomCarouselSlides,
  heritage,
  locations,
} from "@/lib/restaurant";
import MenuItemCard from "@/components/MenuItemCard";
import StatCounter from "@/components/StatCounter";
import DishCarousel from "@/components/DishCarousel";
import {
  StarIcon,
  PinIcon,
  ClockIcon,
  PhoneIcon,
  FlameIcon,
  LeafIcon,
  BoltIcon,
  TrophyIcon,
} from "@/components/icons";

const howItWorks = [
  {
    step: "01",
    title: "Browse & Choose",
    text: "Pick your fire-grilled favorites from the full menu, or let our Signature Dishes point the way.",
  },
  {
    step: "02",
    title: "Order or Reserve",
    text: "Send it straight to the kitchen for delivery or pickup, or book a table for the full dine-in experience.",
  },
  {
    step: "03",
    title: "Fresh Off the Fire",
    text: "Everything is grilled fresh to order — nothing pre-cooked, nothing frozen, ever.",
  },
];

const whyChooseUs = [
  {
    icon: FlameIcon,
    title: "Fire-Grilled, Never Frozen",
    text: "Every steak is grilled fresh to order over an open flame.",
  },
  {
    icon: LeafIcon,
    title: "Fresh Ingredients",
    text: "Quality cuts and produce, prepared fresh in-house daily.",
  },
  {
    icon: BoltIcon,
    title: "Fast Delivery & Pickup",
    text: "Order online and get it delivered hot, or grab it on the way.",
  },
  {
    icon: TrophyIcon,
    title: "Top-Rated in Rawalpindi",
    text: `${restaurantInfo.ranking}, per TripAdvisor.`,
  },
];

export default function Home() {
  const popularItems = menuItems.filter((item) => item.isPopular).slice(0, 4);

  return (
    <div>
      {/* Hero — full-bleed video banner */}
      <section className="relative -mt-20 flex h-[94vh] min-h-150 w-full items-center overflow-hidden border-b border-border">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={heroVideo.poster}
        >
          <source src={heroVideo.src} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-linear-to-t from-bg via-black/55 to-black/60" />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/20 to-transparent" />

        <div className="animate-hero relative z-10 mx-auto w-full max-w-6xl px-4 pt-20 sm:px-6">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-soft backdrop-blur-sm">
            <FlameIcon className="animate-flame h-3.5 w-3.5" />
            Fire-Grilled Since Rawalpindi&apos;s Sadar
          </span>
          <h1 className="max-w-2xl font-display text-4xl font-bold leading-[1.1] text-cream drop-shadow-lg sm:text-6xl">
            Bold steaks.
            <br />
            <span className="text-gradient-gold">Texas-sized flavor.</span>
          </h1>
          <p className="mt-5 max-w-md text-cream/85 drop-shadow">
            Fresh, never-frozen steaks fire-grilled to order at{" "}
            {restaurantInfo.name}, Saddar, Rawalpindi. Order online for
            delivery or pickup, or reserve your table for the full
            experience.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-gold-soft">
              <StarIcon className="h-4 w-4" />
              <StarIcon className="h-4 w-4" />
              <StarIcon className="h-4 w-4" />
              <StarIcon className="h-4 w-4" />
              <StarIcon className="h-4 w-4 opacity-40" />
              <span className="ml-1 font-semibold text-cream">
                {restaurantInfo.rating.toFixed(1)}
              </span>
            </span>
            <span className="text-cream/70">
              {restaurantInfo.reviewCount} reviews · {restaurantInfo.ranking}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/menu"
              className="rounded-lg bg-ember px-6 py-3 font-semibold text-cream shadow-lg shadow-ember/30 transition hover:scale-105 hover:bg-ember-soft active:scale-95"
            >
              Order Now
            </Link>
            <Link
              href="/book-table"
              className="rounded-lg border border-cream/40 bg-black/20 px-6 py-3 font-semibold text-cream backdrop-blur-sm transition hover:scale-105 hover:bg-black/40 active:scale-95"
            >
              Book a Table
            </Link>
          </div>
        </div>

        <div className="animate-scroll-cue absolute inset-x-0 bottom-6 z-10 flex justify-center">
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6 text-cream/70"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 4v14" />
            <path d="M6 13l6 6 6-6" />
          </svg>
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-b border-border bg-bg-elevated">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4">
          {[
            {
              value: restaurantInfo.rating,
              decimals: 1,
              suffix: "★",
              label: "TripAdvisor Rating",
            },
            {
              value: restaurantInfo.reviewCount,
              suffix: "+",
              label: "Customer Reviews",
            },
            { value: 4, prefix: "#", label: "Of 118 in Rawalpindi" },
            { value: 2, label: "Locations" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-2xl font-bold text-gold-soft sm:text-3xl">
                <StatCounter
                  value={stat.value}
                  decimals={stat.decimals}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </p>
              <p className="mt-1 text-xs text-muted sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Autoplaying dish carousel */}
      <section className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            Straight Off The Grill
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold text-cream sm:text-3xl">
            What We&apos;re Known For
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            Eight of the plates that keep Saddar coming back. Hover to pause,
            or use the arrows to take your time.
          </p>
        </div>
        <DishCarousel slides={dishCarouselSlides} />
      </section>

      {/* Why choose us */}
      <section className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            Why Texas Steak House
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold text-cream sm:text-3xl">
            Made for Steak Lovers
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-semibold text-cream">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story teaser */}
      <section className="reveal border-b border-border py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2 md:items-center">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border md:order-2">
            <Image
              src={aboutPhotos.platter.src}
              alt={aboutPhotos.platter.alt}
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="md:order-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              Our Story
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-cream sm:text-3xl">
              Built Around the Grill
            </h2>
            <p className="mt-4 text-muted">
              {restaurantInfo.name} opened in {heritage.foundedYear} with one
              idea: cook everything fresh, over real fire, and never take
              shortcuts. That&apos;s still the standard today across both our
              Saddar and E-7 locations — hand-cut steaks, made-to-order sides,
              and nothing pulled from a freezer.
            </p>
            <Link
              href="/about"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-soft hover:underline"
            >
              Read our full story →
            </Link>
          </div>
        </div>
      </section>

      {/* Room carousel */}
      <section className="reveal border-b border-border bg-bg-elevated py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              Step Inside
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-cream sm:text-3xl">
              The Room You&apos;ll Be Eating In
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
              Photographed at our own tables — no stock shots, no renders.
            </p>
          </div>
          <DishCarousel
            slides={roomCarouselSlides}
            label="Inside the restaurant"
            ctaLabel="Book a Table"
            interval={6000}
          />
        </div>
      </section>

      {/* Gallery */}
      <section className="reveal border-y border-border bg-bg-elevated py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              A Taste of the Room
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-cream sm:text-3xl">
              Behind the Flame
            </h2>
          </div>
          <div className="grid grid-cols-2 auto-rows-32.5 gap-3 sm:auto-rows-37.5 sm:gap-4 md:grid-cols-4 md:auto-rows-42.5">
            {galleryPhotos.map((photo, i) => (
              <div
                key={photo.src}
                className={`relative overflow-hidden rounded-xl border border-border ${
                  i === 0
                    ? "col-span-2 row-span-2"
                    : i === 5
                      ? "col-span-2 md:col-span-4"
                      : ""
                }`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 50vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            Getting Your Food
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold text-cream sm:text-3xl">
            How It Works
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {howItWorks.map((step) => (
            <div
              key={step.step}
              className="relative rounded-2xl border border-border bg-surface p-6"
            >
              <span className="font-display text-4xl font-bold text-gold/25">
                {step.step}
              </span>
              <h3 className="mt-2 font-display text-lg font-semibold text-cream">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Signature dishes */}
      <section className="reveal border-y border-border bg-bg-elevated py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                Fan Favorites
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold text-cream sm:text-3xl">
                Signature Dishes
              </h2>
            </div>
            <Link
              href="/menu"
              className="text-sm font-semibold text-gold-soft hover:underline"
            >
              View full menu →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popularItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="reveal relative flex min-h-90 items-center overflow-hidden border-b border-border">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={ctaVideo.poster}
        >
          <source src={ctaVideo.src} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-linear-to-t from-bg via-black/70 to-black/50" />
        <div className="relative z-10 mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-soft backdrop-blur-sm">
            <FlameIcon className="animate-flame h-3.5 w-3.5" />
            Table for Two? Table for Ten?
          </span>
          <h2 className="font-display text-3xl font-bold text-cream drop-shadow-lg sm:text-4xl">
            Reserve your table, or skip the wait and order in.
          </h2>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link
              href="/book-table"
              className="rounded-lg bg-ember px-6 py-3 font-semibold text-cream shadow-lg shadow-ember/30 transition hover:scale-105 hover:bg-ember-soft active:scale-95"
            >
              Book a Table
            </Link>
            <Link
              href="/menu"
              className="rounded-lg border border-cream/40 bg-black/20 px-6 py-3 font-semibold text-cream backdrop-blur-sm transition hover:scale-105 hover:bg-black/40 active:scale-95"
            >
              Order Online
            </Link>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            Visit Us
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold text-cream sm:text-3xl">
            Our Locations
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {locations.map((loc) => (
            <div
              key={loc.label}
              className="flex flex-col rounded-2xl border border-border bg-surface p-6 sm:p-8"
            >
              <h3 className="font-display text-xl font-semibold text-cream">
                {loc.label}
              </h3>
              <div className="mt-4 flex flex-col gap-3 text-sm">
                <div className="flex items-start gap-3">
                  <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <p className="text-cream">{loc.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <ClockIcon className="h-5 w-5 shrink-0 text-gold" />
                  <p className="text-cream">{loc.hours}</p>
                </div>
                {loc.phone && (
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="h-5 w-5 shrink-0 text-gold" />
                    <a
                      href={`tel:${loc.phone}`}
                      className="text-cream hover:text-gold-soft"
                    >
                      {loc.phone}
                    </a>
                  </div>
                )}
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  loc.query
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-fit rounded-lg border border-border-strong px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-bg-elevated"
              >
                Get Directions
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
