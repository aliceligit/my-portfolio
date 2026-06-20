# Scroll-linked horizontal pan ("no-pin" method)

A way to make a row of cards scroll **horizontally as the user scrolls the page
vertically**, with **no blank space** and clean section spacing. Used for the
Achievement section on mobile (`src/components/sections/Achievement.astro`).

## The problem it solves

We wanted: "scroll down → cards slide left→right → continue to the next section."

The obvious approach is a **pinned** section (CSS `position: sticky`): freeze the
section in place and translate the cards sideways while it's frozen. But a pinned
section needs extra scroll distance (a "runway") to drive the horizontal motion,
and that runway shows up as **blank space** — either below the cards while
scrolling, or as a big empty gap before the next section. On mobile this is
unavoidable when the pinned content is shorter than the screen.

## The no-pin solution (recommended)

Don't pin. Let the section scroll normally, and translate the cards horizontally
based on **how far the page has scrolled**. Because nothing is frozen, there's no
runway and therefore **no blank space**, and the section keeps its normal height
and spacing.

### Key points

- The cards live in a flex row (`nowrap`) inside an `overflow: hidden` wrapper
  that clips the cards sliding off-screen.
- Progress `p` (0→1) is tied to the **scroll position**, not just the section's
  place in the viewport — otherwise, if the section is already visible at page
  load, it computes `p > 0` and the cards look pre-scrolled. Anchoring to scroll
  position keeps `p = 0` until the user actually scrolls (first card stays
  left-aligned with its padding).
- `translateX = -p * distance`, where `distance = row.scrollWidth - innerWidth`.

### Core logic

```js
function applyScroll() {
  const rect = wrapper.getBoundingClientRect();      // the overflow-hidden clip
  const vh = window.innerHeight;
  const sectionTop = rect.top + window.scrollY;       // document offset (constant)
  const startY = Math.max(0, sectionTop - (vh - rect.height)); // 0 if visible on load
  // Finish the pan at 0.6 of the way to the top, NOT at the top itself — see "Dwell".
  const panDist = Math.max(1, (sectionTop - startY) * 0.6);
  const p = Math.max(0, Math.min(1, (window.scrollY - startY) / panDist));
  row.style.transform = `translateX(${-p * distance}px)`;
}
```

Throttle with `requestAnimationFrame`, recompute `distance` on resize, and
re-run after `document.fonts.ready` (card widths change once fonts load).

### Dwell (so the last card is viewable)

The pan is coupled to the section's short vertical scroll-through. If the pan
finishes exactly when the section reaches the top of the screen, the last card is
only fully revealed for a split second before the section scrolls away. Fix:
**finish the pan earlier** (the `* 0.6` factor above) so it completes while the
section is still comfortably in view; the last card then stays fully visible as
the section keeps rising. Lower the factor for more dwell / faster pan, raise it
(toward 1) for a slower pan that finishes later.

## Trade-off vs. pinned

| Method  | Section freezes? | Blank space?            |
| ------- | ---------------- | ----------------------- |
| Pinned  | Yes              | Yes (needs scroll runway) |
| No-pin  | No               | No                      |

If a design calls for the section to truly **freeze** while sliding, use a pinned
sticky stage — but accept the blank space (or fill the viewport with other
content). Otherwise, the **no-pin** method above is the clean default.
