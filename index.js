const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { Client } = require('whatsapp-web.js');

function carregarCatalogo() {
  const data = fs.readFileSync('./catalogo.json', 'utf8');
  return JSON.parse(data);
}

const client = new Client();
const produtos = carregarCatalogo();


client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('🛍️ Bot da Loja Online está pronto!');
});

client.on('message', async (message) => {
  const msg = message.body.toLowerCase().trim();

  if (['menu', 'oi', 'olá'].includes(msg)) {
    await message.reply(
      '👋 Bem-vindo à nossa loja!\n\n' +
      'Escolha uma opção:\n' +
      '1️⃣ Ver produtos\n' +
      '2️⃣ Formas de pagamento\n' +
      '3️⃣ Ajuda'
    );
  }

  else if (msg === '1') {
    let texto = '🛍️ *Nossos produtos:*\n\n';
    produtos.forEach((p, i) => {
      texto += `${i + 1}. ${p.nome} - R$${p.preco.toFixed(2)}\n`;
    });
    texto += '\nDigite o *nome do produto* para ver mais detalhes.';
    await message.reply(texto);
  }

  else if (msg === '2') {
    await message.reply(
      '💳 *Formas de pagamento*\n\n' +
      '✔️ Pix\n' +
      '✔️ Cartão de crédito (até 3x sem juros)\n' +
      '✔️ Boleto bancário\n\n' +
      'Mais informações: https://sualoja.com/pagamento'
    );
  }

  else if (msg === '3') {
    await message.reply(
      '❓ *Ajuda*\n\n' +
      '🔹 Digite *menu* para voltar ao início\n' +
      '🔹 Digite *1* para ver os produtos\n' +
      '🔹 Digite o *nome de um produto* para ver detalhes\n' +
      '🔹 Digite *2* para ver formas de pagamento'
    );
  }

  else {
    const encontrado = produtos.find(p => msg.includes(p.nome.toLowerCase()));

    if (encontrado) {
      await message.reply(
        `🛒 *${encontrado.nome}*\n\n` +
        `${encontrado.descricao}\n` +
        `💰 R$${encontrado.preco.toFixed(2)}\n` +
        `🛍️ Comprar agora: ${encontrado.link}`
      );
    } else {
      await message.reply(
        '🤖 Não entendi sua mensagem.\nDigite *menu* para ver as opções.'
      );
    }
  }
});


client.initialize();
