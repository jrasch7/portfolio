# Conteúdo público: o que pode e o que nunca pode entrar

Este repositório e o site são **públicos**. Tudo aqui (código, docs, commits, PRs, issues, capturas) é lido por qualquer pessoa, inclusive recrutadores e concorrentes.

## Nunca

- IP, host interno, nome de máquina, URL de ambiente que não seja pública.
- Credencial, token, chave de API, senha, segredo de qualquer tipo (nem "de exemplo" com formato real).
- Dado de cliente real, de funcionário, de usuário; capturas de sistema real com dado real.
- E-mail ou telefone pessoal além do contato público que já está no site (`joaovargas1108@gmail.com`).
- Detalhe de infraestrutura do Nivela ou de outro produto (nomes de serviço interno, topologia de rede, projeto e ambiente de nuvem).
- Afirmação sem fonte: cliente, preço, prazo, resultado, número de usuários.

## Só com cuidado

| Item | Regra |
|---|---|
| Números do Nivela | Contados no código real, **arredondados para baixo**, com a data. Diga de onde vieram no PR. |
| Capturas de tela | Só da demonstração pública do Nivela e da SulCore, ou de dados fictícios. Recorte menu fixo, banner de cookies e qualquer dado real. |
| Nome de projeto | Só projeto em produção ou com site aberto. Produto fora de produção (ex.: Nivela Pay) não entra. |
| Cliente | Nome de cliente só com autorização escrita do dono. Hoje não há nenhum no site. |
| Demonstrações | Rotule como simulação e use dados fictícios (Barbearia Alfa, Studio Beta, Pet Gama; Carlos, Rafa). |
| Terceiros | Nenhum script, fonte, imagem ou iframe de terceiros em tempo de execução. |

## O que a pipeline confere sozinha

A etapa `higiene` varre os arquivos versionados atrás de segredos, IPs, hosts internos e e-mails fora da lista; a etapa `seguranca` repete a varredura de segredos sobre o que vai ao ar e garante zero recurso de terceiros. **Ela é a última barreira, não a primeira**: não conte com ela para pegar o que você mesmo pode evitar.

## Se algo sensível vazar

1. Não tente "consertar" só apagando o arquivo: o histórico do Git guarda tudo.
2. Revogue a credencial ou troque o dado imediatamente.
3. Avise o dono; a limpeza de histórico (reescrita) é decisão dele.
4. Registre o incidente em [`../arquivo/LOG.md`](../arquivo/LOG.md) sem repetir o dado vazado.
