<?php
function conectarBancoDeDados() {
    $servername = "127.0.0.1";
    $username = "root";
    $password = "";
    $dbname = "bd_sedex";

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Falha na conexão: " . $conn->connect_error);
    }

    return $conn;
}

$conexao = conectarBancoDeDados();

// Consulta SQL para contar os usuários
$sql = "SELECT COUNT(*) as total FROM usuarios";
$result = $conexao->query($sql);

// Obter o resultado da contagem
$row = $result->fetch_assoc();
$totalUsuarios = $row['total'];

echo $totalUsuarios;

// Fechar a conexão com o banco de dados
$conexao->close();
?>
