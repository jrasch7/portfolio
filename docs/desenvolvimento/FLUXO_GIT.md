# Fluxo de Git, PR e deploy

Regras de trabalho com Git neste repositório. Resumo para quem já conhece o fluxo do Nivela: aqui há **um ambiente** (produção, no GitHub Pages) e **uma branch de integração** (`main`).

## Princípios

1. **Nada direto na `main`.** Todo trabalho vai em branch, vira PR e é mergeado depois do gate.
2. **A `main` é o que está no ar.** Um push na `main` dispara a pipeline e, com o Pages configurado, o deploy.
3. **PR pequeno e explicado.** O gate do PR confere título, corpo e tamanho do diff (até 1500 linhas, sem lockfile nem imagens).
4. **Nunca `git add .` às cegas.** Adicione por caminho e confira o `git diff --cached --stat`.

## Branches

| Padrão | Uso |
|---|---|
| `claude/<assunto>` | Trabalho de agente de IA (também `codex/<assunto>`) |
| `feat/<assunto>`, `fix/<assunto>`, `docs/<assunto>` | Trabalho humano |

Sempre a partir de `main` atualizada: `git fetch origin --prune && git checkout -b <branch> origin/main`. Branch já mergeada não se reaproveita: crie outra.

**Limpeza:** branch cujo PR foi mergeado é obsoleta e se apaga (local e remota). Ligue Settings → General → **Automatically delete head branches** para o GitHub apagar a remota sozinho no merge. Antes de apagar uma branch que não conhece, confira se o conteúdo dela já está na `main` (`git log origin/main..origin/<branch>`): não apague só porque "tem N commits à frente".

## Rotina

1. `git fetch origin --prune`; conferir PRs e branches abertas (para não pisar em outro trabalho).
2. Branch a partir de `origin/main`.
3. Mudança mínima, com documentação junto.
4. `npm run pipeline` (ou a etapa do que mudou). Tela mudou: capturas reais, desktop e celular.
5. `git diff --cached --stat` e conferir adições e remoções.
6. Commit; push com `git push -u origin <branch>`.
7. PR contra `main` com o modelo de [`.github/pull_request_template.md`](../../.github/pull_request_template.md).
8. Merge (squash) depois do gate verde. Registro no [`../arquivo/LOG.md`](../arquivo/LOG.md) quando a entrega for significativa.

## Commits

Mensagem curta no imperativo ou no passado, em português, dizendo **o que mudou**; corpo explica o **porquê** quando não for óbvio.

```
Registro técnico: troca o tema escuro por papel e tinta

Cada seção vira uma folha de formulário; fontes hospedadas; CLS 0.
```

Exemplos ruins: `ajustes`, `fix`, `wip`, `update`.

## Pull request

- Título entre 15 e 100 caracteres, sem ponto final, sem `WIP`.
- Corpo com a seção **Validação** (o gate procura `## Validação`, `## Como validei` ou `## Validation`) e pelo menos 80 caracteres.
- Origem diferente de `main`.
- Diff de até 1500 linhas (lockfile, imagens e `pipeline.json` não contam).

## Merge e deploy

- **Quem mergeia:** o dono autorizou agentes a mergear PR deste repositório quando o gate está verde (ver [`AGENTS.md`](../../AGENTS.md)). Mudança de regra, de pipeline ou de visual grande: avise o dono na resposta.
- **Gate:** o GitHub Actions roda a pipeline no PR. Rode também `npm run pipeline` local antes de abrir e cite o resultado no PR; se o Actions ficar indisponível, o gate local é a única barreira e não se afirma CI verde.
- **Deploy:** push na `main` → pipeline → job `deploy` (Pages por artefato) → job `smoke` → job `finalizar` (republica a página com o resultado do smoke). Detalhe em [`../PIPELINE.md`](../PIPELINE.md).
- **Reverter:** `git revert <merge>` em branch nova e PR. Nunca reescrever histórico da `main`.

## Dependabot

Semanal, para npm (dependências de desenvolvimento agrupadas) e GitHub Actions. PR do Dependabot passa pelo mesmo gate. Atualização de ação fixada por SHA: confira o changelog antes de mergear.
