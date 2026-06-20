// The three cards in the "Achievement" section (between the hero and case
// studies). Edit the heading or body text here — the layout adapts to the
// heading length automatically.

export interface Achievement {
  heading: string;
  body: string;
}

export const achievements: Achievement[] = [
  {
    heading: "0 → 1",
    body: "Led multiple 0→1 web and mobile projects in fast-growing environments, championing tight cross-functional collaboration to ship impactful products.",
  },
  {
    heading: "20k → 800k",
    body: "Architected scalable core web experiences and exploration tools for PointsYeah, directly supporting massive platform user growth within a single year.",
  },
  {
    heading: "Design → Build",
    body: "Utilizing AI-assisted tools and vibe-coding to bridge the gap between intent and production, drastically accelerating team execution and design handoff.",
  },
];
