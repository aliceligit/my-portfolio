// Copy for the About page. Edit the words here — layout and animation live in
// the components (AboutHero, DesignPhilosophy, and the WordReveal animation).

export const aboutHero = {
  // The big intro line. Each word animates in (see the WordReveal animation):
  // it first appears in a hard-coded highlight yellow (#FFDB92) and then settles
  // to the primary text color, one word after another.
  description:
    "Design is how I make sense of the world—from the spaces we occupy to the digital products we touch. It’s my framework for uncovering clarity in chaos, and my commitment to building things that leave a lasting, meaningful impact.",
  headshot: {
    src: "/images/Headshot.svg",
    alt: "Portrait of Alice Li",
  },
};

// The "Design Philosophy" card below the hero.
export const philosophyTitle = "Design Philosophy";

export interface Philosophy {
  icon: string; // path to the icon SVG in /public/images
  title: string;
  body: string;
}

export const philosophies: Philosophy[] = [
  {
    icon: "/images/Icon-Rectangle.svg",
    title: "Fall in Love with the Problem First",
    body: "My background in architectural design taught me that a great solution cannot exist without a deeply understood problem. If a problem is ambiguous, my first step is to define it. I believe in constantly questioning, challenging, and redefining the brief until the true core issue is uncovered. Designing for the wrong problem is just wasted energy; finding the right one is where great design begins.",
  },
  {
    icon: "/images/Icon-Polygon.svg",
    title: "The Architecture of “Less is More”",
    body: "In architecture, every line on a blueprint has a structural purpose. I carry that same discipline into digital spaces: every pixel, interaction, and stroke must matter. True minimalism isn’t just about aesthetics; it’s about eliminating noise to bring clarity and delight to the user, which inherently drives value and revenue for the business.",
  },
  {
    icon: "/images/Icon-Ellipse.svg",
    title: "Design as a Bridge",
    body: "Design is never art for art’s sake—it is a strategic tool. It functions as a bridge that connects human needs with business objectives. To build an effective bridge, I operate with radical empathy for the user while deeply immersing myself in the business logic, ensuring that the final product serves both harmoniously.",
  },
];
