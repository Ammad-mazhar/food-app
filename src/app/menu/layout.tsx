import type { Metadata } from "next";
import { restaurantInfo } from "@/lib/restaurant";

// The page itself is a Client Component and so can't export metadata; this
// thin layout carries it for the route instead.
export const metadata: Metadata = {
  title: `Menu | ${restaurantInfo.name}`,
  description:
    "Browse fire-grilled steaks, burgers, salads and desserts at Texas Steak House, Saddar, Rawalpindi. Order for delivery, pickup or dine-in.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
