export function Logo({ size = 36, color = "#8B7355" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer diamond / tile shape */}
      <rect
        x="24"
        y="2"
        width="30"
        height="30"
        rx="3"
        transform="rotate(45 24 2)"
        fill={color}
      />
      {/* Inner tile grid lines */}
      <g stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.5">
        {/* Horizontal */}
        <line x1="12" y1="24" x2="36" y2="24" />
        {/* Vertical */}
        <line x1="24" y1="12" x2="24" y2="36" />
      </g>
      {/* "S" letter */}
      <text
        x="24"
        y="29"
        textAnchor="middle"
        fontFamily="var(--font-serif), Georgia, serif"
        fontSize="16"
        fontWeight="400"
        fill="#FFFFFF"
      >
        S
      </text>
    </svg>
  );
}
