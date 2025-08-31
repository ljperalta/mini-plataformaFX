let socket = new WebSocket("ws://localhost:8080");

socket.onopen = () => {
  console.log("Conectado ...");
};

socket.onmessage = (event) => {  
  const operation = JSON.parse(event.data);

  if (operation.type === "ACK") {
    console.log("ACK recibido:", operation);
    mostrarToast("✅ " + operation.message, "success");
  } else if (operation.type === "ERROR") {
    mostrarToast("❌ " + operation.message, "danger");
  } else {
    const operationsLog = document.getElementById('operationsLog');
    const logEntry = document.createElement("div");
    logEntry.className = "alert alert-secondary py-2 mb-2";
    logEntry.innerHTML = `<strong>${operation.user}</strong><br><strong>${operation.operacion.toUpperCase()}</strong> ${operation.cantidad} ${operation.divisa} @ ${operation.precio_objetivo} <br><small>${operation.timestamp}</small>`;
    operationsLog.prepend(logEntry);
  }
};

socket.onerror = (error) => {
  console.error("Error WebSocket:", error);
  mostrarToast("Error en la conexión WebSocket", "danger");
};

socket.onclose = () => {
  console.log("Conexion cerrada");
  mostrarToast("Conexión con WebSocket cerrada", "warning");
};
// Simulacion de instrumentos FX
const instrumentos = [
  { id: 1, symbol: "EUR/USD", price: 1.1000, qty: 50 },
  { id: 2, symbol: "USD/JPY", price: 145.20, qty: 30 },
  { id: 3, symbol: "GBP/USD", price: 1.2500, qty: 20 },
  { id: 4, symbol: "AUD/USD", price: 0.6800, qty: 40 }
];

const listDiv = document.getElementById('instrumentList');
const select = document.getElementById('instrumentSelect');

function renderTabla() {
  let html = `
    <table class="table table-striped table-bordered align-middle">
      <thead class="table-primary">
        <tr>
          <th>Instrumento</th>
          <th>Precio</th>
          <th>Cantidad</th>
        </tr>
      </thead>
      <tbody>
  `;
  instrumentos.forEach(inst => {
    html += `
      <tr>
        <td>${inst.symbol}</td>
        <td>${inst.price}</td>
        <td>${inst.qty}</td>
      </tr>
    `;
  });
  html += `</tbody></table>`;
  listDiv.innerHTML = html;
}

// Actualiza precios aleatorios
function actualizarPrecios() {
  instrumentos.forEach(inst => {
    let variacion = (Math.random() - 0.5) / 100;
    inst.price = (parseFloat(inst.price) + variacion).toFixed(5);
    inst.qty = Math.max(0, inst.qty + Math.floor(Math.random() * 5) - 2);
  });
  renderTabla();
}

// Cargar selector con instrumentos
function cargarSelector() {
  select.innerHTML = "";
  instrumentos.forEach(inst => {
    let opt = document.createElement("option");
    opt.value = inst.symbol;
    opt.textContent = inst.symbol;
    select.appendChild(opt);
  });
}

// Inicializar
renderTabla();
cargarSelector();
setInterval(actualizarPrecios, 1000);
//////////////////////////////////////envio de data////////////////////////////////////////////////
document.getElementById("operationForm").addEventListener("submit", function(e){
  e.preventDefault();
  
  const operation = {
    user: currentUser,
    divisa: select.value,
    precio_objetivo: document.getElementById("targetPrice").value,
    cantidad: document.getElementById("quantity").value,
    operacion: document.getElementById("operationType").value,
    timestamp: new Date().toISOString()
  };

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(operation));
    console.log("Operación enviada:", operation);
  } else {
    console.warn("WebSocket no conectado. No se envió la operación.");
    mostrarToast("❌ No se envió la operación.", "danger");
  }
  
});

function mostrarToast(msg, type="primary") {
    const toastEl = document.getElementById('liveToast');
    const toastBody = document.getElementById('toastMessage');

    toastEl.className = `toast align-items-center text-bg-${type} border-0`;
    toastBody.innerText = msg;

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}