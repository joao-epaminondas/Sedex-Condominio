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


function inserirInformacoes($data) {

    $base_path = $_SERVER['DOCUMENT_ROOT'];
    $relative_path = "/Projeto_Sedex/FrontEnd/img/assinaturas/";
    $relative_img = "/Projeto_Sedex/FrontEnd/img/sem-imagem.png";
    $conn = conectarBancoDeDados();

    $numeroSedex = $conn->real_escape_string($data['numeroSedex']);

    // Verifica se o número de Sedex já existe no banco
    $sqlVerificaExistencia = "SELECT COUNT(*) AS count FROM sedex WHERE numeroSedex = '$numeroSedex'";
    $result = $conn->query($sqlVerificaExistencia);
    $row = $result->fetch_assoc();
    if ($row['count'] > 0) {
        $conn->close();
        $response = array("success" => false, "message" => "Já existe um registro com esse número de Sedex");
        echo json_encode($response);
        exit;
    }

    // Resto do código de inserção
    $destinatario = $conn->real_escape_string($data['destinatario']);
    $rua = $conn->real_escape_string($data['rua']);
    $numerorua = $conn->real_escape_string($data['numerorua']);
    $cxp = $conn->real_escape_string($data['cxp']);
    $descricao = $conn->real_escape_string($data['descricao']);
    $entrada_funcionario = $conn->real_escape_string($data['entrada_funcionario']);
    $saida_funcionario = $conn->real_escape_string($data['saida_funcionario']);
    $data_entrada = $conn->real_escape_string($data['data_entrada']);
    $hora_entrada = $conn->real_escape_string($data['hora_entrada']);
    $data_saida = $conn->real_escape_string($data['data_saida']);
    $hora_saida = $conn->real_escape_string($data['hora_saida']);
    $retirado = $conn->real_escape_string($data['retirado']);
    $lote = $conn->real_escape_string($data['lote']);

        

    $caminhoPastaAssinaturas = $base_path.$relative_path;
    if (!file_exists($caminhoPastaAssinaturas)) {
        mkdir($caminhoPastaAssinaturas, 0555, true);
    }

    $url_img_assinatura = $conn->real_escape_string($data['url_img_assinatura']);
    
    if (strpos($url_img_assinatura, 'C:/') === 0) {
        $url_img_assinatura = $base_path.$relative_img;
    } else {
        // Assume-se que é uma string em formato Base64
        $desenhoBinario = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $url_img_assinatura));
        
        $sql = "INSERT INTO sedex (destinatario, rua, numerorua, cxp, numeroSedex, descricao, entrada_funcionario, data_entrada, hora_entrada, saida_funcionario, data_saida, hora_saida, retirado, url_img_assinatura, lote)
                VALUES ('$destinatario', '$rua', '$numerorua', '$cxp', '$numeroSedex', '$descricao', '$entrada_funcionario', '$data_entrada', '$hora_entrada', '$saida_funcionario', '$data_saida', '$hora_saida', '$retirado', '$url_img_assinatura', '$lote')";
        
        if ($conn->query($sql) === TRUE) {
            $idInserido = $conn->insert_id;
            $nomeArquivo = "img_" . $idInserido . ".png";
            $caminhoDesenhoComID = $caminhoPastaAssinaturas . $nomeArquivo;
            file_put_contents($caminhoDesenhoComID, $desenhoBinario);
            $url_img_assinatura = $caminhoDesenhoComID;
            
            $sqlUpdate = "UPDATE sedex SET url_img_assinatura = '$url_img_assinatura' WHERE id = $idInserido";
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

    

    $sql = "INSERT INTO sedex (destinatario, rua, numerorua, cxp, numeroSedex, descricao, entrada_funcionario, data_entrada, hora_entrada, saida_funcionario, data_saida, hora_saida, retirado, url_img_assinatura, lote)
            VALUES ('$destinatario', '$rua', '$numerorua', '$cxp', '$numeroSedex', '$descricao', '$entrada_funcionario', '$data_entrada', '$hora_entrada', '$saida_funcionario', '$data_saida', '$hora_saida', '$retirado', '$url_img_assinatura', '$lote')";


        

    if ($conn->query($sql) === TRUE) {
        // Resto do código de manipulação de sucesso
        $conn->close();
        return true;
    } else {
        // Resto do código de manipulação de erro
        $conn->close();
        return false;
    }
}

