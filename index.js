import { respostasBot } from './mensagens';

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
    await message.reply(respostasBot.boasVindas);
  }

  else if (msg === '1') {
    let texto = '🛍️ *Nossos produtos:*\n\n';
    texto = respostasBot.listaProdutos(produtos);
    await message.reply(texto);
  }

  else if (msg === '2') {
    await message.reply(respostasBot.formasPagamento);
  }

  else if (msg === '3') {
    await message.reply(respostasBot.ajuda);
  }

  else {
   
    const produto = produtos.find(p => msg.includes(p.nome.toLowerCase()));

    if (encontrado) {
      await message.reply(respostasBot.detalhesProduto(produto));
    } else {
      await message.reply(respostasBot.naoEntendi);
    }
  }
});


client.initialize();
