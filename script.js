const API_URL = "http://localhost:3001/products";
const BOT_URL = "http://localhost:3001/bot";

document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("tbody");
  const inputs = document.querySelectorAll("input[type='text']");
  const button = document.querySelector("button");
  const startBotButton = document.getElementById("start-bot");
  const qrContainer = document.getElementById("qr-container");

  // Listar produtos
  async function listarProdutos() {
    const res = await fetch(API_URL);
    const produtos = await res.json();

    tbody.innerHTML = ""; // limpa a tabela
    produtos.forEach(prod => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${prod.name}</td>
        <td>${prod.description || "-"}</td>
        <td>R$ ${prod.price.toFixed(2)}</td>
        <td><a href="${prod.link}" target="_blank">Ver</a></td>
        <td>
          <button class="btn-editar" data-id="${prod.id}">Editar</button>
          <button class="btn-excluir" data-id="${prod.id}">Excluir</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Botões de exclusão
    document.querySelectorAll(".btn-excluir").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        listarProdutos();
      });
    });
    document.querySelectorAll("").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        listarProdutos();
      });
    });
  }

  // Adicionar produto
  button.addEventListener("click", async () => {
    const [nameInput, descriptionInput, priceInput, linkInput] = inputs;

    const novoProduto = {
      name: nameInput.value,
      description: descriptionInput.value,
      price: parseFloat(priceInput.value),
      link: linkInput.value
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoProduto)
    });

    if (res.ok) {
      inputs.forEach(i => i.value = "");
      listarProdutos();
    } else {
      alert("Erro ao adicionar produto.");
    }
  });

  // Iniciar o bot e buscar o QR code
  if (startBotButton) {
    startBotButton.addEventListener("click", async () => {
      // Inicia o bot
      await fetch(`${BOT_URL}/start`, { method: "POST" });

      // Espera um pouco para o QR estar pronto
      setTimeout(async () => {
        const res = await fetch(`${BOT_URL}/qr`);
        if (res.ok) {
          const data = await res.json();
          const qrImg = document.createElement('img');
          qrImg.src = data.qrCode;
          qrImg.style.width = '300px';
          qrContainer.innerHTML = '';
          qrContainer.appendChild(qrImg);
        } else {
          qrContainer.innerHTML = 'QR Code ainda não disponível.';
        }
      }, 2000);
    });
  }

  listarProdutos();
});