function listarDados($paginaAtual, $itensPorPagina) {
    $conn = conectarBancoDeDados();
    if ($conn->connect_error) {
        die('Erro na conexão com o banco de dados: ' . $conn->connect_error);
    }
    $offset = ($paginaAtual - 1) * $itensPorPagina;
    $sql = "SELECT * FROM sedex LIMIT $offset, $itensPorPagina";
    $result = $conn->query($sql);
    $dados = array();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $dados[] = $row;
        }
    }
    $totalRegistros = obterQuantidadeTotalRegistros(); // Obter a quantidade total de registros
    $conn->close();
    $response = array(
        'dados' => $dados,
        'quantidade' => $totalRegistros
    );


    echo json_encode($response);
}

function excluirRegistro($id) {
    $conn = conectarBancoDeDados();
    $id = $conn->real_escape_string($id);
    $sql = "DELETE FROM sedex WHERE id = '$id'";

    if ($conn->query($sql) === TRUE) {
        $conn->close();
        return true;
    } else {
        $conn->close();
        return false;
    }
}

function excluirTudo() {
    $conn = conectarBancoDeDados();
    $sql = "DELETE FROM sedex";

    if ($conn->query($sql) === TRUE) {
        $conn->close();
        return true;
    } else {
        $conn->close();
        return false;
    }
}

function atualizarInformacoes($data) {
    $conn = conectarBancoDeDados();

    if (!isset($data['id'])) {
        return false;
    }
    $id = $conn->real_escape_string($data['id']);
    $destinatario = $conn->real_escape_string($data['destinatario']);
    $rua = $conn->real_escape_string($data['rua']);
    $numerorua = $conn->real_escape_string($data['numerorua']);
    $cxp = $conn->real_escape_string($data['cxp']);
    $numeroSedex = $conn->real_escape_string($data['numeroSedex']);
    $descricao = $conn->real_escape_string($data['descricao']);

    $sql = "UPDATE sedex SET destinatario='$destinatario', rua='$rua', numerorua='$numerorua', cxp='$cxp', numeroSedex='$numeroSedex', descricao='$descricao' WHERE id='$id'";

    if ($conn->query($sql) === TRUE) {
        $conn->close();
        return true;
    } else {
        $conn->close();
        return false;
    }
}

function obterQuantidadeTotalRegistros() {
    $conn = conectarBancoDeDados();
    if ($conn->connect_error) {
        die('Erro na conexão com o banco de dados: ' . $conn->connect_error);
    }
    $sql = "SELECT COUNT(*) AS quantidade FROM sedex";
    $result = $conn->query($sql);
    $quantidade = 0;
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $quantidade = intval($row['quantidade']);
    }
    $conn->close();
    return $quantidade;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = $_POST;

    if (isset($data["excluir_tudo"]) && $data["excluir_tudo"] === "true") {
        // Lógica para excluir todos os registros de Sedex
        $resultado = excluirTudo();
        $response = array();

        if ($resultado) {
            $response['success'] = true;
            $response['message'] = "Todos os registros foram excluídos com sucesso!";
        } else {
            $response['success'] = false;
            $response['message'] = "Falha ao excluir todos os registros.";
        }
    } else {
        // Lógica para inserir as informações no banco de dados
        $resultado = inserirInformacoes($data);
        $response = array();

        if ($resultado) {
            $response['success'] = true;
            $response['message'] = "Informações inseridas com sucesso!";


        } else {
            $response['success'] = false;
            $response['message'] = "Falha ao inserir informações no banco de dados.";
        }
    }

    echo json_encode($response);
} else if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $paginaAtual = isset($_GET['pagina']) ? intval($_GET['pagina']) : 1;
    $itensPorPagina = 5;
    $quantidadeTotalRegistros = obterQuantidadeTotalRegistros();
    listarDados($paginaAtual, $itensPorPagina, $quantidadeTotalRegistros);
} else if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    $response = array();

    if (isset($_GET['id'])) {
        $id = $_GET['id'];
        $resultado = excluirRegistro($id);

        if ($resultado) {
            $response['success'] = true;
            $response['message'] = "Exclusão bem-sucedida.";
        } else {
            $response['success'] = false;
            $response['message'] = "Falha na exclusão.";
        }
    } else {
        $response['success'] = false;
        $response['message'] = "ID do registro não foi fornecido.";
    }

    echo json_encode($response);
} else if ($_SERVER["REQUEST_METHOD"] === "PUT") {
    parse_str(file_get_contents("php://input"), $data);
    $resultado = atualizarInformacoes($data);
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
