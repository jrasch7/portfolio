# Módulo: galeria com ampliação e foto pessoal

## Para agentes

- **O que faz:** `#galeria` mostra capturas reais como fotos coladas em papel, com legenda "Foto N" e ampliação em `<dialog>`; `#sobre` reserva o lugar da foto pessoal.
- **Código:** blocos `galeria com ampliação` (`gallery`) e `foto (opcional)` (`portrait`) em `assets/app.js`; constantes `IMG` e `imgAlt` no topo do arquivo; estilos `.gallery`, `.shot`, `.frame`, `.lightbox`, `.portrait` em `assets/style.css`.
- **Imagens (`IMG`):** `f` (arquivo em `assets/img/`), `w` e `h` reais. **Sempre** informe `width`/`height` reais: evitam deslocamento de layout (CLS).
- **Formato:** WebP, até 150 KB cada, 400 KB no total (a etapa `higiene` confere). Gere com Pillow (recorte e redimensione para WebP); recorte para tirar barra do navegador, menu fixo e banner de cookies.
- **Origem das capturas:** demonstração pública do site do Nivela e capturas das seções "O que fazemos" e "IA aplicada" do site público da SulCore, uma por idioma (`sulcore-servicos-{pt,en}.webp`, `sulcore-ia-{pt,en}.webp`; `imF()` escolhe o arquivo pelo idioma). A antiga captura do console de demonstração foi removida: não explicava nada. **Nunca** captura de sistema real de cliente, de painel interno ou de produto fora de produção.
- **Texto alternativo:** `imgAlt(chave)`, bilíngue, descrevendo o que a imagem mostra.

## Foto pessoal

Hoje `HAS_PHOTO = false` e a folha 2 mostra o monograma "JV" em moldura de foto 3×4. Para usar a foto: salve `assets/foto.jpg` (proporção 3:4, até ~150 KB), mude `HAS_PHOTO` para `true` em `assets/app.js` e rode a pipeline. O código só tenta carregar o arquivo quando a flag está ligada, para não gerar 404 no console de quem visita.

## Armadilhas

- A ampliação usa `width:auto; height:auto; max-width:100%; max-height:74vh`. Se aplicar `width`/`height` fixos, a imagem deforma no celular (aconteceu).
- `<dialog>` fecha com Esc; o teste confere. Clique fora também fecha.
- A fita dos cantos (`.shot-btn::before/::after`) é decoração de CSS; não ponha conteúdo nela.
- `loading="lazy"` nas imagens da galeria; o teste de imagens quebradas força `eager` antes de checar.
