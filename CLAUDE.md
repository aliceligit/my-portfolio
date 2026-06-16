# Alice Li — Portfolio Website

## About the owner

Alice is a UX designer with no coding background. She edits this project by
asking Claude in conversation — she never touches code directly. Explain
everything in plain language. Maintainability is the #1 priority.

## Stack

- **Astro** — static site framework (generates fast pages)
- **React** — used only for interactive/animated components
- **Motion** (formerly Framer Motion) — animation library for React components

## Folder structure

```
my-portfolio/
├── CLAUDE.md              ← You are here. Project docs for future sessions.
├── public/
│   └── images/            ← All images (photos, screenshots, icons)
├── src/
│   ├── styles/
│   │   └── tokens.css     ← Design tokens as CSS variables (single source of truth)
│   ├── content/           ← All copy, text, and data (populated later)
│   ├── components/
│   │   └── animations/    ← One file per animation/interaction
│   ├── layouts/
│   │   └── BaseLayout.astro  ← Shared HTML shell used by every page
│   └── pages/
│       └── index.astro    ← Home page (uses BaseLayout)
└── package.json
```

## Where things live

| What you want to change     | Where to find it                  |
|-----------------------------|-----------------------------------|
| Colors, fonts, spacing      | `src/styles/tokens.css`           |
| Page text and copy          | `src/content/`                    |
| Images and photos           | `public/images/`                  |
| Animations and interactions | `src/components/animations/`      |
| Page structure and layout   | `src/layouts/BaseLayout.astro`    |
| Individual pages            | `src/pages/`                      |

## Conventions

1. **Content is separate from layout.** Text, data, and copy live in
   `src/content/`, not embedded in component files.
2. **One animation per file.** Each interaction gets its own small, named file
   in `src/components/animations/`.
3. **Design tokens in one place.** All colors, fonts, sizes, spacing, and radii
   come from `src/styles/tokens.css`. Never hard-code these values elsewhere.
4. **Astro for pages, React only for interactivity.** Static parts use Astro
   components. React is only used when something needs to be interactive or
   animated.

## Design system

Tokens are pulled from the Figma file "Portfolio / Case Study" and stored as CSS
custom properties in `src/styles/tokens.css`. The file has two layers:

- **Brand tokens** — raw color hex codes, the spacing scale, and font families
- **Mapped tokens** — semantic names (like `--text-primary`, `--surface-secondary`)
  that reference brand tokens, so changing a brand color updates everywhere

Font families: Cormorant Garamond, Figtree, Geist, Jersey 10.

## Figma source

- **File:** Portfolio / Case Study
- **URL:** https://www.figma.com/design/uHIxcwkYnCgelkeVNSE5Cx/Portfolio---Case-Study
- **Library:** Published as a team library under "Alice" team

## Commands

- `npm run dev` — start local dev server
- `npm run build` — build for production
- `npm run preview` — preview production build locally
