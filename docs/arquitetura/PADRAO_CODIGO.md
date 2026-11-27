# Padrão de código do site

Regras para `index.html`, `assets/app.js`, `assets/style.css` e `assets/i18n.js`. Padrão da pipeline: [`../PIPELINE.md`](../PIPELINE.md). É o equivalente, para um site estático, do padrão "blueprints finos e services" do Nivela: **cada coisa no seu lugar, sem lógica espalhada**.

## Responsabilidades

| Arquivo | Responsabilidade | Não pode ter |
|---|---|---|
| `index.html` | Estrutura, texto em português, `data-i18n`, ids de contêiner | Estilo inline, script inline, manipulador `onclick`, texto em inglês |
| `assets/app.js` | Comportamento: um bloco por módulo; dados e textos gerados | Estilo escrito como atributo, requisição a terceiros, `console.log`, framework |
| `assets/style.css` | Todo o visual | Cor solta fora de `:root` (use os tokens; exceção: `rgba(...)` de sombra e de tinta translúcida) |
| `assets/i18n.js` | Inglês dos textos fixos do HTML | Português, lógica |
| `scripts/pipeline/` | Verificações, relatório, execução local | Lógica de negócio do site |
| `tests/` | Testes ponta a ponta sobre o artefato | Dependência do código-fonte (testa `_site/`) |

## JavaScript

1. **Um bloco por módulo**, com o comentário `/* ---------- nome ---------- */` e uma função autoexecutável **nomeada** (`(function tenant() { … })();`). O gerador do mapa lê esse padrão.
2. **Estado local ao módulo.** Nada em `window`, exceto `window.showTab` (usado pela paleta) e `window.I18N_EN` (vem de `i18n.js`).
3. **Texto bilíngue** por `tr(pt, en)` dentro de função de renderização; o módulo se registra com `onLang(render)` para re-renderizar ao trocar de idioma.
4. **DOM por funções pequenas:** `$`, `$$`, `el`, `esc`. Todo texto dinâmico passa por `esc()` antes de `innerHTML`.
5. **Dados no topo do módulo, renderização embaixo.** Dado de conteúdo (projetos, etapas, stack, nós) fica em funções que devolvem objetos, para o `tr()` valer no idioma atual.
6. **Acessibilidade no JS:** botões reais (`<button type="button">`), `aria-pressed`/`aria-selected` mantidos, foco devolvido ao fechar diálogo, `aria-live` nas áreas que mudam.
7. **Movimento:** respeite `prefers-reduced-motion` (`reduce`). Um único momento animado autorizado: o carimbo da pipeline.
8. **Assíncrono com cancelamento:** fluxo com `await` e espera usa um contador de execução (`run`) para descartar a execução antiga ao trocar de cenário.

## HTML

- Um `<h1>`. Cada folha é `<section class="sec sheet" id="…">` com `<div class="wrap">` e `<div class="sheet-head">` (`h2` + `Folha N de 9`).
- Botão sempre com `type="button"`. Imagem sempre com `width`, `height` e `alt`.
- Nada de rótulo pequeno acima de título (ver [`PADRAO_UI.md`](PADRAO_UI.md)).
- O HTML precisa passar no `html-validate` (etapa `estatico`).

## CSS

- Tokens em `:root`; use `var(--…)`.
- Estado por classe e atributo ARIA (`[aria-pressed=true]`, `[aria-selected=true]`), não por estilo inline.
- Alvos de toque ≥ 44 px; `:focus-visible` visível; nada de `outline: none` sem substituto.
- Largura de texto corrido ≤ 65 caracteres (`max-width` em `ch`).

## Segurança (CSP)

`default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'`, em `<meta http-equiv>` (o GitHub Pages não deixa configurar cabeçalho). A etapa `seguranca` confere diretiva por diretiva. Consequência prática: **nenhum `style="…"` em HTML** (nem gerado por JS em `innerHTML`); CSSOM (`el.style.setProperty`) é permitido, mas prefira classe.

## Dependências

Nenhuma de execução. De desenvolvimento: `@playwright/test`, `@axe-core/playwright`, `html-validate`, `@lhci/cli`. Atualizadas pelo Dependabot (semanal). Dependência nova exige justificativa no PR e `npm audit` limpo.
