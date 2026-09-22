import type { Metadata } from "next";
import { restaurantInfo } from "@/lib/restaurant";

// The page itself is a Client Component and so can't export metadata; this
// thin layout carries it for the route instead.
export const metadata: Metadata = {
  title: `Order Details | ${restaurantInfo.name}`,
  description:
    "Track the progress of your Texas Steak House order from the kitchen to your table.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
