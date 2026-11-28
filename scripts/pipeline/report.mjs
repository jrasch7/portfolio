// Junta os reports/<etapa>.json em pipeline.json, o arquivo que a tela "Pipeline" do site lê.
// Uso: node scripts/pipeline/report.mjs [--site] [--seed]
//   --site  grava também em _site/pipeline.json (o que vai ao ar)
//   --seed  grava também em ./pipeline.json (versão de referência no repositório)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { REPORT_DIR, ROOT, SITE_DIR, sh } from "./lib.mjs";
import { STAGES } from "./stages.mjs";

const args = new Set(process.argv.slice(2));
const ci = Boolean(process.env.GITHUB_ACTIONS);
const event = process.env.GITHUB_EVENT_NAME ?? "local";
const branch = process.env.GITHUB_REF_NAME ?? sh("git", ["rev-parse", "--abbrev-ref", "HEAD"]).stdout.trim();
const sha = process.env.GITHUB_SHA ?? sh("git", ["rev-parse", "HEAD"]).stdout.trim();
const shipsFromMain = ci && branch === "main" && ["push", "workflow_dispatch"].includes(event);

function load(id) {
  const f = join(REPORT_DIR, `${id}.json`);
  return existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : null;
}

const NOTES = {
  "só roda em pull request": { pt: "Só roda em pull request.", en: "Only runs on pull requests." },
  "só roda depois do deploy (defina SITE_URL)": { pt: "Só roda depois do deploy no GitHub Actions.", en: "Only runs after deploy on GitHub Actions." },
};
function bilingualNote(note) {
  if (!note) return "";
  if (NOTES[note]) return NOTES[note];
  const m = note.match(/^bloqueada por (.+)$/);
  return m ? { pt: note, en: `blocked by ${m[1]}` } : note;
}

const stages = STAGES.map((s) => {
  const base = { id: s.id, name: s.name, needs: s.needs, command: s.command, what: s.what, why: s.why, inspired: s.inspired, afterPublish: Boolean(s.afterPublish) };
  const rep = load(s.id);
  if (rep) return { ...base, status: rep.status, durationMs: rep.durationMs, checks: rep.checks, metrics: rep.metrics, note: bilingualNote(rep.note) };
  if (s.selfEvident) {
    const smokeRep = load("smoke");
    if (!ci && smokeRep?.status === "passed") return { ...base, status: "passed", durationMs: null, checks: [], metrics: {}, note: { pt: "Publicado no GitHub Pages; confirmado pelo smoke contra o site no ar.", en: "Published on GitHub Pages; confirmed by the smoke test against the live site." } };
    if (shipsFromMain) return { ...base, status: "passed", durationMs: null, checks: [], metrics: {}, note: { pt: "Esta página é a prova: se você a está vendo, o deploy aconteceu.", en: "This page is the proof: if you are seeing it, the deploy happened." } };
    return { ...base, status: ci ? "skipped" : "pending", durationMs: null, checks: [], metrics: {}, note: ci ? { pt: "Deploy só acontece a partir da main.", en: "Deploy only happens from main." } : { pt: "Roda no GitHub Actions.", en: "Runs on GitHub Actions." } };
  }
  return { ...base, status: "pending", durationMs: null, checks: [], metrics: {}, note: s.afterPublish ? { pt: "Roda depois da publicação; o resultado fica no GitHub Actions.", en: "Runs after publishing; the result lives in GitHub Actions." } : { pt: "Ainda não executou.", en: "Has not run yet." } };
});

const count = (st) => stages.filter((s) => s.status === st).length;
const done = stages.filter((s) => s.durationMs != null);
const overall = count("failed") ? "failed" : count("pending") ? "partial" : "passed";

const out = {
  schema: 1,
  source: ci ? "ci" : "local",
  generatedAt: new Date().toISOString(),
  run: {
    id: process.env.GITHUB_RUN_ID ?? null,
    number: process.env.GITHUB_RUN_NUMBER ? Number(process.env.GITHUB_RUN_NUMBER) : null,
    event,
    branch,
    sha,
    shaShort: sha.slice(0, 7),
    url: ci && process.env.GITHUB_REPOSITORY ? `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` : null,
  },
  status: overall,
  totals: { passed: count("passed"), failed: count("failed"), skipped: count("skipped"), pending: count("pending"), durationMs: done.reduce((a, s) => a + s.durationMs, 0) },
  stages,
};

mkdirSync(REPORT_DIR, { recursive: true });
const text = JSON.stringify(out, null, 2) + "\n";
writeFileSync(join(REPORT_DIR, "pipeline.json"), text);
if (args.has("--site")) writeFileSync(join(SITE_DIR, "pipeline.json"), text);
if (args.has("--seed")) writeFileSync(join(ROOT, "pipeline.json"), text);
console.log(`pipeline.json: ${out.status} (${out.totals.passed} ok, ${out.totals.failed} falhas, ${out.totals.skipped} puladas, ${out.totals.pending} pendentes), fonte ${out.source}`);
