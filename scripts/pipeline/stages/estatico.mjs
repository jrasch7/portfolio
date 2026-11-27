// Etapa 3: análise estática (sintaxe, HTML, paridade PT/EN, referências internas).
import { existsSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";
import { HtmlValidate } from "html-validate/node";
import { ROOT, check, read, sh, walk } from "../lib.mjs";

export default async function estatico() {
  const checks = [];
  const html = read(join(ROOT, "index.html"));

  // 1) Sintaxe de cada arquivo JavaScript.
  const js = walk(ROOT).filter((f) => /\.(m?js)$/.test(f) && !f.includes("/node_modules/"));
  const bad = js.filter((f) => sh("node", ["--check", f]).code !== 0);
  checks.push(check(`sintaxe válida em ${js.length} arquivos JavaScript`, !bad.length, bad.map((f) => f.replace(ROOT + "/", "")).join(", ")));

  // 2) Validação do HTML.
  const hv = new HtmlValidate({
    extends: ["html-validate:recommended"],
    rules: {
      "no-inline-style": "off", // estilos dinâmicos são feitos por JS/CSSOM; ver CSP
      "prefer-native-element": ["error", { exclude: ["listbox"] }], // a paleta de comandos é um listbox legítimo
      "no-trailing-whitespace": "off",
      "attribute-boolean-style": "off",
      "void-style": "off",
      "long-title": "off",
      "no-redundant-role": "off",
    },
  });
  const report = await hv.validateString(html, "index.html");
  const msgs = report.results.flatMap((r) => r.messages.map((m) => `L${m.line} ${m.ruleId}: ${m.message}`));
  checks.push(check("HTML válido (html-validate)", report.valid, msgs.slice(0, 4).join(" | ")));

  // 3) Paridade entre português e inglês.
  const ctx = { window: {} };
  vm.runInNewContext(read(join(ROOT, "assets/i18n.js")), ctx);
  const EN = ctx.window.I18N_EN ?? {};
  const used = new Set([...html.matchAll(/data-i18n(?:-label|-ph)?="([^"]+)"/g)].map((m) => m[1]));
  const missing = [...used].filter((k) => !(k in EN));
  const orphan = Object.keys(EN).filter((k) => !used.has(k));
  const empty = Object.entries(EN).filter(([, v]) => !String(v).trim()).map(([k]) => k);
  checks.push(check(`todas as ${used.size} chaves de texto têm tradução em inglês`, !missing.length, missing.join(", ")));
  checks.push(check("nenhuma tradução órfã ou vazia", !orphan.length && !empty.length, [...orphan, ...empty].join(", ")));

  // 4) Referências internas.
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
  const deadAnchors = anchors.filter((a) => !ids.has(a));
  checks.push(check(`${anchors.length} âncoras internas apontam para um id existente`, !deadAnchors.length, deadAnchors.join(", ")));

  const refs = [...html.matchAll(/(?:src|href)="(assets\/[^"?#]+)/g)].map((m) => m[1]);
  const jsText = read(join(ROOT, "assets/app.js"));
  const imgRefs = [...jsText.matchAll(/f:\s*'([^']+\.(?:webp|jpg|png))'/g)].map((m) => `assets/img/${m[1]}`);
  const allRefs = [...new Set([...refs, ...imgRefs])];
  const missingFiles = allRefs.filter((f) => !existsSync(join(ROOT, f)));
  checks.push(check(`${allRefs.length} arquivos referenciados existem`, !missingFiles.length, missingFiles.join(", ")));

  // 5) Básico de documento.
  const meta = [/<html lang="/.test(html), /<meta name="viewport"/.test(html), /<title>[^<]{5,}<\/title>/.test(html), /<meta name="description" content="[^"]{40,}"/.test(html)];
  checks.push(check("lang, viewport, título e descrição presentes", meta.every(Boolean)));

  return { checks, metrics: { chavesDeTexto: used.size, ancoras: anchors.length, arquivosJS: js.length, referencias: allRefs.length } };
}
