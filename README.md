# Portfólio · João Vargas

Portfólio interativo, estático e sem dependências: HTML, CSS e JavaScript puros. Sem build, sem rastreadores, sem cookies. Português e inglês, com botão **PT / EN** (a escolha fica salva no navegador).

O que dá para explorar na página:

- **Arquitetura do Nivela**: diagrama clicável (e navegável por teclado) com a decisão técnica de cada bloco.
- **Isolamento de tenant**: simulação do que acontece quando uma query esquece o filtro de tenant, com e sem RLS no banco.
- **Nivela IA**: simulação do fluxo ação proposta → confirmação → revalidação no servidor → execução única, incluindo o pedido incompleto e o pedido recusado.
- **Projetos** com a parte técnica de cada um, **etapas da IA no desenvolvimento** e **stack** filtrável.
- **Paleta de comandos** com `Ctrl K` (ou `⌘ K`).

## Imagens

As capturas em `assets/img/` são reais, em WebP: demonstração pública do Nivela (dados fictícios), app Nivela Pay em modo de exemplo e a demonstração do site da SulCore. Nunca publique captura de cliente real.

**Sua foto:** coloque `assets/foto.jpg` (proporção 4:5, até ~150 KB) e, em `assets/app.js`, mude `HAS_PHOTO` para `true`. Enquanto isso, a seção Sobre mostra o monograma "JV".

## Arquivos

| Arquivo | O que tem |
|---|---|
| `index.html` | Estrutura e textos em português (cada texto traduzível tem `data-i18n="chave"`) |
| `assets/i18n.js` | Textos fixos do HTML em inglês, por chave |
| `assets/app.js` | Interações; o conteúdo das demos, projetos e stack tem as duas línguas via `tr(pt, en)` |
| `assets/style.css` | Visual |

Texto novo no HTML: ponha o português no próprio elemento com `data-i18n="chave"` e o inglês em `assets/i18n.js`.

## Rodar localmente

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Publicar

Não há workflow de CI. Para publicar no GitHub Pages sem Actions: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**. A pasta raiz já é o site (`index.html` + `assets/`).

## Regras de conteúdo

- Números do Nivela são contados no código e arredondados para baixo; cite de onde vieram no PR.
- As demos usam dados fictícios. Nada de cliente real, endereço interno ou chave.
- Acessibilidade: navegação por teclado, foco visível, alvos de toque de 44 px, `prefers-reduced-motion` respeitado.

Versões anteriores (Flask + PostgreSQL) continuam no histórico do Git.
