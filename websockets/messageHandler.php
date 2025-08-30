<?php
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class MessageHandler implements MessageComponentInterface {
    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
        echo "Nueva conexión: ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        echo "Mensaje recibido de {$from->resourceId}: $msg\n";

        // 🔹 Aquí puedes guardar en la DB si quieres
        $data = json_decode($msg, true);

        if ($data) {
            // Guardar en DB (ejemplo básico con PDO)
            try {
                $pdo = new PDO("mysql:host=localhost;dbname=neix;charset=utf8", "root", "");
                $stmt = $pdo->prepare("INSERT INTO orders (user, symbol, side, qty, target, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
                $stmt->execute([$data['user'], $data['symbol'], $data['side'], $data['qty'], $data['target']]);
            } catch (Exception $e) {
                echo "Error DB: " . $e->getMessage() . "\n";
            }
        }

        // 🔹 Reenviar a todos los clientes
        foreach ($this->clients as $client) {
            $client->send($msg);
        }
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
        echo "Conexión cerrada: ({$conn->resourceId})\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "Error: {$e->getMessage()}\n";
        $conn->close();
    }
}
?>