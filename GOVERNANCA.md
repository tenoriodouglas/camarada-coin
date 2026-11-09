# Governança

## Princípio

Quem guarda a chave **executa** a decisão; não a substitui. Nenhum signatário do
multisig pode gastar o tesouro sem uma proposta aprovada e publicada.

## CIP — Camarada Improvement Proposal

Uma CIP é um arquivo markdown em `cips/`, aberto por pull request. Qualquer
pessoa pode propor.

Estrutura mínima:

```markdown
# CIP-000N: Título curto

- **Autoria:** usuário ou pseudônimo
- **Data:** AAAA-MM-DD
- **Tipo:** tesouro | solidariedade | processo | técnica
- **Valor solicitado:** 0 CMRD (ou o valor, quando houver)

## Problema
## Proposta
## Custo e destino dos fundos
## Como verificar que foi cumprida
## Riscos
```

### Fluxo

1. **Abertura** — pull request com o arquivo da CIP.
2. **Debate** — mínimo de 7 dias corridos, em público, na issue ou PR vinculada.
3. **Votação** — por saldo de CMRD, em ferramenta aberta de votação off-chain,
   com snapshot do bloco anunciado antes do início.
4. **Quórum** — mínimo de 3% da oferta em circulação participando.
5. **Aprovação** — maioria simples dos votos válidos, salvo mudança no processo
   de governança, que exige 2/3.
6. **Execução** — o multisig executa e registra o hash da transação em
   [`TRANSPARENCIA.md`](TRANSPARENCIA.md).
7. **Prestação de contas** — toda CIP com dinheiro envolvido recebe um
   relatório de encerramento, inclusive quando o resultado foi ruim.

CIP não executada em 60 dias após a aprovação caduca e precisa ser reaberta.

## Multisig

- **Esquema:** 3 de 5 assinaturas.
- **Signatários:** identidade ou pseudônimo público, listados em `TRANSPARENCIA.md`.
- **Conflito de interesse:** signatário que seja beneficiário direto de uma CIP
  não assina a transação dela.
- **Rotação:** troca de signatário é CIP de processo (exige 2/3).
- **Perda de chave:** com 3 de 5, a perda de até duas chaves não trava o tesouro.
  A substituição passa por CIP.

## O que a governança **não** pode fazer

Por limitação do próprio contrato, nenhuma votação consegue:

- emitir novos tokens;
- alterar a oferta máxima;
- criar taxa de transferência;
- pausar transferências ou bloquear carteiras;
- confiscar, congelar ou mover token de terceiros;
- trocar a lógica do contrato implantado.

Mudança nesse nível exigiria um contrato novo e migração voluntária, feita em
público, com todo mundo vendo.
