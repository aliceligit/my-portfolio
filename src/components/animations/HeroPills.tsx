// HeroPills — the floating keyword pills in the hero.
//
// Two phases:
//   1. Intro    — on load each pill flies in from an outside edge to its resting
//                 spot, with a little closed hand attached as if pulling it in.
//                 Once settled, the hands fade away.
//   2. Physics  — the first time the user scrolls, the pills drop with real
//                 gravity and stack at the bottom, colliding with each other
//                 (Matter.js). They stay fallen, and can be dragged with the
//                 mouse.
//
// Pill wording, colors, and positions are authored in heroPills.ts.

import { useEffect, useRef, useState } from "react";
import type { HeroPill } from "../../content/heroPills";

const SCROLL_TRIGGER = 60; // px scrolled before the pills start to fall

export default function HeroPills({ pills }: { pills: HeroPill[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [introDone, setIntroDone] = useState(false);

  // Physics state kept in refs so it survives re-renders without re-running.
  const matterRef = useRef<typeof import("matter-js") | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const rafRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Resting position (in px) for pill i, based on its % coordinates.
    const targetOf = (i: number) => ({
      x: (pills[i].x / 100) * container.clientWidth,
      y: (pills[i].y / 100) * container.clientHeight,
    });

    const moveTo = (el: HTMLElement, x: number, y: number, rotate = 0) => {
      el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotate}deg)`;
    };

    // ----- Phase 1: intro fly-in -----
    pills.forEach((pill, i) => {
      const el = pillRefs.current[i];
      if (!el) return;
      const t = targetOf(i);
      const margin = 500;
      let x = t.x;
      let y = t.y;
      if (pill.from === "left") x = -margin;
      if (pill.from === "right") x = container.clientWidth + margin;
      if (pill.from === "top") y = -margin;
      if (pill.from === "bottom") y = container.clientHeight + margin;
      el.style.transition = "none";
      moveTo(el, x, y);
    });

    const introId = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        pills.forEach((_, i) => {
          const el = pillRefs.current[i];
          if (!el) return;
          const t = targetOf(i);
          el.style.transition = `transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) ${i * 0.08}s, box-shadow 0.4s ease`;
          moveTo(el, t.x, t.y);
        });
      }),
    );
    // Fade the hands away once the pills have arrived.
    const introTimer = window.setTimeout(() => setIntroDone(true), 1800);

    // Physics world references, kept here so the resize handler can rescale
    // the floor/walls and pill bodies live after the pills have fallen.
    let world: {
      W: number;
      H: number;
      floor: Matter.Body;
      left: Matter.Body;
      right: Matter.Body;
      bodies: Matter.Body[];
      Body: typeof import("matter-js").Body;
    } | null = null;
    const WALL_T = 200;

    // ----- Phase 2: physics (runs once, stays fallen) -----
    const startPhysics = async () => {
      if (startedRef.current) return;
      startedRef.current = true;
      setIntroDone(true); // make sure the hands are gone

      const imported = await import("matter-js");
      const Matter = ((imported as unknown as { default?: typeof imported })
        .default ?? imported) as typeof import("matter-js");
      matterRef.current = Matter;
      const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Body } =
        Matter;

      const W = container.clientWidth;
      const H = container.clientHeight;

      const engine = Engine.create();
      engine.gravity.y = 1;
      engineRef.current = engine;

      // Floor + side walls so pills stay inside and stack at the bottom.
      const t = WALL_T;
      const floor = Bodies.rectangle(W / 2, H + t / 2, W * 2, t, {
        isStatic: true,
      });
      const left = Bodies.rectangle(-t / 2, H / 2, t, H * 4, { isStatic: true });
      const right = Bodies.rectangle(W + t / 2, H / 2, t, H * 4, {
        isStatic: true,
      });
      Composite.add(engine.world, [floor, left, right]);

      // One capsule-shaped body per pill, starting at its current spot.
      const bodies = pills.map((_, i) => {
        const el = pillRefs.current[i];
        const rect = el?.getBoundingClientRect() ?? { width: 180, height: 52 };
        const pos = targetOf(i);
        const body = Bodies.rectangle(pos.x, pos.y, rect.width, rect.height, {
          chamfer: { radius: rect.height / 2 },
          restitution: 0.45,
          friction: 0.4,
          frictionAir: 0.012,
        });
        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.25);
        if (el) el.style.transition = "none";
        return body;
      });
      Composite.add(engine.world, bodies);
      world = { W, H, floor, left, right, bodies, Body };

      // Let pills be dragged around.
      const mouse = Mouse.create(container);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, render: { visible: false } },
      });
      Composite.add(engine.world, mouseConstraint);

      const runner = Runner.create();
      Runner.run(runner, engine);
      runnerRef.current = runner;

      // Copy each body's position/rotation onto its pill every frame.
      // Pills are capsule-shaped (identical when flipped 180°), so we wrap the
      // displayed angle into -90°..90° — the shape looks the same, but the text
      // never ends up upside down.
      const readableAngle = (radians: number) => {
        let deg = (radians * 180) / Math.PI;
        deg = ((deg % 180) + 180) % 180; // 0..180
        if (deg > 90) deg -= 180; // -90..90
        return deg;
      };

      const sync = () => {
        bodies.forEach((body, i) => {
          const el = pillRefs.current[i];
          if (!el) return;
          moveTo(el, body.position.x, body.position.y, readableAngle(body.angle));
        });
        rafRef.current = requestAnimationFrame(sync);
      };
      sync();
    };

    const onScroll = () => {
      if (window.scrollY > SCROLL_TRIGGER) startPhysics();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      // Still floating: recompute each pill's resting spot.
      if (!startedRef.current) {
        pills.forEach((_, i) => {
          const el = pillRefs.current[i];
          if (!el) return;
          el.style.transition = "none";
          const t = targetOf(i);
          moveTo(el, t.x, t.y);
        });
        return;
      }

      // Already fallen: rescale the physics world to the new size so the pile
      // shrinks/grows proportionally with everything else.
      if (!world) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      const rx = newW / world.W;
      const ry = newH / world.H;
      if (rx === 1 && ry === 1) return;
      const { Body } = world;

      // Move + resize the floor and walls.
      Body.setPosition(world.floor, { x: newW / 2, y: newH + WALL_T / 2 });
      Body.setPosition(world.left, { x: -WALL_T / 2, y: newH / 2 });
      Body.setPosition(world.right, { x: newW + WALL_T / 2, y: newH / 2 });

      // Scale each pill body and move it proportionally.
      world.bodies.forEach((body) => {
        Body.scale(body, rx, ry);
        Body.setPosition(body, {
          x: body.position.x * rx,
          y: body.position.y * ry,
        });
      });

      world.W = newW;
      world.H = newH;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(introId);
      clearTimeout(introTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      const Matter = matterRef.current;
      if (Matter && runnerRef.current) Matter.Runner.stop(runnerRef.current);
      if (Matter && engineRef.current) Matter.Engine.clear(engineRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pills]);

  return (
    <div
      ref={containerRef}
      className={`hero__pills${introDone ? " hero__pills--intro-done" : ""}`}
    >
      {pills.map((pill, i) => (
        <div
          key={pill.text}
          ref={(el) => {
            pillRefs.current[i] = el;
          }}
          className={`hero-pill hero-pill--${pill.color}`}
        >
          <span className="hero-pill__glow" aria-hidden="true" />
          <span className="hero-pill__label">{pill.text}</span>
          <span className="hero-pill__hand" aria-hidden="true" />
        </div>
      ))}
    </div>
  );
}
