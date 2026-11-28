# Pipeline

Este site não precisaria de CI/CD. Ele tem uma de propósito, para mostrar as técnicas. Tudo o que está aqui roda igual no GitHub Actions e na sua máquina, e o resultado aparece na seção **Pipeline** do próprio portfólio.

## Visão geral

```
pr-gate ─┐
higiene ─┴─ estatico ── build ─┬─ testes ──────┐
                               ├─ desempenho ──┼─ (relatorio) ─ deploy ─ smoke ─ (finalizar)
                               └─ seguranca ───┘
```

| # | Etapa | O que confere | Reproduzir |
|---|---|---|---|
| 1 | `pr-gate` | Em PR: título, corpo com seção de validação, branch, tamanho do diff. Fora de PR (push na `main`, execução local): título e tamanho do último commit. Nunca fica "pulada". | `npm run stage -- pr-gate` |
| 2 | `higiene` | Segredos, IPs e hosts internos, e-mails, orçamento de tamanho, arquivos obrigatórios, sem emoji na UI, documentação em dia (mapa gerado, links entre `.md`, módulos indexados) | `npm run stage -- higiene` |
| 3 | `estatico` | Sintaxe JS, HTML válido, paridade PT/EN, âncoras e arquivos referenciados | `npm run stage -- estatico` |
| 4 | `build` | Monta `_site/`, versiona por hash, sitemap, robots, `build-info.json`, build determinístico | `npm run stage -- build` |
| 5 | `testes` | Playwright (desktop e celular), acessibilidade (axe), console limpo, sem violação de CSP | `npm run stage -- testes` |
| 6 | `desempenho` | Lighthouse (mediana de 3) com orçamento: nota mínima e limites de LCP, CLS e TBT | `npm run stage -- desempenho` |
| 7 | `seguranca` | `npm audit`, CSP estrita, nenhum terceiro, `noopener`, segredos no build | `npm run stage -- seguranca` |
| 8 | `deploy` | Publica o artefato aprovado no GitHub Pages (só da `main`) | job `deploy` |
| 9 | `smoke` | Confere o site no ar: 200, todos os arquivos, versão publicada = commit. Local: roda contra o site público. | `npm run stage -- smoke` |

`relatorio` e `finalizar` não são etapas de verificação. `relatorio` junta os relatórios em `pipeline.json` e coloca o arquivo dentro do site. `finalizar` roda depois do smoke e republica **o mesmo artefato** com o `pipeline.json` refeito, agora com o resultado do smoke (que só pode existir depois da publicação). CodeQL roda em workflow próprio (`codeql.yml`).

## Rodar local

```bash
npm ci
npx playwright install chromium   # uma vez
npm run pipeline                  # todas as etapas, na ordem; grava reports/
npm run pipeline -- --seed        # idem, e atualiza ./pipeline.json (referência do repositório)
npm run stage -- higiene          # uma etapa só
```

Cada etapa grava `reports/<etapa>.json` (status, tempo, verificações, métricas). `scripts/pipeline/report.mjs` junta tudo em `reports/pipeline.json`.

## Decisões de técnica (e de onde vieram)

- **Etapas são scripts, o YAML só orquestra.** `scripts/pipeline/stages/*.mjs` têm a lógica; o workflow chama `node scripts/pipeline/run.mjs <etapa>`. Dá para depurar sem fazer push. (O Nivela guarda a lógica em `scripts/quality/` e `scripts/ci/`.)
- **Grafo, não lista.** `needs` explícito: higiene e gate do PR rodam em paralelo; testes, desempenho e segurança rodam em paralelo depois do build.
- **O artefato testado é o artefato publicado.** O build roda uma vez; as etapas seguintes baixam `_site/` e o `deploy` publica esse mesmo pacote. Não há segundo build no meio.
- **Build determinístico.** Dois builds seguidos precisam gerar os mesmos hashes (a data usada é a do commit, não a de agora). A etapa falha se não gerarem.
- **Orçamentos.** Imagem até 150 KB, imagens até 400 KB no total, HTML+JS+CSS comprimidos até 60 KB, Lighthouse com nota mínima por categoria. (SulCore: Lighthouse CI.)
- **CSP estrita por meta.** O GitHub Pages não deixa configurar cabeçalhos, então a política vai em `<meta http-equiv>`: nada inline, nada de terceiros.
- **Ações fixadas por SHA**, permissões mínimas, `persist-credentials: false`, `concurrency` e `timeout-minutes` em todo job (como no SulCore e no Nivela).
- **Sinal público sem detalhe de infraestrutura.** O `pipeline.json` publicado traz status, tempos e nomes de verificação; nunca log, máquina ou endereço. (Mesma regra do status público do Nivela.)
- **Smoke depois do deploy.** Deploy que terminou não é deploy que funciona (smoke-pos-deploy do Nivela).
- **Dependabot** semanal para npm e Actions.

## Publicação

O Pages publica **por artefato** (Settings → Pages → Source: **GitHub Actions**), e é o que está ativo: a página no ar é o artefato `_site/` que passou em todas as etapas, não o código-fonte.

O job `deploy` roda a cada push na `main`, depois que testes, desempenho e segurança passam; `smoke` confere o site publicado; `finalizar` republica a página com o resultado do smoke. Para desligar o deploy sem apagar nada, crie a variável de Actions `PAGES_DEPLOY` com o valor `false`.

## Como a tela do site funciona

`pipeline.json` (schema 1) tem `source` (`ci` ou `local`), a execução (`run`), os totais e a lista de etapas com textos em PT e EN, status, tempo, verificações e métricas. A seção Pipeline do site lê esse arquivo com `fetch`, desenha o grafo a partir de `needs` e mostra o detalhe de cada etapa. O `pipeline.json` na raiz do repositório é a versão de referência de uma execução local; no GitHub Actions o job `relatorio` o substitui dentro do site publicado.

As etapas `deploy` e `smoke` rodam depois que o relatório foi empacotado. O `deploy` aparece como aprovado porque a página só existe se ele aconteceu. O `smoke` só pode existir depois da publicação, por isso o job `finalizar` refaz o `pipeline.json` com o resultado dele e publica a página de novo; se o smoke falhar, `finalizar` não roda e a página mantém o `smoke` como pendente.
