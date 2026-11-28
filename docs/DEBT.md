# Dívida e pendências

Abra aqui o que é dívida de código, de documentação ou de processo; feche quando resolver (com a data no [`arquivo/LOG.md`](arquivo/LOG.md)).

| # | Item | Impacto | Próximo passo |
|---|---|---|---|
| 0 | **Outros projetos, estudos e experimentos do João ainda não estão no site.** | A folha da bancada cobre só o que foi conferido no código do Nivela. | O João listar o que quer mostrar (projetos tentados, estudos, experimentos de IA fora do Nivela); só entra com fonte e com decisão dele. |
| 1 | **Foto pessoal ausente.** | A folha 2 mostra o monograma "JV". | Colocar `assets/foto.jpg` (3:4, ≤150 KB) e ligar `HAS_PHOTO`. |
| 2 | **Números do Nivela são contados à mão.** | Podem ficar velhos. | Script que conte no repositório do Nivela e imprima os valores, para atualizar `data-count` com a data. |
| 3 | **`pipeline.json` na raiz é gerado e versionado.** | Fica desatualizado até a próxima execução local. | Aceito: o CI o substitui no site publicado. Reavaliar se o ruído em diff incomodar. |
| 4 | **Branches remotas obsoletas** (já mergeadas): no `portfolio`, as 8 `claude/*` e a `feat/restruturacao-portfolio-profissional-…` (2 commits antigos de bot que só mexem no `app.py` removido); no repositório do perfil, `claude/keen-sagan-u7sili` e `claude/sem-nivela-pay`. | Poluem a lista de branches. A sessão de agente não consegue apagar branch remota (o proxy bloqueia). | O dono apaga em Branches (ícone de lixeira) e liga Settings → General → "Automatically delete head branches". |
