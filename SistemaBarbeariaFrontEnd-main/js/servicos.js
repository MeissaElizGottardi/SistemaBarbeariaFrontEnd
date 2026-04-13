const BASE_URL = "https://69d5813c1c120e733cccece3.mockapi.io";
const ENDPOINT = "servicos";

let servicoEditando = null;

// =========================
// 📄 CARREGAR SERVIÇOS
// =========================
async function carregarServicos() {
  try {
    const servicos = await getDados(ENDPOINT);

    const lista = document.getElementById("lista-servicos");
    const emptyState = document.querySelector(".empty-state");
    const tableContainer = document.querySelector(".table-container");

    lista.innerHTML = "";

    if (!servicos || servicos.length === 0) {
      emptyState.style.display = "block";
      tableContainer.style.display = "none";
      return;
    }

    emptyState.style.display = "none";
    tableContainer.style.display = "block";

    servicos.forEach((servico) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${servico.categoriaServico}</td>
        <td>R$ ${Number(servico.valor).toFixed(2)}</td>
        <td>
          <button class="btn-action edit" onclick="editarServico('${servico.id}')">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn-action delete" onclick="excluirServico('${servico.id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      `;

      lista.appendChild(tr);
    });

  } catch (erro) {
    console.error("Erro ao carregar serviços:", erro);
  }
}

// =========================
// 💾 SALVAR / EDITAR
// =========================
async function salvarServico() {
  try {
    const servico = {
      categoriaServico: document.getElementById("categoriaServico").value,
      valor: document.getElementById("valor").value,
      dataDeCriacaoDoServico: document.getElementById("dataDeCriacaoDoServico").value,
      atendente: document.getElementById("atendente").value,
      descricao: document.getElementById("descricao").value,
    };

    if (servicoEditando) {
      await fetch(`${BASE_URL}/${ENDPOINT}/${servicoEditando}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(servico),
      });

      alert("Serviço atualizado!");
      servicoEditando = null;

    } else {
      await postDados(ENDPOINT, servico);
      alert("Serviço cadastrado!");
    }

    limparFormulario();
    carregarServicos();

  } catch (erro) {
    console.error("Erro ao salvar serviço:", erro);
    alert("Erro ao salvar serviço");
  }
}

// =========================
// ✏️ EDITAR
// =========================
async function editarServico(id) {
  try {
    const response = await fetch(`${BASE_URL}/${ENDPOINT}/${id}`);
    const servico = await response.json();

    document.getElementById("categoriaServico").value = servico.categoriaServico || "";
    document.getElementById("valor").value = servico.valor || "";
    document.getElementById("dataDeCriacaoDoServico").value = servico.dataDeCriacaoDoServico || "";
    document.getElementById("atendente").value = servico.atendente || "";
    document.getElementById("descricao").value = servico.descricao || "";

    servicoEditando = id;

    window.scrollTo({ top: 0, behavior: "smooth" });

  } catch (erro) {
    console.error("Erro ao editar serviço:", erro);
  }
}

// =========================
// 🗑️ EXCLUIR
// =========================
async function excluirServico(id) {
  if (!confirm("Deseja excluir este serviço?")) return;

  try {
    await fetch(`${BASE_URL}/${ENDPOINT}/${id}`, {
      method: "DELETE",
    });

    alert("Serviço excluído!");
    carregarServicos();

  } catch (erro) {
    console.error("Erro ao excluir serviço:", erro);
    alert("Erro ao excluir serviço");
  }
}

// =========================
// 🧹 LIMPAR
// =========================
function limparFormulario() {
  document.querySelectorAll("input").forEach(input => input.value = "");
}

// =========================
// 🔌 API
// =========================
async function getDados(endpoint) {
  const response = await fetch(`${BASE_URL}/${endpoint}`);
  return response.json();
}

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

// =========================
// 🌍 GLOBAL
// =========================
window.salvarServico = salvarServico;
window.editarServico = editarServico;
window.excluirServico = excluirServico;

// =========================
// 🚀 INICIAR
// =========================
carregarServicos();