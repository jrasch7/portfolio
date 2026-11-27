# ADR 0004: site estático, sem framework e sem build

- Status: aceito
- Data: 2026-11-27

## Contexto

É um portfólio de uma página. A versão inicial era Flask + PostgreSQL só para listar habilidades, o que exigia servidor e banco sem acrescentar nada. Um framework (React/Next) também seria mais do que o problema pede, e o site precisa carregar em instantes e passar em CSP estrita.

## Decisão

HTML, CSS e JavaScript puros, sem build. A "build" da pipeline só **monta** a pasta publicada (copia, versiona por hash, gera sitemap/robots) e confere o resultado; não transpila nem empacota.

## Consequências

- Deploy trivial no GitHub Pages; tempo de carga e superfície de ataque mínimos.
- Sem dependência de execução; só de desenvolvimento (testes, validação, Lighthouse).
- Sem componentes reutilizáveis de framework: a organização vem de [`../arquitetura/PADRAO_CODIGO.md`](../arquitetura/PADRAO_CODIGO.md) (um bloco por módulo, funções de renderização, `tr()`).
- Se o site passar a precisar de backend, banco ou renderização no servidor, exige novo ADR antes.
