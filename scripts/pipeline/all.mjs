// Roda a pipeline inteira na sua máquina, na mesma ordem do GitHub Actions.
// Uso: npm run pipeline            (grava reports/ e reports/pipeline.json)
//      npm run pipeline -- --seed  (também atualiza ./pipeline.json, a versão de referência do repositório)
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { REPORT_DIR, sh } from "./lib.mjs";
import { order } from "./stages.mjs";

rmSync(REPORT_DIR, { recursive: true, force: true });
mkdirSync(REPORT_DIR, { recursive: true });
const seed = process.argv.includes("--seed");

const status = {};
let failed = false;
for (const s of order()) {
  if (s.id === "deploy") continue; // só existe no GitHub Actions
  const blocker = s.needs.find((n) => status[n] === "failed" || status[n] === "blocked");
  if (blocker) {
    status[s.id] = "blocked";
    const now = new Date().toISOString();
    writeFileSync(join(REPORT_DIR, `${s.id}.json`), JSON.stringify({ id: s.id, status: "skipped", startedAt: now, finishedAt: now, durationMs: 0, checks: [], metrics: {}, note: `bloqueada por ${blocker}` }, null, 2));
    console.log(`\n[PULOU] ${s.id} (bloqueada por ${blocker})`);
    continue;
  }
  const r = sh("node", ["scripts/pipeline/run.mjs", s.id], { stdio: "pipe" });
  process.stdout.write(r.out);
  status[s.id] = r.code === 0 ? "ok" : "failed";
  if (r.code !== 0) failed = true;
}

const rep = sh("node", ["scripts/pipeline/report.mjs", ...(seed ? ["--seed"] : [])]);
process.stdout.write("\n" + rep.out);
process.exit(failed ? 1 : 0);
