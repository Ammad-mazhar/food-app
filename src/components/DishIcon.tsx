import { MenuCategory } from "@/lib/types";

const paths: Record<MenuCategory, React.ReactNode> = {
  Starters: (
    <>
      <ellipse cx="24" cy="27" rx="15" ry="8" />
      <path d="M11 24c2-6 8-10 13-10s11 4 13 10" />
      <path d="M17 15c1-3 3-5 5-5M25 15c1-3 3-5 5-5" strokeLinecap="round" />
    </>
  ),
  "Main Course": (
    <>
      <path d="M14 20c0-5 4-9 10-9 4 0 6 2 8 2 2 0 3-1 3-1s0 3-3 4c2 1 3 3 3 5 0 6-6 11-13 11s-13-4-13-11c0-1 .3-2 .6-3" />
      <path d="M18 21l4 4M26 19l4 5M22 26l3 3" strokeLinecap="round" />
    </>
  ),
  "Burgers & Sandwiches": (
    <>
      <path d="M9 22c0-7 7-11 15-11s15 4 15 11z" />
      <path d="M9 26h30M9 30h30" strokeLinecap="round" />
      <path d="M11 34c0 2 3 3 13 3s13-1 13-3" />
    </>
  ),
  Salads: (
    <>
      <path d="M10 22h28l-3 12H13z" />
      <path d="M16 22c0-6 3-11 8-11s8 5 8 11" />
      <path d="M12 27h24M13.5 31.5h21" strokeLinecap="round" />
      <circle cx="19" cy="18" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="27" cy="16" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  Desserts: (
    <>
      <path d="M24 9l9 15H15z" />
      <path d="M15 24l3 15h12l3-15" />
      <path d="M20 28v7M24 28v7M28 28v7" strokeLinecap="round" />
    </>
  ),
  Beverages: (
    <>
      <path d="M17 12h14l-2 24a3 3 0 0 1-3 3H22a3 3 0 0 1-3-3z" />
      <path d="M15 12h18" strokeLinecap="round" />
      <path d="M27 6l3 6" strokeLinecap="round" />
    </>
  ),
};

export default function DishIcon({
  category,
  className = "h-7 w-7",
}: {
  category: MenuCategory;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      className={className}
    >
      {paths[category]}
    </svg>
  );
}
