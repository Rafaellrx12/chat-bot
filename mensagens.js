export const botResponses = {
    boasVindas:
        '👋 Bem-vindo à nossa loja!\n\n' +
        'Escolha uma opção:\n' +
        '1️⃣ Ver produtos\n' +
        '2️⃣ Formas de pagamento\n' +
        '3️⃣ Ajuda',
    boasVindasNovamente: 
        '👋 Olá! Vamos começar novamente.\n\n' +
        'Escolha uma opção:\n' +
        '1️⃣ Ver produtos\n' +
        '2️⃣ Formas de pagamento\n' +
        '3️⃣ Ajuda',
    listaProdutos: (produtos) => {
        let texto = '🛍️ *Nossos produtos:*\n\n';
        produtos.forEach((p, i) => {
        texto += `${i + 1}. ${p.nome} - R$${p.preco.toFixed(2)}\n`;
        });
        texto += '\nDigite o *nome do produto* para ver mais detalhes.';
        return texto;
        },
    formasPagamento:
        '💳 *Formas de pagamento*\n\n' +
        '✔️ Pix\n' +
        '✔️ Cartão de crédito (até 3x sem juros)\n' +
        '✔️ Boleto bancário\n\n' +
        'Mais informações: https://sualoja.com/pagamento',
    ajuda:
        '❓ *Ajuda*\n\n' +
        '🔹 Digite *menu* para voltar ao início\n' +
        '🔹 Digite *1* para ver os produtos\n' +
        '🔹 Digite o *nome de um produto* para ver detalhes\n' +
        '🔹 Digite *2* para ver formas de pagamento',
    detalhesProduto: (produto) => {
        return (
        `🛒 *${produto.nome}*\n\n` +
        `${produto.descricao}\n` +
        `💰 R$${produto.preco.toFixed(2)}\n` +
        `🛍️ Comprar agora: ${produto.link}`
        );
    },
    naoEntendi: '🤖 Não entendi sua mensagem.\nDigite *menu* para ver as opções.',
};