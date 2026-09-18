// Copy and data for the Brightline Branded Fares case study page.
// Everything shown on the page's hero comes from this file — edit here, not in
// the component.

export interface CaseStudyFact {
  label: string;
  value: string;
}

export const brandedFareHero = {
  title: "Brightline Branded Fares",

  // The photo behind everything: the laptop and phone sitting on a table.
  scene: "/images/BL Branded Fare/hero-scene.png",

  // The two designs laid over the blank screens in that photo. Each one has a
  // matching "mask" file — the outline of that screen, already tilted to the
  // same angle as the photo — which trims the design to fit the screen exactly.
  // If you swap a design for a newer screenshot, keep its mask as it is.
  screens: [
    {
      name: "desktop",
      image: "/images/BL Branded Fare/hero-desktop.png",
      mask: "/images/BL Branded Fare/hero-desktop-mask.svg",
      alt: "Brightline desktop fare selection, showing the Smart Saver, Smart Select and Smart Flex fares side by side",
    },
    {
      name: "mobile",
      image: "/images/BL Branded Fare/hero-mobile.png",
      mask: "/images/BL Branded Fare/hero-mobile-mask.svg",
      alt: "The Brightline app departure screen, showing Premium Select and Premium Flex fares",
    },
  ],

  // The four details under the title.
  facts: [
    { label: "ROLE", value: "Lead Product Designer" },
    { label: "TIMELINE", value: "2026 Q3" },
    {
      label: "TEAM",
      value: "PM, Revenue Management, Business Analyst, Branding, Engineers",
    },
    { label: "PLATFORM", value: "iOS . Responsive Web" },
  ] satisfies CaseStudyFact[],
};

// ---------------------------------------------------------------------------
// Section 1 — The Problem
// ---------------------------------------------------------------------------

export interface ProblemSlide {
  // The picture shown in the top of the card.
  image: string;
  // Describes the picture for screen readers and if the image fails to load.
  alt: string;
  // The line in the dark bar underneath.
  caption: string;
}

export const brandedFareProblem = {
  // The small italic line above the title. The number is part of the text, so
  // if you reorder sections later, renumber them here.
  eyebrow: "1. The Problem",

  headline:
    "Brightline needed to grow revenue per booking. Internal analysis had identified a leak: short-haul riders weren't converting to premium fares. Both business and product had their hypothesis.",

  // One entry per paragraph. To make words bold, wrap them in <strong>…</strong>
  // — everything else is plain text.
  body: [
    "The business hypothesis is: the fare ladder was too coarse. For a 45-minute trip, riders didn't perceive the premium bundled benefits as worth the price gap. Adding more granular fare tiers would let riders self-select into the right value tier, capturing revenue currently leaking to the cheapest fare. That hypothesis was the brief I received.",
    "I audited the existing fare-selection flow against analytics and session data. It showed <strong>the existing premium fare had a visibility problem, and mobile users are anchored on the lowest fare</strong>. Adding more tiers to an invisible class wouldn't fix the leak on its own. I raised this with the PM and revenue lead. The conclusion: the business would keep restructuring fare tiers; product would own restructuring the decision architecture.",
  ],

  // The picture card on the right. The arrow button steps through these in
  // order and loops back to the first. Add a third entry and it just works.
  slides: [
    {
      image: "/images/BL Branded Fare/problem-mobile.png",
      alt: "The existing Brightline app fare-selection flow, annotated to show that the premium fare toggle had less than a 1% clicking rate and that all fares were only shown on the next page",
      caption:
        "Existing mobile fare-selection flow exposed higher-value fare visibility problem.",
    },
    {
      image: "/images/BL Branded Fare/problem-web.png",
      alt: "The existing Brightline website fare selection, annotated to show all three fares locked into a rigid grid",
      caption:
        "Existing web makes fares sit in a rigid grid. Adding more fares will break the grid and cause visibility issue.",
    },
  ] satisfies ProblemSlide[],

  // The circular arrow on the slide card. It points down on every slide except
  // the last, where it flips to point back up to the start.
  arrow: "/images/BL Branded Fare/slide-arrow.svg",
};

// ---------------------------------------------------------------------------
// Section 2 — The UX Goal
// ---------------------------------------------------------------------------

export const brandedFareGoal = {
  eyebrow: "2. The UX Goal",

  // <u>…</u> underlines a phrase, as in the design.
  headline:
    "With fare tiers are still pending, how do we <u>redesign the decision architecture</u> so any future fare structure <u>surfaces its value early enough</u> to stop revenue leaking to the cheapest tier?",
};
