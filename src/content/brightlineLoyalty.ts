// Copy and data for the Brightline Loyalty Ecosystem case study page.
// Everything shown on the page's hero comes from this file — edit here, not in
// the component.

export interface HeroSlide {
  // Shown under the dot while this slide is on screen.
  label: string;
  // Path to the moving image for this slide. Either a GIF or a video file
  // (.mp4) — both work. The path starts at the public folder, so
  // "public/images/BL Loyalty/opt-in.gif" is written as
  // "/images/BL Loyalty/opt-in.gif". Leave "" to show a plain placeholder.
  video: string;
  // A still frame of the clip above. It's shown on the two slides either side of
  // the middle one (a GIF can't be paused, so the side slides show this instead
  // of animating), and it stands in until the clip has loaded. The "-still"
  // files were made from the first frame of each GIF. Leave "" for none.
  poster: string;
  // How long this slide stays on screen before the slider moves on. Each one is
  // set to its clip's length, so the clip plays through once before moving on.
  seconds: number;
}

export interface CaseStudyFact {
  label: string;
  value: string;
}

export const brightlineHero = {
  title: "Brightline Loyalty Ecosystem",

  // The five sections the dots switch between.
  slides: [
    {
      label: "Opt-in",
      video: "/images/BL Loyalty/opt-in.gif",
      poster: "/images/BL Loyalty/opt-in-still.gif",
      seconds: 18,
    },
    {
      label: "Earn & Redeem",
      video: "/images/BL Loyalty/earn and redeem.gif",
      poster: "/images/BL Loyalty/earn and redeem-still.gif",
      seconds: 11,
    },
    {
      label: "Dashboard",
      video: "/images/BL Loyalty/Dashboard.gif",
      poster: "/images/BL Loyalty/Dashboard-still.gif",
      seconds: 11,
    },
    {
      label: "Campaigns",
      video: "/images/BL Loyalty/Campaigns.gif",
      poster: "/images/BL Loyalty/Campaigns-still.gif",
      seconds: 9,
    },
    {
      label: "Cross Platform",
      video: "/images/BL Loyalty/Cross platform.mp4",
      poster: "/images/BL Loyalty/Cross platform-still.gif",
      seconds: 14,
    },
  ] as HeroSlide[],

  // The row of details under the title.
  facts: [
    { label: "ROLE", value: "Lead Product Designer" },
    { label: "TIMELINE", value: "2024-2025" },
    { label: "TEAM", value: "PM, Revenue Team, Business Analyst, 3 Engineers" },
    { label: "PLATFORM", value: "iOS . Responsive Web" },
  ] as CaseStudyFact[],
};

// Section 1 — "The Tension". Prose on the left, three question cards on the
// right. The cards number themselves from their order in this list, so adding
// or reordering a question renumbers them automatically.
export const brightlineTension = {
  eyebrow: "1. The Tension",
  headline: "Three core questions we had to answer",

  // Paragraphs above the bullet list.
  intro: [
    "Brightline is a high-premium, high-speed ecosystem, breaking standard regional transit expectations:",
  ],

  bullets: [
    "Not a shopping app where users casually browse.",
    "Not local transit relying on mindless, tap-and-go utility.",
    "Not traditional airlines or railway with complex status tiers and rulebooks.",
  ],

  // Paragraphs below the bullet list.
  outro: [
    "The intercity service balances a dual reality: leisure riders actively track reward points, while business commuters book directly on the platform under intense time pressure. Here, a single second of UX friction doesn't just stall checkout, it blinds users to reward value and risks a missed train. To serve both segments seamlessly, I had to answer three core architectural questions:",
  ],

  questions: [
    {
      title: "The Friction",
      text: "How do we prompt users to enroll in a new program without interrupting a high-conversion, high-revenue booking funnel?",
    },
    {
      title: "Value Perception",
      text: "How do we make an abstract point balance feel like real financial value to a passenger at the exact moment they are looking at costs?",
    },
    {
      title: "The Utility",
      text: "How do we make the complex rules of earning and redeeming points instantly understandable, preventing user errors before they happen?",
    },
  ],
};

