# Tokenomics

Nada aqui é plano em PDF: cada percentual abaixo é uma constante do contrato
(`LIQUIDITY_BPS`, `TREASURY_BPS`, `SOLIDARITY_BPS`), aplicada na cunhagem única
dentro do `constructor`. Se alguém mudar os números, muda o bytecode — e isso
aparece na verificação do código-fonte.

## Oferta

| Parâmetro | Valor |
|---|---|
| Oferta total | **1.917.000.000 CMRD** |
| Casas decimais | 18 |
| Cunhagem | única, no `constructor` |
| Emissão posterior | impossível (não há função de mint) |
| Queima | voluntária, por quem detém (`burn` / `burnFrom` com permissão) |
| Oferta máxima | 1.917.000.000 — só pode cair |

O número homenageia 1917. Também serve a um propósito prático: oferta grande e
preço unitário baixo tornam a moeda usável como símbolo e como gorjeta, sem
decimal infinito na interface.

## Distribuição

| Fatia | % | CMRD | Destino |
|---|---|---|---|
| Liquidez pública | 80% | 1.533.600.000 | Piscina de negociação; tokens de LP queimados |
| Tesouro coletivo | 15% | 287.550.000 | Multisig 3 de 5, move só por CIP aprovada |
| Fundo de solidariedade | 5% | 95.850.000 | Trabalho entregue e caixas de apoio, em lotes |
| Fundadores / investidores / pré-venda | **0%** | 0 | Não existe |

Conferência: `80% + 15% + 5% = 100%`. O contrato calcula as duas primeiras
fatias por basis points e atribui **o resto** à terceira, para que a soma seja
exatamente a oferta total, sem pó de arredondamento.

### 80% — Liquidez pública

Entra inteira na piscina inicial de negociação. Os tokens de LP recebidos vão
para o endereço de queima, e a transação é publicada em
[`TRANSPARENCIA.md`](TRANSPARENCIA.md). Efeito: a liquidez não pode ser retirada
por ninguém, nem por quem criou o projeto. É a diferença entre dizer
"não vamos fazer rug pull" e não ter como fazer.

### 15% — Tesouro coletivo

Carteira multisig 3 de 5, com os endereços dos signatários publicados. Cada
saída exige uma CIP aprovada, e o hash da transação é registrado. Usos
previstos: infraestrutura (domínio, nós, ferramentas), tradução, arte,
material gráfico, eventos, fundo de reserva para auditoria independente.

### 5% — Fundo de solidariedade

Pagamento por trabalho entregue (código, documentação, tradução, arte,
moderação) e caixas de apoio votadas pela comunidade. Liberado em **lotes**,
cada lote com relatório público de valor, destinatário e motivo.

### 0% — Fundadores, investidores, pré-venda

Não há rodada privada, alocação de equipe, cronograma de desbloqueio nem bônus
por chegar primeiro. Quem implanta o contrato termina a transação de criação com
**saldo zero** de CMRD, e isso é verificável no explorador.

## O que não existe neste token

- Taxa de compra ou venda (0% / 0%); o custo é só o gás da rede.
- Redistribuição, reflection, rebase, auto-staking ou "rendimento" embutido.
- Imposto que financia marketing ou carteira de desenvolvimento.
- Limite de carteira, limite de transação, anti-bot temporário, cooldown.
- Lista negra, pausa, congelamento ou função de recuperação de token.

Todos esses mecanismos exigiriam poder administrativo. Não há onde apoiá-lo.

## Riscos que a tokenomics **não** elimina

Honestidade é parte do projeto, então:

- **Concentração de mercado.** Com LP queimado e sem alocação de equipe, a
  distribuição inicial é melhor que a média — mas qualquer pessoa com capital
  pode comprar uma fatia grande no mercado aberto e pesar nas votações.
- **Liquidez não é preço.** LP queimado garante que a piscina continua lá; não
  garante preço, volume nem comprador.
- **Risco de contrato.** O contrato é pequeno e baseado no OpenZeppelin 5, com
  testes, mas não passou por auditoria paga. Leia o código.
- **Governança por saldo.** Voto por quantidade de token favorece quem tem mais.
  O processo de CIP existe para registrar o debate e permitir contestação antes
  da execução, não para resolver essa assimetria.
