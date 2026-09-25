// Turns a Figma export of a device mockup into the frame a storyboard section
// lays over its recordings.
//
// What comes out is a WebP with a hole where the screen is, so the recording
// underneath shows through and the bezel sits on top of it.
//
// Three things have to be fixed on the way, none of which Figma does for you:
//
//   1. The export has the section's grey background baked in, both around the
//      device and, on the phone, through the screen.
//   2. On the phone, the black glow layer behind the screen is not clipped to
//      the rounded corners, so the export has a small black square poking out
//      of each corner.
//   3. The screen has to be cut out around anything drawn on top of it — the
//      phone's Dynamic Island — rather than straight through it.
//
// The screen is found by flooding outwards from its middle rather than by
// clearing every pixel of that colour, so a matching pixel that belongs to the
// artwork is left alone. On the phone that flood also flows around the Dynamic
// Island, which is black, and so leaves the island behind.
//
// Usage:
//   node scripts/make-device-frame.mjs <device> <figma-export.png> [out.webp]
//
//   device   phone  — "Apple iPhone 15 Pro Blue Titanium", node-id 2568-31009
//            laptop — "laptop mockup", node-id 2596-27345
//            Export either as a PNG at 3x.

import sharp from "sharp";

const DEVICES = {
  phone: {
    // the device as it is drawn in Figma, in the design's own pixels
    width: 340,
    height: 697.869,
    // pure white would be wrong here: the phone's screen is empty in the
    // export, so it shows the same grey as the page behind it
    screenLevel: 245,
    // how far from that level still counts as screen. Generous here, because
    // the phone's screen and the page behind it are the same grey and only
    // the bezel separates them.
    tolerance: 20,
    screenSeed: [0.5, 0.6],
    // the outer edge of the handset, which everything is clipped to, plus the
    // side buttons that stand slightly proud of it
    clip: {
      body: { x: 1.84, y: 0, w: 336.128, h: 698.011, r: 56.503 },
      extras: [
        { x: 0, y: 136.921, w: 6.307, h: 28.646, r: 0.788 },
        { x: 0, y: 188.694, w: 6.307, h: 53.349, r: 0.788 },
        { x: 0, y: 256.235, w: 6.307, h: 53.349, r: 0.788 },
        { x: 340.071, y: 225.486, w: 6.307, h: 84.098, r: 0.788 },
      ],
    },
  },
  laptop: {
    width: 979.2474,
    height: 561.113,
    // this screen really is white
    screenLevel: 255,
    // Tight, and it has to be: white is only ten levels from the grey behind
    // the laptop, so a generous figure lets the screen leak out into the page
    // and take the whole picture with it.
    tolerance: 5,
    screenSeed: [0.5, 0.5],
    // the lid, the base and its shadow are an awkward shape to describe, and
    // nothing pokes outside them, so there is nothing to clip
    clip: null,
    // The mockup sits partly at negative coordinates in the Figma file, and
    // Figma will not export anything to the left of the page origin — so the
    // export loses the rounded left end of the laptop's base. The laptop is
    // symmetric, so that slice is rebuilt by mirroring the matching strip from
    // the right-hand side.
    rebuildLeftEdge: true,
  },
};

const [name, input, output] = process.argv.slice(2);
const device = DEVICES[name];

if (!device || !input) {
  console.error(
    "usage: node scripts/make-device-frame.mjs <phone|laptop> <export.png> [out.webp]",
  );
  process.exit(1);
}

const out =
  output ?? `public/images/BL Branded Fare/${name === "phone" ? "iphone" : name}-frame.webp`;

let image = sharp(input);
let { width: W, height: H } = await image.metadata();

