# Módulo: idioma e textos

## Para agentes

- **O que faz:** alterna o site entre português e inglês, lembra a escolha e re-renderiza tudo.
- **Código:** bloco `idioma` e função `applyStatic` em `assets/app.js`; textos fixos em inglês em `assets/i18n.js`; marcação `data-i18n*` em `index.html`.
- **Dois mecanismos, não misture:**
  - **Texto fixo do HTML**: o português fica no próprio elemento com `data-i18n="chave"`; o inglês vai em `assets/i18n.js` na mesma chave. Atributos: `data-i18n-label` (troca `aria-label`) e `data-i18n-ph` (troca `placeholder`).
  - **Texto gerado por JavaScript** (demos, projetos, pipeline, stack, paleta): `tr(pt, en)`, avaliado na hora de renderizar.
- **Idioma inicial:** valor salvo em `localStorage` (`lang`); sem valor, o idioma do navegador (começa com `pt` → português, senão inglês).
- **Re-renderização:** todo módulo que gera texto se registra com `onLang(render)`. `setLang` chama `applyStatic()` e depois todos os `renderers`.
- **Checagem automática:** a etapa `estatico` falha se uma chave usada no HTML não existe no inglês, se sobra chave sem uso ou se há tradução vazia.

## Como acrescentar texto

1. Texto fixo: escreva o português no HTML com `data-i18n="secao.item"`; adicione `'secao.item': '…'` em `assets/i18n.js`.
2. Texto de JS: `tr('português', 'English')`.
3. Rode `npm run stage -- estatico`.

## Armadilhas

- `applyStatic` guarda o original em `data-pt*` na primeira passada. Mudar o português **depois** de o JS rodar, direto no DOM, não funciona; mude o HTML.
- Elementos cujo conteúdo o JS reescreve (`#stack-note`, `#pl-note`, `#arq-detail`) **não** levam `data-i18n`: o módulo cuida deles em `render`.
- Chave com HTML (ex.: `hero.h1` tem `<br>` e `<em>`): vale `innerHTML`; escreva texto confiável, nunca de entrada do usuário.
- O terminal do topo só digita na primeira renderização; ao trocar de idioma ele mostra o texto pronto.
- Caracteres fora do subconjunto latino das fontes (`≥`, `→` em alguns casos) caem na fonte do sistema. É esperado.
- Número de "Folha N de 9" mora nas chaves `sheet.1` a `sheet.9`: se criar ou remover uma folha, renumere.
