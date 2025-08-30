//config de socket
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
