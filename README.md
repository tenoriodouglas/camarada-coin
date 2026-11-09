<div align="center">
  <img src="docs/assets/img/logo.svg" alt="Camarada Coin" width="140">

  # Camarada Coin · $CMRD

  **Token ERC-20 de oferta fixa, sem dono, sem mint e sem taxa.**
  Manifesto, tokenomics, contrato e landing page no mesmo repositório.

  [Manifesto](MANIFESTO.md) · [Tokenomics](TOKENOMICS.md) · [Governança](GOVERNANCA.md) · [Transparência](TRANSPARENCIA.md) · [Segurança](SECURITY.md) · [Aviso de risco](DISCLAIMER.md)
</div>

---

## O que é

A Camarada Coin é um token ERC-20 na rede **Base**, criado como projeto cultural
e de organização coletiva. A estética é de cartaz de agitprop; a engenharia é
levada a sério.

O ponto do projeto é simples: **confiança se verifica, não se promete.** Por isso
o contrato não tem nenhum privilégio embutido, e tudo o que ainda não existe está
marcado como pendente.

| | |
|---|---|
| Nome / símbolo | Camarada Coin / `CMRD` |
| Padrão | ERC-20 + Burnable + Permit (EIP-2612) |
| Rede | Base (8453); ensaios em Base Sepolia (84532) |
| Oferta total | 1.917.000.000 CMRD (cunhagem única, em homenagem a 1917) |
| Casas decimais | 18 |
| Taxa de protocolo | 0% na compra e 0% na venda |
| Função de emissão | não existe |
| Dono / admin / pausa / lista negra / proxy | não existem |
| Licenças | código GPL-3.0-or-later · textos e arte CC BY-SA 4.0 |
| Endereço do contrato | _a publicar no dia do deploy_ |

> **Atenção:** enquanto não houver endereço publicado **aqui e no site ao mesmo
> tempo**, qualquer endereço divulgado como sendo o $CMRD é falso.

## Garantias que qualquer pessoa pode conferir

1. **Sem emissão posterior** — `_mint` só é chamado dentro do `constructor`.
2. **Sem dono** — nenhum `Ownable`, `AccessControl`, `pause`, `blacklist` ou taxa ajustável.
3. **Sem upgrade** — não há proxy; o que foi implantado é o que fica.
4. **Distribuição fixada em código** — 80 / 15 / 5 são constantes (`*_BPS`) aplicadas na cunhagem.
5. **Deployer sai com saldo zero** — a transação de criação não deixa token na carteira que implanta.
6. **Testado** — 17 testes automatizados, incluindo um que falha se alguém adicionar função privilegiada.

```
npm install
npm test
```

## Estrutura do repositório

```
contracts/CamaradaCoin.sol   Contrato do token (Solidity 0.8.28, OpenZeppelin 5)
test/CamaradaCoin.test.js    Suíte de testes (Hardhat + ethers v6)
scripts/deploy.js            Deploy + verificação do código-fonte
tasks/local-solc.js          Compila com o solc fixado no package.json (build reprodutível)
docs/                        Landing page (GitHub Pages)
MANIFESTO.md                 As sete teses, referenciadas dentro do contrato
TOKENOMICS.md                Distribuição, números e o que cada fundo pode fazer
GOVERNANCA.md                Processo de proposta (CIP) e regras do multisig
TRANSPARENCIA.md             Endereços, transações e relatórios de repasse
SECURITY.md                  Relato de vulnerabilidade e lista de golpes comuns
DISCLAIMER.md                Aviso de risco completo
```

## Rodando localmente

Requer Node.js 20+.

```bash
npm install          # instala Hardhat, OpenZeppelin e o solc fixado
npm test             # roda a suíte completa
npm run build        # compila os contratos
npm run site         # serve a landing page em http://localhost:3000
```

A compilação usa o `solc` instalado via npm (`tasks/local-solc.js`), e não um
binário baixado em tempo de build: o mesmo commit gera o mesmo bytecode, em
qualquer máquina ou CI, inclusive sem acesso a `binaries.soliditylang.org`.

## Deploy

Passo a passo completo, incluindo criação e queima da liquidez, em
[`contracts/README.md`](contracts/README.md). Resumo:

```bash
cp .env.example .env     # preencha as variáveis
npm run deploy:base-sepolia   # ensaio
npm run deploy:base           # produção
```

Nunca coloque chave privada em arquivo versionado. O `.env` está no `.gitignore`.

## A landing page

Em `docs/`, HTML/CSS/JS puro, sem build e sem dependência de runtime.

A publicação é feita pelo workflow `.github/workflows/pages.yml`. **Antes do
primeiro deploy, habilite o Pages uma vez:** Settings → Pages → Source →
**GitHub Actions**. O workflow não consegue fazer isso sozinho — criar o site
exige permissão de administração do repositório, que o token do Actions não tem,
e sem esse passo o job falha com `Create Pages site failed`.

## Contribuir

Leia [CONTRIBUTING.md](CONTRIBUTING.md) e o [código de conduta](CODE_OF_CONDUCT.md).
Trabalho entregue pode ser remunerado pelo fundo de solidariedade, por decisão
registrada em CIP.

## Isenção

Projeto cultural e satírico, **sem vínculo com qualquer político, partido,
sindicato, candidatura ou órgão público**. Não é oferta pública, consultoria
financeira nem promessa de rendimento. Criptoativos podem valer zero. Leia o
[aviso completo](DISCLAIMER.md).
