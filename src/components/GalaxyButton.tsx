import { motion } from "motion/react";

/* Arrow SVG used twice for the slide-through loop */
function Arrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M2 6.5h9M7 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface GalaxyButtonProps {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function GalaxyButton({ href = "#", children }: GalaxyButtonProps) {
  /* Looping arrow transition: 0s pause → slide/fade 0.5s → 0.9s pause → repeat */
  const arrowLoop = {
    x: [0, 11, 11, -11, 0],
    opacity: [1, 0, 0, 0, 1],
    transition: {
      duration: 1.8,
      ease: "easeInOut" as const,
      times: [0, 0.28, 0.5, 0.5, 0.78],
      repeat: Infinity,
      repeatDelay: 0.5,
    },
  };

  /* Ghost arrow — offset by half a cycle so it arrives as leader exits */
  const ghostLoop = {
    x: [-11, 0, 0, 0, -11],
    opacity: [0, 1, 1, 0, 0],
    transition: {
      duration: 1.8,
      ease: "easeInOut" as const,
      times: [0.5, 0.78, 0.85, 1, 1],
      repeat: Infinity,
      repeatDelay: 0.5,
    },
  };

  const inner = (
    <span className="cta-btn">
      {/* Label */}
      <span className="cta-btn-label">{children}</span>

      {/* Arrow slot — clip overflow so arrows slide in/out cleanly */}
      <span className="cta-btn-arrow-wrap" aria-hidden="true">
        <motion.span className="cta-btn-arrow" animate={arrowLoop}>
          <Arrow />
        </motion.span>
        <motion.span className="cta-btn-arrow cta-btn-arrow--ghost" animate={ghostLoop}>
          <Arrow />
        </motion.span>
      </span>
    </span>
  );

  return (
    <a href={href} style={{ display: "inline-flex", position: "relative" }}>
      {inner}
    </a>
  );
}
