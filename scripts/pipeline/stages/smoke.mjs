// Etapa 9: fumaça pós-deploy. Confere o que o visitante realmente recebe do site publicado.
import { check } from "../lib.mjs";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default async function smoke() {
  // No CI a URL vem do job de deploy. Fora do CI usa o site público, para a execução local também conferir o que está no ar.
  const base = (process.env.SITE_URL || (process.env.GITHUB_ACTIONS ? "" : "https://jrasch7.github.io/portfolio/")).replace(/\/?$/, "/");
  if (base === "/") return { skipped: "sem URL do site publicado (SITE_URL)", checks: [] };
  const want = process.env.GITHUB_SHA;
  const get = async (path) => {
    const res = await fetch(base + path, { headers: { "cache-control": "no-cache" } });
    return { res, text: await res.text() };
  };

  // O Pages demora a propagar: espera a versão do commit aparecer (até ~5 min).
  let info, waited = 0;
  for (let i = 0; i < 20; i++) {
    try {
      const { res, text } = await get(`build-info.json?t=${Date.now()}`);
      if (res.ok) { info = JSON.parse(text); if (!want || info.sha === want) break; }
    } catch { /* tenta de novo */ }
    await sleep(15000); waited += 15;
  }
  const checks = [];
  checks.push(check("versão publicada é a do commit", !!info && (!want || info.sha === want), info ? `publicado ${info.sha.slice(0, 7)}` : "build-info.json não apareceu"));
  if (!info) return { checks };

  const home = await get("");
  checks.push(check("página inicial responde 200 com título", home.res.status === 200 && /<title>[^<]+<\/title>/.test(home.text), `HTTP ${home.res.status}`));
  const bad = [];
  for (const f of info.files) { const r = await fetch(base + f.path, { method: "HEAD" }); if (!r.ok) bad.push(`${f.path} ${r.status}`); }
  checks.push(check(`${info.files.length} arquivos publicados respondem 200`, !bad.length, bad.slice(0, 3).join(", ")));
  const p = await get("pipeline.json");
  let ok = false; try { ok = JSON.parse(p.text).schema === 1; } catch { /* inválido */ }
  checks.push(check("pipeline.json publicado e válido", p.res.ok && ok));
  return { checks, metrics: { esperouSegundos: waited, arquivos: info.files.length } };
}
