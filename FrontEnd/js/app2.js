$(document).ready(function() {
   var data;
   const total_numero_sedex = 150;

   function displayData(records) {
      var buttoncontainer = $("#button-container2");
      buttoncontainer.empty();
      var blockHtml = '';
      var blockCount = 0;
      for (var i = 0; i < total_numero_sedex; i++) {
         var record = records.find(function(item) {
            return item.numeroSedex === (i + 1).toString();
         });
         var blockClass = "block-yellow";
         if (record) {
            if (record.retirado === "0") {
               blockClass = "block-green";
            } else if (record.retirado === "1") {
               blockClass = "block-red";
            } else {
               blockClass = "block-yellow";
            }
         }
         var displayIndex = i + 1;
         if (blockClass !== "block-yellow" || $("#inputSearch").val() === "") {
            blockHtml += '<button id="' + (record ? record.id : 'noid') + '" class="sedex-button block btn ' + blockClass + ' btn-custom-large2" data-toggle="modal" data-target="#myModal4" data-record-index="' + (i + 1) + '">' + displayIndex.toString().padStart(3, '0') + '</button>';
            blockCount++;
         }
      }
      buttoncontainer.html(blockHtml);
      if (blockCount == 2) {
         $(".btn-custom-large2").css("width", "45%");
      } else if (blockCount == 1) {
         $(".btn-custom-large2").css("width", "100%");
      }
   }

   function filterData(searchTerm) {
      searchTerm = searchTerm.trim();
      var filteredData = data.filter(function(record) {
         var enderecoCompleto = (record.rua + ' ' + record.numerorua);
         var startsWithNumber = /^\d+/.test(searchTerm);
         var descricaoMatch = record.descricao === searchTerm;
         var destinatarioMatch = record.destinatario.includes(searchTerm);
         if (searchTerm.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            var parts = searchTerm.split('/');
            var searchData = parts[2] + '-' + parts[1] + '-' + parts[0];
            // Verificar se record.data está definido antes de usar includes
            var dataMatch = record.data_entrada && record.data_entrada.includes(searchData);
         } else {
            var dataMatch = false; // Se não for uma data válida, não considerar data na pesquisa
         }
         return (descricaoMatch || destinatarioMatch || (enderecoCompleto.includes(searchTerm) && !startsWithNumber) || (startsWithNumber ? record.numeroSedex === searchTerm : false) || dataMatch);
      });
      displayData(filteredData);
   }
   $("#btnSearch").click(function() {
      var searchTerm = $("#inputSearch").val();
      if (searchTerm.trim() === "") {
         displayData(data);
      } else {
         filterData(searchTerm);
      }
   });
   var data = [];

   function getAllData() {
      $.ajax({
         url: '../BackEnd/php/workspace/app2.php',
         type: 'GET',
         dataType: 'json',
         success: function(response) {
            var newData = response.dados;
            if (!isDataEqual(data, newData)) {
               data = newData;
               displayData(data);
            }
         },
         error: function(xhr, status, error) {},
         complete: function() {
            setTimeout(getAllData, 1000);
         }
      });
   }

   function isDataEqual(data1, data2) {
      if (data1.length !== data2.length) {
         return false;
      }
      for (var i = 0; i < data1.length; i++) {
         if (JSON.stringify(data1[i]) !== JSON.stringify(data2[i])) {
            return false;
         }
      }
      return true;
   }
   getAllData();
   $('#myModal4').on('show.bs.modal', function(event) {
      var button = $(event.relatedTarget);
      var sedexNumber = button.data('record-index');
      var record = data.find(function(item) {
         return item.numeroSedex === sedexNumber.toString();
      });
      displayModalData(record);
   });
});

