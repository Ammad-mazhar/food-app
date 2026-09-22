"use client";

import { useId } from "react";
import { MenuCategory } from "@/lib/types";

function Gradients({ p }: { p: string }) {
  return (
    <defs>
      <radialGradient id={`${p}-glow`} cx="30%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#c9a24b" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#c9a24b" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${p}-bg`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1c1512" />
        <stop offset="100%" stopColor="#0b0908" />
      </linearGradient>
      <linearGradient id={`${p}-steak`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#7a3a22" />
        <stop offset="55%" stopColor="#5a2717" />
        <stop offset="100%" stopColor="#3d1a10" />
      </linearGradient>
      <linearGradient id={`${p}-bun`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#d99a4e" />
        <stop offset="100%" stopColor="#a9682c" />
      </linearGradient>
      <linearGradient id={`${p}-cheese`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#e8cd8a" />
        <stop offset="100%" stopColor="#c9a24b" />
      </linearGradient>
      <linearGradient id={`${p}-drink`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e8cd8a" />
        <stop offset="100%" stopColor="#b3432b" />
      </linearGradient>
      <linearGradient id={`${p}-cake`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f3ead9" />
        <stop offset="100%" stopColor="#c9a24b" />
      </linearGradient>
    </defs>
  );
}

function Backdrop({ p }: { p: string }) {
  return (
    <>
      <rect width="320" height="180" fill={`url(#${p}-bg)`} />
      <circle cx="110" cy="60" r="140" fill={`url(#${p}-glow)`} />
      <g stroke="#e8cd8a" strokeOpacity="0.04" strokeWidth="1">
        {Array.from({ length: 10 }).map((_, i) => (
          <path key={i} d={`M${-40 + i * 40} 200 L${40 + i * 40} -20`} />
        ))}
      </g>
    </>
  );
}

function MainCourseArt({ p }: { p: string }) {
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full">
      <Gradients p={p} />
      <Backdrop p={p} />
      <ellipse cx="165" cy="132" rx="118" ry="30" fill="#8a6a26" opacity="0.5" />
      <ellipse cx="165" cy="128" rx="104" ry="24" fill="#120e0b" />
      <ellipse cx="165" cy="126" rx="92" ry="20" fill="#1c1512" />
      <path
        d="M78 112c6-22 36-38 72-38 33 0 61 13 75 33 8 12 3 25-11 31-20 9-45 6-65 6-27 0-54-4-68-17-5-4-4-10-3-15z"
        fill={`url(#${p}-steak)`}
      />
      <g stroke="#160b06" strokeWidth="5" strokeLinecap="round" opacity="0.85">
        <path d="M90 106l44-26" />
        <path d="M104 120l52-30" />
        <path d="M122 128l58-33" />
        <path d="M142 132l52-30" />
      </g>
      <g fill="#e8cd8a" opacity="0.6">
        <circle cx="120" cy="104" r="1.4" />
        <circle cx="140" cy="96" r="1.2" />
        <circle cx="160" cy="106" r="1.4" />
      </g>
      <g transform="translate(212 100) rotate(14)">
        <path d="M0 0c8-5 17-3 22 3" stroke="#7c9a5a" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      </g>
      <g stroke="#e8cd8a" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M140 66c-8-12 8-16 0-30" />
        <path d="M160 64c-8-13 8-17 0-31" />
      </g>
    </svg>
  );
}

function BurgerArt({ p }: { p: string }) {
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full">
      <Gradients p={p} />
      <Backdrop p={p} />
      <g transform="translate(110 30)">
        <path d="M0 46c0-26 22-42 50-42s50 16 50 42z" fill={`url(#${p}-bun)`} />
        <g fill="#f3ead9" opacity="0.8">
          <circle cx="30" cy="18" r="1.6" />
          <circle cx="46" cy="10" r="1.6" />
          <circle cx="62" cy="16" r="1.6" />
          <circle cx="74" cy="26" r="1.6" />
          <circle cx="20" cy="28" r="1.6" />
        </g>
        <path d="M-4 46c10 10 20-6 30 2s20-8 30 0 20-6 28 2v10H-4z" fill="#7c9a5a" />
        <path d="M-2 56h104l-10 16-14-6-14 8-14-7-14 8-14-7-14 8z" fill={`url(#${p}-cheese)`} />
        <rect x="-4" y="70" width="108" height="18" rx="6" fill="#3d1a10" />
        <path d="M-6 88h112c0 12-14 20-56 20s-56-8-56-20z" fill={`url(#${p}-bun)`} />
      </g>
    </svg>
  );
}

function StarterArt({ p }: { p: string }) {
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full">
      <Gradients p={p} />
      <Backdrop p={p} />
      <ellipse cx="160" cy="130" rx="110" ry="26" fill="#8a6a26" opacity="0.4" />
      <ellipse cx="160" cy="126" rx="96" ry="20" fill="#1c1512" />
      <g fill="#c98a3f">
        <path d="M110 120l24-40 20 40z" />
        <path d="M140 122l26-46 22 46z" />
        <path d="M170 120l24-42 22 42z" />
        <path d="M198 122l22-38 18 38z" />
      </g>
      <g stroke={`url(#${p}-cheese)`} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9">
        <path d="M118 112c10 4 18-4 26 2" />
        <path d="M150 114c10 4 20-4 28 2" />
        <path d="M182 112c8 4 16-3 24 2" />
      </g>
      <g fill="#5a7a3a">
        <ellipse cx="150" cy="104" rx="4" ry="2.4" />
        <ellipse cx="178" cy="108" rx="4" ry="2.4" />
        <ellipse cx="200" cy="102" rx="4" ry="2.4" />
      </g>
    </svg>
  );
}

function SaladArt({ p }: { p: string }) {
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full">
      <Gradients p={p} />
      <Backdrop p={p} />
      <path
        d="M70 100h180l-16 38a14 14 0 01-13 9H99a14 14 0 01-13-9z"
        fill="#1c1512"
        stroke="#8a6a26"
        strokeOpacity="0.5"
        strokeWidth="2"
      />
      <g fill="#6f9450">
        <path d="M92 100c4-14 16-22 26-18s10 18 2 22-32 6-28-4z" />
        <path d="M130 100c2-16 16-24 28-18s8 20-2 22-28 6-26-4z" />
        <path d="M170 100c4-16 18-22 28-16s6 20-4 22-26 4-24-6z" />
        <path d="M206 100c2-14 14-20 24-14s6 18-4 20-22 2-20-6z" />
      </g>
      <g fill="#b3432b">
        <circle cx="140" cy="96" r="6" />
        <circle cx="190" cy="94" r="5" />
      </g>
      <g fill="#f3ead9" opacity="0.85">
        <circle cx="120" cy="102" r="2.6" />
        <circle cx="160" cy="106" r="2.6" />
        <circle cx="200" cy="104" r="2.6" />
        <circle cx="175" cy="98" r="2.2" />
      </g>
    </svg>
  );
}

function DessertArt({ p }: { p: string }) {
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full">
      <Gradients p={p} />
      <Backdrop p={p} />
      <ellipse cx="160" cy="140" rx="100" ry="18" fill="#8a6a26" opacity="0.35" />
      <g transform="translate(115 40)">
        <path d="M0 90 L45 10 L90 90 Z" fill={`url(#${p}-cake)`} />
        <rect x="6" y="66" width="78" height="24" fill="#8a5a2e" />
        <rect x="10" y="50" width="70" height="16" fill="#c9a24b" opacity="0.9" />
      </g>
      <g fill="#b3432b">
        <circle cx="180" cy="52" r="5" />
        <circle cx="192" cy="60" r="4" />
      </g>
      <path d="M195 46c6-4 12-2 14 4" stroke="#6f9450" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function BeverageArt({ p }: { p: string }) {
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full">
      <Gradients p={p} />
      <Backdrop p={p} />
      <ellipse cx="160" cy="150" rx="60" ry="12" fill="#8a6a26" opacity="0.3" />
      <path d="M132 40h56l-8 96a8 8 0 01-8 7h-24a8 8 0 01-8-7z" fill={`url(#${p}-drink)`} opacity="0.9" />
      <path d="M128 40h64" stroke="#f3ead9" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
      <g fill="#f3ead9" opacity="0.85">
        <rect x="140" y="58" width="12" height="12" rx="2" transform="rotate(12 146 64)" />
        <rect x="158" y="70" width="12" height="12" rx="2" transform="rotate(-8 164 76)" />
      </g>
      <path d="M176 34l6 14" stroke="#f3ead9" strokeWidth="3" strokeLinecap="round" />
      <path d="M120 44c-6 20-2 40 6 54" stroke="#6f9450" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

const artByCategory: Record<
  MenuCategory,
  (props: { p: string }) => React.JSX.Element
> = {
  Starters: StarterArt,
  "Main Course": MainCourseArt,
  "Burgers & Sandwiches": BurgerArt,
  Salads: SaladArt,
  Desserts: DessertArt,
  Beverages: BeverageArt,
};

export default function DishArt({
  category,
  className = "",
}: {
  category: MenuCategory;
  className?: string;
}) {
  const rawId = useId();
  const p = `da${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const Art = artByCategory[category];
  return (
    <div className={className} role="img" aria-label={`${category} illustration`}>
      <Art p={p} />
    </div>
  );
}
