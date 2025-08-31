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

        $data = json_decode($msg, true);

        if ($data) {
            try {
                //$pdo = new PDO("mysql:host=localhost;dbname=neix;charset=utf8", "root", "");
                //$stmt = $pdo->prepare("INSERT INTO orders (user, divisa, operacion, cantidad, precio_objetivo, fecha) VALUES (?, ?, ?, ?, ?, NOW())");
                //$stmt->execute([$data['user'], $data['divisa'], $data['operacion'], $data['cantidad'], $data['precio_objetivo']]);
            } catch (Exception $e) {
                echo "Error DB: " . $e->getMessage() . "\n";
            }
        }

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