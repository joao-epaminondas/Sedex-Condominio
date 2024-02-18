
var loteAtual = 1;
var numeroLote = getNumeroLoteFromLocalStorage();
var itemsPerPage = 10;


window.addEventListener('storage', function (event) {
    if (event.key === 'informacoes') {
      obterNumerosSedexOcupadoslocal();
      obterNumerosSedexOcupados();
      $('tr').remove();
    }
  });


//iniciando pagina
$(document).ready(function() {
    obterNumerosSedexOcupados();
    listarDadosDoServidor(1);
});

//botao toggle exibir/ocultar form
$(document).ready(function() {
    $("#btnOcultarForm").click(function() {
        $("#sedexForm").toggle();
        $("#btnIcon").toggleClass("fa-chevron-up fa-chevron-down");
    });
});

//checkbox para exibir modal da assinatura
document.addEventListener("DOMContentLoaded", function() {
    const checkbox = document.getElementById("check1");

    checkbox.addEventListener("change", function() {
        if (this.checked) {
            $("#div_assinar1").modal('show');
            
        } else {
            $("#div_assinar1").modal('hide');
        }
    });
});

//botao para sair modal da assinatura
$('#back-button').on('click', function() {
    $('#div_assinar1').modal('hide');
    document.getElementById("check1").checked = false;
});

//-----------------------------------------------------------------------

//iniciando pagina
window.onload = function() {
    var entrada_funcionario = document.getElementById('entrada_funcionario');
    atualizarCampo();
    setInterval(atualizarCampo, 1000);
}

function limpaform(){
    $('#destinatario').val('');
    $('#rua').val('');
    $('#numerorua').val('');
    $('#cxp').val('');
    $('#descricao').val('');
    clearCanva();
}



//Serve para formatar valor do campo Entrada
function atualizarCampo() {
    var informacoesSalvasUsuarios = JSON.parse(localStorage.getItem('usuario'));
    var entrada_funcionario = document.getElementById('entrada_funcionario');
    entrada_funcionario.value = informacoesSalvasUsuarios.nome + " -> " + dataview() + " às " + horaAtualFormatada();
}



//função para inserir informações previamente no localstorage
function inserir() {
    var destinatario = document.getElementById('destinatario').value;
    var rua = document.getElementById('rua').value;
    var numerorua = document.getElementById('numerorua').value;
    var cxp = document.getElementById('cxp').value;
    var numeroSedex = document.getElementById('numeroSedex').value;
    var descricao = document.getElementById('descricao').value;
    var entrada = document.getElementById('entrada_funcionario').value;
    var entrada_funcionario =  entrada.split(' ')[0];

    if (signaturePad1.isEmpty()) {
      var url_img_assinatura = 'C:/wamp64/www/Projeto Sedex/FrontEnd/img/sem-imagem.png';
      var retirado = 0;
      var saida_funcionario =  "-";
      var data_saida = "";
      var hora_saida = "";
    }
    else{
      var url_img_assinatura = signaturePad1.toDataURL();
      var retirado = 1;
      var saida = document.getElementById('entrada_funcionario').value;
      var saida_funcionario =  saida.split(' ')[0];
      var data_saida = dataAtual;
      var hora_saida = horaatual;
    }
    
    var lote = "lote_" + loteAtual;

    var informacoes = localStorage.getItem('informacoes');
    if (informacoes) {
        informacoes = JSON.parse(informacoes);
        var sedexExistente = informacoes.some(function(record) {
            return record.numeroSedex === numeroSedex;
        });
        if (sedexExistente) {
            alert("Número de Sedex já existente. Não é possível inserir o registro.");
            return;
        }
    } else {
        informacoes = [];
    }
    var informacao = {
        destinatario: destinatario,
        rua: rua,
        numerorua: numerorua,
        cxp: cxp,
        numeroSedex: numeroSedex,
        descricao: descricao,
        entrada_funcionario: entrada_funcionario,
        saida_funcionario: saida_funcionario,
        data_entrada: dataAtual,
        hora_entrada: horaatual,
        data_saida: data_saida,
        hora_saida: hora_saida,
        retirado: retirado,
        url_img_assinatura: url_img_assinatura,
        lote: lote
    };
    informacoes.push(informacao);
    localStorage.setItem('informacoes', JSON.stringify(informacoes));
    limpaform();
    obterNumerosSedexOcupadoslocal();
    listarDadosDoServidor(1);
}

