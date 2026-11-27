# Dívida e pendências

Abra aqui o que é dívida de código, de documentação ou de processo; feche quando resolver (com a data no [`arquivo/LOG.md`](arquivo/LOG.md)).

| # | Item | Impacto | Próximo passo |
|---|---|---|---|
| 1 | **GitHub Actions da conta não executa.** Os jobs falham em 2 a 4 segundos, sem rodar nenhum passo e sem log, até o CodeQL do próprio GitHub. | A pipeline só roda localmente (`npm run pipeline`); o deploy por pipeline não acontece. | Ler a anotação da execução no GitHub (provável cobrança, limite ou restrição de Actions da conta) e corrigir. Depois: Settings → Pages → Source: GitHub Actions. |
| 2 | **GitHub Pages ainda não ativado** no repositório. | O site não está no ar. | Tornar o repositório público e ativar o Pages (por pipeline, item 1, ou por branch, que funciona sem Actions). |
| 3 | **Foto pessoal ausente.** | A folha 2 mostra o monograma "JV". | Colocar `assets/foto.jpg` (3:4, ≤150 KB) e ligar `HAS_PHOTO`. |
| 4 | **Sem licença definida.** | Sem arquivo `LICENSE`, vale "todos os direitos reservados" por padrão. | O dono decide: manter assim, ou MIT para o código (fontes seguem OFL; capturas e textos podem ficar de fora). |
| 5 | **Números do Nivela são contados à mão.** | Podem ficar velhos. | Script que conte no repositório do Nivela e imprima os valores, para atualizar `data-count` com a data. |
| 6 | **`pipeline.json` na raiz é gerado e versionado.** | Fica desatualizado até a próxima execução local. | Aceito: o CI o substitui no site publicado. Reavaliar se o ruído em diff incomodar. |
| 7 | **Lighthouse no runner do GitHub pode ficar abaixo do local.** | Orçamento pode reprovar sem ser regressão. | Medir na primeira execução real e ajustar `scripts/pipeline/stages/desempenho.mjs` com justificativa. |
