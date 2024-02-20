<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

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

function listarDados($searchTerm) {
    $conn = conectarBancoDeDados();

    if ($conn->connect_error) {
        die('Erro na conexão com o banco de dados: ' . $conn->connect_error);
    }

    $sql = "SELECT * FROM sedex UNION ALL SELECT * FROM sedex_sd";

    // Verifique se o parâmetro "searchTerm" está presente e não vazio
    if (!empty($searchTerm)) {
        $searchTerm = $conn->real_escape_string($searchTerm); // Sanitize the input
        $sql .= " WHERE destinatario LIKE '%$searchTerm%'";
    }

    $sql .= " ORDER BY data_entrada";
    
    $result = $conn->query($sql);
    $dados = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $dados[] = $row;
        }
    }

    $conn->close();
    $response = array(
        'dados' => $dados,
    );

    echo json_encode($response);
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $searchTerm = isset($_GET['searchTerm']) ? $_GET['searchTerm'] : '';
    listarDados($searchTerm);
}
?>
