# Log de entregas

Histórico cronológico, do mais novo para o mais antigo. Formato fixo (ver [`AGENTS.md`](../../AGENTS.md)).

## [2026-11-27] — Licença: todos os direitos reservados
**Status:** concluída
**O que foi feito:** aviso explícito de "todos os direitos reservados" no `README.md` (com a exceção das fontes, que seguem a OFL) e nota no `CONTRIBUTING.md`; item de licença removido de [`DEBT.md`](../DEBT.md).
**Decisões tomadas:** o dono optou por não adotar licença aberta: o visual (registro técnico), os textos e as capturas são a marca dele. Sem arquivo `LICENSE`. Revisar se quiser abrir só a pipeline e os testes (MIT).
**Próximo passo:** nenhum.

## [2026-11-27] — Documentação, regras de desenvolvimento e módulos
**Status:** concluída
**O que foi feito:** `AGENTS.md` e `CLAUDE.md`; `docs/` com índice, contexto, módulos (um por bloco do `app.js`), padrões de código e de interface, conteúdo público, fluxo de Git, ADRs 0002 a 0004, dívida e este log; modelo de PR; `SECURITY.md` e `CONTRIBUTING.md`; gerador do mapa do código (`npm run docs:mapa`) e checagens de documentação na etapa `higiene` (mapa em dia, links dos `.md`, arquivos de documentação obrigatórios).
**Decisões tomadas:** seguir o modelo do Nivela adaptado à escala (um site, um dono); mapa do código sem número de linha para só mudar quando a estrutura muda; histórico do Git verificado (nenhum segredo) antes de tornar o repositório público.
**Próximo passo:** tornar o repositório público; ativar o Pages; resolver o Actions da conta ([`DEBT.md`](../DEBT.md) itens 1 e 2).

## [2026-11-27] — Registro técnico e refino
**Status:** concluída
**O que foi feito:** redesenho completo para o registro técnico de manutenção ([ADR 0002](../adr/0002-identidade-visual-registro-tecnico.md)); fontes hospedadas ([ADR 0003](../adr/0003-fontes-hospedadas-e-csp-estrita.md)); refino do topo, da ampliação de fotos no celular e remoção de texto sobre app móvel.
**Decisões tomadas:** manter o registro técnico depois de comparar maquetes de planta técnica, terminal e cartaz; paleta de papel quente deliberada.
**Próximo passo:** foto pessoal.

## [2026-11-27] — Pipeline de CI/CD com tela de status no site
**Status:** concluída (CI do GitHub sem executar; ver [`DEBT.md`](../DEBT.md))
**O que foi feito:** nove etapas em grafo, executáveis local e no Actions ([`PIPELINE.md`](../PIPELINE.md), [ADR 0001](../adr/0001-pipeline-em-grafo-com-relatorio-no-site.md)); tela "Pipeline" que lê o `pipeline.json` gerado; Nivela Pay removido do portfólio.
**Decisões tomadas:** relatório dentro do site em vez de chamar a API do GitHub; artefato único testado e publicado; deploy ligado por padrão.
**Próximo passo:** ativar o Pages e o Actions.

## [2026-11-26] — Portfólio interativo, bilíngue, com galeria
**Status:** concluída
**O que foi feito:** reconstrução do portfólio como página estática (antes Flask + PostgreSQL), demos de arquitetura, isolamento de tenant e Nivela IA, galeria com capturas reais, PT/EN, LinkedIn, paleta de comandos.
**Decisões tomadas:** [ADR 0004](../adr/0004-site-estatico-sem-framework-nem-build.md).
**Próximo passo:** identidade visual própria.
