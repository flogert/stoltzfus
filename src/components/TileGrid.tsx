import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
} as const;

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
} as const;

interface GalleryItem {
  src: string;
  title: string;
  category: string;
  quote: string;
  name: string;
}

const galleryImages: GalleryItem[] = [
  {
    src: "https://images.unsplash.com/photo-1699543909013-4b9c73081b48?w=600&q=80",
    title: "Marble Retreat",
    category: "Bathroom",
    quote: "Stoltzfus transformed our master bath into a true spa retreat. Their craftsmanship is simply unmatched.",
    name: "SARAH M.",
  },
  {
    src: "https://images.unsplash.com/photo-1695191388218-f6259600223f?w=600&q=80",
    title: "Herringbone Hearth",
    category: "Kitchen",
    quote: "The herringbone layout in our kitchen is now everyone\u2019s favorite detail. Absolutely stunning work.",
    name: "PAUL K.",
  },
  {
    src: "https://images.unsplash.com/photo-1614187952694-8483e3e55a9d?w=600&q=80",
    title: "Porcelain Living",
    category: "Living Area",
    quote: "From selection to installation, the entire Stoltzfus team made the process seamless and enjoyable.",
    name: "MILLA J.",
  },
  {
    src: "https://images.unsplash.com/photo-1693773511442-8f2787a2c89e?w=600&q=80",
    title: "Grand Foyer Mosaic",
    category: "Entryway",
    quote: "Our foyer mosaic stops every guest in their tracks. Stoltzfus turned our vision into art.",
    name: "JOHN R.",
  },
];

function SkewCard({ src, title, category, quote, name }: GalleryItem) {
  return (
    <div className="skew-card">
      <div className="skew-card-wrapper">
        <img src={src} alt={`${category} \u2014 ${title}`} loading="lazy" />
        <div className="skew-card-overlay" aria-hidden="true">
          <p className="skew-quote">{quote}</p>
          <svg className="skew-guillemets" viewBox="0 0 48 32" fill="currentColor" aria-hidden="true">
            <path d="M0 32V19.2C0 8.533 5.333 2.133 16 0l2.4 4C13.067 5.6 10.133 8.8 9.6 13.6H16V32H0zm26.4 0V19.2C26.4 8.533 31.733 2.133 42.4 0l2.4 4C39.467 5.6 36.533 8.8 36 13.6H42.4V32H26.4z" />
          </svg>
        </div>
      </div>
      <div className="skew-card-name" aria-hidden="true">{name}</div>
    </div>
  );
}

/* â”€â”€ Reflex Card with 3D tilt + gloss â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export function TileGrid() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const total = galleryImages.length;

  const go = useCallback(
    (d: number) => {
      setDir(d);
      setActive((i) => (i + d + total) % total);
    },
    [total],
  );

  const prevIdx = (active - 1 + total) % total;
  const nextIdx = (active + 1) % total;

  return (
    <div className="container">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={stagger}
        className="carousel-header"
      >
        <div>
          <motion.p variants={fadeUp} className="label">Gallery</motion.p>
          <motion.h2 variants={fadeUp} id="gallery-heading">Our Finest Work</motion.h2>
        </div>
        <motion.div variants={fadeUp} className="carousel-nav">
          <button onClick={() => go(-1)} className="carousel-btn" aria-label="Previous slide">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <span className="carousel-counter">
            {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <button onClick={() => go(1)} className="carousel-btn" aria-label="Next slide">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      </motion.div>

      <div className="skew-stage" role="region" aria-label="Gallery carousel" aria-live="polite">
        <button className="skew-slot skew-slot--side" onClick={() => go(-1)} aria-label="Previous slide">
          <SkewCard {...galleryImages[prevIdx]} />
        </button>

        <div className="skew-slot skew-slot--main">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={active}
              custom={dir}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d > 0 ? 50 : -50 }),
                center: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: d > 0 ? -50 : 50 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: EASE }}
            >
              <SkewCard {...galleryImages[active]} />
            </motion.div>
          </AnimatePresence>
        </div>

        <button className="skew-slot skew-slot--side" onClick={() => go(1)} aria-label="Next slide">
          <SkewCard {...galleryImages[nextIdx]} />
        </button>
      </div>

      <div className="carousel-dots" aria-hidden="true">
        {galleryImages.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === active ? "carousel-dot--active" : ""}`}
            onClick={() => { setDir(i > active ? 1 : -1); setActive(i); }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}


/* â”€â”€ Stack positions config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */


/* â”€â”€ Card Stack Carousel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */


