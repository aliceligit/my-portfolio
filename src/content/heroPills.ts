// Pills that float around the hero, then fall and stack when the page scrolls.
// Edit this list to change the wording, colors, or where each pill sits.
//
//   text:   the words shown on the pill (change freely)
//   color:  "red" | "blue" | "yellow" | "grey"  — the soft glow color
//   x, y:   resting position as a percentage of the hero area
//           (x: 0 = far left, 100 = far right · y: 0 = top, 100 = bottom)
//   from:   which edge the pill flies in from on page load
//           "left" | "right" | "top" | "bottom"

export interface HeroPill {
  text: string;
  color: "red" | "blue" | "yellow" | "grey";
  x: number;
  y: number;
  from: "left" | "right" | "top" | "bottom";
}

export const heroPills: HeroPill[] = [
  { text: "senior product designer", color: "blue", x: 38, y: 25, from: "left" },
  { text: "AI-first design", color: "red", x: 60, y: 17, from: "top" },
  { text: "defining problems", color: "grey", x: 82, y: 31, from: "right" },
  { text: "scaling products", color: "yellow", x: 88, y: 53, from: "right" },
  { text: "optimizing conversion", color: "blue", x: 50, y: 69, from: "bottom" },
  { text: "enterprise & startups", color: "yellow", x: 15, y: 64, from: "left" },
  { text: "accelerating growth", color: "red", x: 74, y: 78, from: "right" },
  { text: "designing systems", color: "grey", x: 32, y: 84, from: "bottom" },
];
