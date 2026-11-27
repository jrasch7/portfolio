# ADR 0003: fontes hospedadas e CSP estrita, sem terceiros

- Status: aceito
- Data: 2026-11-27

## Contexto

O site é público e usa GitHub Pages, que não permite configurar cabeçalhos HTTP. Fonte de CDN, analytics e scripts externos aumentam superfície de ataque, risco de privacidade e dependência de terceiros, e pioram desempenho e CLS.

## Decisão

1. Política de segurança por `<meta http-equiv="Content-Security-Policy">` com `default-src 'self'` e nada inline.
2. Fontes baixadas uma vez (Barlow Condensed, B612 Mono, Caveat, licença OFL) e servidas de `assets/fonts/`, com `font-display: fallback` e `preload` das mais usadas.
3. Zero recurso de terceiros em tempo de execução, sem cookies e sem rastreadores.

## Consequências

- A etapa `seguranca` confere cada diretiva e a ausência de terceiros; a etapa `testes` falha se houver violação de CSP no console.
- Estilo dinâmico é feito por classe (CSSOM só se necessário); nunca `style=""` em HTML.
- Fonte nova se baixa e se hospeda; nunca se linka.
- O custo é peso próprio (~120 KB de fontes), compensado por `preload` e cache; Lighthouse segue em 100 e CLS em 0.
