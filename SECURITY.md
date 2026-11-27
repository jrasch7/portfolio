# Segurança

Este é um site estático público, sem backend, banco, formulário, cookie ou rastreador.

## Como reportar uma vulnerabilidade ou um dado exposto

Envie e-mail para o contato público do dono: `joaovargas1108@gmail.com`, com o assunto "Segurança do portfólio". Não abra issue pública com detalhes de uma falha ou com dado sensível. Resposta esperada em poucos dias.

## O que está em escopo

- Vazamento de segredo, IP, host interno ou dado de terceiros em código, docs, histórico ou capturas.
- Falha da CSP (`default-src 'self'`), recurso de terceiros carregado, script ou estilo inline.
- Dependência de desenvolvimento ou ação do GitHub com vulnerabilidade conhecida.

## Defesas que já existem

Política de conteúdo estrita por `<meta>`; zero terceiros em tempo de execução; varredura de segredos, IPs e e-mails na etapa `higiene`; `npm audit`, CSP e `noopener` na etapa `seguranca`; CodeQL; Dependabot; ações fixadas por SHA com permissões mínimas. Detalhe: [`docs/PIPELINE.md`](docs/PIPELINE.md) e [`docs/arquitetura/CONTEUDO_PUBLICO.md`](docs/arquitetura/CONTEUDO_PUBLICO.md).
