// Etapa 1: gate do pull request.
// Em pull request confere o PR (título, corpo, branch, tamanho). Fora de PR (push na main, execução local)
// confere o ÚLTIMO COMMIT com as mesmas regras de título e tamanho: a etapa nunca fica "pulada".
import { readFileSync } from "node:fs";
import { check, sh } from "../lib.mjs";

const MAX_LINES = 1500;
const EXCLUIR = [":!package-lock.json", ":!*.webp", ":!*.png", ":!*.jpg", ":!pipeline.json", ":!docs/MAPA_CODIGO.md"];

function linhasDoDiff(args) {
  const stat = sh("git", ["diff", "--numstat", ...args, "--", ".", ...EXCLUIR]);
  const lines = stat.stdout.trim().split("\n").filter(Boolean).reduce((a, l) => { const [x, y] = l.split("\t"); return a + (Number(x) || 0) + (Number(y) || 0); }, 0);
  return { ok: stat.code === 0, lines };
}

const tituloOk = (t) => t.length >= 15 && t.length <= 100 && !t.endsWith(".");

export default async function prGate() {
  if (process.env.GITHUB_EVENT_NAME === "pull_request" && process.env.GITHUB_EVENT_PATH) {
    const pr = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8")).pull_request;
    const title = pr.title ?? "";
    const body = pr.body ?? "";
    const checks = [
      check("título entre 15 e 100 caracteres, sem ponto final", tituloOk(title), `${title.length} caracteres`),
      check("título sem WIP", !/^\s*(wip|draft)\b/i.test(title)),
      check("corpo com seção de validação (## Validação, ## Como validei ou ## Validation)", /^##\s*(valida|como validei|validation)/im.test(body)),
      check("corpo explica a mudança (80+ caracteres)", body.trim().length >= 80, `${body.trim().length} caracteres`),
      check("origem não é a main", pr.head.ref !== "main", pr.head.ref),
    ];
    const d = linhasDoDiff([`origin/${pr.base.ref}...HEAD`]);
    checks.push(check(`diff com até ${MAX_LINES} linhas (sem lockfile e imagens)`, d.ok && d.lines <= MAX_LINES, `${d.lines} linhas`));
    return { checks, metrics: { modo: "pull request", linhasDoDiff: d.lines } };
  }

  // Modo commit: o PR já foi mergeado (ou ainda não existe). Valida o commit que está sendo construído.
  const subject = sh("git", ["log", "-1", "--format=%s"]).stdout.trim();
  const checks = [
    check("título do commit entre 15 e 100 caracteres, sem ponto final", tituloOk(subject), `${subject.length} caracteres`),
    check("título do commit sem WIP", !/^\s*(wip|draft)\b/i.test(subject)),
  ];
  const temPai = sh("git", ["rev-parse", "--verify", "-q", "HEAD~1"]).code === 0;
  const d = temPai ? linhasDoDiff(["HEAD~1", "HEAD"]) : { ok: true, lines: 0 };
  checks.push(check(`commit com até ${MAX_LINES} linhas (sem lockfile e imagens)`, d.ok && d.lines <= MAX_LINES, temPai ? `${d.lines} linhas` : "primeiro commit"));
  return { checks, metrics: { modo: "commit", linhasDoDiff: d.lines } };
}
