import { useRef, useEffect } from "react";

/* Accent warm tone (matches --accent: #8B7355) */
const AR = 139, AG = 115, AB = 85;
/* On dark background use a lighter warm tone */
const DR = 255, DG = 210, DB = 160;

/* Remove unused Cell fields used only for pulsing */
interface Cell {
  cx: number;
  cy: number;
  glow: number;
  dir: -1 | 1;
  active: boolean;
  speed: number;
}

function drawHex(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6; // pointy-top
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
}

export interface HexGridProps {
  /** Base stroke opacity for unlit cells */
  baseAlpha?: number;
  /** Peak stroke opacity for glowing cells */
  peakAlpha?: number;
  /** Circumradius of each hex in px */
  size?: number;
  /** Radius around cursor that triggers hover glow */
  hoverRadius?: number;
  /** Use light (dark-bg) colours instead of warm accent */
  dark?: boolean;
}

export function HexGrid({
  baseAlpha = 0.07,
  peakAlpha = 0.5,
  size = 34,
  hoverRadius = 130,
  dark = false,
}: HexGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    let cells: Cell[] = [];
    let mouse = { x: -99999, y: -99999 };
    let raf = 0;
    let W = 0, H = 0;

    const S = size;
    const dx = S * Math.sqrt(3);
    const dy = S * 1.5;

    function buildGrid(w: number, h: number) {
      cells = [];
      const cols = Math.ceil(w / dx) + 3;
      const rows = Math.ceil(h / dy) + 3;
      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const cx = col * dx + (row % 2 !== 0 ? dx / 2 : 0);
          const cy = row * dy;
          cells.push({ cx, cy, glow: 0, dir: 1, active: false, speed: 0.015 });
        }
      }
    }

    function resize() {
      const el = canvasRef.current;
      if (!el) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = el.offsetWidth;
      H = el.offsetHeight;
      if (!W || !H) return;
      el.width = Math.round(W * dpr);
      el.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGrid(W, H);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const rr = dark ? DR : AR;
    const gg = dark ? DG : AG;
    const bb = dark ? DB : AB;

    function draw() {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);

      cells.forEach((c) => {
        /* Mouse proximity hover glow only — no idle animation */
        const dist = Math.hypot(c.cx - mouse.x, c.cy - mouse.y);
        const hover = dist < hoverRadius
          ? Math.pow(1 - dist / hoverRadius, 1.8) * 0.85
          : 0;

        const alpha = baseAlpha + hover * (peakAlpha - baseAlpha);

        drawHex(ctx, c.cx, c.cy, S - 1);
        ctx.strokeStyle = `rgba(${rr},${gg},${bb},${alpha})`;
        ctx.lineWidth = 0.75 + hover * 1.25;
        ctx.stroke();
      });
    }
    draw();

    /* Track mouse across the full window so hover works even with pointer-events:none */
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouse = { x: -99999, y: -99999 }; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [baseAlpha, peakAlpha, size, hoverRadius, dark]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
