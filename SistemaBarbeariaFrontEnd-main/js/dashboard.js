const BASE_URL = "https://69d5813c1c120e733cccece3.mockapi.io";

async function carregarDashboard() {
  try {
    const clientes = await fetch(`${BASE_URL}/clientes`).then(r => r.json());
    const servicos = await fetch(`${BASE_URL}/servicos`).then(r => r.json());
    const agendamentos = await fetch(`${BASE_URL}/agendamentos`).then(r => r.json());

    // =========================
    // 💰 FATURAMENTO
    // =========================
    let faturamento = 0;

    agendamentos.forEach(a => {
      faturamento += Number(a.valor || 0);
    });

    document.getElementById("faturamento").innerText =
      `R$ ${faturamento.toFixed(2)}`;

    // =========================
    // 📅 AGENDAMENTOS
    // =========================
    document.getElementById("agendamentos").innerText =
      agendamentos.length;

    // =========================
    // 👥 CLIENTES
    // =========================
    document.getElementById("clientes").innerText =
      clientes.length;

    // =========================
    // 📊 GRÁFICO
    // =========================
    gerarGrafico(agendamentos);

    // =========================
    // 📋 AGENDA DE HOJE
    // =========================
    gerarAgendaHoje(agendamentos);

  } catch (erro) {
    console.error("Erro ao carregar dashboard:", erro);
  }
}

// =========================
// 📊 GRÁFICO
// =========================
function gerarGrafico(agendamentos) {
  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const dados = [0, 0, 0, 0, 0, 0, 0];

  agendamentos.forEach(a => {
    if (!a.data) return;

    const data = new Date(a.data);
    const dia = data.getDay();

    dados[dia] += 1;
  });

  const ctx = document.getElementById("meuGrafico");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: dias,
      datasets: [{
        label: "Agendamentos",
        data: dados,
        tension: 0.4
      }]
    }
  });
}

// =========================
// 📋 AGENDA DE HOJE
// =========================
function gerarAgendaHoje(agendamentos) {
  const container = document.getElementById("lista-agendamentos");
  container.innerHTML = "";

  const hoje = new Date().toISOString().split("T")[0];

  const hojeLista = agendamentos.filter(a => {
    if (!a.data) return false;
    return a.data.startsWith(hoje);
  });

  if (hojeLista.length === 0) {
    container.innerHTML = "<p>Nenhum agendamento hoje</p>";
    return;
  }

  hojeLista.forEach(a => {
    const hora = a.data ? a.data.split("T")[1]?.substring(0, 5) : "--:--";

    const div = document.createElement("div");
    div.classList.add("agenda-item");

    div.innerHTML = `
      <div class="time">${hora}</div>
      <div class="info">
        <strong>${a.cliente || "Cliente"}</strong>
        <span>${a.servico || "Serviço"}</span>
      </div>
      <div class="status waiting">Agendado</div>
    `;

    container.appendChild(div);
  });
}

// =========================
// 🚀 INICIAR
// =========================
carregarDashboard();