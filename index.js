// Importa biblioteca para exibir QR Code no terminal (para escanear e conectar com o WhatsApp)
const qrcode = require('qrcode-terminal');

// Importa módulo para ler arquivos do sistema (usado para carregar o catálogo)
const fs = require('fs');

// Importa a classe Client da biblioteca whatsapp-web.js
const { Client } = require('whatsapp-web.js');

// Função que carrega o catálogo de produtos a partir do arquivo catalogo.json
function carregarCatalogo() {
  const data = fs.readFileSync('./catalogo.json', 'utf8'); // Lê o arquivo como texto
  return JSON.parse(data); // Converte o texto para objeto JSON
}

// Cria uma nova instância do cliente do WhatsApp
const client = new Client();

// Carrega os produtos do catálogo para uso posterior nas mensagens
const produtos = carregarCatalogo();

// Cria um mapa para registrar a última interação de cada contato (chave: id do contato, valor: timestamp)
const ultimaInteracao = new Map();

// Define o tempo máximo de inatividade (em milissegundos). Aqui, 20 minutos.
const TEMPO_INATIVIDADE = 20 * 60 * 1000;

// Exibe o QR code no terminal para que o usuário escaneie com o WhatsApp
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

// Evento disparado quando o bot está pronto para uso
client.on('ready', () => {
  console.log('🛍️ Bot da Loja Online está pronto!');
});

// Evento que trata cada nova mensagem recebida
client.on('message', async (message) => {
  const msg = message.body.toLowerCase().trim(); // Converte o texto da mensagem para minúsculas
  const idContato = message.from; // ID único do remetente
  const agora = Date.now(); // Horário atual

  const ultimaHora = ultimaInteracao.get(idContato); // Recupera a última hora de interação do contato
  const isNovaConversa = !ultimaHora || agora - ultimaHora >= TEMPO_INATIVIDADE;
  // Verifica se é uma nova conversa (nunca falou antes ou passou mais de 20 minutos)

  // Atualiza o horário da última interação
  ultimaInteracao.set(idContato, agora);

  // Se for uma nova conversa, envia o menu e encerra o processamento
  if (isNovaConversa) {
    await message.reply(
      '👋 Olá! Vamos começar novamente.\n\n' +
      'Escolha uma opção:\n' +
      '1️⃣ Ver produtos\n' +
      '2️⃣ Formas de pagamento\n' +
      '3️⃣ Ajuda'
    );
    return;
  }

  // Se a pessoa digitar "menu", "oi" ou "olá", mostra o menu principal
  if (['menu', 'oi', 'olá'].includes(msg)) {
    await message.reply(
      '👋 Bem-vindo à nossa loja!\n\n' +
      'Escolha uma opção:\n' +
      '1️⃣ Ver produtos\n' +
      '2️⃣ Formas de pagamento\n' +
      '3️⃣ Ajuda'
    );
  }

  // Se digitar "1", exibe a lista de produtos
  else if (msg === '1') {
    let texto = '🛍️ *Nossos produtos:*\n\n';
    produtos.forEach((p, i) => {
      texto += `${i + 1}. ${p.nome} - R$${p.preco.toFixed(2)}\n`;
    });
    texto += '\nDigite o *nome do produto* para ver mais detalhes.';
    await message.reply(texto);
  }

  // Se digitar "2", mostra as formas de pagamento
  else if (msg === '2') {
    await message.reply(
      '💳 *Formas de pagamento*\n\n' +
      '✔️ Pix\n' +
      '✔️ Cartão de crédito (até 3x sem juros)\n' +
      '✔️ Boleto bancário\n\n' +
      'Mais informações: https://sualoja.com/pagamento'
    );
  }

  // Se digitar "3", exibe o menu de ajuda
  else if (msg === '3') {
    await message.reply(
      '❓ *Ajuda*\n\n' +
      '🔹 Digite *menu* para voltar ao início\n' +
      '🔹 Digite *1* para ver os produtos\n' +
      '🔹 Digite o *nome de um produto* para ver detalhes\n' +
      '🔹 Digite *2* para ver formas de pagamento'
    );
  }

  // Se digitar o nome de um produto, mostra os detalhes dele
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
      // Se não reconheceu o que foi digitado, orienta o usuário
      await message.reply(
        '🤖 Não entendi sua mensagem.\nDigite *menu* para ver as opções.'
      );
    }
  }
});
