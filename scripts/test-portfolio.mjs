import assert from "node:assert/strict";
import fs from "node:fs/promises";
import ts from "typescript";
const source = await fs.readFile(
  new URL("../app/portfolio-data.ts", import.meta.url),
  "utf8",
);
const js = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const {
  projects,
  reels,
  packages,
  addons,
  estimate,
  todayISO,
  maxDate,
  validDate,
} = await import(
  "data:text/javascript;base64," + Buffer.from(js).toString("base64")
);
assert.equal(new Set(projects.map((p) => p.id)).size, 8);
assert.equal(new Set(packages.map((p) => p.id)).size, 4);
for (const p of packages) {
  assert.equal(estimate(p.id, []), p.price);
  assert.equal(
    estimate(p.id, p.addons),
    p.price +
      p.addons.reduce((n, id) => n + addons.find((a) => a.id === id).price, 0),
  );
  assert.equal(estimate(p.id, [p.addons[0], p.addons[0]]), null);
}
assert.equal(estimate("brand", ["extra-hour", "social-cut"]), 24000);
assert.equal(estimate("portrait", ["social-cut"]), null);
assert.equal(estimate("event", ["missing"]), null);
assert.equal(estimate("custom", []), null);
const now = new Date("2026-10-27T01:00:00Z");
assert.equal(todayISO(now), "2026-10-27");
assert.equal(maxDate(now), "2027-10-27");
assert(validDate("2027-10-27", now));
for (const d of ["2026-10-26", "2027-10-28", "2027-02-29", "invalid"])
  assert(!validDate(d, now));
for (const p of projects) {
  assert(
    packages.some((v) => v.id === p.packageId) || p.packageId === "custom",
  );
  if (p.reelId) assert(reels.some((r) => r.id === p.reelId));
  for (const image of p.images)
    await fs.access(new URL(`../public/images/${image}.jpg`, import.meta.url));
}
for (const r of reels) {
  const file = await fs.readFile(new URL("../public" + r.src, import.meta.url));
  assert.equal(file.subarray(4, 8).toString(), "ftyp");
  assert(file.length > 100000 && file.length < 25 * 1024 * 1024);
  await fs.access(new URL(`../public/images/${r.poster}.jpg`, import.meta.url));
  await fs.access(new URL(`../public/videos/${r.id}.vtt`, import.meta.url));
}
console.log(
  "Portfolio checks passed: eight project references, package and add-on math, date boundaries, image assets, local MP4 signatures and size limits, caption files.",
);
