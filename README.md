# Portfólio · João Vargas

**Regras de desenvolvimento, arquitetura e módulos:** [`AGENTS.md`](AGENTS.md) e [`docs/README.md`](docs/README.md). Produto: [`PRODUCT.md`](PRODUCT.md). Visual: [`DESIGN.md`](DESIGN.md).

Portfólio interativo, estático e sem dependências: HTML, CSS e JavaScript puros. Sem build, sem rastreadores, sem cookies. Português e inglês, com botão **PT / EN** (a escolha fica salva no navegador).

O que dá para explorar na página:

- **Arquitetura do Nivela**: diagrama clicável (e navegável por teclado) com a decisão técnica de cada bloco.
- **Isolamento de tenant**: simulação do que acontece quando uma query esquece o filtro de tenant, com e sem RLS no banco.
- **Nivela IA**: simulação do fluxo ação proposta → confirmação → revalidação no servidor → execução única, incluindo o pedido incompleto e o pedido recusado.
- **Projetos** com a parte técnica de cada um, **etapas da IA no desenvolvimento** e **stack** filtrável.
- **Paleta de comandos** com `Ctrl K` (ou `⌘ K`).

## Pipeline

O site tem uma pipeline completa de propósito, para mostrar as técnicas (grafo de etapas, relatório por etapa, artefato único, orçamentos, CSP estrita, smoke pós-deploy). O resultado aparece na seção **Pipeline** do próprio site. Guia completo: [`docs/PIPELINE.md`](docs/PIPELINE.md).

```bash
npm ci
npx playwright install chromium
npm run pipeline            # roda tudo, na mesma ordem do GitHub Actions
npm run stage -- higiene    # ou uma etapa só
```

## Imagens

As capturas em `assets/img/` são reais, em WebP: demonstração pública do Nivela (dados fictícios) e demonstração do site da SulCore. Produto que ainda não está em produção não entra no portfólio. Nunca publique captura de cliente real.

**Sua foto:** coloque `assets/foto.jpg` (proporção 4:5, até ~150 KB) e, em `assets/app.js`, mude `HAS_PHOTO` para `true`. Enquanto isso, a seção Sobre mostra o monograma "JV".

## Arquivos

| Arquivo | O que tem |
|---|---|
| `index.html` | Estrutura e textos em português (cada texto traduzível tem `data-i18n="chave"`) |
| `assets/i18n.js` | Textos fixos do HTML em inglês, por chave |
| `assets/app.js` | Interações; o conteúdo das demos, projetos e stack tem as duas línguas via `tr(pt, en)` |
| `assets/style.css` | Visual (registro técnico: papel, tinta, carimbo) |
| `assets/fonts/` | Fontes hospedadas no próprio site (B612 Mono, Barlow Condensed, Caveat; licença OFL), sem requisição a terceiros |
| `scripts/pipeline/` | Etapas da pipeline, relatório e execução local |
| `tests/` | Testes ponta a ponta (Playwright + axe) |
| `.github/workflows/` | `pipeline.yml` (CI/CD) e `codeql.yml` |
| `pipeline.json` | Relatório de referência (gerado; o CI gera o definitivo) |

Texto novo no HTML: ponha o português no próprio elemento com `data-i18n="chave"` e o inglês em `assets/i18n.js`.

## Rodar localmente

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Publicar

O deploy é uma etapa da pipeline (GitHub Pages por artefato). Para ligar: **Settings → Pages → Source: GitHub Actions**. Para desligar o deploy, crie a variável de Actions `PAGES_DEPLOY=false`. Alternativa sem Actions: **Source: Deploy from a branch → `main` / `(root)`** (publica o código-fonte, sem as verificações).

## Regras de conteúdo

- Números do Nivela são contados no código e arredondados para baixo; cite de onde vieram no PR.
- As demos usam dados fictícios. Nada de cliente real, endereço interno ou chave.
- Acessibilidade: navegação por teclado, foco visível, alvos de toque de 44 px, `prefers-reduced-motion` respeitado.

Versões anteriores (Flask + PostgreSQL) continuam no histórico do Git.
