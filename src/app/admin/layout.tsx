import type { Metadata } from "next";
import { restaurantInfo } from "@/lib/restaurant";

export const metadata: Metadata = {
  title: `Kitchen Dashboard | ${restaurantInfo.name}`,
  description: "Staff order queue and bookings.",
  // Staff-only screen; keep it out of search results entirely.
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