// Section 2 — "Strategic Sequencing". Story on the left, the touch point map
// on the right. The map is a picture exported from Figma; to update it, replace
// the file in public/images/BL Loyalty/ and keep the same name.
export const brightlineSequencing = {
  eyebrow: "2. Strategic Sequencing",
  headline: "Using the roadmap as a systems blueprint",

  paragraphs: [
    "The product roadmap was set by leadership to manage technical risk: Phase 1 would launch the core transactional features, and Phase 2 would introduce the growth mechanics.",
    "As the designer, I used it as a structural blueprint. Understanding the phased plan allowed me to view the entire product as an interconnected ecosystem from day one, rather than a collection of isolated screens. It forced me to study each possible touch point throughout the journey, and match user motivation with business objectives.",
  ],

  figure: {
    // The two pictures that stack to make the figure. They're exported from
    // Figma WITHOUT the caption — the caption below is real text on the page,
    // so it stays sharp, can be read aloud, and can be edited right here.
    // `alt` is read aloud by screen readers and shown if a picture won't load.
    images: [
      {
        src: "/images/BL Loyalty/roadmap-phases.png",
        alt: "A roadmap chart of the loyalty features month by month: Phase 1 covers the opt-in program, earning rewards, redeeming rewards and viewing rewards; Phase 2 covers refer a friend and rewards campaigns.",
        width: 1160,
        height: 253,
      },
      {
        src: "/images/BL Loyalty/touchpoint-grid.png",
        alt: "A grid mapping each stage of the rider journey — search, results, checkout, confirmation, pre-trip and post-trip — to its loyalty touch point, the rider's motivation, and the business objective.",
        width: 1160,
        height: 440,
      },
    ],
    caption:
      "Fig - Loyalty touch points mapping made by me based on the roadmap. The colored shadow matches the features in the roadmap.",
  },
};

// Section 3 — "Reducing Friction in Program Opt-in".
// The four options on the left are buttons: clicking one shows its picture and
// its three ratings in the dark card on the right.
//
// A rating is "low", "medium" or "high" — that fills 1, 2 or 3 dots. Leave it
// as "" and the rating shows a dash, meaning "not filled in yet".
export type Rating = "" | "low" | "medium" | "high";

export interface FrictionOption {
  // Shown in the numbered list. The number comes from the order in this list.
  label: string;
  // A picture or video for this option, e.g. "/images/BL Loyalty/opt-in.gif"
  // or ".../opt-in.mp4". Leave "" to show the empty panel.
  media: string;
  // Describes the picture for screen readers. Leave "" if there's no picture.
  alt: string;
  friction: Rating;
  motivation: Rating;
  techEffort: Rating;
}

export const brightlineFriction = {
  eyebrow: "3. Reducing Friction in Program Opt-in",
  headline: "Enrolling users without breaking the high-revenue booking funnel",
  intro:
    "I brainstormed possible enrolling touch points for both non-signed up users and signed up users, and analyzed friction level, user motivation, and tech effort along with PM and engineers. We decided to implement option 1 and 2 firsts for their low friction in the flow and low tech effort. The opt-in rate is over 50% one month (web + app) after launching, proving they are effective.",

  options: [
    {
      label: "Opt in as the final step of account creation for new users",
      media: "",
      alt: "",
      friction: "low",
      motivation: "high",
      techEffort: "low",
    },
    {
      label: "Show existing users an opt-in modal on the Profile after signing in",
      media: "",
      alt: "",
      friction: "low",
      motivation: "low",
      techEffort: "low",
    },
    {
      label: "Offer the opt-in during checkout",
      media: "",
      alt: "",
      friction: "high",
      motivation: "medium",
      techEffort: "high",
    },
    {
      label: "Show an opt-in reminder on the booking confirmation page",
      media: "",
      alt: "",
      friction: "low",
      motivation: "high",
      techEffort: "high",
    },
  ] as FrictionOption[],
};

