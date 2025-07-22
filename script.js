const API_URL = "http://localhost:3001/products";

document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("tbody");
  const inputs = document.querySelectorAll("input[type='text']");
  const button = document.querySelector("button");

  async function listarProdutos() {
    const res = await fetch(API_URL);
    const produtos = await res.json();

    tbody.innerHTML = "";
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

    // Exclusão
    document.querySelectorAll(".btn-excluir").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        listarProdutos();
      });
    });
  }

  button.addEventListener("click", async () => {
    const [nameInput, descriptionInput, priceInput, linkInput] = inputs;

    const novoProduto = {
      name: nameInput.value.trim(),
      description: descriptionInput.value.trim(),
      price: parseFloat(priceInput.value),
      link: linkInput.value.trim(),
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

  listarProdutos();
});
