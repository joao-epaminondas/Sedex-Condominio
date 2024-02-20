<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

$base_path = $_SERVER['DOCUMENT_ROOT'];
$relative_path = "/Projeto_Sedex/FrontEnd/img/assinaturas/";
$relative_path_sd = "/Projeto_Sedex/FrontEnd/img/assinaturas_sd/";
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

$conn = conectarBancoDeDados();


$sqlTransferencia = "INSERT INTO sedex_sd SELECT * FROM sedex WHERE retirado = 1";

if ($conn->query($sqlTransferencia) === TRUE) {
    $sqlExclusao = "DELETE FROM sedex WHERE retirado = 1";

    if ($conn->query($sqlExclusao) === TRUE) {
        // Move as imagens da pasta 'assinaturas' para 'assinaturas_sd'
        $pastaOrigem = $base_path.$relative_path;
        $pastaDestino = $base_path.$relative_path_sd;
        if (!file_exists($pastaDestino)) {
        mkdir($pastaDestino, 0555, true);
        }

        $arquivos = scandir($pastaOrigem);

        foreach ($arquivos as $arquivo) {
            if ($arquivo != '.' && $arquivo != '..') {
                $caminhoOrigem = $pastaOrigem . $arquivo;
                $caminhoDestino = $pastaDestino . $arquivo;

                if (rename($caminhoOrigem, $caminhoDestino)) {
                    echo "Numeros Sedex Ocupados Limpos";
                } else {
                    echo "Erro ao mover imagem $arquivo.";
                }
            }
        }

        
    } else {
        echo "Erro ao excluir dados da tabela antiga: " . $conn->error;
    }
} else {
    echo "Erro ao transferir dados: " . $conn->error;
}

// Fecha a conexão
$conn->close();
?>
