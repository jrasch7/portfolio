# Contexto do projeto

> **Para agentes:** visão geral e regras invioláveis. Para trabalhar num módulo, siga o roteiro do [`AGENTS.md`](../AGENTS.md) e abra `docs/modulos/<módulo>.md`; para achar código, [`MAPA_CODIGO.md`](MAPA_CODIGO.md).

## O que é

O portfólio de **João Vargas**, desenvolvedor full-stack em Novo Hamburgo (RS). É um site estático, bilíngue (PT/EN), público, feito para convencer **empresas que contratam** (recrutadores e tech leads) de que ele estrutura sistemas, verifica o que entrega e trabalha bem com agentes de IA. Quem decide lê rápido e depois procura prova de profundidade; o contato esperado é e-mail ou LinkedIn.

A página prova o que afirma sendo aquilo que afirma:

- as demos rodam na página (arquitetura do Nivela, isolamento de tenant, fluxo da Nivela IA);
- os números do Nivela são contados no código real e arredondados para baixo;
- a pipeline que constrói o site tem o status mostrado na própria página, lido de um arquivo gerado por ela.

Produto completo (público, restrições, voz): [`../PRODUCT.md`](../PRODUCT.md). Identidade visual: [`../DESIGN.md`](../DESIGN.md).

## Stack

| Área | Tecnologia |
|---|---|
| Páginas | HTML estático (`index.html`), um arquivo |
| Comportamento | JavaScript puro, sem framework e sem build (`assets/app.js`) |
| Visual | CSS puro (`assets/style.css`), sem pré-processador |
| Fontes | B612 Mono, Barlow Condensed, Caveat, hospedadas em `assets/fonts/` |
| Textos em inglês | `assets/i18n.js` |
| Servidor local | `scripts/serve.mjs` (Node, sem dependências) |
| Pipeline | Node ≥ 22: scripts em `scripts/pipeline/`; Playwright, axe, html-validate, Lighthouse CI como dependências de desenvolvimento |
| CI/CD | GitHub Actions (`.github/workflows/`), deploy no GitHub Pages por artefato |
| Hospedagem | GitHub Pages por artefato (Source: GitHub Actions) |

Não há backend, banco, API própria, cookie, rastreador nem requisição a terceiros. É decisão ([ADR 0004](adr/0004-site-estatico-sem-framework-nem-build.md)).

## Regras invioláveis

1. **Público e sem dado sensível.** Ver [`arquitetura/CONTEUDO_PUBLICO.md`](arquitetura/CONTEUDO_PUBLICO.md).
2. **Dado só com fonte.** Número medido, arredondado para baixo, com data. Produto fora de produção não entra.
3. **Bilíngue.** Texto novo nos dois idiomas, com chave ou `tr()`.
4. **CSP estrita.** `default-src 'self'`; nada inline, nada de terceiros.
5. **Acessibilidade e desempenho são teste, não intenção.** axe sem violação grave, Lighthouse ≥ 90/95/95/90, CLS ≤ 0,05.
6. **Documentação no mesmo PR.** `MAPA_CODIGO.md` é gerado e checado.
7. **Nada direto na `main`.** PR sempre; gate local verde.

## Relação com os outros projetos

| Projeto | Relação |
|---|---|
| **Nivela** (`jrasch7/nivela_app`, privado) | Fonte dos números e do conteúdo técnico das demos. O portfólio **não** lê esse repositório em execução: os números são contados à mão (ou por script) e escritos no HTML com a data. Capturas vêm da demonstração pública do site do Nivela. |
| **SulCore** (`sulcore/sulcore.github.io`, público) | Referência de pipeline (ações fixadas por SHA, Lighthouse CI, e2e) e uma das capturas. Aparece como projeto. |
| **Nivela Pay** | **Fora do portfólio** enquanto não estiver em produção. |

## Estado dos módulos

| Módulo | Estado | Doc |
|---|---|---|
| Idioma e textos | Estável | [`modulos/idioma-e-textos.md`](modulos/idioma-e-textos.md) |
| Topo: anotações e totais | Estável | [`modulos/heroi-e-totais.md`](modulos/heroi-e-totais.md) |
| Demos do Nivela (arquitetura, tenant, IA) | Estável | [`modulos/demos-nivela.md`](modulos/demos-nivela.md) |
| Projetos, IA no desenvolvimento, stack | Estável | [`modulos/projetos-ia-dev-stack.md`](modulos/projetos-ia-dev-stack.md) |
| Galeria e foto | Estável; foto pessoal pendente ([`DEBT.md`](DEBT.md)) | [`modulos/galeria-e-foto.md`](modulos/galeria-e-foto.md) |
| Tela da pipeline | Estável | [`modulos/tela-da-pipeline.md`](modulos/tela-da-pipeline.md) |
| Paleta de comandos e navegação | Estável | [`modulos/paleta-e-navegacao.md`](modulos/paleta-e-navegacao.md) |
| Pipeline de CI/CD | Estável; roda no GitHub Actions e publica o site | [`PIPELINE.md`](PIPELINE.md) |
| Sistema visual | Estável | [`modulos/sistema-visual.md`](modulos/sistema-visual.md) |

## Terminologia

- **Folha**: cada seção da página, no estilo de um registro técnico (`Folha N de 9`).
- **Registro técnico**: o mundo visual do site (formulário em papel, tinta, carimbo).
- **Etapa**: uma verificação da pipeline (`higiene`, `estatico`, `build`, `testes`, `desempenho`, `seguranca`, `deploy`, `smoke`, `pr-gate`).
- **Relatório**: o `pipeline.json` gerado pela pipeline e lido pela tela da pipeline.
- **Artefato**: a pasta `_site/` montada pela etapa `build`; é ela que se testa e que se publica.
