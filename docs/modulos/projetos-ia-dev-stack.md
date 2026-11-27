# Módulo: projetos, IA no desenvolvimento, stack

## Para agentes

- **O que faz:** três folhas de conteúdo: `#projetos` (ordens de serviço), `#ia-dev` (como o trabalho com agentes de IA é controlado) e `#stack` (ferramentas por área).
- **Código:** blocos `projetos` (`projects`), `pipeline de IA no desenvolvimento` (`pipeline`) e `stack` em `assets/app.js`. O bloco chamado "pipeline de IA no desenvolvimento" **não é** a pipeline de CI: é a lista de sete etapas do processo com agentes (contexto, branch, plano, implementação, evidência, gate, decisão humana). A pipeline de CI é [`PIPELINE.md`](../PIPELINE.md).
- **Projetos (`P()`):** cada item tem `n` (nome), `img` (chave de `IMG`, opcional), `st` (`[classe, rótulo]`: `live`, `beta`, `wip`), `d`, `tech`, `det` (lista do "Por dentro") e `link` opcional. Projetos atuais: Nivela, Nivela IA, SulCore.
- **IA no desenvolvimento (`S()`):** cada etapa tem `t`, `d`, `l` (bullets) e `h` (true = decisão humana, destaque em rosa-carbono). Reflete as regras do `AGENTS.md` do Nivela (contexto versionado, branch isolada, evidência em vez de resumo, gate, humano decide merge e release).
- **Stack (`G()`):** categorias com pares `[nome, uso]`. Passar o mouse, focar ou clicar mostra o uso na nota. Só liste ferramenta que o João usa de verdade, com o uso onde é usada.

## Regras

- **Só entra projeto em produção ou com site aberto.** Em desenvolvimento ou beta fechado, só com decisão do dono. Nivela Pay e Hall 239 ficaram de fora por decisão dele.
- Todo número ou afirmação de projeto vem de código ou documentação real. "290+ services" é o valor medido do Nivela.
- Cartões de projeto não são iguais por desenho: o que tem captura ganha miniatura; o que não tem, linha larga. Não force simetria.

## Armadilhas

- Ao remover um projeto, remova também a chave de `IMG`/`imgAlt` (se só ele usava), o arquivo em `assets/img/` e as menções em `stack` e nos textos de arquitetura. Já aconteceu de sobrar "app móvel" num detalhe.
- `renderers`: o estado "aberto" dos `<details>` é preservado ao trocar de idioma; ao mexer no markup do cartão, mantenha isso.
- A etapa `ia-dev` começa com a quinta etapa ("Evidência, não resumo") selecionada. É de propósito.
