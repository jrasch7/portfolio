# Design

Mundo visual: **registro técnico de manutenção**, o formulário de papel em que cada intervenção é descrita, conferida, carimbada e liberada para serviço. É o mesmo gesto que o site quer provar: cada afirmação tem inspeção por trás.

## Material e cor

- Papel quente `#f3efe4` (sombra `#ebe5d3`), com grão leve; cópias de papel carbono em amarelo `#f1e7a6` e rosa `#f0cfc9` para estados selecionados.
- Três tintas e só: preto de impressão `#16150f` (estrutura, texto), vermelho de formulário `#b3261b` (rótulos de campo, carimbos, alerta) e azul de caneta `#1d3da3` (tudo o que foi "preenchido": dados, entradas, resultados aprovados).
- Sem tema escuro. O papel é a cena de uso: leitura de dia, na tela do computador ou do celular.

## Tipografia (hospedada em `assets/fonts/`)

- **Barlow Condensed** 500/600/700: o impresso do formulário (títulos em caixa alta, rótulos, texto corrido, botões).
- **B612 Mono** 400/700: o que é preenchido e o que é dado (campos, tabelas, código, métricas).
- **Caveat** 600: só a assinatura e a anotação "liberado para serviço".

## Composição

- Cada seção é uma **folha**: título em condensada alta, caixa "Folha N de 9" no canto, linha dupla de separação.
- Campos impressos (rótulo vermelho pequeno acima do valor em azul) formam o cabeçalho e os dados; o `fieldset` com `legend` rotula a caixa do título.
- Projetos são **ordens de serviço** em linhas largas de tamanhos diferentes, não cartões iguais.
- Fotos são **anexos**: moldura de papel, fita nos cantos, legenda "Foto N".
- Pipeline é a **folha de inspeção**: etapas em caixas com marca de verificação desenhada, resultado em carimbo duplo.
- Contato é o **certificado de liberação** com campo de assinatura.

## Interação e movimento

- Um momento autorizado: o carimbo do resultado da pipeline cai ao entrar na tela. As anotações do herói se escrevem sozinhas uma vez. O resto é estado, não efeito.
- Foco visível em vermelho com recuo; seleção de texto em azul de caneta; barra de rolagem fina em tinta.

## Regras

- Ícones são SVG desenhados em traço único; nenhum emoji, nenhum glifo como ícone.
- Nada de rótulo pequeno acima de título, nada de métrica gigante, nada de gradiente em texto.
- Contraste mínimo 4,5:1; alvos de toque de 44 px; Lighthouse acima de 90/95/95/90; axe sem violação grave.
