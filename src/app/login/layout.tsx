import type { Metadata } from "next";
import { restaurantInfo } from "@/lib/restaurant";

// The page itself is a Client Component and so can't export metadata; this
// thin layout carries it for the route instead.
export const metadata: Metadata = {
  title: `Log In | ${restaurantInfo.name}`,
  description:
    "Log in to your Texas Steak House account to track orders and reservations.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
