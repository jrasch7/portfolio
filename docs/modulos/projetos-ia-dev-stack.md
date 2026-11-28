# Módulo: projetos, IA no desenvolvimento, stack

## Para agentes

- **O que faz:** quatro folhas de conteúdo: `#projetos` (ordens de serviço), `#ia-dev` (como o trabalho com agentes de IA é controlado), `#lab` (bancada de IA: avaliação medida e IA aplicada nos produtos) e `#stack` (ferramentas por área).
- **Código:** blocos `projetos` (`projects`), `pipeline de IA no desenvolvimento` (`pipeline`) e `stack` em `assets/app.js`. O bloco chamado "pipeline de IA no desenvolvimento" **não é** a pipeline de CI: é a lista de sete etapas do processo com agentes (contexto, branch, plano, implementação, evidência, gate, decisão humana). A pipeline de CI é [`PIPELINE.md`](../PIPELINE.md).
- **Projetos (`P()`):** cada item tem `n` (nome), `img` (chave de `IMG`, opcional), `st` (`[classe, rótulo]`: `live`, `beta`, `wip`), `d`, `tech`, `det` (lista do "Por dentro") e `links` opcional (lista de `[url, rótulo]`). Projetos atuais: Nivela, Nivela IA, SulCore (explicado como empresa: quatro frentes, padrão de IA, processo; imagem `sulS`).
- **IA no desenvolvimento (`S()`):** cada etapa tem `t`, `d`, `l` (bullets) e `h` (true = decisão humana, destaque em rosa-carbono). Reflete as regras do `AGENTS.md` do Nivela (contexto versionado, branch isolada, evidência em vez de resumo, gate, humano decide merge e release).
- **Stack (`G()`):** categorias com pares `[nome, uso]`. Passar o mouse, focar ou clicar mostra o uso na nota. Só liste ferramenta que o João usa de verdade, com o uso onde é usada.

## Bancada de IA (`#lab`, bloco `lab` em `assets/app.js`)

- **Rodadas (`ROUNDS()`):** duas abas com barras de acerto por modelo. Rodada 1: 39 pedidos, Opus 74%, Sonnet 77%, Haiku 64%, seguro 100%. Rodada 2: 47 casos × 2 repetições, Sonnet e Haiku 94/94, seguro 100%. Fonte: `docs/DEBT.md` e `docs/runbooks/NIVELA_IA_ACOES_AVALIACAO.md` do Nivela (avaliação de 2026-11-04). A largura das barras é aplicada por CSSOM (`style.setProperty`), porque a CSP proíbe `style` escrito no HTML.
- **`HOW()` e `USES()`:** como a bancada funciona e as sete fichas de IA nos produtos. Cada ficha descreve o que o código faz (confira nos `*_service.py` do Nivela antes de afirmar algo novo).
- **Custo só em proporção** ("cerca de 12 vezes mais barato"). Preço, margem e cota do produto não são públicos: não escreva.
- Nome de modelo (Opus, Sonnet, Haiku) aparece de propósito; é decisão do dono manter.

## Regras

- **Só entra projeto em produção ou com site aberto.** Em desenvolvimento ou beta fechado, só com decisão do dono. Nivela Pay e Hall 239 ficaram de fora por decisão dele.
- Todo número ou afirmação de projeto vem de código ou documentação real. "290+ services" é o valor medido do Nivela.
- Cartões de projeto não são iguais por desenho: o que tem captura ganha miniatura; o que não tem, linha larga. Não force simetria.

## Armadilhas

- Ao remover um projeto, remova também a chave de `IMG`/`imgAlt` (se só ele usava), o arquivo em `assets/img/` e as menções em `stack` e nos textos de arquitetura. Já aconteceu de sobrar "app móvel" num detalhe.
- `renderers`: o estado "aberto" dos `<details>` é preservado ao trocar de idioma; ao mexer no markup do cartão, mantenha isso.
- A etapa `ia-dev` começa com a quinta etapa ("Evidência, não resumo") selecionada. É de propósito.
