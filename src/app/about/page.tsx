import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { restaurantInfo, aboutPhotos, aboutHeroVideo } from "@/lib/restaurant";
import { FlameIcon, LeafIcon, TrophyIcon, PinIcon, ClockIcon, PhoneIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: `About Us | ${restaurantInfo.name}`,
  description: `The story, the fire, and the people behind ${restaurantInfo.name} in Saddar, Rawalpindi.`,
};

const values = [
  {
    icon: FlameIcon,
    title: "Fire First",
    text: "Every steak, kebab, and skillet leaves an open flame, not a microwave. It's slower, but it's the whole point.",
  },
  {
    icon: LeafIcon,
    title: "Fresh, Never Frozen",
    text: "Cuts and produce are sourced and prepped daily — nothing sits in a freezer waiting for an order.",
  },
  {
    icon: TrophyIcon,
    title: "Earned Reputation",
    text: `${restaurantInfo.ranking} on TripAdvisor, built one plate at a time — not by accident.`,
  },
];

const timeline = [
  {
    step: "The Fire",
    text: "It starts with an open flame. No shortcuts, no par-cooked trays — every order is grilled fresh from raw.",
  },
  {
    step: "The Craft",
    text: "Hand-cut steaks, house spice rubs, and made-to-order sides. If it can be made in-house, it is.",
  },
  {
    step: "The Table",
    text: "Whether you're dining in, picking up, or having it delivered, the goal is the same plate, the same standard.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative -mt-20 flex h-[70vh] min-h-[440px] w-full items-end overflow-hidden border-b border-border">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={aboutHeroVideo.poster}
        >
          <source src={aboutHeroVideo.src} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-black/60 to-black/40" />
        <div className="animate-hero relative z-10 mx-auto w-full max-w-6xl px-4 pb-14 pt-20 sm:px-6">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-soft backdrop-blur-sm">
            <FlameIcon className="animate-flame h-3.5 w-3.5" />
            Our Story
          </span>
          <h1 className="max-w-2xl font-display text-4xl font-bold leading-[1.1] text-cream drop-shadow-lg sm:text-5xl">
            Cooked over fire, served with pride.
          </h1>
          <p className="mt-4 max-w-xl text-cream/85">
            From a single grill in Saddar, Rawalpindi to{" "}
            {restaurantInfo.ranking.toLowerCase()} — {restaurantInfo.name} has
            earned its name one fire-grilled steak at a time.
          </p>
        </div>
      </section>

      {/* Intro copy + photo */}
      <section className="reveal mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            Who We Are
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold text-cream sm:text-3xl">
            A steakhouse built around the grill, not the menu
          </h2>
          <p className="mt-4 text-muted">
            {restaurantInfo.name} is an American-style steakhouse in the heart
            of Saddar, Rawalpindi, built on one simple idea: cook everything
            fresh, over real fire, and never cut corners to save time. That
            philosophy is why regulars keep coming back for the Texas Fire
            Steak, and why we&apos;ve earned {restaurantInfo.ranking.toLowerCase()}{" "}
            on TripAdvisor with a {restaurantInfo.rating.toFixed(1)}-star
            average across {restaurantInfo.reviewCount}+ reviews.
          </p>
          <p className="mt-4 text-muted">
            Today you&apos;ll find us at two locations — our original Saddar
            branch and our second home in E-7, Islamabad — serving the same
            fire-grilled steaks, burgers, and Texas classics for dine-in,
            pickup, and delivery.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/menu"
              className="rounded-lg bg-ember px-6 py-3 font-semibold text-cream shadow-lg shadow-ember/20 transition hover:scale-105 hover:bg-ember-soft active:scale-95"
            >
              Explore the Menu
            </Link>
            <Link
              href="/book-table"
              className="rounded-lg border border-border-strong px-6 py-3 font-semibold text-cream transition hover:scale-105 hover:bg-surface active:scale-95"
            >
              Book a Table
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border">
          <Image
            src={aboutPhotos.pour.src}
            alt={aboutPhotos.pour.alt}
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Values */}
      <section className="reveal border-y border-border bg-bg-elevated py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              What We Stand For
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-cream sm:text-3xl">
              The Standards Behind Every Plate
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-semibold text-cream">
                  {v.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* From Fire to Table timeline */}
      <section className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            How We Cook
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold text-cream sm:text-3xl">
            From Fire to Table
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {timeline.map((t, i) => (
            <div key={t.step} className="relative rounded-2xl border border-border bg-surface p-6">
              <span className="font-display text-4xl font-bold text-gold/25">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-display text-lg font-semibold text-cream">
                {t.step}
              </h3>
              <p className="mt-1.5 text-sm text-muted">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Photo strip */}
      <section className="reveal border-y border-border bg-bg-elevated py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              Around the Restaurant
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-cream sm:text-3xl">
              The Room, The Kitchen, The Table
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {[aboutPhotos.platter, aboutPhotos.spread, aboutPhotos.patio, aboutPhotos.bites].map(
              (photo) => (
                <div
                  key={photo.src}
                  className="relative aspect-[3/4] overflow-hidden rounded-xl border border-border"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover transition duration-500 hover:scale-105"
                  />
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Visit CTA */}
      <section className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 rounded-2xl border border-border bg-surface p-8 sm:p-10 md:grid-cols-2 md:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              Come See Us
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-cream sm:text-3xl">
              Saddar, Rawalpindi
            </h2>
            <div className="mt-4 flex flex-col gap-2.5 text-sm">
              <div className="flex items-start gap-3">
                <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <p className="text-cream">{restaurantInfo.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <ClockIcon className="h-5 w-5 shrink-0 text-gold" />
                <p className="text-cream">{restaurantInfo.hours}</p>
              </div>
              <div className="flex items-center gap-3">
                <PhoneIcon className="h-5 w-5 shrink-0 text-gold" />
                <a href={`tel:${restaurantInfo.phone}`} className="text-cream hover:text-gold-soft">
                  {restaurantInfo.phone}
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 md:justify-end">
            <Link
              href="/book-table"
              className="rounded-lg bg-ember px-6 py-3 font-semibold text-cream shadow-lg shadow-ember/20 transition hover:scale-105 hover:bg-ember-soft active:scale-95"
            >
              Book a Table
            </Link>
            <Link
              href="/menu"
              className="rounded-lg border border-border-strong px-6 py-3 font-semibold text-cream transition hover:scale-105 hover:bg-bg-elevated active:scale-95"
            >
              Order Online
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
