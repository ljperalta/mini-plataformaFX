let socket = new WebSocket("ws://localhost:8080");

socket.onopen = () => {
  console.log("Conectado ...");
};

socket.onmessage = (event) => {
  console.log("Mensaje desde el servidor:", event.data);
};

socket.onerror = (error) => {
  console.error("Error WebSocket:", error);
};

socket.onclose = () => {
  console.log("Conexion cerrada");
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
  }
  //console.log("data recib:", event.data);
  // console.log("Operación preparada:", operation);
  // const logEntry = document.createElement("div");
  // logEntry.className = "alert alert-secondary py-2 mb-2";
  // logEntry.innerHTML = `<strong>${operation.operacion.toUpperCase()}</strong> ${operation.cantidad} ${operation.divisa} @ ${operation.precio_objetivo} <br><small>${operation.timestamp}</small>`;
  // operationsLog.prepend(logEntry);
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