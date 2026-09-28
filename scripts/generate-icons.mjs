/*
 * Rasterises public/icon.svg into the PNGs a real PWA install needs.
 *
 *   npm run icons:generate
 *
 * The generated PNGs are COMMITTED. This script exists so they can be rebuilt
 * when the crest changes, not as a build step — the deploy must not depend on
 * sharp being installable on the build machine.
 *
 * Why PNGs at all, when icon.svg is sharper at every size: Chrome on Android
 * will not offer "Add to Home Screen" unless the manifest lists a 192px and a
 * 512px raster icon. An SVG-only manifest is silently un-installable, which is
 * the state this app was in.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "public", "icon.svg");
const outDir = join(root, "public", "icons");

/*
 * Android masks icons to a circle or squircle and can crop up to ~20% off each
 * edge. The crest fills its whole 512 canvas, so the maskable variant is drawn
 * smaller on a filled background — everything important then sits inside the
 * safe zone whatever shape the launcher applies.
 *
 * Matches the manifest's background_color, so the padding is invisible.
 */
const MASKABLE_SAFE_SCALE = 0.78;
const MASKABLE_BACKGROUND = "#1e1712"; // the crest's own field, not the paper

const targets = [
  { file: "icon-192.png", size: 192, maskable: false },
  { file: "icon-512.png", size: 512, maskable: false },
  { file: "icon-512-maskable.png", size: 512, maskable: true },
  // iOS ignores the manifest and reads this from a <link> tag. It also has no
  // transparency handling worth relying on, so it gets a solid field too.
  { file: "apple-touch-icon.png", size: 180, maskable: true },
];

async function render(svg, { file, size, maskable }) {
  if (!maskable) {
    return {
      file,
      buffer: await sharp(svg, { density: 512 })
        .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer(),
    };
  }

  const inner = Math.round(size * MASKABLE_SAFE_SCALE);
  const crest = await sharp(svg, { density: 512 }).resize(inner, inner).png().toBuffer();

  return {
    file,
    buffer: await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: MASKABLE_BACKGROUND,
      },
    })
      .composite([{ input: crest, gravity: "centre" }])
      .png()
      .toBuffer(),
  };
}

async function main() {
  const svg = await readFile(source);
  await mkdir(outDir, { recursive: true });

  for (const target of targets) {
    const { file, buffer } = await render(svg, target);
    await writeFile(join(outDir, file), buffer);
    console.log(`  ${file.padEnd(26)} ${String(buffer.length).padStart(7)} bytes`);
  }

  console.log("\nIcons written to public/icons/ — commit them.");
}

main().catch((error) => {
  console.error("Icon generation failed:", error);
  process.exit(1);
});
