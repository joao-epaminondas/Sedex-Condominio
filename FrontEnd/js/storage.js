function getCurrentPage() {
   var path = window.location.pathname;
   var pageName = path.split("/").pop().replace(".html", "");
   return pageName;
}
var GLOBAL = (function() {
   function isLogged() {
      var logged = JSON.parse(localStorage.getItem('usuario'));
      return logged && logged.logado === true;
   }

   function verificaAlteracaoNome() {
      const usuarioJSON = localStorage.getItem('usuario');
      if (usuarioJSON) {
         const mudado = JSON.parse(usuarioJSON);
         if (mudado) {
            logout();
         }
      }
   }

   function logout() {
      localStorage.removeItem('usuario');
      window.location.href = '../index.html';
   }

   function handleStorageEvent(event) {
      if (event.originalEvent.key === 'usuario') {
         if (!isLogged()) {
            window.location.href = '../index.html';
         }
         verificaAlteracaoNome();
      }
   }

   function verificaConexao() {
      if (navigator.onLine) {
         $("#connection-status").removeClass("offline");
         $("#connection-status").addClass("online");
         $("#connection-status").append("<i class='fas fa-wifi' id='online'></i>");
         $("#offline").remove();
         $("#menu2").slideUp(500);
      } else {
         $("#connection-status").removeClass("online");
         $("#connection-status").addClass("offline");
         $("#connection-status").append("<i class='fas fa-times' id='offline'></i>");
         $("#online").remove();
         $("#menu2").slideDown(500);
      }
   }
   return {
      init: function() {
         $(window).on('storage', handleStorageEvent);
         $(document).ready(function() {
            verificaConexao();
            window.addEventListener('online', verificaConexao);
            window.addEventListener('offline', verificaConexao);
            $("#btn-logout").click(logout);
         });
      },
   };
})();
var INDEX = (function() {
   function getCountUsers() {
      $.ajax({
         type: "POST",
         url: "./BackEnd/php/usuario/verifica_user.php",
         success: function(response) {
            var pillsLogin = $("#pills-login");
            var pillsCadastro = $("#pills-cadastro");
            if (!response || response === "" || response === "0") {
               pillsLogin.remove();
            } else {
               pillsCadastro.remove();
            }
            $(".pills-tabContent").show();
         }
      });
   }

   function login() {
      var usuario = $('#usuario').val();
      var senha = $('#senha').val();
      $.ajax({
         url: './BackEnd/php/usuario/login.php',
         type: 'POST',
         data: {
            usuario: usuario,
            senha: senha
         },
         dataType: 'json',
         success: function(response) {
            if (response.success) {
               handleValidLogin(response.usuarioValido);
            } else {
               showError("Usuario e/ou Senha Incorretos");
            }
         },
         error: function() {
            showError("Erro ao processar a requisição");
         }
      });
   }

   function register() {
      var nome = $('#cad_nome').val();
      var usuario = $('#cad_usuario').val();
      var senha = $('#cad_senha').val();
      $.ajax({
         url: './BackEnd/php/usuario/register.php',
         type: 'POST',
         data: {
            nome: nome,
            usuario: usuario,
            senha: senha
         },
         dataType: 'json',
         success: function(response) {
            if (response.success) {
               location.reload();
            } else {
               showError(response.message);
            }
         },
         error: function() {
            showError("Erro ao processar a requisição");
         }
      });
   }

   function handleValidLogin(usuarioValido) {
      if (usuarioValido !== undefined && usuarioValido !== null) {
         var logado = {
            nome: usuarioValido,
            logado: true
         };
         localStorage.setItem('usuario', JSON.stringify(logado));
         window.location.href = './pages/workspace.html';
      } else {
         showError("Usuario ou Senha Incorretos");
      }
   }

   function showError(message) {
      $('.error-menu').text(message).show(500).delay(2000).hide(500);
   }
   return {
      init: function() {
         getCountUsers();
         var logged = JSON.parse(localStorage.getItem('usuario'));
         if (logged && logged.logado === true) {
            window.location.href = './pages/workspace.html';
         }
         $(document).ready(function() {
            $("#btn-login").click(login);
            $("#btn-register").click(register);
            $("#senha").keypress(function(event) {
               if (event.keyCode === 13) {
                  login();
               }
            });
         });
      }
   };
})();
var WORKSPACE = (function() {
   function enableScrollForNumericInput(inputElement) {
      inputElement.addEventListener("input", function() {
         const currentValue = parseFloat(inputElement.value);
         // Verifica se o valor é negativo, se for, ajusta para vazio
         if (isNaN(currentValue) || currentValue < 0) {
            inputElement.value = '';
         }
      });
      inputElement.addEventListener("wheel", function(event) {
         event.preventDefault();
         const step = parseFloat(inputElement.step) || 1;
         const currentValue = parseFloat(inputElement.value);
         // Calcula o novo valor após a rolagem
         const newValue = isNaN(currentValue) ? 1 : currentValue + (event.deltaY > 0 ? -step : step);
         // Impede que o valor seja negativo e ajusta para vazio se atingir zero
         inputElement.value = Math.max(newValue, 0) !== 0 ? newValue : '';
      });
   }
   return {
      init: function() {
         const numerorua = document.getElementById("numerorua");
         enableScrollForNumericInput(numerorua);
         const cxp = document.getElementById("cxp");
         enableScrollForNumericInput(cxp);
         $('input[type="text"]').attr({
            inputmode: 'textCapCharacters',
            autocapitalize: 'characters'
         });
         var logged = JSON.parse(localStorage.getItem('usuario'));
         if (logged && logged.logado === false) {
            window.location.href = '../index.html';
         }
      },
   };
})();
var NOTFOUND404 = (function() {
   return {
      init: function() {
         window.location.href = './index.html';
      },
   };
})();
$(document).ready(function() {
   var currentPage = getCurrentPage();
   if (currentPage === "index") {
      GLOBAL.init();
      INDEX.init();
   } else if (currentPage === "workspace") {
      GLOBAL.init();
      WORKSPACE.init();
   } else {
      GLOBAL.init();
      NOTFOUND404.init();
   }
})