import type { Metadata } from "next";
import { restaurantInfo } from "@/lib/restaurant";

// The page itself is a Client Component and so can't export metadata; this
// thin layout carries it for the route instead.
export const metadata: Metadata = {
  title: `Sign Up | ${restaurantInfo.name}`,
  description:
    "Create a Texas Steak House account to order faster and manage your bookings.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
