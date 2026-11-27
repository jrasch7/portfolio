# Módulo: tela da pipeline

## Para agentes

- **O que faz:** mostra, na folha 7 (`#pipeline`), o resultado real da pipeline que construiu o site: grafo de etapas, status, tempo, verificações e métricas de cada uma.
- **Código:** bloco `tela da pipeline` (`pipelineView`) em `assets/app.js`; estilos `.pl-*` em `assets/style.css`. Os **dados** vêm de `pipeline.json`, que **não é escrito à mão**: é gerado por `scripts/pipeline/report.mjs` a partir dos relatórios de cada etapa.
- **Fluxo:** `fetch('pipeline.json', {cache:'no-store'})` → `levels()` agrupa as etapas por profundidade (`needs`) → `renderGraph()` desenha os nós → `drawEdges()` desenha as ligações em SVG (só acima de 900 px; abaixo disso os nós empilham) → `renderDetail()` mostra a etapa selecionada.
- **Schema 1** (`pipeline.json`): `source` (`ci` ou `local`), `run` (sha, branch, evento, url), `status`, `totals`, `stages[]` com `name`/`what`/`why`/`inspired` em PT e EN, `status` (`passed`, `failed`, `skipped`, `pending`), `durationMs`, `checks[]` (`name`, `en`, `ok`, `detail`), `metrics`, `note`.
- **Texto das etapas** mora em `scripts/pipeline/stages.mjs`, não no site: é a definição única de etapa, usada pelo workflow, pela execução local e por esta tela.
- **Rótulos das métricas** (`METRIC` no módulo) são traduzidos aqui; nome de verificação é traduzido por `scripts/pipeline/i18n-checks.mjs`.

## Estados e o que significam

- `deploy` aparece como **passou** quando o relatório vem do CI na `main`: a página só existe se o deploy aconteceu. Fora disso, "pulada" (PR) ou "pendente" (execução local).
- `smoke` roda **depois** que o site é publicado; no pacote publicado ele aparece **pendente**, e o resultado fica no GitHub Actions. A tela avisa isso.
- Execução local mostra `source: local` ("Execução local"); a do CI mostra "GitHub Actions" e o link da execução.

## Armadilhas

- `pipeline.json` na raiz do repositório é uma versão de referência gerada por `npm run pipeline -- --seed`. Fica velha até a próxima execução; o CI a substitui dentro do site publicado.
- O carimbo do resultado cai com animação ao entrar na tela (`IntersectionObserver` + classes `pre`/`slam`). É o único momento animado da página; com `prefers-reduced-motion` ele já aparece pronto.
- Não escreva estilo inline ao montar o grafo (CSP). Posições de aresta vão em atributos do SVG, estados em classes.
- Nome de etapa novo em `stages.mjs` precisa de arquivo em `scripts/pipeline/stages/` (ou ser job do Actions) e atualiza o teste "nove etapas" em `tests/site.spec.mjs`.
