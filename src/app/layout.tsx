import type { Metadata, Viewport } from "next";
import { Rokkitt } from "next/font/google";
import "./globals.css";

/**
 * Rokkitt is a Clarendon-style slab serif — the Egyptian/playbill genre used
 * on Western wanted posters and saloon signage, which is the register the
 * restaurant's film-set interior is going for. Picked over the heavier display
 * slabs (Bevan, Alfa Slab One) because those ship a single 400 weight, and the
 * layouts here lean on `font-bold` throughout; Rokkitt is variable, so bold
 * headings stay real weights rather than synthetic smears.
 */
const displayFont = Rokkitt({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-rokkitt",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RevealObserver from "@/components/RevealObserver";
import FloatingHub from "@/components/FloatingHub";
import { restaurantInfo, siteUrl } from "@/lib/restaurant";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Texas Steak House | Rawalpindi's Home of Fire-Grilled Steaks",
    // Pages that set their own title already include the restaurant name.
    template: "%s",
  },
  description:
    "Order fire-grilled steaks and Texas classics for delivery or pickup, or book your table at Texas Steak House, Saddar, Rawalpindi.",
  applicationName: restaurantInfo.name,
  keywords: [
    "steakhouse Rawalpindi",
    "Texas Steak House",
    "Saddar restaurants",
    "steak delivery Rawalpindi",
    "E-7 Islamabad restaurant",
  ],
  openGraph: {
    type: "website",
    siteName: restaurantInfo.name,
    locale: "en_PK",
    url: siteUrl,
    title: "Texas Steak House | Rawalpindi's Home of Fire-Grilled Steaks",
    description:
      "Fresh, never-frozen steaks fire-grilled to order. Delivery, pickup and table bookings in Saddar, Rawalpindi and E-7, Islamabad.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Texas Steak House",
    description:
      "Fresh, never-frozen steaks fire-grilled to order in Saddar, Rawalpindi.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0b0908",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the inline script below sets data-theme on
    // <html> before React hydrates, so the server markup and the live DOM
    // legitimately differ on that one attribute.
    <html
      lang="en"
      className={`h-full antialiased ${displayFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1 pt-20">{children}</main>
            <Footer />
            <FloatingHub />
            <RevealObserver />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
