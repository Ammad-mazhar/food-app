import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  restaurantInfo,
  aboutPhotos,
  aboutHeroVideo,
  heritage,
  milestones,
  missionVision,
  hygienePledges,
  sourcingPledges,
  aboutFaqs,
  restaurantPhotos,
  tourVideo,
  ambiance,
} from "@/lib/restaurant";
import VideoShowcase from "@/components/VideoShowcase";
import {
  FlameIcon,
  LeafIcon,
  TrophyIcon,
  PinIcon,
  ClockIcon,
  PhoneIcon,
  ShieldCheckIcon,
  CheckIcon,
  TargetIcon,
  EyeIcon,
  UsersIcon,
  DropletIcon,
  ThermometerIcon,
  SparkleIcon,
  LassoIcon,
  HatIcon,
  MusicIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: `About Us | ${restaurantInfo.name}`,
  description: `The story since ${heritage.foundedYear}, our mission and vision, and the hygiene standards behind every plate at ${restaurantInfo.name} in Saddar, Rawalpindi.`,
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

/** Keyed to the `ambiance` entries in src/lib/restaurant.ts. */
const ambianceIcons = {
  set: LassoIcon,
  cast: HatIcon,
  score: MusicIcon,
} as const;

/* Icons are paired to the hygiene pledges by position — see `hygienePledges`
   in src/lib/restaurant.ts. */
const hygieneIcons = [
  EyeIcon,
  DropletIcon,
  UsersIcon,
  ThermometerIcon,
  ShieldCheckIcon,
  CheckIcon,
];

const atAGlance = [
  { label: "Established", value: heritage.foundedYear },
  { label: "Kitchens", value: "2" },
  { label: "TripAdvisor", value: `${restaurantInfo.rating.toFixed(1)} ★` },
  { label: "Guest Reviews", value: `${restaurantInfo.reviewCount}+` },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative -mt-20 flex h-[70vh] min-h-110 w-full items-end overflow-hidden border-b border-border">
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
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/55 to-black/45" />
        <div className="animate-hero relative z-10 mx-auto w-full max-w-6xl px-4 pb-14 pt-20 sm:px-6">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-soft backdrop-blur-sm">
            <FlameIcon className="animate-flame h-3.5 w-3.5" />
            Our Story · {heritage.establishedLabel}
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

      {/* At a glance */}
      <div className="border-b border-border bg-bg-elevated">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4">
          {atAGlance.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-2xl font-bold text-gold-soft sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-muted sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Intro copy + photo */}
      <section className="reveal mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            Who We Are
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
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
            We opened in {heritage.foundedYear}. {heritage.openingLine} In the
            years since, the menu has grown and the room has changed twice, but
            the rule on the line hasn&apos;t moved: if it can be made in-house,
            it is, and if it can&apos;t be cooked properly, it doesn&apos;t go
            out.
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
              className="rounded-lg border border-border-strong px-6 py-3 font-semibold text-ink transition hover:scale-105 hover:bg-surface active:scale-95"
            >
              Book a Table
            </Link>
          </div>
        </div>
        <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl border border-border">
          <Image
            src={aboutPhotos.pour.src}
            alt={aboutPhotos.pour.alt}
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* The room: set, cast, score */}
      <section className="reveal border-y border-border bg-bg-elevated py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
              Dinner on a Western set
            </h2>
            <p className="mt-4 text-muted">
              The steak is the reason to come. The room is the reason people
              bring their cousins. We dressed the Saddar branch like a
              Hollywood Western — and then committed to it properly, down to
              what the waiters are wearing and what&apos;s playing while you
              eat.
            </p>
          </div>

          <div className="rule-rope my-10" />

          <div className="grid gap-10 sm:grid-cols-3">
            {ambiance.map((part) => {
              const Icon = ambianceIcons[part.key];
              return (
                <div key={part.key}>
                  <Icon className="h-7 w-7 text-rope" />
                  <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                    {part.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {part.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="reveal border-y border-border bg-bg-elevated py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              Since {heritage.foundedYear}
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
              How We Got Here
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted">
              Fifteen years, two kitchens, and one spice rub we still refuse to
              write down for anyone outside the family.
            </p>
          </div>

          <div className="flex flex-col gap-10 md:gap-14">
            {milestones.map((m, i) => (
              <div
                key={m.year}
                className="grid gap-6 md:grid-cols-2 md:items-center md:gap-10"
              >
                <div
                  className={`relative aspect-16/10 w-full overflow-hidden rounded-2xl border border-border ${
                    i % 2 === 1 ? "md:order-2" : ""
                  }`}
                >
                  <Image
                    src={m.photo.src}
                    alt={m.photo.alt}
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="object-cover transition duration-700 hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full border border-gold/40 bg-black/60 px-3 py-1 font-display text-sm font-bold text-gold-soft backdrop-blur-sm">
                    {m.year}
                  </span>
                </div>
                <div className={i % 2 === 1 ? "md:order-1" : ""}>
                  <span className="font-display text-5xl font-bold text-gold/20">
                    {m.year}
                  </span>
                  <h3 className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl">
                    {m.title}
                  </h3>
                  <p className="mt-3 text-muted">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            Where We&apos;re Headed
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
            Mission &amp; Vision
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { ...missionVision.mission, icon: TargetIcon },
            { ...missionVision.vision, icon: EyeIcon },
          ].map((block) => (
            <div
              key={block.title}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <div className="relative aspect-video w-full">
                <Image
                  src={block.photo.src}
                  alt={block.photo.alt}
                  fill
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                {/* Just enough shade at the foot of the photo for the icon
                    badge to sit on. A fade into the card's own colour turned
                    into a pale haze once the theme went light. */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/45 to-transparent" />
                <div className="absolute bottom-4 left-5 flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-black/50 text-gold backdrop-blur-sm">
                  <block.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="flex flex-1 flex-col p-7 pt-5 sm:p-8 sm:pt-5">
                <h3 className="font-display text-xl font-semibold text-ink">
                  {block.title}
                </h3>
                <p className="mt-3 text-muted">{block.text}</p>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {block.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      <span className="text-ink/90">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="reveal border-y border-border bg-bg-elevated py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              What We Stand For
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
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
                <h3 className="font-display font-semibold text-ink">
                  {v.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hygiene & food safety */}
      <section className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border">
            <Image
              src={aboutPhotos.kitchenAction.src}
              alt={aboutPhotos.kitchenAction.alt}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              Hygiene &amp; Food Safety
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
              The Part You Can&apos;t Taste
            </h2>
            <p className="mt-4 text-muted">
              A steakhouse lives or dies on trust. You can&apos;t taste whether
              a chiller was logged or a board was swapped between raw beef and
              salad, so you are taking our word for it — which is exactly why
              we would rather set out what the word is.
            </p>
            <p className="mt-4 text-muted">
              A room full of rope, saddles and cased ammunition is a room full
              of surfaces. The theme gets held to the same standard as the
              kitchen: if it&apos;s on the wall, it&apos;s on the cleaning
              rota.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hygienePledges.map((pledge, i) => {
            const Icon = hygieneIcons[i] ?? ShieldCheckIcon;
            return (
              <div
                key={pledge.title}
                className="rounded-2xl border border-border bg-surface p-6 transition hover:border-border-strong hover:bg-surface-hover"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-semibold text-ink">
                  {pledge.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted">{pledge.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sourcing */}
      <section className="reveal border-y border-border bg-bg-elevated py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div className="md:order-2">
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border">
                <Image
                  src={aboutPhotos.prep.src}
                  alt={aboutPhotos.prep.alt}
                  fill
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="md:order-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                Where It Comes From
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
                Sourced Daily, Prepped In-House
              </h2>
              <p className="mt-4 text-muted">
                The shortest way to ruin a steak is to buy it badly. We keep our
                supplier list small and our delivery schedule daily, which costs
                more and is worth it every single morning.
              </p>
              <div className="mt-6 flex flex-col gap-4">
                {sourcingPledges.map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <LeafIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <div>
                      <h3 className="font-display font-semibold text-ink">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-sm text-muted">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* From Fire to Table timeline */}
      <section className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            How We Cook
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
            From Fire to Table
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {timeline.map((t, i) => (
            <div key={t.step} className="relative rounded-2xl border border-border bg-surface p-6">
              <span className="font-display text-4xl font-bold text-gold/25">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                {t.step}
              </h3>
              <p className="mt-1.5 text-sm text-muted">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Walkthrough video */}
      <section className="reveal border-y border-border bg-bg-elevated py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              The Full Tour
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
              See It Before You Sit In It
            </h2>
          </div>
          <VideoShowcase
            src={tourVideo.src}
            poster={tourVideo.poster}
            posterAlt={restaurantPhotos.aisle.alt}
            caption="A walk through the dining room, from the front door to the arch at the back."
          />
        </div>
      </section>

      {/* Photo strip */}
      <section className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div>
          <div className="mb-8 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              Around the Restaurant
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
              The Room, The Kitchen, The Table
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {[
              restaurantPhotos.floor,
              restaurantPhotos.laid,
              restaurantPhotos.banquet,
              restaurantPhotos.daytime,
              aboutPhotos.platter,
              aboutPhotos.grill,
              aboutPhotos.service,
              aboutPhotos.sweet,
            ].map((photo) => (
              <div
                key={photo.src}
                className="relative aspect-4/3 overflow-hidden rounded-xl border border-border"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition */}
      <section className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface p-7">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold">
              <TrophyIcon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-semibold text-ink">
              {restaurantInfo.ranking}
            </h3>
            <p className="mt-1.5 text-sm text-muted">
              Ranked by TripAdvisor traveller reviews, not by paid placement.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-7">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold">
              <SparkleIcon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-semibold text-ink">
              {restaurantInfo.rating.toFixed(1)} stars, {restaurantInfo.reviewCount}+ reviews
            </h3>
            <p className="mt-1.5 text-sm text-muted">
              Written by people who paid for their own dinner.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-7">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold">
              <UsersIcon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-semibold text-ink">
              Two kitchens, one standard
            </h3>
            <p className="mt-1.5 text-sm text-muted">
              Saddar since {heritage.foundedYear}, E-7 Islamabad since 2023.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="reveal border-y border-border bg-bg-elevated py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              Before You Visit
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
              Questions We Get Asked
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {aboutFaqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-border bg-surface p-5 transition open:border-border-strong"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span className="shrink-0 text-gold transition group-open:rotate-45">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted">{faq.a}</p>
              </details>
            ))}
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
            <h2 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
              Saddar, Rawalpindi
            </h2>
            <div className="mt-4 flex flex-col gap-2.5 text-sm">
              <div className="flex items-start gap-3">
                <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <p className="text-ink">{restaurantInfo.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <ClockIcon className="h-5 w-5 shrink-0 text-gold" />
                <p className="text-ink">{restaurantInfo.hours}</p>
              </div>
              <div className="flex items-center gap-3">
                <PhoneIcon className="h-5 w-5 shrink-0 text-gold" />
                <a href={`tel:${restaurantInfo.phone}`} className="text-ink hover:text-gold-soft">
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
              className="rounded-lg border border-border-strong px-6 py-3 font-semibold text-ink transition hover:scale-105 hover:bg-bg-elevated active:scale-95"
            >
              Order Online
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
