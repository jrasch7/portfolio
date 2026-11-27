// Utilidades compartilhadas pelas etapas da pipeline.
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { gzipSync } from "node:zlib";

export const ROOT = new URL("../../", import.meta.url).pathname.replace(/\/$/, "");
export const SITE_DIR = join(ROOT, "_site");
export const REPORT_DIR = join(ROOT, "reports");

/** Um item de verificação dentro de uma etapa. */
export const check = (name, ok, detail = "") => ({ name, ok: Boolean(ok), detail: String(detail) });

/** Executa um comando e devolve saída; nunca lança. */
export function sh(cmd, args = [], opts = {}) {
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, ...opts });
  return { code: r.status ?? 1, out: (r.stdout ?? "") + (r.stderr ?? ""), stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
}

/** Arquivos versionados (ou, fora de um repositório Git, uma varredura simples). */
export function trackedFiles() {
  const r = sh("git", ["ls-files"]);
  if (r.code === 0 && r.stdout.trim()) return r.stdout.trim().split("\n").filter((f) => existsSync(join(ROOT, f)));
  return walk(ROOT).map((f) => relative(ROOT, f));
}

const SKIP = new Set(["node_modules", ".git", "_site", "reports", ".lighthouseci", "playwright-report", "test-results"]);
export function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    if (SKIP.has(name)) return [];
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

export const read = (path) => readFileSync(path, "utf8");
export const gzipBytes = (buf) => gzipSync(buf, { level: 9 }).length;
export const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

/** Chrome para Lighthouse e Playwright: usa o do ambiente se existir, senão o instalado pelo Playwright. */
export function chromiumPath() {
  for (const p of [process.env.PW_CHROMIUM, process.env.CHROME_PATH, "/opt/pw-browsers/chromium"]) {
    if (p && existsSync(p) && statSync(p).isFile()) return p;
  }
  return undefined;
}

/** Texto de arquivos do site (HTML, CSS, JS, JSON), usado em varreduras de conteúdo. */
export function siteTextFiles(base = ROOT) {
  const keep = (f) => /\.(html|css|js|json|svg|txt|xml|md)$/.test(f);
  return walk(base).filter(keep).map((f) => ({ path: relative(base, f), text: read(f) }));
}
