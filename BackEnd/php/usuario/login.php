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
    $usuario = $_POST['usuario'];
    $senha = $_POST['senha'];

    // Conexão com o banco de dados
    $conexao = conectarBancoDeDados();

    // Verificar se o usuário existe
    $sql_check = "SELECT usuario, senha, nome FROM usuarios WHERE usuario = '$usuario'";
    $result_check = mysqli_query($conexao, $sql_check);
    $row_check = mysqli_fetch_assoc($result_check);

    if ($row_check && password_verify($senha, $row_check['senha'])) {
        $response = array(
            'success' => true,
            'message' => 'Login bem-sucedido',
            'usuarioValido' => $row_check['nome']
            
        );
        echo json_encode($response);
    } else {
        $response = array('success' => false, 'message' => 'Usuário ou senha incorretos');
        echo json_encode($response);
    }

    // Fechar a conexão com o banco de dados
    mysqli_close($conexao);
} else {
    $response = array('success' => false, 'message' => 'Método inválido');
    echo json_encode($response);
}
?>
