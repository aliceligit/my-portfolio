// ProblemSlides — the picture card on the right of the Problem section.
//
// It shows one picture at a time with a caption underneath. The circular arrow
// button steps to the next picture and loops back to the first from the last,
// where the arrow flips to point back up.
//
// The pictures, captions and arrow all come from src/content/, and the styling
// lives in CaseStudyProblem.astro.
import { useState } from "react";

interface Slide {
  image: string;
  alt: string;
  caption: string;
}

interface Props {
  slides: Slide[];
  arrow: string;
}

export default function ProblemSlides({ slides, arrow }: Props) {
  const [current, setCurrent] = useState(0);

  const isLast = current === slides.length - 1;
  const next = () => setCurrent(isLast ? 0 : current + 1);

  return (
    <div className="problem-slides">
      <div className="problem-slides__stage">
        {slides.map((slide, i) => (
          <img
            key={slide.image}
            className={`problem-slides__image${i === current ? " is-active" : ""}`}
            src={slide.image}
            alt={slide.alt}
            /* Only the first picture is worth loading straight away. */
            loading={i === 0 ? "eager" : "lazy"}
            aria-hidden={i === current ? undefined : true}
          />
        ))}
      </div>

      <div className="problem-slides__bar">
        <p className="problem-slides__caption">{slides[current].caption}</p>
        <p className="problem-slides__counter">
          {current + 1}/{slides.length}
        </p>
        <button
          className="problem-slides__next"
          type="button"
          onClick={next}
          aria-label={
            isLast
              ? "Back to the first picture"
              : `Show picture ${current + 2} of ${slides.length}`
          }
        >
          <img
            className={`problem-slides__arrow${isLast ? " is-up" : ""}`}
            src={arrow}
            alt=""
            width="40"
            height="40"
          />
        </button>
      </div>
    </div>
  );
}
