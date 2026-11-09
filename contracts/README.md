# Deploy e verificação

Checklist de lançamento. Faça o ensaio completo em Base Sepolia antes da rede
principal — inclusive a parte de liquidez.

## 1. Pré-requisitos

- Node.js 20+ e `npm install` executado.
- `npm test` passando (17 testes).
- Três carteiras **distintas** prontas: liquidez, tesouro (multisig 3/5) e
  solidariedade. O contrato recusa deploy com endereço repetido ou zerado.
- Carteira de deploy com ETH na rede escolhida, usada só para isso.
- Chave de API do Basescan, para verificar o código-fonte.

## 2. Variáveis de ambiente

```bash
cp .env.example .env
```

| Variável | Para que serve |
|---|---|
| `PRIVATE_KEY` | chave da carteira que implanta (sem prefixo `0x` opcional) |
| `LIQUIDITY_FUND` | endereço que recebe 80% |
| `TREASURY_FUND` | multisig que recebe 15% |
| `SOLIDARITY_FUND` | endereço que recebe 5% |
| `BASESCAN_API_KEY` | verificação automática do código-fonte |
| `BASE_RPC_URL` / `BASE_SEPOLIA_RPC_URL` | RPC próprio (opcional) |

O `.env` está no `.gitignore`. Nunca versione chave privada.

## 3. Ensaio em Base Sepolia

```bash
npm run deploy:base-sepolia
```

Confira no explorador de testes: oferta total exata, os três saldos em 80/15/5,
saldo zero na carteira de deploy e o evento `GenesisAllocation` emitido.

## 4. Produção

```bash
npm run deploy:base
```

O script verifica o código-fonte automaticamente quando `BASESCAN_API_KEY`
estiver definida. Se a verificação falhar, repita manualmente:

```bash
npx hardhat verify --network base <ENDERECO> <LIQUIDITY_FUND> <TREASURY_FUND> <SOLIDARITY_FUND>
```

## 5. Liquidez e queima do LP

1. Com a carteira de liquidez, crie a piscina CMRD/ETH numa DEX da Base,
   depositando os 80%.
2. Receba os tokens de LP.
3. Envie **todos** os tokens de LP para `0x000000000000000000000000000000000000dEaD`.
4. Publique o hash das três transações em `TRANSPARENCIA.md`.

Sem o passo 3, a promessa de liquidez travada não vale nada — é esse passo que
torna impossível retirar a piscina.

## 6. Publicação

Atualize na mesma leva:

- `TRANSPARENCIA.md`: endereço do contrato, dos três fundos, signatários do
  multisig e hashes;
- `docs/index.html`: substitua as marcas "a publicar no deploy" pelos endereços
  reais, com link para o explorador;
- `README.md`: linha do endereço do contrato.

Commit único, para que a divulgação do endereço tenha um ponto verificável no
histórico.

## Notas de build

- Compilação com o `solc` fixado no `package.json` (`tasks/local-solc.js`), e não
  com binário baixado: o mesmo commit gera o mesmo bytecode em qualquer máquina.
- `metadata.bytecodeHash = "none"` e otimizador em 200 execuções, para build
  reprodutível e verificação estável.
- `evmVersion: "cancun"`, suportada pela Base.
