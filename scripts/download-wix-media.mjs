#!/usr/bin/env node
/**
 * Copies every image and document the built site still loads from Wix into this repository.
 *
 *   node scripts/download-wix-media.mjs [dist]
 *
 * 1. Scans the built site (dist/) for https://static.wixstatic.com and https://docs.wixstatic.com links.
 * 2. Downloads each one into public/media/ (files already there are skipped).
 * 3. Records each link and its local copy in src/data/wix-media.json.
 *
 * The site's wix() and localize() helpers (src/lib/site.ts) read that file and serve the local copy;
 * anything not listed keeps loading from Wix. Run by .github/workflows/download-wix-media.yml.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const DIST = process.argv[2] ?? 'dist';
const OUT_DIR = 'public/media';
const MANIFEST = 'src/data/wix-media.json';
const LINK = /https:\/\/(?:static|docs)\.wixstatic\.com\/[^"'\s)<>]+/g;
const TYPES = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/gif': '.gif', 'image/webp': '.webp', 'application/pdf': '.pdf' };

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? htmlFiles(p) : p.endsWith('.html') ? [p] : [];
  });
}

const links = new Set();
for (const file of htmlFiles(DIST)) for (const m of fs.readFileSync(file, 'utf8').matchAll(LINK)) links.add(m[0]);

const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {};
fs.mkdirSync(OUT_DIR, { recursive: true });

let added = 0, kept = 0;
const failed = [];
for (const link of [...links].sort()) {
  if (manifest[link] && fs.existsSync(path.join('public', manifest[link]))) { kept++; continue; }
  try {
    const res = await fetch(link, {
      // Ask for the original formats so file names match what is stored
      headers: { Accept: 'image/png,image/jpeg;q=0.9,application/pdf;q=0.9,*/*;q=0.5', 'User-Agent': 'we-stand-4-something-site-build' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const type = (res.headers.get('content-type') ?? '').split(';')[0].trim();
    const ext = TYPES[type];
    if (!ext) throw new Error(`unexpected content type ${type || '(none)'}`);
    const name = crypto.createHash('sha1').update(link).digest('hex').slice(0, 16) + ext;
    fs.writeFileSync(path.join(OUT_DIR, name), Buffer.from(await res.arrayBuffer()));
    manifest[link] = `media/${name}`;
    added++;
  } catch (err) {
    failed.push(`${link}  (${err.message})`);
  }
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(MANIFEST, JSON.stringify(sorted, null, 2) + '\n');

console.log(`Wix links found: ${links.size}. Downloaded: ${added}. Already copied: ${kept}. Failed: ${failed.length}.`);
for (const f of failed) console.log(`  failed: ${f}`);
if (links.size && added + kept === 0) process.exit(1);
