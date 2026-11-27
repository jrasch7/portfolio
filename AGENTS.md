# AGENTS.md — Portfólio de João Vargas · Regras permanentes para agentes
> Contexto permanente para Claude Code, Codex e demais agentes de IA neste repositório.
> Este arquivo tem **regras**. Fatos do produto ficam em `docs/CONTEXT.md`, os de cada módulo em `docs/modulos/`, o histórico em `docs/arquivo/LOG.md`.
> Formato adaptado do `AGENTS.md` do Nivela para a escala deste projeto (um site estático, um dono, sem backend).
> Não pergunte o que já está documentado.

## Roteiro de toda tarefa (siga nesta ordem)

1. **Entenda o pedido.** Reescreva para si em 1 frase o resultado esperado e o critério de pronto. Se faltar uma decisão que só o dono pode tomar, pergunte uma vez, objetivamente; o resto, decida e diga o que decidiu.
2. **Carregue só o contexto da tarefa** (não leia tudo):
   - produto, regras invioláveis e estado dos módulos: [`docs/CONTEXT.md`](docs/CONTEXT.md);
   - o módulo que vai mexer: índice [`docs/MODULES.md`](docs/MODULES.md) → `docs/modulos/<módulo>.md` (comece pelo bloco **"Para agentes"**);
   - onde está a seção, a função, a etapa ou o teste: [`docs/MAPA_CODIGO.md`](docs/MAPA_CODIGO.md) (gerado do código);
   - tela, cor, tipografia ou componente: [`DESIGN.md`](DESIGN.md) e [`docs/arquitetura/PADRAO_UI.md`](docs/arquitetura/PADRAO_UI.md);
   - código do site: [`docs/arquitetura/PADRAO_CODIGO.md`](docs/arquitetura/PADRAO_CODIGO.md);
   - o que pode e o que nunca pode ser publicado: [`docs/arquitetura/CONTEUDO_PUBLICO.md`](docs/arquitetura/CONTEUDO_PUBLICO.md);
   - pipeline, CI e deploy: [`docs/PIPELINE.md`](docs/PIPELINE.md);
   - decisão técnica já tomada: [`docs/adr/`](docs/adr/README.md) (não redebater do zero).
3. **Confira no código antes de afirmar.** Documento pode estar velho; o código e o site no ar são a verdade. Achou doc errado? Corrija no mesmo PR.
4. **Branch a partir de `main`**, mudança mínima e aditiva.
5. **Valide de verdade:** `npm run pipeline` (todas as etapas) ou, ao menos, a etapa do que mudou (`npm run stage -- <etapa>`). Tela mudou? Abra no navegador, desktop e celular, e olhe as capturas. Nunca diga que passou o que não rodou.
6. **Atualize a documentação** do módulo, rode `npm run docs:mapa` se criou ou renomeou módulo, seção, etapa, teste ou workflow, e escreva a entrada do log.
7. **PR contra `main`** com o modelo de `.github/pull_request_template.md` (a seção "Validação" é checada pelo gate do PR). Responda ao dono com: o que mudou, como validou, o que ficou pendente e por quê.

## Regras absolutas

> [!WARNING]
> **REPOSITÓRIO E SITE PÚBLICOS.** Nenhum IP, host interno, credencial, token, e-mail pessoal (só o de contato que já está no site), dado de cliente ou nome de máquina, nem no conteúdo, nem no código, nem em docs, commits ou texto de PR. A etapa `higiene` varre isso, mas ela é a última barreira, não a primeira. Detalhe: [`docs/arquitetura/CONTEUDO_PUBLICO.md`](docs/arquitetura/CONTEUDO_PUBLICO.md).

> [!IMPORTANT]
> **DADO SÓ COM FONTE.** Número do Nivela vem de contagem no código real, arredondado para baixo, com a data. Capacidade, prazo, cliente ou resultado que ninguém confirmou não entra. Produto que **não está em produção não entra** no portfólio (o Nivela Pay ficou de fora por isso). Capturas de tela só de demonstração pública ou de dados fictícios.

> [!IMPORTANT]
> **BRANCHING E MERGE.** Nada direto na `main`: branch, commit, PR, merge. O dono autorizou agentes a **abrir PR e mergear** neste repositório (2026-11-26 e 2026-11-27), desde que o gate local esteja verde. Antes de abrir: `git fetch origin --prune` e conferir PRs e branches abertas para não pisar no trabalho de outro. Detalhe: [`docs/desenvolvimento/FLUXO_GIT.md`](docs/desenvolvimento/FLUXO_GIT.md). Quando o GitHub Actions estiver indisponível, o gate local (`npm run pipeline`) é a única barreira: rode e cite o resultado no PR.

