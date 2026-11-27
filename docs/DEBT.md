# Dívida e pendências

Abra aqui o que é dívida de código, de documentação ou de processo; feche quando resolver (com a data no [`arquivo/LOG.md`](arquivo/LOG.md)).

| # | Item | Impacto | Próximo passo |
|---|---|---|---|
| 1 | **GitHub Actions da conta não executa.** Os jobs falham em 2 a 4 segundos, sem rodar nenhum passo e sem log, até o CodeQL do próprio GitHub. | A pipeline só roda localmente (`npm run pipeline`); o deploy por pipeline não acontece. | Ler a anotação da execução no GitHub (provável cobrança, limite ou restrição de Actions da conta) e corrigir. Depois: Settings → Pages → Source: GitHub Actions. |
| 2 | **Foto pessoal ausente.** | A folha 2 mostra o monograma "JV". | Colocar `assets/foto.jpg` (3:4, ≤150 KB) e ligar `HAS_PHOTO`. |
| 3 | **Números do Nivela são contados à mão.** | Podem ficar velhos. | Script que conte no repositório do Nivela e imprima os valores, para atualizar `data-count` com a data. |
| 4 | **`pipeline.json` na raiz é gerado e versionado.** | Fica desatualizado até a próxima execução local. | Aceito: o CI o substitui no site publicado. Reavaliar se o ruído em diff incomodar. |
| 5 | **Lighthouse no runner do GitHub pode ficar abaixo do local.** | Orçamento pode reprovar sem ser regressão. | Medir na primeira execução real e ajustar `scripts/pipeline/stages/desempenho.mjs` com justificativa. |
| 6 | **Branches remotas obsoletas** (já mergeadas): no `portfolio`, as 8 `claude/*` e a `feat/restruturacao-portfolio-profissional-…` (2 commits antigos de bot que só mexem no `app.py` removido); no repositório do perfil, `claude/keen-sagan-u7sili` e `claude/sem-nivela-pay`. | Poluem a lista de branches. A sessão de agente não consegue apagar branch remota (o proxy bloqueia). | O dono apaga em Branches (ícone de lixeira) e liga Settings → General → "Automatically delete head branches". |
