#!/usr/bin/env node
/* ============================================================================
 * WIRE IMAGES
 * ----------------------------------------------------------------------------
 * Points the data files at whichever photographs are actually on disk.
 *
 *   node scripts/wire-images.mjs           report what is present and missing
 *   node scripts/wire-images.mjs --write   patch data/ for the files that exist
 *
 * The rule this exists to enforce: a path is only ever written for a file that
 * is really there. `next/image` 404s on a missing local source rather than
 * falling back, so a hopeful path is worse than no path — it turns a designed
 * placeholder into a broken image. Every slot without a file keeps its
 * generated halftone plate, which means a partial delivery is safe and the set
 * can land one photograph at a time.
 *
 * Adding a new slot: add a line to SLOTS. The `match` is the unique anchor the
 * field belongs to, so the same field name on two records cannot collide.
 * ========================================================================== */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const write = process.argv.includes('--write');

/** @type {{file:string, anchor:string, field:string, asset:string, back?:boolean}[]} */
const SLOTS = [
  // -- Barber portraits ----------------------------------------------------
  ...[
    'marcus-reyes',
    'desmond-whitfield',
    'nina-castellanos',
    'yusuf-amari',
    'june-park',
  ].map((slug) => ({
    file: 'src/data/barbers.ts',
    anchor: `slug: '${slug}'`,
    field: 'portrait',
    asset: `/team/${slug}.jpg`,
  })),

  // -- Hero and atmosphere -------------------------------------------------
  { file: 'src/data/media.ts', anchor: 'export const heroMedia', field: 'image', asset: '/shop/hero.jpg' },
  /* The atmosphere set is an array of anonymous objects whose only unique
   * text is the alt — and `image` sits ABOVE it in each record, so these are
   * the one case that has to search backwards from its anchor. Searching
   * forward would wire each photograph into the following record. */
  { file: 'src/data/media.ts', anchor: "alt: 'The row of chairs", field: 'image', asset: '/shop/chairs.jpg', back: true },
  { file: 'src/data/media.ts', anchor: "alt: 'Chrome clippers", field: 'image', asset: '/shop/tools.jpg', back: true },
  { file: 'src/data/media.ts', anchor: "alt: 'Cut hair on the floor", field: 'image', asset: '/shop/floor.jpg', back: true },
  { file: 'src/data/media.ts', anchor: "alt: 'Record player", field: 'image', asset: '/shop/records.jpg', back: true },
  { file: 'src/data/media.ts', anchor: "alt: 'Front window", field: 'image', asset: '/shop/window.jpg', back: true },
  { file: 'src/data/media.ts', anchor: 'export const manifestoMedia', field: 'image', asset: '/shop/fade-detail.jpg' },
  { file: 'src/data/media.ts', anchor: 'export const visitMedia', field: 'image', asset: '/shop/chapel-street.jpg' },

  // -- Locations -----------------------------------------------------------
  { file: 'src/data/locations.ts', anchor: 'const chapelStreet', field: 'image', asset: '/shop/chapel-street.jpg' },
  { file: 'src/data/locations.ts', anchor: 'const whitneyAvenue', field: 'image', asset: '/shop/whitney-avenue.jpg' },

  // -- The lookbook --------------------------------------------------------
  ...Array.from({ length: 16 }, (_, i) => {
    const id = `w-${String(i + 1).padStart(2, '0')}`;
    return { file: 'src/data/work.ts', anchor: `id: '${id}'`, field: 'image', asset: `/work/${id}.jpg` };
  }),
  ...['w-01', 'w-13'].map((id) => ({
    file: 'src/data/work.ts',
    anchor: `id: '${id}'`,
    field: 'beforeImage',
    asset: `/work/${id}-before.jpg`,
  })),
];

/* -------------------------------------------------------------------------- */

const sources = new Map();
const read = (f) => {
  if (!sources.has(f)) sources.set(f, readFileSync(join(root, f), 'utf8'));
  return sources.get(f);
};

let present = 0;
let patched = 0;
/* A Set, because one photograph legitimately fills more than one slot — the
 * Chapel Street shopfront is both the visit page's frame and the primary
 * location's — and reporting it twice reads like a mistake. */
const absent = new Set();

for (const slot of SLOTS) {
  const onDisk = existsSync(join(root, 'public', slot.asset));
  if (!onDisk) {
    absent.add(slot.asset);
    continue;
  }
  present++;

  const src = read(slot.file);
  const at = src.indexOf(slot.anchor);
  if (at === -1) {
    console.error(`  ! anchor not found in ${slot.file}: ${slot.anchor}`);
    continue;
  }

  /* The nearest occurrence of the field to its anchor — forward by default,
   * backward where the field sits above the only unique text in the record.
   * Either way it is the CLOSEST match, so a neighbouring record can never be
   * rewritten by a greedy search. */
  const re = new RegExp(`(${slot.field}:\\s*)(null|'[^']*')`, 'g');

  let m;
  let abs;
  if (slot.back) {
    const head = src.slice(0, at);
    let last = null;
    for (const found of head.matchAll(re)) last = found;
    if (last) {
      m = last;
      abs = last.index;
    }
  } else {
    m = re.exec(src.slice(at)) ?? undefined;
    if (m) abs = at + m.index;
  }

  if (!m) {
    console.error(`  ! field "${slot.field}" not found near ${slot.anchor}`);
    continue;
  }

  const current = m[2];
  const next = `'${slot.asset}'`;
  if (current === next) continue;
  sources.set(
    slot.file,
    src.slice(0, abs) + m[1] + next + src.slice(abs + m[0].length),
  );
  patched++;
  console.log(`  ${write ? 'wired' : 'would wire'}  ${slot.asset}  →  ${slot.file}`);
}

if (write) {
  for (const [f, src] of sources) writeFileSync(join(root, f), src);
}

const assets = new Set(SLOTS.map((s) => s.asset));

console.log('');
console.log(
  `  ${assets.size - absent.size} of ${assets.size} images on disk · ` +
    `${present} of ${SLOTS.length} slots filled · ` +
    `${patched} ${write ? 'wired' : 'to wire'}`,
);

if (absent.size) {
  console.log(`\n  Still on the generated plate (${absent.size}):`);
  for (const a of [...absent].sort()) console.log(`    public${a}`);
}
if (!write && patched) {
  console.log('\n  Re-run with --write to apply, then `npm run build`.');
}
