<?php
// Verifica se há dados enviados pelo JavaScript através da requisição POST
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["sedexData"])) {
  $sedexData = $_POST["sedexData"];

  // Decodifica a string JSON em um array associativo no PHP
  $data = json_decode($sedexData, true);

  // Faça o que quiser com os dados no PHP, por exemplo, salvar no banco de dados

  // Envia uma resposta de volta para o JavaScript (opcional)
  $response = ["status" => "success", "message" => "Dados recebidos com sucesso no PHP!"];
  echo json_encode($response);
} else {
  // Caso não haja dados recebidos
  echo "Nenhum dado recebido.";
}
?>