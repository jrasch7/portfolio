# Módulo: topo (anotações do inspetor e totais)

## Para agentes

- **O que faz:** abre a página como a folha 1 de um registro técnico: campos preenchidos (responsável, base, sistema), título do trabalho, anotações escritas à caneta e os totais do Nivela.
- **Código:** blocos `terminal do hero` (função `terminal`) e `contadores` (função `counters`) em `assets/app.js`; seção `#top` em `index.html`; estilos `.fields`, `.box`, `.term`, `.totals`, `.side` em `assets/style.css`.
- **Anotações (`#term-out`):** `lines()` devolve pares `[classe, texto]`. Classes: `p` título sublinhado, `v` linha em azul de caneta, `d` linha em tinta cinza, `k` assinatura em letra manuscrita. A digitação roda **uma vez**; com `prefers-reduced-motion` ou ao trocar de idioma, o texto aparece pronto.
- **Totais (`#stats`):** cada `<li>` tem o rótulo e um `<b data-count="N">`. O `+` do final vem do CSS (`b::after`). Contagem animada ao entrar na tela (`IntersectionObserver`, limiar 0,6).
- **Regra de dado:** os números (290, 560, 200, 390) são **contados no código do Nivela e arredondados para baixo**; a data fica na nota `stats.fine`. Mudou o número? Mude `data-count`, a data da nota (PT e EN) e registre no log.

## Como medir os números do Nivela

Contagem feita em novembro de 2026 no repositório privado do Nivela: arquivos de `app/services/` (services), decoradores `@…route(` em `app/blueprints/` (rotas), arquivos de `app/migrations/versions/` (migrations) e arquivos de `app/tests/` (testes). Arredonde para baixo na dezena (290, não 297).

## Armadilhas

- O visual de "total" é livro-razão (rótulo, pontilhado, valor), de propósito: não vire isso em cartões com número gigante.
- `.side` empilha anotações, totais e nota. Se uma coluna ficar muito mais alta que a outra, o título à esquerda parece desalinhado; confira em 1366 px e em 390 px.
- O texto das anotações afirma "conforme" em três itens (isolamento, IA com confirmação, dinheiro e fiscal sob teste). Só mantenha enquanto for verdade no Nivela.
