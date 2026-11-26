# Portfólio · João Vargas

Portfólio interativo, estático e sem dependências: HTML, CSS e JavaScript puros. Sem build, sem rastreadores, sem cookies.

O que dá para explorar na página:

- **Arquitetura do Nivela**: diagrama clicável (e navegável por teclado) com a decisão técnica de cada bloco.
- **Isolamento de tenant**: simulação do que acontece quando uma query esquece o filtro de tenant, com e sem RLS no banco.
- **Nivela IA**: simulação do fluxo ação proposta → confirmação → revalidação no servidor → execução única, incluindo o pedido incompleto e o pedido recusado.
- **Projetos** com a parte técnica de cada um, **pipeline de IA no desenvolvimento** e **stack** filtrável.
- **Paleta de comandos** com `Ctrl K` (ou `⌘ K`).

## Rodar localmente

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Publicar

O workflow `.github/workflows/pages.yml` publica no GitHub Pages a cada push na `main`.
Uma vez só: **Settings → Pages → Source: GitHub Actions**.

## Regras de conteúdo

- Números do Nivela são contados no código e arredondados para baixo; cite de onde vieram no PR.
- As demos usam dados fictícios. Nada de cliente real, endereço interno, chave ou e-mail que não seja o de contato público.
- Acessibilidade: navegação por teclado, foco visível, alvos de toque de 44 px, `prefers-reduced-motion` respeitado.

Versões anteriores (Flask + PostgreSQL) continuam no histórico do Git.
