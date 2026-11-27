# Módulo: demos do Nivela (arquitetura, isolamento de tenant, Nivela IA)

## Para agentes

- **O que faz:** três demos interativas, em abas, na folha 4 (`#nivela`): diagrama clicável da arquitetura, simulador de isolamento entre clientes e simulação do fluxo da IA.
- **Código:** blocos `abas`, `arquitetura` (`arch`), `isolamento de tenant` (`tenant`) e `Nivela IA` (`nivelaIA`) em `assets/app.js`; painéis `#p-arq`, `#p-ten`, `#p-ia` em `index.html`; estilos `.tabs`, `.arq`, `.demo`, `.chat` em `assets/style.css`.
- **Todas as demos são didáticas e usam dados fictícios** (Barbearia Alfa, Studio Beta, Pet Gama; Carlos, Rafa). O texto da folha diz isso; não apresente como o sistema real.
- **Abas:** `role="tablist"`, setas esquerda/direita, `window.showTab(id)` usado pela paleta de comandos.

## Arquitetura

- `nodes()` define cada bloco (posição `x, y, w, h`, título, subtítulo, texto de detalhe em PT e EN). `E` lista as arestas por id. Clicar ou Enter/Espaço seleciona; as arestas do bloco ficam vermelhas e o resto esmaece.
- O conteúdo técnico vem da documentação do Nivela (repositório privado) e dos números medidos; mantenha cada afirmação verdadeira para o Nivela. O Nivela Pay **não** aparece (fora de produção).
- Em celular o SVG rola na horizontal (`min-width: 760px`); a dica `arq-tip` aparece abaixo de 1020 px.

## Isolamento de tenant

- O usuário escolhe o negócio da sessão, liga ou desliga "RLS" e "simular o bug" (query sem filtro). `run()` mostra o SQL e a tabela.
- Regra da simulação: sem o bug a query filtra por tenant; com o bug devolve tudo; com RLS ligado o resultado é sempre filtrado pelo tenant da sessão. Linhas de outro negócio aparecem em vermelho e o veredito vira "vazamento".
- É **simulação**, não o banco real; o texto da folha avisa.

## Nivela IA

- Três cenários (`S()`): `ok` (agendar um corte), `amb` (pedido incompleto, pergunta de esclarecimento), `bad` (pedido destrutivo, recusa).
- Fluxo do cenário `ok`: ferramentas consultam cliente, serviço e disponibilidade → proposta validada → **confirmação humana** → o servidor revalida → executa **uma única vez**. Clicar em Confirmar de novo mostra a mensagem de idempotência.
- O fluxo é assíncrono e protegido por um contador (`run`): trocar de cenário no meio cancela o anterior.
- Reflete o comportamento descrito do produto (ação proposta, pergunta ou recusa; confirmação explícita; revalidação no servidor; execução única). Não invente capacidade nova na demo.

## Armadilhas

- Texto de nó do SVG não quebra linha: título longo estoura a caixa. Títulos em até ~16 caracteres e subtítulos em até ~26 (fonte mono 10,5 px). Se precisar de mais, aumente `w` do nó.
- Não ponha `aria-label` nos nós do SVG: o axe acusa `label-content-name-mismatch`; o nome vem do conteúdo.
- Teste cobre as três demos (`tests/site.spec.mjs`): arquitetura, tenant e confirmação repetida da IA, em desktop e celular. A espera do botão Confirmar é de até 12 s por causa da animação.
