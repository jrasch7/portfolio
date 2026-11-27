// Etapa 2: higiene do repositório (segredos, privacidade, orçamento, regras de interface).
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, normalize } from "node:path";
import { BUDGET, CONFLICT_RE, EMAIL_ALLOW, EMAIL_ALLOW_SUFFIX, EMAIL_RE, EMOJI_RE, PRIVACY_PATTERNS, SCAN_IGNORE, SECRET_PATTERNS } from "../patterns.mjs";
import { ROOT, check, gzipBytes, kb, read, sh, trackedFiles } from "../lib.mjs";

const TEXT = new Set([".html", ".css", ".js", ".mjs", ".json", ".md", ".yml", ".yaml", ".txt", ".svg", ".xml", ""]);
const IMAGE = new Set([".webp", ".jpg", ".jpeg", ".png", ".svg"]);
const REQUIRED = [
  "index.html", "README.md", "package-lock.json", "docs/PIPELINE.md", "assets/app.js", "assets/i18n.js", "assets/style.css",
  ".github/workflows/pipeline.yml", ".github/workflows/codeql.yml", ".github/dependabot.yml", ".github/pull_request_template.md",
  "AGENTS.md", "CLAUDE.md", "PRODUCT.md", "DESIGN.md", "SECURITY.md", "CONTRIBUTING.md",
  "docs/README.md", "docs/CONTEXT.md", "docs/MODULES.md", "docs/MAPA_CODIGO.md", "docs/DEBT.md", "docs/arquivo/LOG.md",
  "docs/desenvolvimento/FLUXO_GIT.md", "docs/arquitetura/PADRAO_CODIGO.md", "docs/arquitetura/PADRAO_UI.md", "docs/arquitetura/CONTEUDO_PUBLICO.md",
];

export default async function higiene() {
  const files = trackedFiles();
  const checks = [];
  const textFiles = files.filter((f) => TEXT.has(extname(f)) && !SCAN_IGNORE.has(f.split("/").pop()) && statSync(join(ROOT, f)).size < 1_000_000);

  checks.push(check("arquivos obrigatórios presentes", REQUIRED.every((f) => existsSync(join(ROOT, f))), REQUIRED.filter((f) => !existsSync(join(ROOT, f))).join(", ")));

  const hits = (patterns) => {
    const found = [];
    for (const f of textFiles) {
      if (f.startsWith("scripts/pipeline/patterns")) continue; // define os próprios padrões
      const text = read(join(ROOT, f));
      for (const [label, re] of patterns) if (re.test(text)) found.push(`${f} (${label})`);
    }
    return found;
  };
  const secrets = hits(SECRET_PATTERNS);
  checks.push(check("nenhum segredo nos arquivos versionados", !secrets.length, secrets.join("; ")));
  const priv = hits(PRIVACY_PATTERNS);
  checks.push(check("nenhum IP nem host interno (repositório público)", !priv.length, priv.join("; ")));

  const badEmails = [];
  for (const f of textFiles) {
    for (const m of read(join(ROOT, f)).matchAll(EMAIL_RE)) {
      const e = m[0].toLowerCase();
      if (!EMAIL_ALLOW.has(e) && !EMAIL_ALLOW_SUFFIX.some((s) => e.endsWith(s))) badEmails.push(`${f}: ${e}`);
    }
  }
  checks.push(check("só o e-mail de contato público aparece", !badEmails.length, [...new Set(badEmails)].slice(0, 5).join("; ")));

  const conflicts = textFiles.filter((f) => CONFLICT_RE.test(read(join(ROOT, f))));
  checks.push(check("sem marcador de conflito de merge", !conflicts.length, conflicts.join(", ")));

  // Orçamento de tamanho.
  const images = files.filter((f) => f.startsWith("assets/") && IMAGE.has(extname(f)));
  const sizes = images.map((f) => [f, statSync(join(ROOT, f)).size]);
  const big = sizes.filter(([, s]) => s > BUDGET.imageEach).map(([f, s]) => `${f} ${kb(s)}`);
  const imagesTotal = sizes.reduce((a, [, s]) => a + s, 0);
  checks.push(check(`cada imagem até ${kb(BUDGET.imageEach)}`, !big.length, big.join(", ")));
  checks.push(check(`imagens somam até ${kb(BUDGET.imagesTotal)}`, imagesTotal <= BUDGET.imagesTotal, kb(imagesTotal)));
  const code = ["index.html", "assets/app.js", "assets/i18n.js", "assets/style.css"];
  const codeGz = code.reduce((a, f) => a + gzipBytes(readFileSync(join(ROOT, f))), 0);
  checks.push(check(`HTML+JS+CSS comprimidos até ${kb(BUDGET.codeGzipTotal)}`, codeGz <= BUDGET.codeGzipTotal, kb(codeGz)));

  // Regras de interface e de código entregue.
  const ui = ["index.html", "assets/app.js", "assets/i18n.js", "assets/style.css"];
  const emojis = ui.filter((f) => EMOJI_RE.test(read(join(ROOT, f))));
  checks.push(check("sem emoji na interface (ícone é SVG ou texto)", !emojis.length, emojis.join(", ")));
  const logs = ["assets/app.js", "assets/i18n.js"].filter((f) => /\bconsole\.(log|debug)\(/.test(read(join(ROOT, f))));
  checks.push(check("sem console.log no JavaScript entregue", !logs.length, logs.join(", ")));

  // Documentação viva: mapa gerado em dia, links entre documentos, módulos indexados.
  const mapa = sh("node", ["scripts/docs/gerar-mapa-codigo.mjs", "--check"]);
  checks.push(check("MAPA_CODIGO.md em dia com o código", mapa.code === 0, mapa.code === 0 ? "" : "rode npm run docs:mapa"));
  const mds = files.filter((f) => f.endsWith(".md"));
  const brokenLinks = [];
  for (const f of mds) {
    const text = read(join(ROOT, f)).replace(/```[\s\S]*?```/g, "");
    for (const m of text.matchAll(/\]\(([^)\s]+)\)/g)) {
      const link = m[1];
      if (/^(https?:|mailto:|#)/.test(link)) continue;
      const target = normalize(join(dirname(f), link.split("#")[0].split("?")[0]));
      if (!existsSync(join(ROOT, target))) brokenLinks.push(`${f} -> ${link}`);
    }
  }
  checks.push(check(`links relativos de ${mds.length} documentos apontam para arquivos que existem`, !brokenLinks.length, brokenLinks.slice(0, 4).join("; ")));
  const modulosDocs = files.filter((f) => f.startsWith("docs/modulos/"));
  const indice = existsSync(join(ROOT, "docs/MODULES.md")) ? read(join(ROOT, "docs/MODULES.md")) : "";
  const semIndice = modulosDocs.filter((f) => !indice.includes(f.replace("docs/", "")));
  checks.push(check("todo documento de módulo está no índice MODULES.md", !semIndice.length, semIndice.join(", ")));

  return {
    checks,
    metrics: { arquivos: files.length, documentos: mds.length, arquivosDeTexto: textFiles.length, imagensKB: Math.round(imagesTotal / 1024), codigoGzipKB: +(codeGz / 1024).toFixed(1) },
  };
}
