# Módulos

Cada módulo é um bloco de `assets/app.js` (função autoexecutável), junto com a parte do HTML, do CSS e dos textos que lhe pertence. Onde fica cada coisa: [`MAPA_CODIGO.md`](MAPA_CODIGO.md) (gerado). Cada documento abaixo começa por um bloco **"Para agentes"** e termina com as armadilhas.

| Módulo | Seção (âncora) | Doc |
|---|---|---|
| Idioma e textos (PT/EN, `data-i18n`, `tr()`) | todas | [`modulos/idioma-e-textos.md`](modulos/idioma-e-textos.md) |
| Topo: anotações do inspetor e totais | `#top` | [`modulos/heroi-e-totais.md`](modulos/heroi-e-totais.md) |
| Demos do Nivela: arquitetura, isolamento de tenant, Nivela IA | `#nivela` | [`modulos/demos-nivela.md`](modulos/demos-nivela.md) |
| Projetos, IA no desenvolvimento, stack | `#projetos`, `#ia-dev`, `#stack` | [`modulos/projetos-ia-dev-stack.md`](modulos/projetos-ia-dev-stack.md) |
| Galeria com ampliação e foto pessoal | `#galeria`, `#sobre` | [`modulos/galeria-e-foto.md`](modulos/galeria-e-foto.md) |
| Tela da pipeline | `#pipeline` | [`modulos/tela-da-pipeline.md`](modulos/tela-da-pipeline.md) |
| Paleta de comandos, menu ativo, aviso | cabeçalho | [`modulos/paleta-e-navegacao.md`](modulos/paleta-e-navegacao.md) |
| Sistema visual (CSS) | todas | [`modulos/sistema-visual.md`](modulos/sistema-visual.md) |
| Pipeline de CI/CD (scripts e workflows) | fora da página | [`PIPELINE.md`](PIPELINE.md) |

## Como acrescentar um módulo

1. Crie o bloco em `assets/app.js` com o comentário `/* ---------- nome ---------- */` e uma função autoexecutável nomeada, no padrão de [`arquitetura/PADRAO_CODIGO.md`](arquitetura/PADRAO_CODIGO.md).
2. Se tiver texto visível: chave em `assets/i18n.js` ou `tr(pt, en)`. Os dois idiomas.
3. Se tiver comportamento que o visitante usa: um teste em `tests/site.spec.mjs` com nome `português // inglês`.
4. Crie `docs/modulos/<nome>.md` com o bloco "Para agentes" e as armadilhas, e linke aqui e em [`CONTEXT.md`](CONTEXT.md).
5. Rode `npm run docs:mapa` e `npm run pipeline`.
