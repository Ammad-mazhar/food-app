import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RevealObserver from "@/components/RevealObserver";
import FloatingHub from "@/components/FloatingHub";
import { restaurantInfo, siteUrl } from "@/lib/restaurant";

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
    <html lang="en" className="h-full antialiased">
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
