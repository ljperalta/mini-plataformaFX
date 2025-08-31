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
        if ($data === null) {
            $error = json_encode([
                "type" => "ERROR",
                "message" => "Formato de mensaje inválido (no es JSON)",
                "timestamp" => time()
            ]);
            $from->send($error);
            return;
        }

        if (!isset($data['divisa']) || !isset($data['precio_objetivo']) || !isset($data['cantidad'])) {
            print_r($data);
            $error = json_encode([
                "type" => "ERROR",
                "message" => "Faltan parámetros requeridos (divisa, precio objetivo o cantidad)",
                "timestamp" => time()
            ]);
            $from->send($error);
            return;
        }

        foreach ($this->clients as $client) {
            $client->send($msg);
        }

        $ack = json_encode([
            "type" => "ACK",
            "message" => "Operación recibida y transmitida",
            "timestamp" => time()
        ]);

        $from->send($ack);
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