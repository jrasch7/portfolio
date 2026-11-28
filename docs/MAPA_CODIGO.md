# Mapa do código

> **Gerado** por `scripts/docs/gerar-mapa-codigo.mjs`. Não edite à mão: rode `npm run docs:mapa` depois de criar, renomear ou remover módulo, seção, etapa, teste ou workflow. A etapa `higiene` da pipeline falha se este arquivo estiver desatualizado.

## Página (`index.html`)

Cada seção é uma "folha" do registro técnico. A chave é a do título no `assets/i18n.js`.

| Âncora | Chave do título |
|---|---|
| `#top` | `hero.form` |
| `#sobre` | `about.h2` |
| `#galeria` | `gal.h2` |
| `#nivela` | `s1.h2` |
| `#projetos` | `s2.h2` |
| `#ia-dev` | `s3.h2` |
| `#pipeline` | `pl.h2` |
| `#stack` | `s4.h2` |
| `#contato` | `s5.h2` |

## Comportamento (`assets/app.js`)

Um arquivo, um módulo por bloco (função autoexecutável), na ordem do arquivo. Detalhe de cada um em [`docs/modulos/`](modulos/).

| Bloco | Função |
|---|---|
| idioma | `(declarações no escopo do arquivo)` |
| toast | `toast` |
| terminal do hero | `terminal` |
| contadores | `counters` |
| abas | `tabs` |
| arquitetura | `arch` |
| isolamento de tenant | `tenant` |
| Nivela IA | `nivelaIA` |
| projetos | `projects` |
| pipeline de IA no desenvolvimento | `pipeline` |
| stack | `stack` |
| paleta de comandos | `palette` |
| seção ativa no menu | `spy` |
| galeria com ampliação | `gallery` |
| foto (opcional): assets/foto.jpg | `portrait` |
| tela da pipeline (lê pipeline.json, gerado pela própria pipeline) | `pipelineView` |

## Textos e imagens

- `assets/i18n.js`: 81 textos fixos do HTML em inglês (português fica no próprio HTML, em `data-i18n`).
- Textos de demos, projetos, pipeline e stack ficam em `assets/app.js`, com `tr(pt, en)`.
- Imagens em `assets/img/` (WebP); fontes em `assets/fonts/` (hospedadas, OFL).

Arquivos em `assets/`:

- `assets/app.js`
- `assets/favicon.svg`
- `assets/i18n.js`
- `assets/style.css`
- `assets/img/nivela-celular.webp`
- `assets/img/nivela-dashboard.webp`
- `assets/img/sulcore-demo.webp`
- `assets/fonts/b612-mono-400-latin.woff2`
- `assets/fonts/b612-mono-700-latin.woff2`
- `assets/fonts/barlow-condensed-500-latin.woff2`
- `assets/fonts/barlow-condensed-600-latin.woff2`
- `assets/fonts/barlow-condensed-700-latin.woff2`
- `assets/fonts/caveat-600-latin.woff2`

## Pipeline (`scripts/pipeline/`)

| # | Etapa | Depende de | Código |
|---|---|---|---|
| 1 | pr-gate | - | `stages/pr-gate.mjs` |
| 2 | higiene | - | `stages/higiene.mjs` |
| 3 | estatico | higiene | `stages/estatico.mjs` |
| 4 | build | estatico | `stages/build.mjs` |
| 5 | testes | build | `stages/testes.mjs` |
| 6 | desempenho | build | `stages/desempenho.mjs` |
| 7 | seguranca | build | `stages/seguranca.mjs` |
| 8 | deploy | testes, desempenho, seguranca | job do Actions |
| 9 | smoke | deploy | `stages/smoke.mjs` |

Infraestrutura: `run.mjs` (uma etapa), `all.mjs` (todas, local), `report.mjs` (junta em `pipeline.json`), `stages.mjs` (definição única), `lib.mjs`, `patterns.mjs`, `i18n-checks.mjs`.

## Testes (`tests/site.spec.mjs`)

- página carrega com console limpo, sem violação de CSP e sem rolagem lateral
- imagens: nenhuma quebrada
- troca de idioma PT/EN muda o texto e fica salva
- arquitetura: clicar num bloco mostra o detalhe
- isolamento de tenant: sem RLS vaza, com RLS protege
- Nivela IA: confirmação repetida não executa duas vezes
- galeria: clicar amplia a imagem e Esc fecha
- paleta de comandos abre, filtra e navega
- tela da pipeline: mostra as nove etapas e o detalhe de cada uma
- artefato: build-info.json lista só arquivos que existem
- acessibilidade (axe): nenhuma violação grave ou crítica, em PT e EN

## Workflows (`.github/workflows/`)

- `codeql.yml` (CodeQL): `analyze` (Análise estática (…))
- `pipeline.yml` (Pipeline): `pr-gate` (1. Gate do PR), `higiene` (2. Higiene do repositório), `estatico` (3. Análise estática), `build` (4. Build reproduzível), `testes` (5. Testes ponta a ponta), `desempenho` (6. Desempenho), `seguranca` (7. Segurança), `relatorio` (Relatório (pipeline.json)), `deploy` (8. Deploy (GitHub Pages)), `smoke` (9. Fumaça pós-deploy), `finalizar` (10. Republicar a página com o resultado do smoke)

## Documentação (`docs/`)

- `docs/CONTEXT.md`
- `docs/DEBT.md`
- `docs/MAPA_CODIGO.md`
- `docs/MODULES.md`
- `docs/PIPELINE.md`
- `docs/README.md`
- `docs/adr/0001-pipeline-em-grafo-com-relatorio-no-site.md`
- `docs/adr/0002-identidade-visual-registro-tecnico.md`
- `docs/adr/0003-fontes-hospedadas-e-csp-estrita.md`
- `docs/adr/0004-site-estatico-sem-framework-nem-build.md`
- `docs/adr/README.md`
- `docs/arquitetura/CONTEUDO_PUBLICO.md`
- `docs/arquitetura/PADRAO_CODIGO.md`
- `docs/arquitetura/PADRAO_UI.md`
- `docs/arquivo/LOG.md`
- `docs/desenvolvimento/FLUXO_GIT.md`
- `docs/modulos/demos-nivela.md`
- `docs/modulos/galeria-e-foto.md`
- `docs/modulos/heroi-e-totais.md`
- `docs/modulos/idioma-e-textos.md`
- `docs/modulos/paleta-e-navegacao.md`
- `docs/modulos/projetos-ia-dev-stack.md`
- `docs/modulos/sistema-visual.md`
- `docs/modulos/tela-da-pipeline.md`
