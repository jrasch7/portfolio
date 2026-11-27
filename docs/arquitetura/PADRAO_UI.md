# Padrão de interface

Resumo operacional de [`../../DESIGN.md`](../../DESIGN.md) (a identidade) para quem vai criar ou alterar tela. Antes de entregar tela, passe pelo checklist no fim.

## Princípios

1. **O artefato lidera.** A primeira tela é o próprio registro técnico, não um cartaz sobre ele.
2. **Cada folha é um formulário.** Cabeçalho com título e "Folha N de 9", campos impressos, entradas à caneta, carimbo para resultado.
3. **Três tintas.** Preto (estrutura), vermelho de formulário (rótulo, carimbo, alerta), azul de caneta (preenchido). Não introduza cor nova.
4. **Dado é mono, impresso é condensado.** B612 Mono para o que é dado ou entrada; Barlow Condensed para título, rótulo, texto corrido e botão; Caveat só na assinatura e numa anotação.
5. **Caixas retas.** Sem cantos arredondados em cartões e botões; borda de 1,5 px em tinta. Alvos de toque ≥ 44 px.

## Componentes

| Componente | Classe | Regra |
|---|---|---|
| Folha | `.sheet`, `.sheet-head`, `.sheet-no` | Linha dupla acima; número da folha à direita (ou abaixo do título no celular). |
| Campo impresso | `.fields` | Rótulo vermelho pequeno **dentro** da célula, valor em azul de caneta. |
| Caixa com título na borda | `.box` + `legend` | Só quando a legenda rotula a caixa; nunca como rótulo acima de título. |
| Anotações | `.term` | Linhas pautadas, texto em azul, assinatura em Caveat. |
| Livro-razão | `.totals` | Rótulo, pontilhado, valor. Não vira cartão de métrica. |
| Botão | `.btn`, `.btn.primary` | Caixa alta condensada. Primário em tinta cheia; hover em vermelho. |
| Aba | `.tabs button` | Guia de pasta; a selecionada "abre" sobre a linha. |
| Chip/filtro | `.chip` | Caixas coladas (bordas sobrepostas); selecionado em tinta cheia. |
| Foto colada | `.shot`, `.frame` | Moldura de papel com fita nos cantos e legenda "Foto N". |
| Ordem de serviço | `.card` | Linha larga; miniatura à esquerda quando houver; carimbo de status. |
| Carimbo | `.status`, `.pl-pill` | Borda dupla ou tracejada, levemente girado; vermelho = no ar, azul = aprovado. |
| Verificação | `.pl-checks li`, `.pipe button` | Caixa com marca desenhada em SVG de traço único. |
| Certificado | `.release`, `.sign` | Borda dupla, campo de assinatura em Caveat. |

## Estados

Foco visível (vermelho com recuo de 3 px), hover por inversão ou fundo de papel mais escuro, selecionado por tinta cheia ou fundo carbono (`--carbon`), desabilitado com opacidade, vazio com próxima ação, erro com o motivo.

## Responsivo

Pontos de quebra: 1020, 900, 720 e 560 px. Sem rolagem lateral da página (rolagem interna só em diagrama e tabela). O menu de links some abaixo de 1020 px; a paleta de comandos permanece.

## Proibido

Emoji; glifo como ícone; rótulo pequeno acima de título; métrica gigante; texto em gradiente; barra colorida de um lado só; sombra com halo colorido; vidro/blur decorativo; cartões iguais de ícone + título + texto como estrutura da página; fonte de sistema como voz de título; cor nova sem registro.

## Checklist antes de entregar tela

- [ ] Texto nos dois idiomas (`estatico` passa).
- [ ] Capturas reais em 1366 px e 390 px, olhadas; sem sobreposição, sem corte, sem rolagem lateral.
- [ ] Contraste ≥ 4,5:1; foco visível; alvos de 44 px; `prefers-reduced-motion` respeitado.
- [ ] Teste Playwright para o que o visitante usa (desktop e celular).
- [ ] `npm run pipeline` verde (axe, Lighthouse, CSP).
- [ ] `DESIGN.md` e o módulo atualizados se a regra mudou.