//funcao para verificar condiçoes antes de salvar no servidor
function fecharLote() {
    var informacoes = localStorage.getItem('informacoes');
    if (!informacoes) {
        $(".lote-menu").show(500);
            setTimeout(function() {
                $(".lote-menu").hide(500);
            }, 2000);
        $("#gerartable").empty();
        return;
    }
    informacoes = JSON.parse(informacoes);
    for (var i = 0; i < informacoes.length; i++) {
        var registro = informacoes[i];
        registro.lote = "lote_" + numeroLote + "_" + dataAtualFormatada();
        salvarDadosNoServidor(registro, function() {
        });
    }
    
}

//funcao para inserir informações definitivamente no banco de dados
function salvarDadosNoServidor(data, successCallback) {
    $.ajax({
        url: '../BackEnd/php/app1.php',
        type: 'POST',
        data: data,
        success: function(response) {
            if (response.success) {
                numeroLote++;
                localStorage.setItem('numeroLote', numeroLote);
                localStorage.removeItem('informacoes');
                $("#gerartable").empty();
                successCallback();
                limpaform();
                $('label').addClass('piscar-azul');
                setTimeout(function() {
                    $('label').removeClass('piscar-azul');
                }, 4000);
                $(".success-menu").show(500);
                setTimeout(function() {
                    $(".success-menu").hide(500);
                }, 2000);
            } else {
               
                $(".error-menu").text(response.message).show(500);
                setTimeout(function() {
                    $(".error-menu").hide(500);
                }, 2000);
            }
        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText);
            console.log(status);
            console.log(error);
            $(".error-menu").show(500);
            setTimeout(function() {
                $(".error-menu").hide(500);
            }, 2000);
        }
    });
}

//funcao para retornar informações do banco de dados
function listarDadosDoServidor(paginaAtual) {
    var informacoes = localStorage.getItem('informacoes');

    if (!informacoes) {
        return;
    }

    informacoes = JSON.parse(informacoes);

     // Number of items to display per page
    var currentPage = paginaAtual || 1; // Use the provided page or default to 1

    var startIndex = (currentPage - 1) * itemsPerPage;
    var endIndex = Math.min(startIndex + itemsPerPage, informacoes.length);

    var theadRow = $("<tr>");

    if (isMobileDevice()) {
        theadRow.append($("<th>").html("Nº Sedex"), $("<th>").html("Destinatário"));
    } else {
        theadRow.append(
            $("<th>").html("Nº Sedex"),
            $("<th>").html("Destinatário"),
            $("<th>").html("Endereço"),
            $("<th>").html("Ações") // For buttons on PC
        );
    }

    var thead = $("<thead>").addClass("table-dark").append(theadRow);
    var tbody = $("<tbody>");

    for (var i = startIndex; i < endIndex; i++) {
        var record = informacoes[i];
        var row = $("<tr>").addClass("dinamica").attr("id", "sedex_" + record.numeroSedex)
                    .attr("data-toggle", "modal")
                    .attr("data-target", "#myModal3")
                    .attr("data-destinatario", record.destinatario)
                    .attr("data-rua", record.rua)
                    .attr("data-numeroRua", record.numerorua)
                    .attr("data-cxp", record.cxp)
                    .attr("data-numeroSedex", record.numeroSedex)
                    .attr("data-descricao", record.descricao)
                    .attr("data-entrada_funcionario", record.entrada_funcionario)
                    .attr("data-saida_funcionario", record.saida_funcionario)
                    .attr("data-data_entrada", record.data_entrada)
                    .attr("data-hora_entrada", record.hora_entrada)
                    .attr("data-data_saida", record.data_saida)
                    .attr("data-hora_saida", record.hora_saida)
                    .attr("data-retirado", record.retirado)
                    .attr("data-img", record.url_img_assinatura);

        if (isMobileDevice()) {
            mobile(row, record);
        } else {
            pc(row, record);
        }

        tbody.append(row);
    }

     var table = $("<table>").addClass("table table-striped table-bordered table-responsive t1");
    table.append(thead, tbody);

    var totalPages = Math.ceil(informacoes.length / itemsPerPage);

    // Create the table footer with pagination buttons
    var tfoot = $("<tfoot>").append(
        $("<tr>").append(
            $("<td>").attr("colspan", isMobileDevice() ? 2 : 4).append(
                generatePaginationButtons(totalPages, currentPage)
            )
        )
    );

    table.append(tfoot);

    $("#gerartable").empty().append(table);

    if (isMobileDevice()) {
        $(".dinamica").click(function() {
            var sedex = $(this).attr("id").replace("sedex_", "");
            console.log(sedex);
            $("#myModal3").modal("show");
        });

        $(".dinamica").on("touchstart", function(event) {
            var touchStartX = event.originalEvent.touches[0].clientX;
            var row = $(this);

            $(this).on("touchmove", function(event) {
                var touchMoveX = event.originalEvent.touches[0].clientX;
                var deltaX = touchMoveX - touchStartX;

                if (deltaX > 0) {
                    row.css("transform", "translateX(" + deltaX + "px)");
                    $("body").css("overflow", "hidden");
                }
            });

            $(this).on("touchend", function(event) {
                var touchEndX = event.changedTouches[0].clientX;
                var deltaX = touchEndX - touchStartX;

                if (deltaX > 100) {
                    var id = $(this).attr("id").replace("sedex_", "");
                    var respostaConfirmacao = confirm("Tem certeza que deseja excluir este registro?");
                    if (respostaConfirmacao) {
                        excluirRegistro(id);
                        $('#sedex_' + id).remove();

                    }
                }

                row.css("transform", "");
                $("body").css("overflow", "");
                $(this).off("touchmove touchend");
            });
        });
    } else {
        // For desktop version, attach click handlers to buttons
        $(".dinamica").on("click", ".btn-excluir", function() {
            var id = $(this).data("id");
            var respostaConfirmacao = confirm("Tem certeza que deseja excluir este registro?");
            if (respostaConfirmacao) {
                excluirRegistro(id);
                $('#sedex_' + id).remove();
                
            }
        });

        // ... Add similar click handlers for other buttons
    }
}

