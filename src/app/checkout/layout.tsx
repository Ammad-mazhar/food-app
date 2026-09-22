import type { Metadata } from "next";
import { restaurantInfo } from "@/lib/restaurant";

// The page itself is a Client Component and so can't export metadata; this
// thin layout carries it for the route instead.
export const metadata: Metadata = {
  title: `Checkout | ${restaurantInfo.name}`,
  description:
    "Confirm your delivery or pickup details and place your Texas Steak House order.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
