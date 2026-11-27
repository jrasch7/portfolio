// Etapa 5: testes ponta a ponta (Playwright, desktop e celular) sobre o artefato _site/.
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { REPORT_DIR, SITE_DIR, check, sh } from "../lib.mjs";

export default async function testes() {
  if (!existsSync(join(SITE_DIR, "index.html"))) return { checks: [check("build presente (_site/)", false, "rode a etapa build antes")] };
  mkdirSync(REPORT_DIR, { recursive: true });
  const out = join(REPORT_DIR, "playwright.json");
  const r = sh("npx", ["playwright", "test", "--reporter=json"], { env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_NAME: out } });
  if (!existsSync(out)) return { checks: [check("Playwright executou", false, r.out.slice(-200))] };

  const json = JSON.parse(readFileSync(out, "utf8"));
  const specs = [];
  const walk = (suite, file) => {
    for (const s of suite.specs ?? []) specs.push({ title: s.title, file: suite.file ?? file, ok: s.ok, projects: s.tests.map((t) => t.projectName) });
    for (const sub of suite.suites ?? []) walk(sub, sub.file ?? file);
  };
  json.suites.forEach((s) => walk(s, s.file));

  // Um item por teste (os dois projetos, desktop e celular, precisam passar).
  const checks = specs.map((s) => check(s.title, s.ok, s.projects.join(" + ")));
  const stats = json.stats ?? {};
  return {
    checks,
    metrics: {
      testes: specs.length,
      execucoes: (stats.expected ?? 0) + (stats.unexpected ?? 0) + (stats.flaky ?? 0),
      falhas: stats.unexpected ?? 0,
      instaveis: stats.flaky ?? 0,
      projetos: [...new Set(specs.flatMap((s) => s.projects))].join(", "),
    },
  };
}
