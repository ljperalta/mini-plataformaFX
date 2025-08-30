// Simulacion de instrumentos FX
const instrumentos = [
  { id: 1, symbol: "EUR/USD", price: 1.1000, qty: 50 },
  { id: 2, symbol: "USD/JPY", price: 145.20, qty: 30 },
  { id: 3, symbol: "GBP/USD", price: 1.2500, qty: 20 },
  { id: 4, symbol: "AUD/USD", price: 0.6800, qty: 40 }
];

const listDiv = document.getElementById('instrumentList');
const select = document.getElementById('instrumentSelect');
const operationsLog = document.getElementById('operationsLog');

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
setInterval(actualizarPrecios, 2000);
//////////////////////////////////////envio de data////////////////////////////////////////////////
document.getElementById("operationForm").addEventListener("submit", function(e){
  e.preventDefault();
  
  const operation = {
    symbol: select.value,
    target: document.getElementById("targetPrice").value,
    qty: document.getElementById("quantity").value,
    side: document.getElementById("operationType").value,
    timestamp: new Date().toISOString()
  };

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(operation));
    console.log("Operación enviada:", operation);
  } else {
    console.warn("WebSocket no conectado. No se envió la operación.");
  }

  const logEntry = document.createElement("div");
  logEntry.className = "alert alert-secondary py-2 mb-2";
  logEntry.innerHTML = `<strong>${operation.side.toUpperCase()}</strong> ${operation.qty} ${operation.symbol} @ ${operation.target} <br><small>${operation.timestamp}</small>`;
  operationsLog.prepend(logEntry);
});



// const instrumentos = [
//   { id: 1, symbol: "EUR/USD", price: 1.1000, qty: 50 },
//   { id: 2, symbol: "USD/JPY", price: 145.20, qty: 30 },
//   { id: 3, symbol: "GBP/USD", price: 1.2500, qty: 20 },
//   { id: 4, symbol: "AUD/USD", price: 0.6800, qty: 40 }
// ];

// const listDiv = document.getElementById('instrumentList');

// // Simula actualización de precios aleatorios
// function actualizarPrecios() {
//   instrumentos.forEach(inst => {
//     let variacion = (Math.random() - 0.5) / 100; // variación pequeña
//     inst.price = (parseFloat(inst.price) + variacion).toFixed(5);
//   });
//   mostrarInstrumentos();
// }

// // Renderizar tabla dinámica con Bootstrap
// function mostrarInstrumentos() {
//   let html = `
//     <table class="table table-striped table-bordered align-middle">
//       <thead class="table-primary">
//         <tr>
//           <th>Instrumento</th>
//           <th>Precio</th>
//           <th>Cantidad</th>
//           <th>Precio Objetivo</th>
//           <th>Mi Cantidad</th>
//           <th>Operación</th>
//         </tr>
//       </thead>
//       <tbody>
//   `;
//   instrumentos.forEach(inst => {
//     html += `
//       <tr>
//         <td>${inst.symbol}</td>
//         <td>${inst.price}</td>
//         <td>${inst.qty}</td>
//         <td><input type="number" step="0.0001" class="form-control" placeholder="Target"></td>
//         <td><input type="number" class="form-control" placeholder="Cantidad"></td>
//         <td>
//           <select class="form-select">
//             <option value="buy">Buy</option>
//             <option value="sell">Sell</option>
//           </select>
//         </td>
//       </tr>
//     `;
//   });
//   html += `
//       </tbody>
//     </table>
//   `;
//   listDiv.innerHTML = html;
// }

// // Inicialización
// mostrarInstrumentos();
// setInterval(actualizarPrecios, 1000);

// // Botón central (ejemplo, luego se conecta al WS)
// document.getElementById('sendBtn').onclick = () => {
//   alert("Aquí luego enviamos las configuraciones por WebSocket 🚀");
// };