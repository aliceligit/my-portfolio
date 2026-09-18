// Copy and data for the Brightline Branded Fares case study page.
// Everything shown on the page's hero comes from this file — edit here, not in
// the component.

export interface CaseStudyFact {
  label: string;
  value: string;
}

export const brandedFareHero = {
  title: "Brightline Branded Fares",

  // The hero picture: the laptop and phone on a table with the designs on
  // their screens, exported from Figma as one image. To update it, re-export
  // the Hero frame at high resolution and replace this file.
  image: "/images/BL Branded Fare/hero.png",

  // A much smaller copy of the same picture, shown to browsers that support
  // it. Remake it with `node scripts/make-webp.mjs` after replacing the PNG.
  imageWebp: "/images/BL Branded Fare/hero.webp",

  alt: "A laptop and a phone on a table. The laptop shows the Brightline desktop fare selection with the Smart Saver, Smart Select and Smart Flex fares side by side; the phone shows the app's departure screen with Premium Select and Premium Flex fares.",

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
    "With fare tiers still pending, how do we <u>redesign the decision architecture</u> so any future fare structure <u>surfaces its value early enough</u> to stop revenue leaking to the cheapest tier?",
};

// ---------------------------------------------------------------------------
// Section 3 — Competitive Analysis
// ---------------------------------------------------------------------------

export interface SpectrumItem {
  name: string;
  description: string;
  // Which side of the centre line the card sits on.
  side: "left" | "right";
  // How far down the chart the card sits, and how far down its little line
  // meets the centre line — both as a percentage from the top of the chart.
  // Keep the list in top-to-bottom order: that is the order a screen reader
  // reads them in.
  top: number;
  dot: number;
  // Draws the card in Brightline yellow instead of the usual blue.
  highlight?: boolean;
}

export const brandedFareCompetitive = {
  eyebrow: "3. Competitive Analysis",

  headline:
    "I analyzed six transportation and hospitality brands—Amtrak, Eurostar, Trenitalia, Southwest, Delta, and Marriott—to understand how similar core services are packaged into differentiated fare products, and how those differences are merchandised to help customers perceive value and upgrade.",

  insightsLabel: "Key Insights:",

  // One entry per paragraph. <strong>…</strong> makes words bold.
  body: [
    "<strong>Companies are adopting two models for structuring fare products: a service × flexibility matrix, and bundled fare families</strong>. Amtrak, Trenitalia, and Delta use the matrix of class and flexibility, chosen progressively. Delta just widens the flexibility axis, folding in boarding priority, snacks, and seat selection, which adds granularity but requires closer reading. Eurostar and Southwest do the opposite, bundling flexibility directly into the fare itself with fewer choices and less calculation, and each fare given a distinct color to reinforce it as one complete product.",
    "For Brightline, this meant weighing users' mental model against business strategy to find the right fit. <strong>We ruled out a bundled fare family with an opt-in flexibility checkbox</strong>: Delta's own \"Accept Restriction\" checkbox shows that even clear, well-merchandised restriction messaging doesn't stop friction. Users still have to actively check a box, and they usually won't.",
  ],

  // The chart on the right: a line running from one model to the other, with
  // each company placed along it.
  chart: {
    topLabel: {
      title: "MATRIX MODEL",
      description: "Build your own: class × flexibility, chosen progressively",
    },
    bottomLabel: {
      title: "BUNDLED FAMILY MODEL",
      description:
        "Pre-packaged, named fares — flexibility baked in, not chosen",
    },
    caption: {
      title: "Fare Structure Models",
      description: "Amtrak, Eurostar, Trenitalia, Southwest, Delta, Marriott",
    },
    items: [
      {
        name: "Brightline",
        description: "Existing simple matrix (2 classes and 3 fares)",
        side: "right",
        top: 11.1,
        dot: 15.4,
        highlight: true,
      },
      {
        name: "Trenitalia",
        description: "Simple matrix",
        side: "left",
        top: 18.5,
        dot: 22.7,
      },
      {
        name: "Amtrak",
        description: "Simple matrix",
        side: "right",
        top: 30,
        dot: 34.2,
      },
      {
        name: "Delta",
        description:
          "Same matrix, but widens flexibility axis: + boarding priority, snacks, seat pick → more granular, more reading",
        side: "left",
        top: 35.1,
        dot: 45.4,
      },
      {
        name: "Eurostar",
        description: "Named, color-coded fares",
        side: "right",
        top: 59.2,
        dot: 63.5,
      },
      {
        name: "Southwest",
        description: "Named, color-coded fares",
        side: "left",
        top: 67.2,
        dot: 71.5,
      },
      {
        name: "Marriott",
        description: "Loyalty-tier bundles",
        side: "right",
        top: 75.1,
        dot: 79.4,
      },
    ] satisfies SpectrumItem[],
  },
};

// ---------------------------------------------------------------------------
// Section 4 — Design Exploration
// ---------------------------------------------------------------------------

export interface ExplorationOption {
  title: string;
  // One entry per paragraph.
  body: string[];
  // The recording, and the still frame shown until it has loaded. Make both
  // from the exported GIF — see the commands in CLAUDE.md.
  video: string;
  poster: string;
  // Describes the recording for screen readers.
  alt: string;
  // Which side of the row the phone sits on.
  phoneSide: "left" | "right";
}

export const brandedFareExploration = {
  eyebrow: "4. Design Exploration",

  headline:
    "Initially, the business leaned toward a new fare family. From there, my exploration focused on two questions: how clearly each fare communicates its value, and how the selection flow itself guides the decision.",

  options: [
    {
      title: "Option 1: Progressive Disclosure with Class Toggle",
      body: [
        "Introduces a high-level toggle on the train selection page to switch between fare classes. Detailed benefits remain on a subsequent page.",
        "It exposes the visibility of higher value classes with manageable cognitive load. But it still forces users to click through to see each fare and details. It forces back-and-forth navigation to compare trains.",
      ],
      video: "/images/BL Branded Fare/option-1.mp4",
      poster: "/images/BL Branded Fare/option-1-poster.webp",
      alt: "The first option played through on a phone: picking dates, then a separate Select Fare page with a Smart, New Class and Premium toggle across the top and each class's benefits underneath.",
      phoneSide: "left",
    },
    {
      title: "Option 2: Inline Fare Comparison",
      body: [
        "Embeds all fare classes and key benefits directly within each train card, turning the page into a unified decision surface.",
        "It put the heavy choices up front, eliminated extra navigation steps and enabled instant comparison across trains and classes. The risk was noise. If we didn't design it carefully, the screen would turn into a wall of text and numbers. My job was to make all that information fit without breaking the experience.",
      ],
      video: "/images/BL Branded Fare/option-2.mp4",
      poster: "/images/BL Branded Fare/option-2-poster.webp",
      alt: "The second option played through on a phone: the departure list where each train card opens to show the Smart, New and Premium fares side by side with their benefits and prices.",
      phoneSide: "right",
    },
  ] satisfies ExplorationOption[],
};
