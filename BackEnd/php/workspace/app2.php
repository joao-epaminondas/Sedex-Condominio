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

function listarDados() {
    $conn = conectarBancoDeDados();
    if ($conn->connect_error) {
        die('Erro na conexão com o banco de dados: ' . $conn->connect_error);
    }
    $sql = "SELECT * FROM sedex";
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

function atualizarDados($data) {
    $base_path = $_SERVER['DOCUMENT_ROOT'];
    $relative_path = "/Projeto_Sedex/FrontEnd/img/assinaturas/";
    $conn = conectarBancoDeDados();

    // Verificar se os dados necessários estão presentes na requisição PUT
    if (!isset($data['id'])) {
        return false;
    }
    $id = $conn->real_escape_string($data['id']);
    $saida_funcionario = $conn->real_escape_string($data['saida_funcionario']);
    $data_saida = $conn->real_escape_string($data['data_saida']);
    $hora_saida = $conn->real_escape_string($data['hora_saida']);
    $retirado = $conn->real_escape_string($data['retirado']);
    $caminhoPastaAssinaturas = $base_path.$relative_path;
    if (!file_exists($caminhoPastaAssinaturas)) {
        mkdir($caminhoPastaAssinaturas, 0777, true);
    }

    $desenhoBinario = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $data['url_img_assinatura']));

    // Executar a atualização no banco de dados
    $sql = "UPDATE sedex SET 
            saida_funcionario = '$saida_funcionario',
            data_saida = '$data_saida',
            hora_saida = '$hora_saida',
            retirado = '$retirado'
            WHERE id = '$id'";

    if ($conn->query($sql) === TRUE) {
        $nomeArquivo = "img_" . $id . ".png";
        $caminhoDesenhoComID = $caminhoPastaAssinaturas . $nomeArquivo;
        file_put_contents($caminhoDesenhoComID, $desenhoBinario);
        $url_img_assinatura = $caminhoDesenhoComID;

        // Atualizar a URL da imagem da assinatura no banco de dados
        $sqlUpdate = "UPDATE sedex SET url_img_assinatura = '$url_img_assinatura' WHERE id = '$id'";
        $conn->query($sqlUpdate);

        // Resto do código de manipulação de sucesso
        $conn->close();
        return true;
    } else {
        // Resto do código de manipulação de erro
        $conn->close();
        return false;
    }
}


if ($_SERVER["REQUEST_METHOD"] === "GET") {
    listarDados();
}
if ($_SERVER["REQUEST_METHOD"] === "PUT") {
    $putdata = file_get_contents("php://input");
    $data = json_decode($putdata, true);

    $resultado = atualizarDados($data); // Defina a variável $resultado com o resultado da função

    $response = array();
    if ($resultado) {
        $response['success'] = true;
        $response['message'] = "Informações atualizadas com sucesso!";
    } else {
        $response['success'] = false;
        $response['message'] = "Falha ao atualizar informações no banco de dados.";
    }

    echo json_encode($response);
}

?>