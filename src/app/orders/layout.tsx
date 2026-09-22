import type { Metadata } from "next";
import { restaurantInfo } from "@/lib/restaurant";

// The page itself is a Client Component and so can't export metadata; this
// thin layout carries it for the route instead.
export const metadata: Metadata = {
  title: `My Orders | ${restaurantInfo.name}`,
  description:
    "Track the status of your Texas Steak House orders.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
