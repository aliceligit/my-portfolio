// HeroSlider — the video showcase at the top of a case study page.
//
// One slide sits large in the middle; the slides either side peek in from the
// edges, smaller and faded. Underneath is a row of five dots on a line:
//
//   • the slider moves to the next slide on its own once the current slide's
//     time (set per slide in the content file) is up, and loops back to the
//     first one at the end;
//   • clicking a dot jumps straight to that slide and restarts the timer;
//   • the label of the slide currently on screen is shown under its dot.
//
// All sizes, colors, and spacing live in CaseStudyHero.astro.

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { HeroSlide } from "../../content/brightlineLoyalty";

// Animated GIFs are shown as images; everything else is treated as a video file.
const isGif = (file: string) => file.toLowerCase().endsWith(".gif");

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Move to the next slide when this one's time is up. The timer restarts
  // whenever `active` changes — including when a dot is clicked.
  useEffect(() => {
    const seconds = slides[active]?.seconds ?? 10;
    const timer = window.setTimeout(
      () => setActive((current) => (current + 1) % slides.length),
      seconds * 1000,
    );
    return () => window.clearTimeout(timer);
  }, [active, slides]);

  // Play the middle video from the start; keep the ones off to the side paused.
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active) {
        video.currentTime = 0;
        void video.play().catch(() => {
          /* Some browsers block autoplay — the poster image stays up. */
        });
      } else {
        video.pause();
      }
    });
  }, [active]);

  // How many places this slide sits from the middle one (…-1, 0, 1…), taking
  // the shorter way around so the slider loops instead of rewinding.
  const offsetFrom = (index: number) => {
    const count = slides.length;
    let offset = index - active;
    if (offset > count / 2) offset -= count;
    if (offset < -count / 2) offset += count;
    return offset;
  };

  return (
    <div className="slider">
      <div className="slider__stage">
        {slides.map((slide, i) => (
          <div
            key={slide.label}
            className={`slider__slide${i === active ? " is-active" : ""}`}
            style={{ "--offset": offsetFrom(i) } as CSSProperties}
            aria-hidden={i !== active}
          >
            {!slide.video ? (
              <div className="slider__placeholder" />
            ) : isGif(slide.video) ? (
              // A GIF can't be paused, so only the slide in the middle gets the
              // animated file — the ones off to the side show a still instead.
              // The still also stands in while the animation loads, and means
              // the big files are only fetched as each slide comes round.
              <>
                <img
                  className="slider__media"
                  src={slide.poster || slide.video}
                  alt=""
                  loading={i === active ? "eager" : "lazy"}
                  decoding="async"
                />
                {i === active && slide.poster && (
                  <img
                    className="slider__media slider__media--playing"
                    src={slide.video}
                    alt=""
                    decoding="async"
                  />
                )}
              </>
            ) : (
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                className="slider__media"
                src={slide.video}
                poster={slide.poster || undefined}
                loop
                muted
                playsInline
                preload="metadata"
              />
            )}
          </div>
        ))}
      </div>

      <div className="slider__track">
        {slides.map((slide, i) => (
          <button
            key={slide.label}
            type="button"
            className="slider__dot"
            aria-current={i === active}
            aria-label={`Show ${slide.label}`}
            onClick={() => setActive(i)}
          >
            <span className="slider__label" aria-hidden="true">
              {slide.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