function generatePaginationButtons(totalPages, currentPage) {
    var paginationContainer = $("<div>").addClass("pagination-container");

    for (var i = 1; i <= totalPages; i++) {
        var pageButton = $("<button>")
            .text(i)
            .addClass("btn btn-pagination")
            .toggleClass("active", i === currentPage)
            .on("click", function() {
                var newPage = parseInt($(this).text());
                listarDadosDoServidor(newPage);
            });

        paginationContainer.append(pageButton);
    }

    return paginationContainer;
}

//funcao para excluir registros do localstorage
function excluirRegistro(id) {
    var informacoes = localStorage.getItem('informacoes');

    if (!informacoes) {
        console.log("Nenhum registro encontrado para excluir.");
        return;
    }

    informacoes = JSON.parse(informacoes);

    var indexToRemove = -1;
    for (var i = 0; i < informacoes.length; i++) {
        if (informacoes[i].numeroSedex === id) {
            indexToRemove = i;
            break;
        }
    }
    if (indexToRemove !== -1) {
        informacoes.splice(indexToRemove, 1);
        localStorage.setItem('informacoes', JSON.stringify(informacoes));
        listarDadosDoServidor();

    } else {
        console.log("Registro não encontrado para exclusão.");
    }
}



//-----------------------------------------------------------------------

$(document).on("click", ".btn-info, .dinamica", function() {
    var destinatario = $(this).data("destinatario");
    var rua = $(this).data("rua");
    var numeroRua = $(this).data("numerorua");
    var cxp = $(this).data("cxp");
    var numero = $(this).data("numerosedex");
    var numeroSedex = numero.toString().padStart(3, '0');
    var descricao = $(this).data("descricao");
    var entrada_funcionario = $(this).data("entrada_funcionario");
    var saida_funcionario = $(this).data("saida_funcionario");
    var e = $(this).data("data_entrada");
    var e2 = $(this).data("data_saida");
    var parts = e.split("-");
    var parts2 = e2.split("-");
    var data_entrada = parts[2] + "/" + parts[1] + "/" + parts[0];
    var data_saida = parts2[2] + "/" + parts2[1] + "/" + parts2[0];
    var hora_entrada = $(this).data("hora_entrada");
    var hora_saida = $(this).data("hora_saida");
    var retirado = $(this).data("retirado") ? "Sim" : "Não";
    var caminhoAbsoluto = $(this).data("img");
    var caminhoRelativo = caminhoAbsoluto.replace('C:/wamp64/www/Projeto Sedex/FrontEnd', '../FrontEnd');


    $("#modalDestinatario").text("Destinatário: " + destinatario);
    $("#modalRua").text("Endereço: " + rua + ", " + numeroRua);
    $("#modalCXP").text("Caixa Postal: " + cxp);
    $("#modalNumeroSedex").text(numeroSedex);
    $("#modalDescricao").text("Descrição: " + descricao);
    $("#modalentrada_funcionario").text("Entrada: " + entrada_funcionario +" -> "+ data_entrada +" ÀS "+ hora_entrada);
    if (saida_funcionario == "-") {
        $("#modalsaida_funcionario").text("Saida: " + saida_funcionario);
    }
    else{
        $("#modalsaida_funcionario").text("Saida: " + saida_funcionario +" -> "+ data_saida +" ÀS "+ hora_saida);
    }
    $("#modalimg").attr("src", caminhoRelativo);
    $("#myModal").modal("show");
});


