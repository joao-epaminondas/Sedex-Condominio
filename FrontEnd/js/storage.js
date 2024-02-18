

  $(window).on('storage', function(event) {
    function islogged() {
    var logged = JSON.parse(localStorage.getItem('usuario'));
    if (logged && logged.logado === true) {
      return true;
    } else {
      window.location.href = '../index.html';
      return false;
    }
  }
    if (event.originalEvent.key === 'usuario') {
      islogged();
    }
  });

  $(window).on('storage', function(event) {
  if (event.key === 'usuario') {
    verificaAlteracaoNome();
  }
});


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

function login() {
                var usuario = $('#usuario').val();
                var senha = $('#senha').val();

                $.ajax({
                    url: '../BackEnd/php/usuario/login.php',
                    type: 'POST',
                    data: { usuario: usuario, senha: senha },
                    dataType: 'json',
                    success: function(response) {
                        if (response.success) {
                            
                            console.log(response.usuarioValido);

                            if (response.usuarioValido !== undefined && response.usuarioValido !== null) {
                                var logado = {
                                    nome: response.usuarioValido,
                                    logado: true
                                };
                                localStorage.setItem('usuario', JSON.stringify(logado));
                                window.location.href = './pages/cadastroSedex.html';
                            } else {
                                alert('Nome de usuário ou senha inválidos!');
                            }


                            $('#mensagem').text(response.message).css('color', 'green');
                        } else {
                            alert("senha ou usuario incorreto");
                            $('#mensagem').text(response.message).css('color', 'red');
                        }
                    },
                    error: function() {
                        $('#mensagem').text('Erro ao processar a requisição').css('color', 'red');
                    }
                });
}




function register() {
            var nome = $('#nome').val();
            var usuario = $('#usuario').val();
            var senha = $('#senha').val();

            $.ajax({
                url: '../BackEnd/php/usuario/register.php',
                type: 'POST',
                data: { nome: nome, usuario: usuario, senha: senha },
                dataType: 'json',
                success: function(response) {
                    if (response.success) {

                        $('#mensagem').text(response.message).css('color', 'green');
                        $('#nome').val('');
                        $('#usuario').val('');
                        $('#senha').val('');

                        // Atualizar a URL sem os parâmetros
                        history.pushState(null, null, window.location.href.split('?')[0]);
                    } else {
                        $('#mensagem').text(response.message).css('color', 'red');
                    }
                },
                error: function() {
                    $('#mensagem').text('Erro ao processar a requisição').css('color', 'red');
                }
            });
        }