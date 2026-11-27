# ADR 0002: identidade visual: registro técnico de manutenção

- Status: aceito
- Data: 2026-11-27

## Contexto

A primeira versão era um tema escuro roxo com cartões, brilho e texto em gradiente. O dono a achou "genérica demais" e pediu uma identidade única. O público é empresa que contrata; o que o site precisa provar é inspeção, verificação e liberação (testes, pipeline, confirmação humana).

## Decisão

O site é um **registro técnico de manutenção**: formulário em papel, campos impressos, entradas à caneta, carimbos, certificado de liberação para serviço. Papel quente; tinta preta para o impresso, vermelho de formulário para rótulos e carimbos, azul de caneta para o preenchido. Barlow Condensed (impresso), B612 Mono (dados), Caveat (assinatura). Cada seção é uma folha numerada.

Alternativas avaliadas com maquetes renderizadas: planta técnica (papel milimetrado, cotas), terminal editorial (verde de fósforo) e cartaz tipográfico (letras gigantes, cor ácida). O dono escolheu manter o registro técnico e refinar.

## Consequências

- Identidade reconhecível e coerente com o conteúdo (a tela da pipeline é uma folha de inspeção; o contato é o certificado).
- A paleta de papel quente é deliberada; o detector de design a sinaliza como "creme" e a supressão está registrada em `.impeccable/config.json` com o motivo.
- Exige disciplina: três tintas, sem cor nova; sem os padrões proibidos listados em [`../arquitetura/PADRAO_UI.md`](../arquitetura/PADRAO_UI.md).
- Trocar de identidade no futuro é decisão nova (ADR que substitui este).