//-----------------------------------------------------------------------

//verifica dimensoes de celular
function isMobileDevice() {
    return window.innerWidth <= 767;
}

function mobile(row, record) {
    row.append($("<td>").text(record.numeroSedex), $("<td>").text(reduzirTextoDestinatario(record.destinatario, 25)));
}

function pc(row, record) {
    row.append(
        $("<td>").text(record.numeroSedex),
        $("<td>").text(reduzirTextoDestinatario(record.destinatario, 25)),
        $("<td>").text(record.rua + ", " + record.numerorua),
        $("<td>").html(
            "<button class='btn btn-info btn-sm' data-toggle='modal' data-target='#myModal3' data-destinatario='" + record.destinatario + "' data-rua='" + record.rua + "' data-numeroRua='" + record.numerorua + "' data-cxp='" + record.cxp +"' data-numeroSedex='" + record.numeroSedex + "' data-descricao='" + record.descricao + "' data-entrada_funcionario='" + record.entrada_funcionario + "' data-data_entrada='" + record.data_entrada + "' data-hora_entrada='" + record.hora_entrada + "' data-retirado='" + record.retirado + "' data-img='" + record.url_img_assinatura + "'>Visualizar <i class='fas fa-eye'></i></button>" +
            " <span class='btn-separator'></span> " + // Add a separator or space
            "<button class='btn btn-danger btn-sm btn-excluir' data-id='" + record.id + "'>Excluir <i class='fas fa-trash-alt'></i></button>"
        )
    );
}

function obterNumerosSedexOcupadoslocal(){
    var numeroSedexInserido = document.getElementById('numeroSedex').value;
    $("#numeroSedex option[value='" + numeroSedexInserido + "']").remove();
}

function obterNumerosSedexOcupados() {
    $.ajax({
        url: '../BackEnd/php/consultaNumerosSedex.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            var numerosOcupados = response.dados;
            var selectNumeroSedex = $("#numeroSedex");
            
            var numerosInseridos = getNumerosSedexInseridos();
            selectNumeroSedex.empty();
            
            if (Array.isArray(numerosOcupados)) {
                for (var i = 0; i < numerosOcupados.length; i++) {
                    var numeroSedex = numerosOcupados[i];
                    if (numeroSedex !== '' && numerosInseridos.indexOf(numeroSedex) === -1) {
                        selectNumeroSedex.append("<option value='" + numeroSedex + "'>" + numeroSedex + "</option>");
                        
                    }
                }
                for (var i = 0; i < numerosInseridos.length; i++) {
                    var numero = parseInt(numerosInseridos[i]);
                    if (!isNaN(numero)) {
                        $("#numeroSedex option[value='" + numero + "']").remove();
                     }
                }

            } else {
                console.error('Resposta inválida do servidor: a propriedade "dados" não é uma matriz.');
            }
        },
        error: function(xhr, status, error) {
            console.error('Erro ao obter números de Sedex ocupados:', error);
        }
    });
}

function getNumerosSedexInseridos() {
    var informacoes = localStorage.getItem('informacoes');

    if (informacoes) {
        informacoes = JSON.parse(informacoes);
        return informacoes.map(function(record) {
            return record.numeroSedex;
            
        });
    }
    return [];
    
}

function getNumeroLoteFromLocalStorage() {
    var savedDate = localStorage.getItem('savedDate');
    var currentDate = dataAtualFormatada();

    if (savedDate !== currentDate) {
        localStorage.setItem('numeroLote', 1);
        localStorage.setItem('savedDate', currentDate);
    }

    var savedNumeroLote = localStorage.getItem('numeroLote');
    if (savedNumeroLote !== null) {
        return parseInt(savedNumeroLote);
    }
    return 1;
}
