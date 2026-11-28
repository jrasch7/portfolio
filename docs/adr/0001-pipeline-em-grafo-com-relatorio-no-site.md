# ADR 0001: pipeline em grafo, com relatório dentro do site

- Status: aceito
- Data: 2026-11-27

## Contexto

O portfólio é um site estático sem build. Uma pipeline completa é mais do que ele precisa. O objetivo é mostrar as técnicas de CI/CD que usamos no Nivela e no SulCore num projeto pequeno e público.

## Decisão

1. Etapas são scripts Node sem dependências de execução, em `scripts/pipeline/stages/`. O workflow só orquestra.
2. As etapas formam um grafo (`needs`) definido uma vez em `scripts/pipeline/stages.mjs`; dali saem a execução local, o workflow e a tela do site.
3. Cada etapa grava um relatório JSON. Um job final junta tudo em `pipeline.json`, que é empacotado no site.
4. O artefato é construído uma vez e é o mesmo testado e publicado.
5. Deploy só da `main`, ligado por padrão (a variável `PAGES_DEPLOY=false` o desliga), seguido de um smoke.

## Consequências

- Dá para rodar tudo antes do push (`npm run pipeline`).
- A tela do site mostra dados reais e não precisa chamar a API do GitHub (que exige token em repositório privado e tem limite de requisições).
- `pipeline.json` na raiz é um arquivo gerado, versionado como referência; fica desatualizado até a próxima execução local ou de CI.
- `deploy` e `smoke` não conseguem aparecer com o resultado final dentro do pacote que o próprio deploy publica. Solução: o job `finalizar` roda depois do smoke e republica o mesmo artefato com o `pipeline.json` refeito (segundo deploy, artefato `github-pages-final`). O custo é um segundo deploy por execução.
- O `pr-gate` não pode depender de existir PR: fora de PR ele valida o último commit, para o estado "pulada" nunca aparecer na tela.