// Section 4 — "Increasing Value Perception in Earning".
// This section is one grey card holding three stories, separated by white
// dividing lines:
//   A. the two user mindsets, with the donut chart
//   B. deferred routing, with the dark option viewer (same idea as section 3:
//      clicking an option swaps the picture and the ratings)
//   C. celebrating the earning moment, with a picture
export interface RoutingOption {
  // Shown in the list. The number comes from the order in this list.
  label: string;
  // A picture or video for this option, e.g. "/images/BL Loyalty/routing.gif"
  // or ".../routing.mp4". Leave "" to show the empty panel.
  media: string;
  // Describes the picture for screen readers. Leave "" if there's no picture.
  alt: string;
  // "low", "medium" or "high" — fills 1, 2 or 3 dots. "" shows a dash.
  valuePerception: Rating;
  cognitiveLoad: Rating;
}

export const brightlineValue = {
  eyebrow: "4. Increasing Value Perception in Earning",
  headline: "Two user mindsets require two different value perception strategies",

  // A — the mindsets story and the donut chart beside it.
  mindsets: {
    intro:
      "I asked myself who are our customers and how to maximize their value perception towards loyalty rewards, and requested data from business analysts. The commercial data revealed two opposite user mindsets. The Floridian either for leisure travel or visiting family/friends, takes up the majority customer portion. They tended to accumulate points to lower their future travel costs. While business and domestic/international travelers are less price-sensitive and less loyal. The team assumes they prefer routing their earnings to global partners like United Airlines.",
    chart: {
      src: "/images/BL Loyalty/value-perception-chart.png",
      alt: "A donut chart of Brightline's customers. About 65% are point accumulators — leisure travellers and people visiting family or friends. About 35% are partner-oriented — business and international travellers.",

      // Hovering (or tabbing to) a half of the outer ring shows one of these
      // cards. The order matters: the first is the green "point accumulators"
      // half, the second is the orange "partner-oriented" half.
      tooltips: [
        {
          // Read out to screen readers, since a shape can't be read otherwise.
          ringLabel: "Point accumulators — about 65% of customers",
          icon: "/images/BL Loyalty/tooltip-liquid.svg",
          title: "Points as liquid value",
          text: "Price-sensitive, high-frequency, most loyal. They accumulate points to lower the cost of future trips.",
          // How wide the card is allowed to run before the text wraps.
          width: "187px",
        },
        {
          ringLabel: "Partner-oriented — about 35% of customers",
          icon: "/images/BL Loyalty/tooltip-transfer.svg",
          title: "Points as transferable currency",
          text: "Less price-sensitive, less loyal. They value points more when routed to global airline/hotel partners.",
          width: "255px",
        },
      ],
    },
  },

  // B — deferred routing, with the two options in the dark viewer.
  routing: {
    headline: "Deferred routing protects checkout velocity",
    paragraphs: [
      'This created a major design tension: do we let users choose their loyalty routing directly at the checkout? I created two distinct options. We landed on Option1. The checkout must remain a high-velocity path without introducing extra cognitive load. The UI focuses purely on immediate value calculation. Once the transaction is secure, the post-purchase dashboard handles the complexity, offering a clean, one-click action button: "Transfer Points to Partners."',
    ],
    options: [
      {
        label: "Users route their points to Partner post-purchase via dashboard.",
        media: "",
        alt: "",
        valuePerception: "medium",
        cognitiveLoad: "low",
      },
      {
        label:
          "Forcing users to select Brightline or Partner points inside the checkout",
        media: "",
        alt: "",
        valuePerception: "high",
        cognitiveLoad: "high",
      },
    ] as RoutingOption[],
  },

  // C — the confirmation screen story and its picture.
  celebration: {
    headline: "Celebrating the earning moment",
    paragraphs: [
      "Every earning is worth celebrating. The new confirmation screen shows both the rewards program branding and the points to be earned from this trip.",
    ],
    // Leave media as "" to show the empty white panel.
    media: "",
    alt: "",
  },
};

