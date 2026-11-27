// Etapa 7: segurança (dependências, CSP, terceiros, links externos, segredos no build).
import { existsSync } from "node:fs";
import { join } from "node:path";
import { SECRET_PATTERNS } from "../patterns.mjs";
import { ROOT, SITE_DIR, check, read, sh, siteTextFiles } from "../lib.mjs";

export default async function seguranca() {
  const checks = [];
  if (!existsSync(join(SITE_DIR, "index.html"))) return { checks: [check("build presente (_site/)", false, "rode a etapa build antes")] };
  const html = read(join(SITE_DIR, "index.html"));
  const app = read(join(ROOT, "assets/app.js"));

  // 1) Dependências de desenvolvimento e de execução.
  const audit = sh("npm", ["audit", "--audit-level=high", "--json"]);
  let meta;
  try { meta = JSON.parse(audit.stdout).metadata?.vulnerabilities; } catch { meta = undefined; }
  checks.push(check("npm audit sem vulnerabilidade alta ou crítica", audit.code === 0 && !!meta, meta ? `crítica ${meta.critical}, alta ${meta.high}, moderada ${meta.moderate}` : "auditoria indisponível: " + audit.out.slice(0, 80)));

  // 2) CSP estrita, entregue em meta (GitHub Pages não deixa configurar cabeçalhos).
  const csp = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1] ?? "";
  const dir = Object.fromEntries(csp.split(";").map((d) => d.trim()).filter(Boolean).map((d) => { const [k, ...v] = d.split(/\s+/); return [k, v.join(" ")]; }));
  checks.push(check("CSP presente com default-src 'self'", dir["default-src"] === "'self'", csp ? "" : "sem meta CSP"));
  checks.push(check("script-src sem 'unsafe-inline' nem 'unsafe-eval'", !!dir["script-src"] && !/unsafe-/.test(dir["script-src"]), dir["script-src"] ?? "ausente"));
  checks.push(check("style-src sem 'unsafe-inline'", !!dir["style-src"] && !/unsafe-inline/.test(dir["style-src"]), dir["style-src"] ?? "ausente"));
  checks.push(check("object-src 'none', base-uri 'self', form-action 'none'", dir["object-src"] === "'none'" && dir["base-uri"] === "'self'" && dir["form-action"] === "'none'"));

  // 3) Nada inline e nada de terceiros.
  const inlineScripts = [...html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>/g)].length;
  const inlineHandlers = [...html.matchAll(/\son[a-z]+="/g)].length;
  checks.push(check("sem script inline nem manipulador de evento inline", inlineScripts === 0 && inlineHandlers === 0, `${inlineScripts} scripts, ${inlineHandlers} manipuladores`));
  const external = [...html.matchAll(/<(?:script|link|img|iframe|source|video|audio)\b[^>]*(?:src|href)="(https?:)?\/\/[^"]+"/g)].map((m) => m[0].slice(0, 60));
  checks.push(check("nenhum recurso carregado de terceiros (sem rastreadores, sem CDN)", !external.length, external.join(" | ")));

  // 4) Links externos.
  const tag = (text) => [...text.matchAll(/target="_blank"[^>]*>|<a\b[^>]*target="_blank"[^>]*>/g)].map((m) => m[0]);
  const unsafe = [...tag(html), ...tag(app)].filter((t) => !/rel="[^"]*noopener/.test(t) && !/noopener/.test(t));
  const opens = [...app.matchAll(/window\.open\([^)]*\)/g)].map((m) => m[0]).filter((c) => !c.includes("noopener"));
  checks.push(check("links externos abrem com rel=noopener", !unsafe.length && !opens.length, [...unsafe, ...opens].slice(0, 2).join(" | ")));

  // 5) Segredos no que vai ao ar.
  const leaked = [];
  for (const f of siteTextFiles(SITE_DIR)) for (const [label, re] of SECRET_PATTERNS) if (re.test(f.text)) leaked.push(`${f.path} (${label})`);
  checks.push(check("varredura de segredos no build", !leaked.length, leaked.join("; ")));

  return { checks, metrics: { vulnerabilidades: meta ? meta.total : "n/d", diretivasCSP: Object.keys(dir).length } };
}
