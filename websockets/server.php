<?php
require __DIR__ . '/vendor/autoload.php';
require 'MessageHandler.php';

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new MessageHandler()
        )
    ),
    8080
);

echo "Servidor WebSocket en ws://localhost:8080\n";
$server->run();
?>