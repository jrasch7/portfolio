# Documentação do portfólio

Índice canônico. **Uma informação tem um lugar só**; os outros documentos linkam, não copiam.

## Comece aqui

| Para... | Leia |
|---|---|
| Trabalhar no repositório (agente ou pessoa) | [`../AGENTS.md`](../AGENTS.md) |
| Entender o produto, o público e o que o site precisa provar | [`../PRODUCT.md`](../PRODUCT.md), depois [`CONTEXT.md`](CONTEXT.md) |
| Mexer na aparência | [`../DESIGN.md`](../DESIGN.md), [`arquitetura/PADRAO_UI.md`](arquitetura/PADRAO_UI.md) |
| Mexer no código | [`arquitetura/PADRAO_CODIGO.md`](arquitetura/PADRAO_CODIGO.md), [`MODULES.md`](MODULES.md), [`MAPA_CODIGO.md`](MAPA_CODIGO.md) |
| Saber o que pode ser publicado | [`arquitetura/CONTEUDO_PUBLICO.md`](arquitetura/CONTEUDO_PUBLICO.md) |
| Rodar, entender ou publicar a pipeline | [`PIPELINE.md`](PIPELINE.md) |
| Abrir PR | [`desenvolvimento/FLUXO_GIT.md`](desenvolvimento/FLUXO_GIT.md) |
| Ver o que foi decidido e por quê | [`adr/`](adr/README.md) |
| Ver pendências conhecidas | [`DEBT.md`](DEBT.md) |
| Ver o histórico de entregas | [`arquivo/LOG.md`](arquivo/LOG.md) |

## Mapa dos documentos

```
AGENTS.md              regras permanentes (CLAUDE.md aponta para ele)
PRODUCT.md             produto, público, restrições
DESIGN.md              identidade visual: registro técnico
docs/
  README.md            este índice
  CONTEXT.md           contexto técnico, regras invioláveis, estado dos módulos
  MODULES.md           índice dos módulos
  modulos/             um arquivo por módulo (bloco "Para agentes" + armadilhas)
  MAPA_CODIGO.md       GERADO: seções, módulos, etapas, testes, workflows
  PIPELINE.md          pipeline de CI/CD
  DEBT.md              dívida e pendências
  arquitetura/         padrões de código e de interface, conteúdo público
  adr/                 decisões técnicas numeradas
  desenvolvimento/     fluxo de Git e PR
  arquivo/LOG.md       histórico de entregas
```

## Contrato de manutenção

- Mudou comportamento, regra, seção, módulo, etapa ou decisão: o doc pertinente muda **no mesmo PR**.
- `MAPA_CODIGO.md` é gerado (`npm run docs:mapa`). A etapa `higiene` da pipeline falha se ele estiver velho ou se algum link relativo dos `.md` estiver quebrado.
- Documento obsoleto se corrige ou se apaga. Histórico só vale ficar se tiver valor real (ADR, log).
- Texto público (o que aparece no site) segue [`arquitetura/CONTEUDO_PUBLICO.md`](arquitetura/CONTEUDO_PUBLICO.md): este repositório é aberto.
