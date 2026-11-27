// Executa UMA etapa da pipeline e grava reports/<etapa>.json.
// Uso: node scripts/pipeline/run.mjs <etapa>     (o mesmo comando roda no GitHub Actions e na sua máquina)
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { REPORT_DIR } from "./lib.mjs";
import { toEn, toPt } from "./i18n-checks.mjs";
import { byId } from "./stages.mjs";

const id = process.argv[2];
if (!id || !byId[id]) {
  console.error(`etapa desconhecida: ${id ?? "(nenhuma)"}. Use uma de: ${Object.keys(byId).join(", ")}`);
  process.exit(2);
}

const startedAt = new Date();
let result;
try {
  const mod = await import(`./stages/${id}.mjs`);
  result = await mod.default();
} catch (err) {
  result = { checks: [{ name: "execução da etapa", ok: false, detail: String(err?.stack ?? err).split("\n").slice(0, 3).join(" | ") }] };
}

const checks = (result.checks ?? []).map((c) => ({ ...c, name: toPt(c.name), en: toEn(c.name) }));
const failed = checks.filter((c) => !c.ok);
const status = result.skipped ? "skipped" : failed.length ? "failed" : "passed";
const report = {
  id,
  status,
  startedAt: startedAt.toISOString(),
  finishedAt: new Date().toISOString(),
  durationMs: Date.now() - startedAt.getTime(),
  checks,
  metrics: result.metrics ?? {},
  note: result.skipped ?? "",
};

mkdirSync(REPORT_DIR, { recursive: true });
writeFileSync(join(REPORT_DIR, `${id}.json`), JSON.stringify(report, null, 2) + "\n");

const icon = { passed: "OK  ", failed: "FALHA", skipped: "PULOU" }[status];
console.log(`\n[${icon}] ${id} em ${(report.durationMs / 1000).toFixed(1)} s${report.note ? ` (${report.note})` : ""}`);
for (const c of checks) console.log(`  ${c.ok ? "ok   " : "FALHA"} ${c.name}${c.detail ? ` : ${c.detail}` : ""}`);
process.exit(status === "failed" ? 1 : 0);