function displayModalData(record) {
   $("#modalimg2").attr("src", "#");
   var caminhoRelativo = record.url_img_assinatura.replace('C:/wamp64/www/Projeto_Sedex/FrontEnd', '../FrontEnd');
   $("#modalNumeroSedex2").text(record.numeroSedex.toString().padStart(3, '0'));
   $("#modalDestinatario2").text("Destinatário: " + record.destinatario);
   $("#modalRua2").text("Endereço: " + record.rua + ", " + record.numerorua);
   $("#modalCXP2").text("Caixa Postal: " + record.cxp);
   $("#modalDescricao2").text("Descrição: " + record.descricao);
   $("#myModal4").attr('data-modal', record.id);
   var e = record.data_entrada;
   var e2 = record.data_saida;
   var parts = e.split("-");
   var parts2 = e2.split("-");
   var data_entrada = parts[2] + "/" + parts[1] + "/" + parts[0];
   var data_saida = parts2[2] + "/" + parts2[1] + "/" + parts2[0];
   if (record.retirado == 0) {
      $("#darBaixaButton1").show();
      $("#modalentrada_funcionario2").text("Entrada: " + record.entrada_funcionario + ' -> ' + data_entrada + ' às ' + record.hora_entrada);
      if (record.saida_funcionario === "-") {
         $("#modalsaida_funcionario2").text("Saida: " + record.saida_funcionario);
      } else {
         $("#modalsaida_funcionario2").text("Saida: " + record.saida_funcionario + " -> " + data_saida + " ÀS " + record.hora_saida);
      }
   } else {
      $("#darBaixaButton1").hide();
      $("#modalentrada_funcionario2").text("Entrada: " + record.entrada_funcionario + ' - ' + data_entrada + ' às ' + record.hora_entrada);
      if (record.saida_funcionario === "-") {
         $("#modalsaida_funcionario2").text("Saida: " + record.saida_funcionario);
      } else {
         $("#modalsaida_funcionario2").text("Saida: " + record.saida_funcionario + " -> " + data_saida + " ÀS " + record.hora_saida);
      }
   }
   $("#modalimg2").attr("src", caminhoRelativo);
}
$("#btnDarBaixa").click(function() {
   toggleBaixaForm();
});
$("#darBaixaButton1").click(function() {
   $("#darBaixaButton1").hide();
   $("#d-sedex").hide();
   $("#mf-info").hide();
   $("#clear-button2").show(500);
   $("#c-sedex").show(500);
   $("#mf-baixa").show(500);
   $("#back4").html("<i class='fas fa-arrow-left'></i> Voltar para Sedex");
   $("#back4").removeAttr('data-dismiss');
   $("#back4").attr('id', 'back5');
});
$(document).on('click', '#back5', function() {
   $("#darBaixaButton1").show(500);
   $("#d-sedex").show(500);
   $("#mf-info").show(500);
   $("#clear-button2").hide();
   $("#c-sedex").hide();
   $("#mf-baixa").hide();
   $("#back5").html("<i class='fas fa-arrow-left'></i> Voltar para o formulário");
   $("#back5").attr('data-dismiss', 'modal');
   $("#back5").attr('id', 'back4');
});

function consulta() {
   $(document).ready(function() {
      $.ajax({
         url: '../BackEnd/php/workspace/consultaNumerosSedex.php',
         type: 'GET',
         dataType: 'json',
         success: function(response) {
            var numerosOcupados = response;
            var selectNumeroSedex = $("#numeroSedex");
            for (var i = 1; i <= total_numero_sedex; i++) { // Modifique o limite conforme necessário
               if (!numerosOcupados.includes(i)) {
                  selectNumeroSedex.append("<option value='" + i + "'>" + i + "</option>");
               }
            }
         },
         error: function(xhr, status, error) {
            $(".error-menu").text("Erro no Servior").show(500);
            setTimeout(function() {
               $(".error-menu").hide(500);
            }, 2000);
         }
      });
   });
}

function inserir2() {
   if (signaturePad2.isEmpty()) {
      alert("Assinatura está vazia.");
      return;
   }
   var url_img_assinatura = signaturePad2.toDataURL();
   var retirado = 1;
   var jsonString = localStorage.getItem('usuario');
   var jsonObject = JSON.parse(jsonString);
   var saida_funcionario = jsonObject.nome;
   var data_saida = dataAtual;
   var hora_saida = horaatual;
   var id_sedex = $('#myModal4').data('modal');
   var informacoes = localStorage.getItem('informacoes_app2') || '[]';
   var informacoesArray = JSON.parse(informacoes);
   var sedexExistente = informacoesArray.some(function(record) {
      return record.id === id_sedex;
   });
   if (sedexExistente) {
      $(".error-menu").text("Já existe um registro com esse número de Sedex").show(500);
      setTimeout(function() {
         $(".error-menu").hide(500);
      }, 2000);
      return;
   }
   var informacao = {
      id: id_sedex,
      saida_funcionario: saida_funcionario,
      data_saida: data_saida,
      hora_saida: hora_saida,
      retirado: retirado,
      url_img_assinatura: url_img_assinatura,
   };
   informacoesArray.push(informacao);
   localStorage.setItem('informacoes_app2', JSON.stringify(informacoesArray));
   salvarDadosNoServidor2(informacao, function(response) {
      if (response.success) {} else {
         // Exibir mensagem de erro
         $(".error-menu").text(response.message).show(500);
         setTimeout(function() {
            $(".error-menu").hide(500);
         }, 2000);
      }
   });
   fecharLote2();
}

function salvarDadosNoServidor2(data, callback) {
   console.log(data);
   $.ajax({
      url: '../BackEnd/php/workspace/app2.php',
      type: 'PUT',
      data: JSON.stringify(data),
      dataType: 'json',
      success: function(response) {
         $("#modalimg2").attr("src", "#");
         callback(response);
         $(".success-ass").show(500);
         setTimeout(function() {
            $(".success-ass").hide(500);
         }, 2000);
      },
      error: function(xhr, status, error) {
         $(".error-menu").text("Erro ao Salvar Informações").show(500);
         setTimeout(function() {
            $(".error-menu").hide(500);
         }, 2000);
      }
   });
}

function fecharLote2() {
   $("#back5").click();
   var informacoesArray = JSON.parse(localStorage.getItem('informacoes_app2') || '[]');
   informacoesArray.forEach(function(registro) {
      salvarDadosNoServidor2(registro, function(response) {});
   });
   localStorage.removeItem('informacoes_app2');
}

$(document).ready(function(){
   $("#btnSearch").click();
})
