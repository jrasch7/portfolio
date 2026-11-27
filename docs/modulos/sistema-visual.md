# Módulo: sistema visual (CSS)

## Para agentes

- **O que faz:** implementa o registro técnico: papel, tinta, campos impressos, carimbos, letra à caneta. A fonte de verdade da identidade é [`DESIGN.md`](../../DESIGN.md); o padrão de componentes é [`arquitetura/PADRAO_UI.md`](../arquitetura/PADRAO_UI.md).
- **Código:** `assets/style.css`, um arquivo, organizado por comentários de bloco; tokens em `:root` (`--paper`, `--paper-2`, `--ink`, `--ink-2`, `--ink-3`, `--form`, `--pen`, `--carbon`, `--carbon-pink`, `--hair`, `--display`, `--entry`, `--hand`).
- **Três tintas:** preto de impressão (estrutura e texto), vermelho de formulário `--form` (rótulos, carimbos, alerta) e azul de caneta `--pen` (tudo que é "preenchido": dados, resultados aprovados). Cor nova só com decisão registrada.
- **Três vozes tipográficas:** Barlow Condensed (impresso), B612 Mono (dados), Caveat (assinatura e uma anotação). Fontes hospedadas em `assets/fonts/` com `font-display: fallback` e `preload` das mais usadas, para o CLS ficar em 0.
- **Responsivo:** pontos de quebra em 1020, 900, 720 e 560 px.

## Armadilhas

- **Contraste:** `--ink-3` sobre `--paper-2` fica perto de 4,6:1; não clareie. Texto branco só sobre fundos escuros (tinta); sobre cor de destaque o axe reprova.
- **Sem estilo inline.** A CSP bloqueia `style=""`. Estado visual vai em classe.
- **Sombra** com deslocamento e desfoque, neutra; halo colorido é proibido (parece enfeite de IA).
- **Sem barra colorida de um lado só** em caixa (use borda inteira, fundo suave ou ícone).
- **`:has()`** é usado no cartão de projeto sem miniatura; navegadores sem suporte caem no layout de coluna única.
- **Textura de papel** é um SVG de ruído em `data:` URI no `body`. `img-src` da CSP inclui `data:` por isso.
- Fontes nunca de CDN: Google Fonts **só para baixar** (`font-fetch`), nunca em runtime.
