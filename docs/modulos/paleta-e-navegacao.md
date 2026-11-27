# Módulo: paleta de comandos, menu ativo e aviso

## Para agentes

- **O que faz:** paleta de comandos (Ctrl/Cmd+K) para ir a qualquer folha, abrir demos, copiar o e-mail, abrir LinkedIn e GitHub e trocar o idioma; destaque do item do menu da folha visível; aviso curto ("E-mail copiado").
- **Código:** blocos `paleta de comandos` (`palette`), `seção ativa no menu` (`spy`) e `toast` em `assets/app.js`; `#palette` e `.nav` em `index.html`; estilos `.palette`, `.nav`, `.toast` em `assets/style.css`.
- **Comandos (`CMD()`):** lista de `[rótulo, tipo, ação]`, bilíngue. Para acrescentar: uma linha em `CMD()` (e, se for uma folha, o id correspondente).
- **Menu ativo:** `IntersectionObserver` com `rootMargin: '-40% 0px -55% 0px'` sobre os ids da lista em `spy`. Folha nova com link no menu: acrescente o id lá.
- **Teclado:** setas navegam, Enter executa, Esc fecha; Tab fica preso no campo. O foco volta ao elemento que abriu a paleta.

## Armadilhas

- **Enter precisa de `preventDefault()`.** Ao executar um comando a paleta fecha e devolve o foco ao botão que a abriu; sem o `preventDefault`, o mesmo Enter ativa esse botão e a paleta reabre (bug real, pego pelo teste "paleta de comandos abre, filtra e navega").
- O navegador define `hidden` mas o CSS de `.palette` usa `display:grid`: a regra `.palette[hidden]{display:none}` é necessária.
- Abaixo de 1020 px o menu de links some; a paleta e o botão "Comandos" continuam. Não esconda o botão.
- `window.open` de links externos usa `'noopener'` (a etapa `seguranca` confere).
