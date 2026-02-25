import { useState, useEffect, useRef, lazy, Suspense } from "react";
const TileGrid = lazy(() => import("./components/TileGrid").then(m => ({ default: m.TileGrid })));
import { HexGrid } from "./components/HexGrid";
import { Logo } from "./components/Logo";
import { GalaxyButton } from "./components/GalaxyButton";
import { Phone, Mail, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/* ── Animation ──────────────────────────────────────────── */
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
} as const;

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
} as const;

/* ── Data ───────────────────────────────────────────────── */
const values = [
  {
    title: "Craftsmanship",
    body: "We create surfaces that bring clarity, warmth, and a lasting sense of quality to every room.",
  },
  {
    title: "Personal Design",
    body: "Every project is shaped around your taste, lifestyle, and the character of your space.",
  },
  {
    title: "Flow & Function",
    body: "We design tile layouts that blend form with harmony for effortless everyday living.",
  },
  {
    title: "Lasting Beauty",
    body: "Thoughtful material choices and balanced patterns that elevate the feel of every room.",
  },
];

const services = [
  {
    title: "Bathroom Tiling",
    body: "Complete bathroom tile installations including floors, walls, and shower enclosures with expert waterproofing. We handle every detail — from layout to sealant — so your bathroom is both beautiful and built to last.",
  },
  {
    title: "Kitchen Backsplash",
    body: "Custom backsplash designs that protect your walls while adding style and personality. Whether subway tile, mosaic, or natural stone, we help you find the perfect match.",
  },
  {
    title: "Floor Installation",
    body: "Durable and beautiful floor tile installations for any room — from porcelain and natural stone to large-format tiles. Precision leveling, heated floor compatibility, and flawless grouting.",
  },
  {
    title: "Custom Mosaic & Pattern Work",
    body: "Bring your vision to life with custom mosaic art, decorative inlays, and intricate tile patterns. We work with glass, porcelain, and natural stone to create one-of-a-kind surfaces.",
  },
  {
    title: "Tile Repair & Restoration",
    body: "We carefully match existing finishes, replace cracked tiles, re-grout worn surfaces, and restore tile work to its original beauty — or better.",
  },
];

const approach = [
  {
    num: "01",
    title: "Consultation",
    body: "We define goals and assess the space to establish a clear direction for materials, layout, and timeline.",
  },
  {
    num: "02",
    title: "Design",
    body: "We translate your ideas into a refined tile plan that balances beauty, function, and materiality.",
  },
  {
    num: "03",
    title: "Installation",
    body: "Our certified installers bring the design to life with meticulous preparation, precision cuts, and expert craftsmanship.",
  },
  {
    num: "04",
    title: "Completion",
    body: "A final walkthrough ensures every detail meets our standards — clean grout, level surfaces, and lasting quality.",
  },
];

const projects = [
  {
    img: "https://images.unsplash.com/photo-1699543909013-4b9c73081b48?w=800&q=80",
    label: "Bathroom",
    title: "Marble Retreat Bath",
    location: "Lancaster, PA",
    area: "120 sq ft",
    year: "2025",
  },
  {
    img: "https://images.unsplash.com/photo-1695191388218-f6259600223f?w=800&q=80",
    label: "Kitchen",
    title: "Herringbone Hearth",
    location: "Harrisburg, PA",
    area: "85 sq ft",
    year: "2024",
  },
  {
    img: "https://images.unsplash.com/photo-1693773511442-8f2787a2c89e?w=800&q=80",
    label: "Entryway",
    title: "Grand Foyer Mosaic",
    location: "Philadelphia, PA",
    area: "200 sq ft",
    year: "2024",
  },
  {
    img: "https://images.unsplash.com/photo-1614187952694-8483e3e55a9d?w=800&q=80",
    label: "Living Area",
    title: "Porcelain Living Space",
    location: "Reading, PA",
    area: "340 sq ft",
    year: "2025",
  },
];

const testimonials = [
  {
    quote:
      "Working with Stoltzfus was a game-changer for our bathroom renovation. Their attention to detail, material knowledge, and ability to translate abstract ideas into functional spaces exceeded every expectation.",
    name: "Jennifer Whitmore",
    role: "Homeowner, Lancaster",
  },
  {
    quote:
      "As a business owner I was skeptical about a full floor renovation timeline. But the installation from Stoltzfus had us back in business right on schedule — and the result is stunning.",
    name: "David Hayes",
    role: "Restaurant Owner, Harrisburg",
  },
  {
    quote:
      "The custom mosaic work they created for our foyer is simply breathtaking. Guests always comment on it. Stoltzfus brought a level of artistry and precision I didn't think was possible at this scale.",
    name: "Rachel Monroe",
    role: "Homeowner, Philadelphia",
  },
  {
    quote:
      "From consultation to final grouting, the entire process felt effortless. They respected our space, communicated clearly, and delivered a kitchen backsplash that looks like it belongs in a magazine.",
    name: "Thomas & Linda Park",
    role: "Homeowners, Reading",
  },
];

