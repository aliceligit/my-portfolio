// WordReveal — recolors a sentence as a smooth wave.
//
// The whole sentence appears at once in a hard-coded highlight yellow
// (#FFDB92). Then the primary text color flows across it left-to-right in
// reading order. Each word eases from yellow to primary over a short moment,
// and neighbouring words overlap, so instead of discrete "jumps" you get a soft
// band of colour travelling across the line that the eye can follow.
//
// Three knobs control the feel (see below):
//   STAGGER < DURATION  -> words overlap -> the wave looks continuous.
//   STAGGER ≈ DURATION  -> words barely overlap -> more of a one-by-one snap.
// The end color is read from the --text-primary design token at runtime, so it
// stays in sync with tokens.css.

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const HIGHLIGHT = "#FFDB92"; // color the full sentence starts in (hard-coded, per design)
const START_DELAY = 0.4; // seconds the all-yellow sentence holds before the wave starts
const STAGGER = 0.1; // seconds between each word beginning its change (wave speed)
const DURATION = 0.5; // seconds for one word to ease from highlight to primary
// Easing for each word's colour change. A gentle ease-in-out keeps the leading
// edge of the wave soft rather than abrupt.
const EASE = [0.4, 0, 0.2, 1] as const;

// Resolve a CSS custom property (e.g. --text-primary) to a concrete color so
// Motion can animate to it. Reading the variable directly can hand back an
// unresolved "var(...)" chain, so we paint it onto a hidden probe element and
// read the computed color back.
function useResolvedColor(varName: string, fallback: string) {
  const [color, setColor] = useState(fallback);
  useEffect(() => {
    const probe = document.createElement("span");
    probe.style.color = `var(${varName})`;
    probe.style.position = "absolute";
    probe.style.opacity = "0";
    document.body.appendChild(probe);
    const resolved = getComputedStyle(probe).color;
    probe.remove();
    if (resolved) setColor(resolved);
  }, [varName]);
  return color;
}

type Props = {
  text: string;
  className?: string;
};

export default function WordReveal({ text, className }: Props) {
  // Fallback matches --text-primary's current value so there's no flash if the
  // probe hasn't resolved yet.
  const endColor = useResolvedColor("--text-primary", "#554a3b");
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  // Respect "reduce motion": show the finished text immediately, no animation.
  if (reduceMotion) {
    return (
      <p className={className} style={{ color: endColor }}>
        {text}
      </p>
    );
  }

  return (
    <p className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", whiteSpace: "pre" }}
          // Every word starts in the highlight color (so the whole sentence
          // shows in yellow at once), then eases to the primary color in turn.
          // The per-word delay steps across the sentence to make the wave.
          initial={{ color: HIGHLIGHT }}
          animate={{ color: endColor }}
          transition={{
            duration: DURATION,
            ease: EASE,
            delay: START_DELAY + i * STAGGER,
          }}
        >
          {i < words.length - 1 ? word + " " : word}
        </motion.span>
      ))}
    </p>
  );
}
