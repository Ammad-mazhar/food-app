import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RevealObserver from "@/components/RevealObserver";
import FloatingHub from "@/components/FloatingHub";

export const metadata: Metadata = {
  title: "Texas Steak House | Rawalpindi's Home of Fire-Grilled Steaks",
  description:
    "Order fire-grilled steaks and Texas classics for delivery or pickup, or book your table at Texas Steak House, Saddar, Rawalpindi.",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0b0908",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <CartProvider>
          <Navbar />
          <main className="flex-1 pt-20">{children}</main>
          <Footer />
          <FloatingHub />
          <RevealObserver />
        </CartProvider>
      </body>
    </html>
  );
}
