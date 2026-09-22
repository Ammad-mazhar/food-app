export default function HeroArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      className={className}
      role="img"
      aria-label="Illustration of a fire-grilled steak on a plate"
    >
      <defs>
        <radialGradient id="glow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#c9a24b" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#c9a24b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="plateRim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8cd8a" />
          <stop offset="100%" stopColor="#8a6a26" />
        </linearGradient>
        <linearGradient id="steakBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7a3a22" />
          <stop offset="55%" stopColor="#5a2717" />
          <stop offset="100%" stopColor="#3d1a10" />
        </linearGradient>
        <linearGradient id="sear" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2a120a" />
          <stop offset="100%" stopColor="#180a05" />
        </linearGradient>
      </defs>

      {/* ambient glow */}
      <circle cx="200" cy="190" r="190" fill="url(#glow)" />

      {/* plate */}
      <ellipse cx="200" cy="245" rx="150" ry="46" fill="url(#plateRim)" opacity="0.9" />
      <ellipse cx="200" cy="240" rx="134" ry="38" fill="#120e0b" />
      <ellipse cx="200" cy="238" rx="120" ry="32" fill="#1c1512" />

      {/* steak body */}
      <path
        d="M96 214c8-30 46-52 92-52 42 0 78 18 96 46 10 16 4 34-14 42-26 12-58 8-84 8-34 0-70-6-88-24-6-6-4-14-2-20z"
        fill="url(#steakBody)"
      />
      <path
        d="M96 214c8-30 46-52 92-52 42 0 78 18 96 46"
        stroke="#e8cd8a"
        strokeOpacity="0.35"
        strokeWidth="2"
      />

      {/* grill sear marks */}
      <g stroke="url(#sear)" strokeWidth="7" strokeLinecap="round" opacity="0.85">
        <path d="M110 206l58-34" />
        <path d="M128 224l70-40" />
        <path d="M150 236l78-44" />
        <path d="M176 242l70-40" />
        <path d="M202 244l56-32" />
      </g>

      {/* seasoning flecks */}
      <g fill="#e8cd8a" opacity="0.7">
        <circle cx="150" cy="210" r="1.6" />
        <circle cx="178" cy="198" r="1.4" />
        <circle cx="206" cy="212" r="1.6" />
        <circle cx="130" cy="222" r="1.3" />
        <circle cx="230" cy="220" r="1.5" />
      </g>

      {/* herb garnish */}
      <g transform="translate(268 208) rotate(18)">
        <path d="M0 0c10-6 22-4 28 4" stroke="#7c9a5a" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M4 -2c4-6 4-6 8-2M10 2c4-6 5-5 9-2M16 5c4-5 5-4 9-1" stroke="#7c9a5a" strokeWidth="2.4" strokeLinecap="round" />
      </g>

      {/* steam */}
      <g stroke="#e8cd8a" strokeOpacity="0.5" strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M172 150c-10-16 10-22 0-40" />
        <path d="M200 146c-10-18 10-24 0-42" />
        <path d="M228 150c-10-16 10-22 0-40" />
      </g>
    </svg>
  );
}
