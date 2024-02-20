function repor_nsedex() {
   var xhr = new XMLHttpRequest();
   xhr.open("GET", "../BackEnd/php/workspace/app4.php", true);
   xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
         if (xhr.status === 200) {
            var resultado = xhr.responseText;
            if (resultado != "") {
               $(".success-menu").text(resultado).show(500);
               setTimeout(function() {
                  $(".success-menu").hide(500);
               }, 2000);
            } else {
               $(".error-menu").text("Não há Numeros Sedex Ocupados").show(500);
               setTimeout(function() {
                  $(".error-menu").hide(500);
               }, 2000);
            }
         } else {
            $(".error-menu").text("Erro no Servior").show(500);
            setTimeout(function() {
               $(".error-menu").hide(500);
            }, 2000);
         }
      }
   };
   xhr.send();
}
const dadosSessionStorage = JSON.parse(localStorage.getItem('usuario'));
// Verifique se os dados existem e se a propriedade 'nome' está definida
if (dadosSessionStorage && dadosSessionStorage.nome) {
   const nome = dadosSessionStorage.nome;
   $("#usuario_logado").text(nome);
} else {
   console.log('Nenhum nome encontrado no sessionStorage.');
}

function informacoes() {
   localStorage.removeItem("status-pagina");
}