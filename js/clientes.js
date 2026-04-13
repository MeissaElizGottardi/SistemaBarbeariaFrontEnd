// 🔥 coloque aqui sua URL do MockAPI
const API_URL = "https://consumer-api-vuxo.onrender.com/consumers";
const BASE_URL = "https://consumer-api-vuxo.onrender.com";
// controla edição
let clienteEditando = null;

// =========================
// 📄 CARREGAR CLIENTES
// =========================
async function carregarClientes() {
  try {
    const clientes = await getDados("consumers");

    
    const lista = document.getElementById("lista-clientes");
    const emptyState = document.querySelector(".empty-state");
    const tableContainer = document.querySelector(".table-container");

    lista.innerHTML = "";

    // 🔥 SE NÃO TEM CLIENTE
    if (!clientes || clientes.length === 0) {
      emptyState.style.display = "block";
      tableContainer.style.display = "none";
      return;
    }

    // 🔥 SE TEM CLIENTE
    emptyState.style.display = "none";
    tableContainer.style.display = "block";

    clientes.forEach((cliente) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${cliente.nome}</td>
        <td>${cliente.id || "-"}</td>
        <td>
          <button class="btn-action edit" onclick="editarCliente('${cliente.id}')">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn-action delete" onclick="excluirCliente('${cliente.id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      `;

      lista.appendChild(tr);
    });
  } catch (erro) {
    console.error("Erro ao carregar clientes:", erro);
  }
}

// =========================
// 💾 SALVAR / EDITAR CLIENTE
// =========================
async function salvarCliente() {
  try {
    const cliente = {
      nome: document.getElementById("nome").value,
      cpf: document.getElementById("cpf").value,
      telefone: document.getElementById("telefone").value,
      email: document.getElementById("email").value,
      dataNascimento: document.getElementById("dataNascimento").value,
      genero: document.getElementById("genero").value,
      endereco: document.getElementById("endereco").value,
    };

    // 👉 SE ESTIVER EDITANDO
    if (clienteEditando) {
      await fetch(`${API_URL}/${clienteEditando}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente),
      });

      alert("Cliente atualizado!");

      clienteEditando = null;
    } else {
      // 👉 NOVO CLIENTE
      await postDados("clientes", cliente);

      alert("Cliente cadastrado!");
    }

    limparFormulario();
    carregarClientes();
  } catch (erro) {
    console.error("Erro ao salvar cliente:", erro);
    alert("Erro ao salvar cliente");
  }
}

// =========================
// ✏️ EDITAR CLIENTE
// =========================
async function editarCliente(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const cliente = await response.json();

    document.getElementById("nome").value = cliente.nome || "";
    document.getElementById("cpf").value = cliente.cpf || "";
    document.getElementById("telefone").value = cliente.telefone || "";
    document.getElementById("email").value = cliente.email || "";
    document.getElementById("dataNascimento").value =
      cliente.dataNascimento || "";
    document.getElementById("genero").value = cliente.genero || "";
    document.getElementById("endereco").value = cliente.endereco || "";

    clienteEditando = id;

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (erro) {
    console.error("Erro ao carregar cliente:", erro);
  }
}

// =========================
// 🗑️ EXCLUIR CLIENTE
// =========================
async function excluirCliente(id) {
  const confirmar = confirm("Tem certeza que deseja excluir este cliente?");

  if (!confirmar) return;

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    alert("Cliente excluído!");
    carregarClientes();
  } catch (erro) {
    console.error("Erro ao excluir:", erro);
    alert("Erro ao excluir cliente");
  }
}

// =========================
// 🧹 LIMPAR FORMULÁRIO
// =========================
function limparFormulario() {
  document.querySelectorAll("input").forEach((input) => (input.value = ""));
}

// =========================
// 🌍 GLOBAL (HTML acessar)
// =========================
window.salvarCliente = salvarCliente;
window.editarCliente = editarCliente;
window.excluirCliente = excluirCliente;

const PROXY = "https://cors-anywhere.herokuapp.com/";
    
    async function getDados(endpoint) {
      const response = await fetch(`${PROXY}${BASE_URL}/${endpoint}`);
      return response.json();
    }

// POST
async function postDados(endpoint, dados) {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });
  return response.json();
}

// DELETE
async function deleteDados(endpoint, id) {
  await fetch(`${BASE_URL}/${endpoint}/${id}`, {
    method: "DELETE",
  });
}

// =========================
// 🚀 INICIAR
// =========================
carregarClientes();
