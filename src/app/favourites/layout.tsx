import type { Metadata } from "next";
import { restaurantInfo } from "@/lib/restaurant";

export const metadata: Metadata = {
  title: `Favourites | ${restaurantInfo.name}`,
  description:
    "The Texas Steak House dishes you've saved for next time.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
