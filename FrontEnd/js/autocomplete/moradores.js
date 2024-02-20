var nomes = [
  {
    "nome": "Ana Silva",
    "endereco": "Rua1, 1",
    "cxp": 57
  },
  {
    "nome": "Antonio Oliveira",
    "endereco": "Rua1, 2",
    "cxp": 23
  },
  {
    "nome": "Amanda Pereira",
    "endereco": "Rua1, 3",
    "cxp": 89
  },
  {
    "nome": "Alexandre Souza",
    "endereco": "Rua1, 4",
    "cxp": 42
  },
  {
    "nome": "Adriana Santos",
    "endereco": "Rua1, 5",
    "cxp": 75
  },
  {
    "nome": "Bruno Costa",
    "endereco": "Rua2, 1",
    "cxp": 13
  },
  {
    "nome": "Beatriz Pereira",
    "endereco": "Rua2, 2",
    "cxp": 68
  },
  {
    "nome": "Bianca Lima",
    "endereco": "Rua2, 3",
    "cxp": 31
  },
  {
    "nome": "Bernardo Oliveira",
    "endereco": "Rua2, 4",
    "cxp": 94
  },
  {
    "nome": "Barbara Costa",
    "endereco": "Rua2, 5",
    "cxp": 55
  },
  {
    "nome": "Carlos Santos",
    "endereco": "Rua3, 1",
    "cxp": 82
  },
  {
    "nome": "Camila Souza",
    "endereco": "Rua3, 2",
    "cxp": 47
  },
  {
    "nome": "Cristiano Silva",
    "endereco": "Rua3, 3",
    "cxp": 19
  },
  {
    "nome": "Carolina Lima",
    "endereco": "Rua3, 4",
    "cxp": 73
  },
  {
    "nome": "Cesar Oliveira",
    "endereco": "Rua3, 5",
    "cxp": 36
  },
  {
    "nome": "Daniel Silva",
    "endereco": "Rua4, 1",
    "cxp": 61
  },
  {
    "nome": "Daniela Costa",
    "endereco": "Rua4, 2",
    "cxp": 28
  },
  {
    "nome": "Diego Oliveira",
    "endereco": "Rua4, 3",
    "cxp": 87
  },
  {
    "nome": "Diana Lima",
    "endereco": "Rua4, 4",
    "cxp": 50
  },
  {
    "nome": "Douglas Santos",
    "endereco": "Rua4, 5",
    "cxp": 11
  },
  {
    "nome": "Eduardo Costa",
    "endereco": "Rua5, 1",
    "cxp": 64
  },
  {
    "nome": "Evelyn Silva",
    "endereco": "Rua5, 2",
    "cxp": 25
  },
  {
    "nome": "Elias Oliveira",
    "endereco": "Rua5, 3",
    "cxp": 79
  },
  {
    "nome": "Elaine Souza",
    "endereco": "Rua5, 4",
    "cxp": 44
  },
  {
    "nome": "Eric Lima",
    "endereco": "Rua5, 5",
    "cxp": 7
  },
  {
    "nome": "Fernando Santos",
    "endereco": "Rua6, 1",
    "cxp": 69
  },
  {
    "nome": "Franciele Costa",
    "endereco": "Rua6, 2",
    "cxp": 32
  },
  {
    "nome": "Fabio Silva",
    "endereco": "Rua6, 3",
    "cxp": 85
  },
  {
    "nome": "Flavia Oliveira",
    "endereco": "Rua6, 4",
    "cxp": 48
  },
  {
    "nome": "Felipe Lima",
    "endereco": "Rua6, 5",
    "cxp": 15
  }
];

  var input = document.getElementById("destinatario");
    new Awesomplete(input, {
        list: nomes.map(function(nome) {
            return nome.nome;
        }),
        minChars: 1,
        maxItems: 5
    });

  var input2 = document.getElementById("morador");
    new Awesomplete(input2, {
        list: nomes.map(function(nome) {
            return nome.nome;
        }),
        minChars: 1,
        maxItems: 5
    });

function procurarEndereco(destinatario) {
  for (var i = 0; i < nomes.length; i++) {
    if (nomes[i].nome === destinatario) {
      var enderecoCompleto = nomes[i].endereco;
      var enderecoPartes = enderecoCompleto.split(", ");
      var cxp = nomes[i].cxp;

      if (enderecoPartes.length === 2) {
        var rua = enderecoPartes[0];
        var numerorua = enderecoPartes[1];
        return { rua: rua, numerorua: numerorua, cxp: cxp };
      }
    }
  }
  return null;
}

function preencherEndereco() {
  var destinatario = document.getElementById("destinatario").value;
  var enderecoSelect = document.getElementById("rua");
  var numeroruaInput = document.getElementById("numerorua");
  var cxp = document.getElementById("cxp");

  var enderecoObj = procurarEndereco(destinatario);

  if (enderecoObj !== null) {
    enderecoSelect.value = enderecoObj.rua;
    numeroruaInput.value = enderecoObj.numerorua;
    cxp.value = enderecoObj.cxp;
  } else {
    enderecoSelect.value = "";
    numeroruaInput.value = "";
    cxp.value = "";
  }
}