// Makes a WebP copy of a picture, next to the original.
//
// WebP is a newer picture format that is far smaller than PNG for photographs
// at the same visible quality. The page shows the WebP to browsers that
// understand it and falls back to the PNG for any that don't, so nothing
// breaks either way.
//
// Run it after replacing any of the pictures listed below:
//
//   node scripts/make-webp.mjs
//
// To cover another picture, add its path to the list. You can also pass paths
// on the command line instead:
//
//   node scripts/make-webp.mjs "public/images/BL Branded Fare/hero.png"

import sharp from "sharp";
import { stat } from "node:fs/promises";

// The pictures that have a WebP companion. Add a line when you need another.
const PICTURES = ["public/images/BL Branded Fare/hero.png"];

// 82 is the sweet spot for photographs: no visible difference from the
// original, but a fraction of the size. Raise it if you ever see banding.
const QUALITY = 82;

const targets = process.argv.slice(2).length
  ? process.argv.slice(2)
  : PICTURES;

for (const source of targets) {
  const out = source.replace(/\.png$/i, ".webp");

  const before = (await stat(source)).size;
  const info = await sharp(source)
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(out);

  const mb = (n) => (n / 1024 / 1024).toFixed(2);
  const saved = Math.round((1 - info.size / before) * 100);
  console.log(
    `${out}\n  ${mb(before)} MB → ${mb(info.size)} MB  (${saved}% smaller, ${info.width}x${info.height})`,
  );
}
