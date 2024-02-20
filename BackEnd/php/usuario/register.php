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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = $_POST['nome'];
    $usuario = $_POST['usuario'];
    $senha = $_POST['senha'];

    $conexao = conectarBancoDeDados();

    // Verifica se o usuário já existe
    $sql_check_user = "SELECT COUNT(*) as count FROM usuarios WHERE usuario = '$usuario'";
    $result_check_user = mysqli_query($conexao, $sql_check_user);
    $row_check_user = mysqli_fetch_assoc($result_check_user);

    if ($row_check_user['count'] > 0) {
        // Usuário já existe
        $response = array('success' => false, 'message' => 'Usuário já existe');
        echo json_encode($response);
        exit;
    }

    // Verifica se existem quaisquer usuários
    $sql_check_total_users = "SELECT COUNT(*) as total FROM usuarios";
    $result_check_total_users = mysqli_query($conexao, $sql_check_total_users);
    $row_check_total_users = mysqli_fetch_assoc($result_check_total_users);

    if ($row_check_total_users['total'] == 0) {
        // Não há usuários cadastrados
        // Atribui o nível de acesso 3 ao primeiro usuário (como mencionado anteriormente)
        $nivelAcesso = 3;
    } else {
        // Já existem usuários, atribui o nível de acesso 1
        $nivelAcesso = 1;
    }

    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);

    // Insere o usuário no banco de dados
    $sql_insert = "INSERT INTO usuarios (nome, usuario, senha, nivel) VALUES ('$nome', '$usuario', '$senhaHash', $nivelAcesso)";
    $result_insert = mysqli_query($conexao, $sql_insert);

    if ($result_insert) {
        $response = array('success' => true, 'message' => 'Usuário cadastrado com sucesso');
        echo json_encode($response);
    } else {
        $response = array('success' => false, 'message' => 'Erro ao cadastrar usuário');
        echo json_encode($response);
    }

    mysqli_close($conexao);
} else {
    $response = array('success' => false, 'message' => 'Método inválido');
    echo json_encode($response);
}
?>
