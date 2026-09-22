import type { Metadata } from "next";
import { restaurantInfo } from "@/lib/restaurant";

// The page itself is a Client Component and so can't export metadata; this
// thin layout carries it for the route instead.
export const metadata: Metadata = {
  title: `Book a Table | ${restaurantInfo.name}`,
  description:
    "Reserve a table at Texas Steak House in Saddar, Rawalpindi or E-7, Islamabad.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