const faqs = [
  {
    q: "What is the first step if I want to start a tile project?",
    a: "It starts with a free consultation. We visit your space, discuss your vision, review material options, and provide a detailed quote — all before any work begins.",
  },
  {
    q: "Can you work with my existing layout or partial tile?",
    a: "Yes. We regularly work with existing layouts, matching tiles for repairs or extensions, and can blend new work seamlessly with what's already there.",
  },
  {
    q: "How do you help me visualize the result before installation?",
    a: "We provide detailed layout plans, material samples, and digital mockups so you can see exactly how your tile will look before we begin installation.",
  },
  {
    q: "Do you handle plumbing coordination during bathroom projects?",
    a: "We coordinate closely with your plumber and other trades to ensure all rough-in work, waterproofing, and tile installation align perfectly.",
  },
  {
    q: "What if I have a specific budget? Can you design within it?",
    a: "Absolutely. We offer material and design guidance at every price point. A clear budget helps us recommend the best tile, pattern, and scope for your project.",
  },
];

/* ── FAQ Item ────────────────────────────────────────────── */
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const num = String(index + 1).padStart(2, "0");
  return (
    <div className={`faq-row${open ? " faq-row--open" : ""}`}>
      <div className="faq-num" aria-hidden="true">{num}</div>
      <div className="faq-qa">
        <button
          className="faq-header"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          <span className="faq-bg" aria-hidden="true" />
          <span className="faq-icon" aria-hidden="true">
            <motion.span
              animate={{ rotate: open ? 45 : 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </motion.span>
          </span>
          <h3 className="faq-question">{q}</h3>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="answer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1, transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ height: 0, opacity: 0, transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } }}
              style={{ overflow: "hidden" }}
            >
              <div className="faq-answer">
                <p>{a}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CraftValueRow({ title, body }: { title: string; body: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`craft-value-row${open ? " craft-value-row--open" : ""}`}>
      <button className="craft-value-header" onClick={() => setOpen((o) => !o)}>
        <motion.span
          className="craft-value-icon"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.span>
        <span className="craft-value-title">{title}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } }}
            style={{ overflow: "hidden" }}
          >
            <p className="craft-value-body">{body}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════ */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [activeTesti, setActiveTesti] = useState(0);
  const [testiDir, setTestiDir] = useState(1);
  const testiTouchX = useRef<number | null>(null);

  const goTesti = (d: number) => {
    setTestiDir(d);
    setActiveTesti((i) => (i + d + testimonials.length) % testimonials.length);
  };

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(() => goTesti(1), 6000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* Hidden SVG defs for rounded hex clip-paths */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          {/* Pointy-top hex with rounded corners (hero images) */}
          <clipPath id="hex-round" clipPathUnits="objectBoundingBox">
            <path d="M0.5715,0.0358 L0.9285,0.2142 Q1,0.25,1,0.33 L1,0.67 Q1,0.75,0.9285,0.7858 L0.5715,0.9642 Q0.5,1,0.4285,0.9642 L0.0715,0.7858 Q0,0.75,0,0.67 L0,0.33 Q0,0.25,0.0715,0.2142 L0.4285,0.0358 Q0.5,0,0.5715,0.0358Z" />
          </clipPath>
        </defs>
      </svg>

      {/* ── SKIP LINK ──────────────────────────────────────── */}
      <a href="#main" className="sr-only" style={{ position: "absolute", top: 0, left: 0, zIndex: 100, background: "var(--accent)", color: "#fff", padding: "0.5rem 1rem" }}>
        Skip to main content
      </a>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <motion.header
        className="header"
        role="banner"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
        }}
      >
        <nav className="nav-bar" aria-label="Primary navigation">

          {/* Logo cell */}
          <motion.a
            href="#"
            className="nav-cell nav-cell-logo"
            aria-label="Stoltzfus Tile — Home"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5, ease: EASE } } }}
          >
            <Logo size={26} color="var(--accent)" />
            <span className="cell-label">Stoltzfus Tile</span>
          </motion.a>

          {/* Nav links + CTA — centered wrapper */}
          <div className="nav-links">
            {[
              { label: "About",    href: "#about"    },
              { label: "Services", href: "#services" },
              { label: "Projects", href: "#projects" },
              { label: "Contact",  href: "#contact"  },
            ].map((n, idx) => (
              <motion.div
                key={n.label}
                className="nav-hex-wrap"
                style={{ zIndex: 10 - idx }}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5, ease: EASE } } }}
              >
                <a href={n.href} className="nav-cell nav-hex-inner">
                  <span className="cell-label">{n.label}</span>
                </a>
              </motion.div>
            ))}
            <motion.div
              className="nav-cta-inline"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5, ease: EASE } } }}
            >
              <GalaxyButton href="#contact">Book a Call</GalaxyButton>
            </motion.div>
          </div>

          {/* Right: hamburger (mobile only) */}
          <div className="nav-right">
            <button
              className="mobile-menu-btn"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="mobile-nav" role="navigation" aria-label="Mobile navigation">
            {[
              { label: "About",    href: "#about"    },
              { label: "Services", href: "#services" },
              { label: "Projects", href: "#projects" },
              { label: "Contact",  href: "#contact"  },
            ].map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="mobile-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                {n.label}
              </a>
            ))}
            <div className="mobile-nav-cta">
              <GalaxyButton href="#contact">Book a Call</GalaxyButton>
            </div>
          </div>
        )}
      </motion.header>

      <main id="main">
        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="hero" aria-labelledby="hero-heading">
          <HexGrid baseAlpha={0.06} peakAlpha={0.55} size={32} hoverRadius={140} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="watermark"
            aria-hidden="true"
          >
            STOLTZFUS TILE
          </motion.div>
          <div className="container" style={{ position: "relative", zIndex: 1 }}>
            <div className="hero-grid">
              {/* Copy */}              <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                style={{ position: "relative", zIndex: 1 }}
              >
                <motion.h1
                  id="hero-heading"
                  variants={fadeUp}
                  style={{ marginBottom: "1.5rem", position: "relative", zIndex: 1 }}
                >
                  Transforming surfaces.
                  <br />
                  Perfecting detail.
                  <br />
                  <em style={{ fontStyle: "normal", color: "var(--accent)" }}>
                    Creating beauty.
                  </em>
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  style={{ marginBottom: "2rem", maxWidth: "24rem", fontSize: "0.9375rem", lineHeight: 1.7, color: "var(--muted)", position: "relative", zIndex: 1 }}
                >
                  Pennsylvania's trusted tile specialists — bathrooms, kitchens,
                  floors, and custom mosaic work crafted with precision.
                </motion.p>

                <motion.div
                  variants={fadeUp}
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", position: "relative", zIndex: 1 }}
                >
                  <a href="#contact" className="btn btn-primary">Book a Call</a>
                  <a href="#projects" className="btn btn-glass">See Projects</a>
                </motion.div>
              </motion.div>

              {/* Hex honeycomb images */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
                className="hero-hex-grid"
                aria-hidden="true"
              >
                {[
                  "https://images.unsplash.com/photo-1699543909013-4b9c73081b48?w=600&q=85",
                  "https://images.unsplash.com/photo-1614187952694-8483e3e55a9d?w=600&q=85",
                  "https://images.unsplash.com/photo-1695191388218-f6259600223f?w=600&q=85",
                  "https://images.unsplash.com/photo-1693773511442-8f2787a2c89e?w=600&q=85",
                  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=85",
                  "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=85",
                ].map((src, i) => (
                  <div key={i} className="hero-hex-cell">
                    <div className="hero-hex-fill">
                      <img
                        src={src}
                        alt=""
                        width={600}
                        height={400}
                        loading={i < 2 ? "eager" : "lazy"}
                        fetchPriority={i === 0 ? "high" : undefined}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── CRAFT & SERVICES (combined) ────────────────────── */}
        <section id="about" className="section craft-section" aria-labelledby="craft-heading">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="craft-header"
            >
              <div>
                <motion.p variants={fadeUp} className="label">Our Craft</motion.p>
                <motion.h2 variants={fadeUp} id="craft-heading">
                  Built on craftsmanship.<br />Guided by care.
                </motion.h2>
              </div>
              <motion.p variants={fadeUp} className="craft-intro-text">
                From first consultation to final grout line — we bring skill and honesty to every project.
              </motion.p>
            </motion.div>

            <div className="craft-layout">
              {/* Left: interactive values */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={stagger}
              >
                <motion.p variants={fadeUp} className="label" style={{ marginBottom: 0 }}>Our Philosophy</motion.p>
                <div className="craft-values">
                  {values.map((v) => (
                    <CraftValueRow key={v.title} title={v.title} body={v.body} />
                  ))}
                </div>
                <motion.div variants={fadeUp} className="services-stat-row">
                  <div className="services-stat">
                    <span className="services-stat-num">12+</span>
                    <span className="services-stat-label">Years in PA</span>
                  </div>
                  <div className="services-stat">
                    <span className="services-stat-num">500+</span>
                    <span className="services-stat-label">Projects completed</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right: services accordion */}
              <motion.div
                id="services"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={stagger}
              >
                <motion.p variants={fadeUp} className="label" style={{ marginBottom: 0 }}>What We Do</motion.p>
                <div className="craft-values">
                  {services.map((svc) => (
                    <CraftValueRow key={svc.title} title={svc.title} body={svc.body} />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── GALLERY + PROJECTS (merged "Our Finest Work") ── */}
        <section id="projects" className="section hex-section" style={{ background: "var(--bg-alt)" }} aria-labelledby="gallery-heading">
          <Suspense fallback={<div style={{ minHeight: "32rem" }} />}>
            <TileGrid />
          </Suspense>

          {/* Approach steps */}
          <div className="container" style={{ marginTop: "4rem" }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="grid-4"
            >
              {approach.map((step) => (
                <motion.div key={step.num} variants={fadeUp}>
                  <span className="step-num" aria-hidden="true">{step.num}</span>
                  <h3 className="mb-2">{step.title}</h3>
                  <p className="text-sm">{step.body}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Project cards */}
          <div className="container" style={{ marginTop: "4rem" }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="grid-2"
            >
              {projects.map((p) => (
                <motion.a
                  key={p.title}
                  href="#projects"
                  variants={fadeUp}
                  className="card"
                  aria-label={`${p.title} — ${p.label} project in ${p.location}`}
                >
                  <div className="card-img-wrap">
                    <img src={p.img} alt={p.title} loading="lazy" />
                  </div>
                  <div className="card-body project-meta">
                    <div>
                      <span className="label" style={{ marginBottom: "0.25rem" }}>{p.label}</span>
                      <h3 className="mt-1">{p.title}</h3>
                    </div>
                    <div className="project-meta-right">
                      <span className="text-xs" style={{ display: "block", color: "var(--muted)" }}>
                        {p.location}
                      </span>
                      <span className="text-xs" style={{ display: "block", color: "var(--muted)" }}>
                        {p.area} &middot; {p.year}
                      </span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── TESTIMONIALS (compact carousel) ──────────────── */}
        <section className="section hex-section" style={{ background: "var(--bg-white)" }} aria-labelledby="testimonials-heading">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="testi-header"
            >
              <div>
                <motion.p variants={fadeUp} className="label">Testimonials</motion.p>
                <motion.h2 variants={fadeUp} id="testimonials-heading">
                  Trusted by clients we've worked with.
                </motion.h2>
              </div>
              <motion.div variants={fadeUp} className="carousel-counter-wrap">
                <span className="carousel-counter">
                  {String(activeTesti + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
                </span>
              </motion.div>
            </motion.div>

            <div className="testi-outer">
              {/* Side arrow left */}
              <button className="peek-arrow peek-arrow--left" onClick={() => goTesti(-1)} aria-label="Previous testimonial">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
              </button>

              <div
                className="testi-viewport"
                onTouchStart={(e) => { testiTouchX.current = e.touches[0].clientX; }}
                onTouchEnd={(e) => {
                  if (testiTouchX.current === null) return;
                  const dx = e.changedTouches[0].clientX - testiTouchX.current;
                  if (dx < -48) goTesti(1);
                  else if (dx > 48) goTesti(-1);
                  testiTouchX.current = null;
                }}
              >
              <AnimatePresence mode="wait" custom={testiDir}>
                <motion.div
                  key={activeTesti}
                  className="testimonial testimonial--compact"
                  custom={testiDir}
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
                  <div className="testi-compact-inner">
                    <div className="testimonial-stars" aria-label="5 stars">★★★★★</div>
                    <blockquote>&ldquo;{testimonials[activeTesti].quote}&rdquo;</blockquote>
                    <div className="testimonial-author">
                      <div className="testimonial-avatar" aria-hidden="true">
                        {testimonials[activeTesti].name.charAt(0)}
                      </div>
                      <cite style={{ fontStyle: "normal" }}>
                        <span className="testimonial-name">{testimonials[activeTesti].name}</span>
                        <span className="testimonial-role">{testimonials[activeTesti].role}</span>
                      </cite>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              </div>{/* end testi-viewport */}

              {/* Side arrow right */}
              <button className="peek-arrow peek-arrow--right" onClick={() => goTesti(1)} aria-label="Next testimonial">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>{/* end testi-outer */}

            {/* Dot indicators */}
            <div className="carousel-dots" style={{ marginTop: "1.5rem" }} aria-hidden="true">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`carousel-dot ${i === activeTesti ? "carousel-dot--active" : ""}`}
                  onClick={() => { setTestiDir(i > activeTesti ? 1 : -1); setActiveTesti(i); }}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────── */}
        <section className="section hex-section" aria-labelledby="faq-heading">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="mb-10"
            >
              <motion.p variants={fadeUp} className="label">Frequently Asked Questions</motion.p>
              <motion.h2 variants={fadeUp} id="faq-heading" className="max-w-2xl">
                Clear, comprehensive answers to the common questions we receive
                from homeowners and builders.
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              className="faq-list"
            >
              {faqs.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section id="contact" className="section cta-section" style={{ position: "relative" }} aria-labelledby="cta-heading">
          <HexGrid dark baseAlpha={0.04} peakAlpha={0.3} size={32} hoverRadius={150} />
          <div className="container two-col-center" style={{ position: "relative", zIndex: 1 }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp} id="cta-heading">Create With Us.</motion.h2>
              <motion.p variants={fadeUp} className="mt-3 text-lg" style={{ color: "var(--bg)", opacity: 0.85 }}>
                Let's bring your vision to life.
              </motion.p>
              <motion.p variants={fadeUp} className="mt-2 max-w-md" style={{ color: "var(--bg)", opacity: 0.6 }}>
                Want to uncover new possibilities through better tile work?
                We'd love to hear about your project.
              </motion.p>
              <motion.div variants={fadeUp}>
                <button
                  className="btn btn-accent mt-6"
                  onClick={() => setShowContact((v) => !v)}
                  aria-expanded={showContact}
                >
                  {showContact ? "Close" : "Book a Call"}
                </button>
              </motion.div>

              {/* Contact reveal */}
              <AnimatePresence>
                {showContact && (
                  <motion.div
                    className="cta-reveal"
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="cta-reveal-inner">
                      <a href="tel:+15551234567" className="cta-reveal-item">
                        <Phone size={18} />
                        <span>(555) 123-4567</span>
                      </a>
                      <a href="mailto:info@stoltzfustile.com" className="cta-reveal-item">
                        <Mail size={18} />
                        <span>info@stoltzfustile.com</span>
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              className="hide-mobile cta-image"
            >
              <img
                src="https://images.unsplash.com/photo-1693773511442-8f2787a2c89e?w=800&q=80"
                alt="Elegant tile interior showcase"
                loading="lazy"
              />
            </motion.div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer-grid-wide">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Logo size={26} color="var(--accent)" />
                <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  Stoltzfus Tile
                </span>
              </div>
              <p className="text-xs" style={{ maxWidth: "180px", lineHeight: 1.5, opacity: 0.7 }}>
                Expert tile installation across Pennsylvania.
              </p>
            </div>

            {/* Company */}
            <nav aria-label="Footer navigation — Company">
              <p className="footer-heading">Company</p>
              <ul>
                {[
                  { label: "About Us", href: "#about" },
                  { label: "Projects", href: "#projects" },
                  { label: "Contact", href: "#contact" },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="footer-link">{l.label}</a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Socials */}
            <nav aria-label="Footer navigation — Social media">
              <p className="footer-heading">Socials</p>
              <ul>
                {["LinkedIn", "Instagram", "Facebook"].map((s) => (
                  <li key={s}>
                    <a href="#" className="footer-link" aria-label={`Visit us on ${s}`}>{s}</a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact */}
            <div>
              <p className="footer-heading">Contact</p>
              <div className="space-y-2">
                <div className="contact-item">
                  <Phone aria-hidden="true" />
                  <span><a href="tel:+15551234567">(555) 123-4567</a></span>
                </div>
                <div className="contact-item">
                  <Mail aria-hidden="true" />
                  <span><a href="mailto:info@stoltzfustile.com">info@stoltzfustile.com</a></span>
                </div>
              </div>
            </div>

            {/* Service Area */}
            <div>
              <p className="footer-heading">Service Area</p>
              <p className="text-xs" style={{ lineHeight: 1.7 }}>
                Serving all of Central Pennsylvania — Lancaster,
                Harrisburg, Reading, Philadelphia, and surrounding areas.
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>Copyright &copy; 2026 Stoltzfus Tile</p>
            <p style={{ opacity: 0.6 }}>Licensed &amp; Insured &middot; Lancaster, PA</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

