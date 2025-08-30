<?php
header('Content-Type: application/json');
$symbols = ['EUR/USD','USD/JPY','GBP/USD','AUD/USD'];
$data = [];
foreach ($symbols as $s) {
    $data[] = [
        "symbol" => $s,
        "price" => round(rand(100,200) + rand()/getrandmax(), 5),
        "qty" => rand(1,100)
    ];
}
echo json_encode($data);
?>