// ---------------------------------------------------------------------------
// 0. Put back anything Figma cut off the left-hand side (see rebuildLeftEdge).
// ---------------------------------------------------------------------------
if (device.rebuildLeftEdge) {
  const raw = await image.ensureAlpha().raw().toBuffer();
  const plain = (x, y) => {
    const i = (y * W + x) * 4;
    return (
      Math.abs(raw[i] - 245) <= 3 &&
      Math.abs(raw[i + 1] - 245) <= 3 &&
      Math.abs(raw[i + 2] - 245) <= 3
    );
  };

  // The lid is inset from the base, so both its edges survived the cut and it
  // can say where the middle of the laptop really is.
  let lidLeft = W;
  let lidRight = -1;
  for (let y = Math.round(H * 0.15); y < Math.round(H * 0.75); y += 5) {
    for (let x = 0; x < W; x++) if (!plain(x, y)) { if (x < lidLeft) lidLeft = x; break; }
    for (let x = W - 1; x >= 0; x--) if (!plain(x, y)) { if (x > lidRight) lidRight = x; break; }
  }
  const middle = (lidLeft + lidRight) / 2;

  // The right-hand side is whole, so it says how wide a half should be.
  let rightMost = -1;
  for (let y = 0; y < H; y++)
    for (let x = W - 1; x > rightMost; x--) if (!plain(x, y)) { rightMost = x; break; }

  const missing = Math.round(rightMost - middle - middle);
  if (missing > 1) {
    const strip = await sharp(input)
      .extract({ left: W - missing, top: 0, width: missing, height: H })
      .flop()
      .toBuffer();
    const joined = await sharp({
      create: { width: W + missing, height: H, channels: 4, background: { r: 245, g: 245, b: 245, alpha: 1 } },
    })
      .composite([
        { input: strip, left: 0, top: 0 },
        { input: await sharp(input).toBuffer(), left: missing, top: 0 },
      ])
      .png()
      .toBuffer();

    image = sharp(joined);
    W += missing;
    console.log(`rebuilt ${missing}px of the laptop's left edge by mirroring`);
  }
}

const scale = W / device.width;
const pixels = await image.ensureAlpha().raw().toBuffer();

// ---------------------------------------------------------------------------
// 1 + 3. Clear the baked-in background: around the device, and the screen.
// ---------------------------------------------------------------------------
const near = (i, level, tolerance) =>
  Math.abs(pixels[i] - level) <= tolerance &&
  Math.abs(pixels[i + 1] - level) <= tolerance &&
  Math.abs(pixels[i + 2] - level) <= tolerance;

/** Clears everything of one colour joined to the given starting points. */
function flood(seeds, level, tolerance) {
  const filled = new Uint8Array(W * H);
  const queue = [];
  const visit = (x, y) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const p = y * W + x;
    if (filled[p] || !near(p * 4, level, tolerance)) return;
    filled[p] = 1;
    queue.push(p);
  };

  for (const [x, y] of seeds) visit(x, y);
  while (queue.length) {
    const p = queue.pop();
    const x = p % W;
    const y = (p - x) / W;
    visit(x + 1, y);
    visit(x - 1, y);
    visit(x, y + 1);
    visit(x, y - 1);
  }

  let cleared = 0;
  for (let p = 0; p < W * H; p++)
    if (filled[p]) {
      pixels[p * 4 + 3] = 0;
      cleared++;
    }
  return cleared;
}

// everything joined to the edge of the picture is outside the device
const border = [];
for (let x = 0; x < W; x++) border.push([x, 0], [x, H - 1]);
for (let y = 0; y < H; y++) border.push([0, y], [W - 1, y]);
const outside = flood(border, 245, 20);

// and the screen, from a point well inside it
const screen = flood(
  [[Math.round(W * device.screenSeed[0]), Math.round(H * device.screenSeed[1])]],
  device.screenLevel,
  device.tolerance,
);

console.log(
  `cleared ${outside} px around the device and ${screen} px of screen`,
);

// ---------------------------------------------------------------------------
// 2. Clip to the device's outline, which takes the black corners off.
// ---------------------------------------------------------------------------
let result = sharp(pixels, { raw: { width: W, height: H, channels: 4 } });

if (device.clip) {
  const roundedRect = ({ x, y, w, h, r }) => {
    const [X, Y, Wd, Ht, R] = [x, y, w, h, r].map((v) => v * scale);
    return (
      `M ${X + R} ${Y} H ${X + Wd - R} A ${R} ${R} 0 0 1 ${X + Wd} ${Y + R} ` +
      `V ${Y + Ht - R} A ${R} ${R} 0 0 1 ${X + Wd - R} ${Y + Ht} ` +
      `H ${X + R} A ${R} ${R} 0 0 1 ${X} ${Y + Ht - R} ` +
      `V ${Y + R} A ${R} ${R} 0 0 1 ${X + R} ${Y} Z`
    );
  };
  const shapes = [device.clip.body, ...device.clip.extras].map(roundedRect);
  result = result.composite([
    {
      input: Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">` +
          `<path fill="#fff" d="${shapes.join(" ")}"/></svg>`,
      ),
      blend: "dest-in",
    },
  ]);
}

const info = await result.webp({ quality: 90, alphaQuality: 100 }).toFile(out);

console.log(`${out}  ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)}KB`);
