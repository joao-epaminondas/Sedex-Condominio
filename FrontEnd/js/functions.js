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



$(document).ready(function() {
        verificaConexao();
        window.addEventListener('online', verificaConexao);
        window.addEventListener('offline', verificaConexao);

});



const menuItems = document.querySelectorAll('.menu-item');
const divDivs = document.querySelectorAll('.div');
const localStorageKey = 'status-pagina';

$(document).ready(function() {
    var inputs = $('input[type="text"], input[type="password"], input[type="email"]');

    inputs.on('input', function() {
        var uppercaseValue = $(this).val().toUpperCase();
        $(this).val(uppercaseValue);
    });
});

// Função para mostrar div com base no ID do botão
function showDiv(divId) {
    divDivs.forEach(div => div.classList.remove('active'));
    const activeDiv = document.getElementById(divId);
    if (activeDiv) {
        activeDiv.classList.add('active');
    }
}

// Restaurar o estado do menu, div e cor do localStorage
const savedState = localStorage.getItem(localStorageKey);
if (savedState) {
    const savedStateObj = JSON.parse(savedState);
    const activeButton = document.getElementById(savedStateObj.activeButtonId);
    if (activeButton) {
        activeButton.classList.add('active');
        showDiv(`div${savedStateObj.activeButtonId.slice(-1)}`);
        $('body').addClass(savedStateObj.activeColor);
    }
}

// Adicionar ouvintes de evento para salvar o estado no localStorage e controlar a exibição da div e cor
menuItems.forEach(item => {
    item.addEventListener('click', function() {
        menuItems.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
        showDiv(`div${this.id.slice(-1)}`);
        const activeColor = this.getAttribute('data-color');
        localStorage.setItem(localStorageKey, JSON.stringify({
            activeButtonId: this.id,
            activeColor: activeColor
        }));
        $('body').removeClass('cor-div1 cor-div2 cor-div3 cor-div4').addClass(activeColor);
    });
});

// Adicionar ouvintes de evento para controlar a exibição da div usando jQuery
$('#botao1').on('click', function() {
    $('#div1').show();
    $('#div2, #div3, #div4').hide();
});
$('#botao2').on('click', function() {
    $('#div2').show();
    $('#div1, #div3, #div4').hide();
});
$('#botao3').on('click', function() {
    $('#div3').show();
    $('#div1, #div2, #div4').hide();
});
$('#botao4').on('click', function() {
    $('#div4').show();
    $('#div1, #div2, #div3').hide();
});

//Serve para formatar data yy-mm-dd
function dataAtualFormatada() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return dataAtual = `${year}-${month}-${day}`;
}

//Serve para formatar data dd/mm/yy
function dataview() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
}

//Serve para formatar horario
function horaAtualFormatada() {
    var d = new Date();
    return horaatual = d.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
}



function enableScrollForNumericInput(inputElement) {
            inputElement.addEventListener("wheel", function(event) {
                event.preventDefault();
                const step = inputElement.step || 1; // Obtém o passo do input, caso definido, caso contrário usa 1
                inputElement.value = parseFloat(inputElement.value) + (event.deltaY > 0 ? -step : step);
            });
}

const numerorua = document.getElementById("numerorua");
enableScrollForNumericInput(numerorua);

const cxp = document.getElementById("cxp");
enableScrollForNumericInput(cxp);


$(document).ready(function() {
    $('input[type="text"]').attr({
        inputmode: 'textCapCharacters',
        autocapitalize: 'characters'
    });
});

function reduzirTextoDestinatario(destinatario, maxCaracteres) {
    if (destinatario.length > maxCaracteres) {
        var ultimoEspaco = destinatario.lastIndexOf(' ', maxCaracteres);
        if (ultimoEspaco !== -1) {
            return destinatario.substring(0, ultimoEspaco) + '...';
        } else {
            return destinatario.substring(0, maxCaracteres) + '...';
        }
    } else {
        return destinatario;
    }
}

function adjustCanvasSize() {
   var windowHeight2 = window.innerHeight;
   var modalHeader2 = document.querySelector("#myModal4 .modal-header");
   var modalFooter2 = document.querySelector("#myModal4 .modal-footer");
   var modalHeaderHeight2 = modalHeader2 ? modalHeader2.clientHeight : 0;
   var modalFooterHeight2 = modalFooter2 ? modalFooter2.clientHeight : 0;

   var windowHeight = window.innerHeight;
   var modalHeader = document.querySelector("#div_assinar1 .modal-header");
   var modalFooter = document.querySelector("#div_assinar1 .modal-footer");
   var modalHeaderHeight = modalHeader ? modalHeader.clientHeight : 0;
   var modalFooterHeight = modalFooter ? modalFooter.clientHeight : 0;

   var canvas2 = document.getElementById("canvas2");
   canvas2.width = window.innerWidth;
   canvas2.height = windowHeight2 - modalHeaderHeight2 - modalFooterHeight2 - 40;

   var canvas1 = document.getElementById("canvas1");
   canvas1.width = window.innerWidth;
   canvas1.height = windowHeight - modalHeaderHeight - modalFooterHeight - 40;
}

$("#div_assinar1").on("shown.bs.modal", function() {
   adjustCanvasSize();
});
$("#myModal4").on("shown.bs.modal", function() {
   adjustCanvasSize();
});
window.addEventListener("resize", function() {
   adjustCanvasSize();
});


