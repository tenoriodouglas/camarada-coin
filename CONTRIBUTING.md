# Como contribuir

Toda contribuição é bem-vinda: código, documentação, tradução, arte, revisão de
segurança, moderação.

## Antes de começar

1. Leia o [manifesto](MANIFESTO.md) — ele define o que o projeto aceita ou não.
2. Leia o [código de conduta](CODE_OF_CONDUCT.md).
3. Para mudança grande, abra uma issue primeiro e combine o escopo.

## Preparando o ambiente

```bash
git clone https://github.com/tenoriodouglas/camarada-coin.git
cd camarada-coin
npm install
npm test
```

Requer Node.js 20 ou superior.

## Padrões do repositório

- **Solidity:** 0.8.28, OpenZeppelin para o que for padrão, nada de reinventar
  primitiva de token. Mudança no contrato precisa de teste que cubra o
  comportamento novo **e** continuar passando o teste `no privileged surface`.
- **Comentários e identificadores:** em inglês, curtos e explicativos.
- **Documentação e conteúdo do site:** em português.
- **JavaScript:** sem framework e sem dependência de runtime na landing page.
- **Commits:** um assunto por commit, mensagem no imperativo.

## Pull request

- Descreva **o que** muda e **por que**.
- Rode `npm test` antes de enviar; a CI roda a mesma coisa.
- Mudança no site: inclua captura de tela nos dois temas (claro e escuro).
- Mudança que mexe na distribuição, na oferta ou na governança **não entra por
  PR direto**: precisa de [CIP](GOVERNANCA.md) aprovada antes.

## Trabalho remunerado

Contribuição relevante pode ser remunerada pelo fundo de solidariedade. O
caminho é uma CIP descrevendo o trabalho, o valor e como verificar a entrega.
Não há pagamento combinado em canal privado.

## O que não será aceito

- Qualquer função administrativa, de pausa, de taxa ou de lista negra no contrato.
- Promessa de retorno financeiro em qualquer texto do projeto.
- Selo de auditoria, parceria ou listagem que não exista e não seja verificável.
- Uso do nome ou da imagem de pessoa real como marca do projeto.
- Conteúdo que ataque pessoas ou grupos; crítica política é permitida, ofensa não.
