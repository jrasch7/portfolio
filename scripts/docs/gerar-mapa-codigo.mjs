// Gera docs/MAPA_CODIGO.md a partir do código: onde está cada módulo, seção, etapa, teste e workflow.
// Uso: node scripts/docs/gerar-mapa-codigo.mjs           (escreve o arquivo)
//      node scripts/docs/gerar-mapa-codigo.mjs --check   (falha se o arquivo estiver desatualizado; roda na etapa "higiene")
// Não coloca número de linha de propósito: o mapa só muda quando a estrutura muda.
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import vm from "node:vm";
import { STAGES } from "../pipeline/stages.mjs";
import { ROOT, walk } from "../pipeline/lib.mjs";

const OUT = join(ROOT, "docs/MAPA_CODIGO.md");
const read = (p) => readFileSync(join(ROOT, p), "utf8");

function modulosDoApp() {
  const lines = read("assets/app.js").split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\/\* -{10} (.+?) -{10} \*\/$/);
    if (!m) continue;
    let fn = "";
    for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
      const f = lines[j].match(/^\((?:async )?function (\w+)\(/) ?? lines[j].match(/^function (\w+)\(/);
      if (f) { fn = f[1]; break; }
    }
    out.push([m[1], fn || "(declarações no escopo do arquivo)"]);
  }
  return out;
}

function secoesDoHtml() {
  const html = read("index.html");
  return [...html.matchAll(/<section class="[^"]*" id="([^"]+)">\s*<div class="wrap[^"]*">\s*<(?:div class="(?:sheet-head|form-bar)"|header[^>]*)>\s*(?:<h2 data-i18n="([^"]+)"|<p class="form-title" data-i18n="([^"]+)")/g)]
    .map((m) => [m[1], m[2] ?? m[3]]);
}

function chavesDeTraducao() {
  const ctx = { window: {} };
  vm.runInNewContext(read("assets/i18n.js"), ctx);
  return Object.keys(ctx.window.I18N_EN ?? {}).length;
}

function testes() {
  const src = read("tests/site.spec.mjs");
  return [...src.matchAll(/^test\("([^"]+)"/gm)].map((m) => m[1].split(" // ")[0]);
}

function workflows() {
  const dir = join(ROOT, ".github/workflows");
  return readdirSync(dir).filter((f) => f.endsWith(".yml")).sort().map((f) => {
    const txt = readFileSync(join(dir, f), "utf8");
    const nome = txt.match(/^name:\s*(.+)$/m)?.[1] ?? f;
    const jobs = [...txt.matchAll(/^  ([a-z][\w-]*):\n    name: (.+)$/gm)].map((m) => `\`${m[1]}\` (${m[2].replace(/\$\{\{.*?\}\}/g, "…")})`);
    return [f, nome, jobs];
  });
}

function arquivosDe(dir, filtro = () => true) {
  return walk(join(ROOT, dir)).map((f) => relative(ROOT, f)).filter(filtro).sort();
}

function gerar() {
  const L = [];
  L.push("# Mapa do código", "");
  L.push("> **Gerado** por `scripts/docs/gerar-mapa-codigo.mjs`. Não edite à mão: rode `npm run docs:mapa` depois de criar, renomear ou remover módulo, seção, etapa, teste ou workflow. A etapa `higiene` da pipeline falha se este arquivo estiver desatualizado.", "");

  L.push("## Página (`index.html`)", "", "Cada seção é uma \"folha\" do registro técnico. A chave é a do título no `assets/i18n.js`.", "", "| Âncora | Chave do título |", "|---|---|");
  for (const [id, key] of secoesDoHtml()) L.push(`| \`#${id}\` | \`${key}\` |`);
  L.push("");

  L.push("## Comportamento (`assets/app.js`)", "", "Um arquivo, um módulo por bloco (função autoexecutável), na ordem do arquivo. Detalhe de cada um em [`docs/modulos/`](modulos/).", "", "| Bloco | Função |", "|---|---|");
  for (const [titulo, fn] of modulosDoApp()) L.push(`| ${titulo} | \`${fn}\` |`);
  L.push("");

  L.push("## Textos e imagens", "",
    `- \`assets/i18n.js\`: ${chavesDeTraducao()} textos fixos do HTML em inglês (português fica no próprio HTML, em \`data-i18n\`).`,
    "- Textos de demos, projetos, pipeline e stack ficam em `assets/app.js`, com `tr(pt, en)`.",
    "- Imagens em `assets/img/` (WebP); fontes em `assets/fonts/` (hospedadas, OFL).", "");
  L.push("Arquivos em `assets/`:", "");
  for (const f of arquivosDe("assets", (f) => !f.includes("/img/") && !f.includes("/fonts/"))) L.push(`- \`${f}\``);
  for (const f of arquivosDe("assets/img")) L.push(`- \`${f}\``);
  for (const f of arquivosDe("assets/fonts")) L.push(`- \`${f}\``);
  L.push("");

  L.push("## Pipeline (`scripts/pipeline/`)", "", "| # | Etapa | Depende de | Código |", "|---|---|---|---|");
  STAGES.forEach((s, i) => L.push(`| ${i + 1} | ${s.id} | ${s.needs.join(", ") || "-"} | ${existsSync(join(ROOT, `scripts/pipeline/stages/${s.id}.mjs`)) ? `\`stages/${s.id}.mjs\`` : "job do Actions"} |`));
  L.push("", "Infraestrutura: `run.mjs` (uma etapa), `all.mjs` (todas, local), `report.mjs` (junta em `pipeline.json`), `stages.mjs` (definição única), `lib.mjs`, `patterns.mjs`, `i18n-checks.mjs`.", "");

  L.push("## Testes (`tests/site.spec.mjs`)", "");
  for (const t of testes()) L.push(`- ${t}`);
  L.push("");

  L.push("## Workflows (`.github/workflows/`)", "");
  for (const [f, nome, jobs] of workflows()) L.push(`- \`${f}\` (${nome}): ${jobs.join(", ") || "-"}`);
  L.push("");

  L.push("## Documentação (`docs/`)", "");
  for (const f of arquivosDe("docs", (f) => f.endsWith(".md"))) L.push(`- \`${f}\``);
  L.push("");
  return L.join("\n");
}

const novo = gerar();
if (process.argv.includes("--check")) {
  const atual = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
  if (atual !== novo) { console.error("docs/MAPA_CODIGO.md está desatualizado. Rode: npm run docs:mapa"); process.exit(1); }
  console.log("MAPA_CODIGO.md está em dia.");
} else {
  writeFileSync(OUT, novo);
  console.log("docs/MAPA_CODIGO.md gerado.");
}
