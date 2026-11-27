// Etapa 6: desempenho com orçamento (Lighthouse CI, mediana de 3 execuções).
import { existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { ROOT, SITE_DIR, check, chromiumPath, sh } from "../lib.mjs";

const MIN = { performance: 0.9, accessibility: 0.95, "best-practices": 0.95, seo: 0.9 };
const MAX = { "largest-contentful-paint": 2500, "cumulative-layout-shift": 0.05, "total-blocking-time": 200 };
const median = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];

export default async function desempenho() {
  if (!existsSync(join(SITE_DIR, "index.html"))) return { checks: [check("build presente (_site/)", false, "rode a etapa build antes")] };
  const dir = join(ROOT, ".lighthouseci");
  rmSync(dir, { recursive: true, force: true });
  const env = { ...process.env };
  const chrome = chromiumPath();
  if (chrome) env.CHROME_PATH = chrome;
  const runs = process.env.LH_RUNS ?? "3";
  const r = sh("npx", ["lhci", "collect", `--numberOfRuns=${runs}`], { env });
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => /^lhr-.*\.json$/.test(f)) : [];
  if (!files.length) return { checks: [check("Lighthouse executou", false, r.out.slice(-200))] };

  const lhrs = files.map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")));
  const score = (id) => median(lhrs.map((l) => l.categories[id].score));
  const audit = (id) => median(lhrs.map((l) => l.audits[id].numericValue));

  const checks = [];
  const metrics = { execucoes: lhrs.length };
  for (const [id, min] of Object.entries(MIN)) {
    const v = score(id);
    metrics[id] = Math.round(v * 100);
    checks.push(check(`${id} ≥ ${min * 100}`, v >= min, `${Math.round(v * 100)}`));
  }
  for (const [id, max] of Object.entries(MAX)) {
    const v = audit(id);
    metrics[id] = id === "cumulative-layout-shift" ? +v.toFixed(3) : Math.round(v);
    checks.push(check(`${id} ≤ ${max}${id === "cumulative-layout-shift" ? "" : " ms"}`, v <= max, String(metrics[id])));
  }
  return { checks, metrics };
}
