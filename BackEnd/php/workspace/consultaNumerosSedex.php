<?php
error_reporting(0); // Oculta os erros e avisos
ini_set('display_errors', 0);
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


function obterNumerosSedexOcupados() {
    $conn = conectarBancoDeDados();
    if ($conn->connect_error) {
        die('Erro na conexão com o banco de dados: ' . $conn->connect_error);
    }

    // Primeiro, obtemos todos os números de Sedex ocupados do banco de dados
    $sql = "SELECT numeroSedex FROM sedex WHERE numeroSedex IS NOT NULL AND numeroSedex != ''";
    $result = $conn->query($sql);
    $numerosOcupados = array();

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            if (!empty($row['numeroSedex'])) {
                $numerosOcupados[] = $row['numeroSedex'];
            }
        }
    }

    // Em seguida, geramos um array com todos os números de 1 a 150
    $todosNumeros = range(1, 150);

    // Por fim, utilizamos a função array_diff para obter os números de Sedex que não estão ocupados
    $numerosDisponiveis = array_diff($todosNumeros, $numerosOcupados);

    $conn->close();

    return $numerosDisponiveis;
}




$numerosOcupados = obterNumerosSedexOcupados();
$response = array(
    "dados" => array_values(array_filter($numerosOcupados, function ($numeroSedex) {
        return !empty($numeroSedex);
    }))
);

echo json_encode($response);
?>