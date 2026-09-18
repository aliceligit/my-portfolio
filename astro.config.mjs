// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  vite: {
    optimizeDeps: {
      // matter-js (the hero pill physics) is only loaded at the moment the
      // pills fall, so the dev server doesn't notice it at startup. Naming it
      // here makes the dev server prepare it up front — otherwise the very
      // first scroll can fail to load it and the pills never drop.
      include: ["matter-js"],
    },
  },
});