// Etapa 4: build reproduzível. Monta _site/, versiona por hash, gera sitemap/robots/build-info e verifica.
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { ROOT, SITE_DIR, check, kb, read, sh, walk } from "../lib.mjs";

const SITE_URL = (process.env.SITE_URL || "https://jrasch7.github.io/portfolio/").replace(/\/?$/, "/");
const VERSIONED = ["assets/style.css", "assets/i18n.js", "assets/app.js"];

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

/** Data do commit (e não "agora"), para o mesmo commit gerar o mesmo build. */
function buildTime() {
  const r = sh("git", ["log", "-1", "--format=%cI"]);
  return r.code === 0 && r.stdout.trim() ? r.stdout.trim() : "1970-01-01T00:00:00Z";
}

function assemble(dir) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  cpSync(join(ROOT, "assets"), join(dir, "assets"), { recursive: true });
  const cacheKey = (f) => sha256(readFileSync(join(ROOT, f))).slice(0, 8);
  let html = read(join(ROOT, "index.html"));
  for (const f of VERSIONED) {
    const before = `"${f}"`;
    if (!html.includes(before)) throw new Error(`index.html não referencia ${f}`);
    html = html.replace(before, `"${f}?v=${cacheKey(f)}"`);
  }
  writeFileSync(join(dir, "index.html"), html);
  if (existsSync(join(ROOT, "pipeline.json"))) cpSync(join(ROOT, "pipeline.json"), join(dir, "pipeline.json"));
  writeFileSync(join(dir, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n`);
  writeFileSync(
    join(dir, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE_URL}</loc></url>\n</urlset>\n`,
  );
  writeFileSync(join(dir, ".nojekyll"), "");

  // build-info: hash de cada arquivo publicado (menos pipeline.json, que o relatório reescreve).
  const files = walk(dir)
    .map((f) => relative(dir, f))
    .filter((f) => f !== "pipeline.json" && f !== "build-info.json" && f !== ".nojekyll")
    .sort()
    .map((f) => ({ path: f, bytes: readFileSync(join(dir, f)).length, sha256: sha256(readFileSync(join(dir, f))) }));
  const sha = process.env.GITHUB_SHA || sh("git", ["rev-parse", "HEAD"]).stdout.trim() || "local";
  const info = { sha, builtAt: buildTime(), siteUrl: SITE_URL, totalBytes: files.reduce((a, f) => a + f.bytes, 0), files };
  writeFileSync(join(dir, "build-info.json"), JSON.stringify(info, null, 2) + "\n");
  return info;
}

export default async function build() {
  const checks = [];
  const info = assemble(SITE_DIR);
  checks.push(check("pasta publicada montada", existsSync(join(SITE_DIR, "index.html")), `${info.files.length} arquivos, ${kb(info.totalBytes)}`));

  // Reprodutibilidade: um segundo build em outra pasta precisa ter exatamente os mesmos hashes.
  const second = assemble(join(ROOT, "_site_verificacao"));
  const same = JSON.stringify(info.files) === JSON.stringify(second.files);
  rmSync(join(ROOT, "_site_verificacao"), { recursive: true, force: true });
  checks.push(check("build determinístico (dois builds, mesmos hashes)", same));

  // Verificação do que saiu.
  const html = read(join(SITE_DIR, "index.html"));
  const refs = [...html.matchAll(/(?:src|href)="(assets\/[^"?#]+)(?:\?v=([0-9a-f]{8}))?/g)];
  const missing = refs.filter((m) => !existsSync(join(SITE_DIR, m[1]))).map((m) => m[1]);
  checks.push(check(`${refs.length} referências do HTML publicado existem`, !missing.length, missing.join(", ")));
  const stale = VERSIONED.filter((f) => !new RegExp(`${f.replace(/[./]/g, "\\$&")}\\?v=[0-9a-f]{8}`).test(html));
  checks.push(check("arquivos de código versionados por hash de conteúdo", !stale.length, stale.join(", ")));
  checks.push(check("robots.txt e sitemap.xml gerados", existsSync(join(SITE_DIR, "robots.txt")) && existsSync(join(SITE_DIR, "sitemap.xml"))));
  checks.push(check("build-info.json com hash de cada arquivo", info.files.every((f) => /^[0-9a-f]{64}$/.test(f.sha256))));

  return { checks, metrics: { arquivos: info.files.length, tamanhoKB: Math.round(info.totalBytes / 1024), commit: info.sha.slice(0, 7) } };
}