> [!CAUTION]
> **INTEGRIDADE DE CÓDIGO (ANTI-AMADORISMO).** Proibido usar regex de escopo aberto (`.*`, `re.DOTALL`, `sed` cego) para adicionar ou modificar código em arquivo existente: use substituição exata e direcionada. **Antes de commitar**, rode `git diff --cached --stat` e confira adições e remoções. Apagou código fora do escopo? Pare, restaure o arquivo e corrija a abordagem.

> [!IMPORTANT]
> **INTERFACE.** O visual é o **registro técnico** (papel, tinta preta, vermelho de formulário, azul de caneta): [`DESIGN.md`](DESIGN.md). Sem emoji e sem glifo como ícone (ícone é SVG desenhado). Sem rótulo pequeno acima de título, sem métrica gigante, sem texto em gradiente. Contraste mínimo 4,5:1, alvo de toque de 44 px, foco visível, `prefers-reduced-motion` respeitado. Tela só está pronta com captura real em desktop (1366 px) e celular (390 px), olhada de verdade.

> [!IMPORTANT]
> **BILÍNGUE.** Todo texto visível existe em português e em inglês. Texto fixo do HTML: `data-i18n="chave"` com o português no próprio HTML e o inglês em `assets/i18n.js`. Texto gerado por JS: `tr(pt, en)`. A etapa `estatico` falha se faltar tradução ou sobrar chave.

> [!IMPORTANT]
> **CSP ESTRITA, SEM TERCEIROS.** O site declara `default-src 'self'`. Nada de script ou estilo inline, nada de CDN, fonte externa, analytics ou rastreador. Fonte nova se hospeda em `assets/fonts/`. Estilo dinâmico vai por classe CSS (ou CSSOM), nunca por atributo `style` escrito em HTML.

> [!IMPORTANT]
> **DOCUMENTAÇÃO 100% ATUALIZADA, NO MESMO PR.** Mudou comportamento, regra, seção, módulo, etapa, teste ou decisão? O doc pertinente sai no mesmo PR. Decisão técnica nova vira ADR em `docs/adr/` (próximo número livre; ADR aceito não se reescreve: cria outro que o substitui). Documento obsoleto se corrige ou se apaga na hora (confira referências antes). `docs/MAPA_CODIGO.md` é gerado: nunca edite à mão.

> [!WARNING]
> **SEGREDOS NUNCA NO CÓDIGO.** Nenhuma chave, token ou senha em arquivo, commit, PR ou conversa. `.env` fica fora do git.

## Princípios de desenvolvimento

- Nunca reescrever o que funciona. Mudança mínima e aditiva.
- Um arquivo por responsabilidade: estrutura em `index.html`, comportamento em `assets/app.js` (um bloco por módulo), visual em `assets/style.css`, textos em inglês em `assets/i18n.js`.
- Regra de verificação nova nasce como etapa ou checagem em `scripts/pipeline/`, não como passo solto no YAML.
- Sem dependência de execução: o site é HTML, CSS e JavaScript puros. Dependência de desenvolvimento (testes, validação) só se justificar e entra no `package-lock.json`.
- Node ≥ 22 e `npm` (não `yarn`/`pnpm`).

## Formato da entrada no log (`docs/arquivo/LOG.md`)

```markdown
## [YYYY-MM-DD] — [título da tarefa ou decisão]
**Status:** concluída | em andamento | bloqueada
**O que foi feito:** ...
**Decisões tomadas:** ...
**Próximo passo:** ...
```

## Onde cada tipo de informação vive

| Tema | Lugar canônico |
|---|---|
| Regras para agentes | este `AGENTS.md` |
| Produto, público, o que o site precisa provar | `PRODUCT.md` |
| Identidade visual (cor, tipografia, composição) | `DESIGN.md` e `docs/arquitetura/PADRAO_UI.md` |
| Contexto técnico, regras invioláveis, estado dos módulos | `docs/CONTEXT.md` |
| Cada módulo (o que faz, armadilhas) | `docs/modulos/<módulo>.md` (índice `docs/MODULES.md`) |
| Onde está cada seção, função, etapa, teste | `docs/MAPA_CODIGO.md` (gerado) |
| Padrão de código e de interface | `docs/arquitetura/` |
| Pipeline, CI e deploy | `docs/PIPELINE.md` |
| Decisões técnicas (ADRs) | `docs/adr/` |
| Dívida e pendências | `docs/DEBT.md` |
| Git, branch, PR | `docs/desenvolvimento/FLUXO_GIT.md` |
| Histórico de entregas | `docs/arquivo/LOG.md` |
