# Log de entregas

Histórico cronológico, do mais novo para o mais antigo. Formato fixo (ver [`AGENTS.md`](../../AGENTS.md)).

## [2026-11-28] — Gate e smoke sem estado pendente
**Status:** concluída
**O que foi feito:** diagnóstico com a execução real do Actions (commit `37b27b7`): o job "Gate do PR" ficava verde mas o script se declarava "pulado" fora de PR; o job de smoke rodava e passava, mas o `pipeline.json` já estava empacotado antes do deploy e mostrava "pendente". Correções: o `pr-gate` passa a validar o último commit fora de PR; novo job `finalizar` republica o mesmo artefato com o `pipeline.json` refeito depois do smoke; o smoke local passa a rodar contra o site público; o `deploy` local é confirmado pelo smoke. Docs e ADR 0001 corrigidos: o Actions **funciona** e o Pages publica **por artefato** (a entrada do dia 27 dizia o contrário).
**Decisões tomadas:** segundo deploy por execução (artefato `github-pages-final`) em vez de deixar o smoke pendente na página; itens de dívida do Actions e do Lighthouse fechados (a execução real passou nos orçamentos).
**Próximo passo:** apagar as branches remotas obsoletas ([`DEBT.md`](../DEBT.md) item 4); conferir a próxima execução na `main` com o smoke aprovado na página.

## [2026-11-27] — Site no ar e organização de branches
**Status:** concluída (limpeza das branches remotas pendente do dono)
**O que foi feito:** repositório tornado público e Pages ativado por branch (`main`, raiz): site em `https://jrasch7.github.io/portfolio/`, verificado (200 em todos os arquivos, sem erro de console, sem violação de CSP, 9 etapas na tela da pipeline). Mergeados os dois PRs do Dependabot (`codeql-action` 4.39.2 → 4.39.5, `init` e `analyze` juntos; o changelog oficial só traz atualização do pacote do CodeQL). Branches locais já mergeadas apagadas nos dois repositórios.
**Decisões tomadas:** a `feat/restruturacao-…` (2 commits de bot de abril, só no `app.py` removido) é obsoleta: o conteúdo atual a substitui por completo. A sessão de agente não apaga branch remota (proxy bloqueia o `git push --delete`; sem ferramenta no MCP): fica para o dono ([`DEBT.md`](../DEBT.md) item 4).
**Próximo passo:** apagar as branches remotas; resolver o Actions da conta e trocar o Pages para "GitHub Actions".

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
