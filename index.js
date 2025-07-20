import { botResponses } from './messages';

const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { Client } = require('whatsapp-web.js');

// Util: Load product catalog from JSON
function loadProductCatalog() {
  const data = fs.readFileSync('./catalog.json', 'utf8');
  return JSON.parse(data);
}

const client = new Client();
const products = loadProductCatalog();

// Gera QR Code para autenticação
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

// Confirma que o bot está pronto
client.on('ready', () => {
  console.log('🛍️ Online Store Bot is ready!');
});

// Lida com mensagens recebidas
client.on('message', async (message) => {
  const userMessage = formatInitialMessage(message.body);

  if (['menu', 'oi', 'ola'].includes(userMessage)) {
    await message.reply(botResponses.boasVindas);
  }

  else if (userMessage === '1') {
    const productListText = botResponses.listaProdutos(products);
    await message.reply(productListText);
  }

  else if (userMessage === '2') {
    await message.reply(botResponses.formasPagamento);
  }

  else if (userMessage === '3') {
    await message.reply(botResponses.ajuda);
  }

  else {
    const matchedProduct = products.find(p =>
      userMessage.includes(p.name.toLowerCase())
    );

    if (matchedProduct) {
      await message.reply(botResponses.detalhesProduto(matchedProduct));
    } else {
      await message.reply(botResponses.naoEntendi);
    }
  }
});

client.initialize();

function formatInitialMessage(message) {
  return text
    .toLowerCase()                    // deixa tudo minúsculo
    .normalize('NFD')                // separa acentos das letras
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .trim()                         // remove espaços nas extremidades
}