// Section 5 — "Smooth Redeeming". The story on the left, one picture on the
// right. The blank line between the two paragraphs comes from them being two
// separate entries in the list below.
export const brightlineRedeeming = {
  eyebrow: "5. Smooth Redeeming",
  headline: "From input box to stepper to prevent errors",

  paragraphs: [
    "Six months after launching, the business introduced a strict redeem constraint: a redemption threshold and increment redemption of 1,000 points. Originally, the system allowed users to type any arbitrary number into an open text box for redemption. If keeping the UI, users come across error messages and a lot of frustration during checkout.",
    "I replaced the input box with a stepper component. It dynamically defaults to the minimum threshold. Users can only increment or decrement by valid, predefined milestones. The interface physically prevents the error state from ever occurring.",
  ],

  // Leave media as "" to show the empty white panel.
  media: "",
  alt: "",
};

// Section 6 — "Dashboard". Same shape as section 5: the story on the left, one
// picture on the right.
//
// Anything wrapped in **two stars** in the paragraphs below comes out bold on
// the page, so you can emphasise a phrase without touching any code.
export const brightlineDashboard = {
  eyebrow: "6. Dashboard",
  headline: "Designing a points dashboard that provides assurance",

  paragraphs: [
    "I aligned with the product and business teams to define our immediate scope. Because elite tiers were a far-future business objective, we deliberately bypassed the status tracker to focus entirely on a high-clarity transactional wallet.",
    "The challenge was ensuring the point wallet was both highly motivating and absolute in its transparency. To achieve this, I mapped the visualization engine to loop dynamically through four distinct states based on the intersection of **available points**, **pending points**, and **the minimum redemption threshold**.",
  ],

  // Leave media as "" to show the empty white panel.
  media: "",
  alt: "",
};

// Section 7 — "Campaign System". One grey card holding:
//   - the heading and a full-width opening paragraph
//   - two rows, each a picture on one side and a short story on the other
//   - a white dividing line
//   - the "Refer a Friend" story with one full-width picture below it
//
// As in section 6, anything wrapped in **two stars** comes out bold.
export interface CampaignRow {
  title: string;
  paragraphs: string[];
  // Which side the picture sits on for this row. The other side gets the words.
  // On a phone the words always come first and the picture drops below them.
  mediaSide: "left" | "right";
  // Leave media as "" to show the empty white panel.
  media: string;
  alt: string;
}

export const brightlineCampaign = {
  eyebrow: "7. Campaign",
  headline: "Campaign System",

  intro:
    "Loyalty campaigns are members-only and **opt-in is a qualification gate**, not acquisition: bonus points go only to riders who deliberately signed up, not passively to everyone. That set the two metrics every decision below optimizes for: **opt-in rate** and **conversion rate**.",

  rows: [
    {
      title: "Why homepage and profile, not trip",
      paragraphs: [
        "Placement matched campaigns to a moment, not a page. Homepage is the open-app moment, before a member's committed to a task, so a campaign is additive. Profile is the check-points moment, a member's already there, so a campaign nearby is caught in passing. Trip doesn't get one: it's where members manage a booking already made, a utility task where a campaign competing for attention against a ticket someone needs in five minutes is noise, not opportunity.",
        "**Risk accepted:** excluding Trip gives up a warm, actively-traveling audience as an opt-in surface, a bet that a reliable utility screen is worth more than the lift it could produce.",
      ],
      mediaSide: "left",
      media: "",
      alt: "",
    },
    {
      title: "Card versus detail view",
      paragraphs: [
        "Same split at a component level. The card (reward, what it is, deadline) is tuned for opt-in; the detail view (rules, activation, progress tracker) is tuned for conversion. The tracker only moves on completed trips, never engagement, so it can't be gamed into showing conversion the ridership didn't actually earn.",
        "**Risk accepted:** withheld terms protect the tap but risk conversion if the fine print surprises a member mid-funnel, trading a stronger opt-in number for pressure on the detail view to close that gap fast.",
      ],
      mediaSide: "right",
      media: "",
      alt: "",
    },
  ] as CampaignRow[],

  // The full-width story and picture below the dividing line.
  referral: {
    title: "Refer a Friend",
    paragraphs: [
      "Referral has two sides — a referrer and a referee who may be new to Brightline. The conversion depends on the referee's state they arrive in. So rather than a single flow, I designed for the full matrix: existing member or brand new, logged in or logged out since each case changes what the reward means and what's required to grant it.",
    ],
    media: "",
    alt: "",
  },
};
