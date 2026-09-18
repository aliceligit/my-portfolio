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
