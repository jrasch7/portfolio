// Etapa 1: gate do pull request. Fora de PR a etapa é pulada.
import { readFileSync } from "node:fs";
import { check, sh } from "../lib.mjs";

const MAX_LINES = 1500;

export default async function prGate() {
  if (process.env.GITHUB_EVENT_NAME !== "pull_request" || !process.env.GITHUB_EVENT_PATH) {
    return { skipped: "só roda em pull request", checks: [] };
  }
  const pr = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8")).pull_request;
  const title = pr.title ?? "";
  const body = pr.body ?? "";
  const checks = [
    check("título entre 15 e 100 caracteres, sem ponto final", title.length >= 15 && title.length <= 100 && !title.endsWith("."), `${title.length} caracteres`),
    check("título sem WIP", !/^\s*(wip|draft)\b/i.test(title)),
    check("corpo com seção de validação (## Validação, ## Como validei ou ## Validation)", /^##\s*(valida|como validei|validation)/im.test(body)),
    check("corpo explica a mudança (80+ caracteres)", body.trim().length >= 80, `${body.trim().length} caracteres`),
    check("origem não é a main", pr.head.ref !== "main", pr.head.ref),
  ];
  // Diff sem arquivos gerados (lockfile, imagens, relatórios).
  const base = `origin/${pr.base.ref}`;
  const stat = sh("git", ["diff", "--numstat", `${base}...HEAD`, "--", ".", ":!package-lock.json", ":!*.webp", ":!*.png", ":!*.jpg", ":!pipeline.json"]);
  const lines = stat.stdout.trim().split("\n").filter(Boolean).reduce((a, l) => { const [x, y] = l.split("\t"); return a + (Number(x) || 0) + (Number(y) || 0); }, 0);
  checks.push(check(`diff com até ${MAX_LINES} linhas (sem lockfile e imagens)`, stat.code === 0 && lines <= MAX_LINES, `${lines} linhas`));
  return { checks, metrics: { linhasDoDiff: lines } };
}
