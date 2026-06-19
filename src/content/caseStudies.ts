// Case study cards shown in the "Case Studies" section on the home page.
// To add, remove, or edit a case study, just change this list — the layout
// updates automatically.
//
//   variant:   "wide"    = large card, image and text side by side (one per row)
//              "compact" = smaller card, image on top of text (shown two per row)
//   imageSide: which side the image sits on. Always applies to "wide" cards;
//              for "compact" cards it only matters in the side-by-side layout
//              shown on screens narrower than 1280px.
//   tags:      short labels shown above the title
//   image:     leave empty ("") for now — dark-grey placeholder is shown instead

export interface CaseStudy {
  variant: "wide" | "compact";
  imageSide?: "left" | "right";
  tags: string[];
  title: string;
  description: string;
  image: string;
}

export const caseStudies: CaseStudy[] = [
  {
    variant: "wide",
    imageSide: "left",
    tags: ["Tag 1", "Tag 2", "Tag 3"],
    title: "Case Study Title",
    description:
      "Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
    image: "",
  },
  {
    variant: "wide",
    imageSide: "right",
    tags: ["Tag 1", "Tag 2", "Tag 3"],
    title: "Case Study Title",
    description:
      "Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
    image: "",
  },
  {
    variant: "compact",
    imageSide: "left",
    tags: ["Tag 1", "Tag 2", "Tag 3"],
    title: "Case Study Title",
    description:
      "Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    image: "",
  },
  {
    variant: "compact",
    imageSide: "right",
    tags: ["Tag 1", "Tag 2", "Tag 3"],
    title: "Case Study Title",
    description:
      "Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    image: "",
  },
  {
    variant: "compact",
    imageSide: "left",
    tags: ["Tag 1", "Tag 2", "Tag 3"],
    title: "Case Study Title",
    description:
      "Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    image: "",
  },
  {
    variant: "compact",
    imageSide: "right",
    tags: ["Tag 1", "Tag 2", "Tag 3"],
    title: "Case Study Title",
    description:
      "Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    image: "",
  },
];
