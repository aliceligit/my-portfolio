# Scroll-driven storyboard (the pinned-stage method)

A section that **holds still while you scroll through it**, changing which step
is lit up and which recording is playing as you go. Used for Sections 5 and 6 of
the Brightline Branded Fares case study
(`src/components/sections/CaseStudyStoryboard.astro`).

One component covers both, because everything that makes it work — the runway,
the stage, the steps, the joining lines — is the same. A `media` prop picks the
shape:

- `media="phone"` (the default, Section 5) puts the recordings inside the
  iPhone frame with the steps either side of it.
- `media="web"` (Section 6) puts them inside the laptop mockup on the left with
  the steps stacked down the right, and no second column.

## When to use this instead of the no-pin method

`docs/scroll-linked-horizontal-pan.md` says to prefer the **no-pin** method,
because pinning needs extra scroll distance and that usually shows up as blank
space. That is still the right default.

This section is the exception the other doc allows for: the whole point of the
design is that the phone and the four steps **stay exactly where they are**
while the reader moves through them. And the objection doesn't apply here,
because the pinned stage is a full composition that fills the screen — there is
no blank space to see.

**Rule of thumb:** pin only when the design calls for something to hold still
*and* the thing holding still fills the screen. Otherwise, no-pin.

## How it works

Three pieces:

```
.storyboard            the grey card
  .storyboard__runway  a tall empty box — the only reason the section is
                       taller than the screen. Nothing is drawn in it.
    .storyboard__stage position: sticky; top: 0 — what you actually see
```

The runway is `100vh + steps × 72vh`. The stage sticks to the top of the screen
for as long as the runway lasts, so the reader scrolls `steps × 72vh` while
looking at a picture that doesn't move.

Which step you are on comes from how far into the runway you have scrolled:

```js
const travel   = runway.offsetHeight - stage.offsetHeight; // the stuck distance
const passed   = -runway.getBoundingClientRect().top;      // how far in we are
const progress = Math.min(Math.max(passed / travel, 0), 1);
const index    = Math.min(count - 1, Math.floor(progress * count));
```

Raise the `72vh` for a slower read, lower it for a quicker one.

## Things that bit us

**The nav floats over everything.** It is `position: fixed` and stays there. A
normal section scrolls underneath it, so only a sliver is ever hidden, but a
pinned stage sits still and stays covered — the heading would be unreadable the
whole time you are in the section.

The fix is the stage's `top`, not its padding: it sticks at `--nav-clear`
(96px) instead of 0, and gives up that much height. The card behind it still
runs to the top of the screen, so nothing looks cut off, and the 24px above the
eyebrow is untouched — which is what lines this section's heading up with every
other one when you scroll into it.

Because the stage now comes to rest short of the top, how far it has travelled
is measured **between the stage and the runway** rather than from the top of the
screen:

```js
const passed = stage.getBoundingClientRect().top - runway.getBoundingClientRect().top;
```

That reads 0 before it sticks and grows correctly afterwards, whatever
`--nav-clear` is set to.

**Recordings won't start off-screen.** Browsers stop a video that is playing out
of sight, so calling `play()` as the page loads does nothing. An
`IntersectionObserver` on the stage starts the recording when the section comes
into view and stops it when it leaves.

**There is no `loop`.** Each recording plays once and holds its last frame, so
nothing snaps back to the beginning while you are still reading. It restarts
from zero when you scroll back to that step.

**Steps are buttons, not just text.** Clicking one scrolls to the middle of its
stretch of the runway. That keeps the section usable from a keyboard and lets a
reader jump straight to the part they want.

**A token written as `var(--another-token)` can't be overridden halfway down.**
This section shrinks its own type in a short window. Setting
`--text-style-body-size` on the stage works, but it does **not** reach
`--text-style-body-emphasized-size`, because that one is written as
`var(--text-style-body-size)` in `tokens.css` and is worked out there, once.
Both have to be named. This only comes up when a section resizes its own type —
everywhere else the whole scale moves together in `tokens.css`.

**The devices are the real artwork, exported from Figma, not drawn in CSS.**
The phone is the "Apple iPhone 15 Pro Blue Titanium" frame and the laptop is the
"laptop mockup" frame, each exported as a WebP with the screen punched out of
it, and each lies *over* the recordings — so the bezel, the side buttons and the
Dynamic Island are all on top and the recording shows through the hole. Because the screen is a hole in the picture, the recordings need no
rounded corners of their own; the corners belong to the picture.

`scripts/make-device-frame.mjs` turns a fresh Figma export into either picture,
and explains at the top the things an export gets wrong on its own. The laptop
has one of its own: the mockup sits partly at negative coordinates in the Figma
file, and Figma will not export anything left of the page origin, so the rounded
left end of its base is missing. The script mirrors the right-hand side to put
it back, which works because the laptop is symmetric.

One trap that isn't in the picture at all: **the recording needs the screen's
rounded corners too.** The hole is rounded, but a recording sitting in a square
box keeps its square corners, and they stick out past the handset's rounded
ones as four sharp tabs. `.storyboard__screen` carries the same 44px corner the
hole does.

**The website recordings do not fit a laptop screen.** They are 1.47 wide for
each unit of height and the screen is 1.60, so about 8% of their height cannot
be shown. `object-position: top` takes it off the bottom: the top of each
recording carries the page header, while the bottom is a part-row that reads as
the page carrying on below the fold.

**Percentages measure different sides against different things.** The screen is
placed with `left`/`right` percentages (which count against the device's width)
and `top`/`bottom` percentages (which count against its height). The same is
true of `padding`, which counts against the *parent's* width on all four sides —
which is why it can't be used to place something inside a box of a fixed shape.

## On a narrow screen

Two columns of writing either side of a phone stop fitting at about 1089px.
Below that the phone moves above the writing, only the step you are on is shown,
and a row of four numbers takes over from the fading as the way to see where you
are. The heading also moves **out** of the pinned stage — on a phone it reads
first and scrolls away, leaving the whole screen for the storyboard. That is why
the heading appears twice in the markup, with one copy hidden at each width.
