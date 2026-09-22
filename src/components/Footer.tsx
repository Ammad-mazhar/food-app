import Link from "next/link";
import { restaurantInfo, locations, socialLinks } from "@/lib/restaurant";
import {
  FlameIcon,
  PinIcon,
  PhoneIcon,
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "@/components/icons";

const quickLinks = [
  { href: "/menu", label: "Menu" },
  { href: "/book-table", label: "Book a Table" },
  { href: "/orders", label: "Track Order" },
  { href: "/reservations", label: "My Reservations" },
  { href: "/about", label: "About Us" },
  { href: "/account", label: "My Account" },
];

const socialIcons = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  whatsapp: WhatsAppIcon,
} as const;

export default function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden border-t border-white/10 bg-bg-elevated/60 backdrop-blur-xl">
      {/* Animated gold shimmer line along the top edge */}
      <div
        className="absolute inset-x-0 top-0 h-px opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent, var(--color-gold) 25%, var(--color-gold-soft) 50%, var(--color-gold) 75%, transparent)",
          backgroundSize: "200% 100%",
          animation: "shimmer-drift 6s linear infinite",
        }}
      />
      {/* Soft ambient glow blobs to reinforce the glass feel */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-ember/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-cream">
            <FlameIcon className="h-5 w-5 text-gold" />
            {restaurantInfo.name}
          </h3>
          <p className="text-sm text-muted">
            {restaurantInfo.tagline}. Fresh, never-frozen steaks, fire-grilled
            to order.
          </p>
          <div className="mt-4 flex gap-3">
            {socialLinks.map((social) => {
              const Icon = socialIcons[social.key];
              return (
                <a
                  key={social.key}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border-strong text-cream transition hover:scale-110 hover:border-gold hover:text-gold-soft"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm text-muted">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-gold-soft">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {locations.map((loc) => (
          <div key={loc.label}>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">
              {loc.label}
            </h4>
            <ul className="space-y-2.5 text-sm text-muted">
              <li className="flex items-start gap-2">
                <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {loc.address}
              </li>
              <li className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 shrink-0 text-gold" />
                {loc.hours}
              </li>
              {loc.phone && (
                <li className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4 shrink-0 text-gold" />
                  <a
                    href={`tel:${loc.phone}`}
                    className="transition hover:text-gold-soft"
                  >
                    {loc.phone}
                  </a>
                </li>
              )}
              <li>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    loc.query
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gold-soft transition hover:underline"
                >
                  Get directions →
                </a>
              </li>
            </ul>
          </div>
        ))}
      </div>

      <div className="relative border-t border-white/10 py-4 text-center text-xs text-faint">
        © {new Date().getFullYear()} {restaurantInfo.name}. All rights
        reserved.
      </div>
    </footer>
  );
}
