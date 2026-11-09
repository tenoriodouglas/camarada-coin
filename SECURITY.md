# Segurança

## Relatar vulnerabilidade

Encontrou falha no contrato, no site ou na infraestrutura?

1. **Não abra issue pública** se a falha permitir perda de fundos.
2. Use o canal privado de relato do GitHub: aba **Security → Report a
   vulnerability** (GitHub Private Vulnerability Reporting) neste repositório.
3. Descreva o impacto, o passo a passo de reprodução e, se possível, um teste
   que falhe.

Compromisso: primeira resposta em até 72 horas e divulgação pública coordenada
após a correção, com crédito a quem relatou (ou anonimato, se preferir).

Não há programa de recompensa com valor fixo. Recompensa por relato relevante
pode ser proposta por CIP ao fundo de solidariedade, e isso é decisão da
comunidade, não promessa do projeto.

## Superfície do contrato

O contrato é intencionalmente mínimo:

- `ERC20`, `ERC20Burnable` e `ERC20Permit` do OpenZeppelin Contracts 5;
- cunhagem única no `constructor`, sem nenhuma função de emissão posterior;
- nenhuma função administrativa, nenhum papel de acesso, nenhum proxy;
- `immutable` nos três endereços de fundo, fixados no deploy;
- sem `receive`, sem `fallback`, sem chamada externa a contrato desconhecido.

Isso elimina por construção: rug pull por mint, taxa surpresa, congelamento de
carteira, confisco e troca de lógica. Não elimina risco de mercado nem erro de
quem usa.

## Golpes comuns — como não cair

- **Token falso.** Confira o endereço em [`TRANSPARENCIA.md`](TRANSPARENCIA.md)
  e no site. Antes do deploy, **não existe** endereço legítimo.
- **Pedido de frase-semente.** Ninguém do projeto vai pedir. Jamais.
- **Airdrop por DM.** O projeto não distribui token por mensagem direta.
- **"Site de resgate".** Não existe página de claim. Desconfie de domínio
  parecido com o oficial.
- **Suporte falso.** Não há atendimento privado que peça acesso à sua carteira.
- **Urgência.** Pressão por tempo ("só hoje", "últimas vagas") é sinal de golpe.

## Chaves e operação

- Chave privada nunca entra em arquivo versionado. Use `.env`, que está no
  `.gitignore`, ou uma carteira de hardware.
- O deploy usa carteira dedicada, que termina a transação com saldo zero de CMRD.
- O tesouro fica em multisig 3 de 5; nenhuma chave isolada move fundos.
