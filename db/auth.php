<?php
session_start();
$config = include '../env.php';
$mysqli = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);

if ($mysqli->connect_error) {
    die("Error de conexión: " . $mysqli->connect_error);
}

$username = $_POST['username'];
$password = $_POST['password'];

$sql = "SELECT id, user, name FROM users WHERE user=? AND password=MD5(?)";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $row = $result->fetch_assoc();
    
    $_SESSION['user_id'] = $row['id'];
    $_SESSION['username'] = $row['user'];
    $_SESSION['name'] = $row['name'];

    echo json_encode(["success"=>true]);
    exit;
} else {
    echo json_encode(["success"=>false]);
}
$mysqli->close();