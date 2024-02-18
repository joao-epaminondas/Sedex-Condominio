// JavaScript


var canvas1 = document.getElementById('canvas1');
var signaturePad1 = new SignaturePad(canvas1);
var canvas2 = document.getElementById('canvas2');
var signaturePad2 = new SignaturePad(canvas2);


function clearCanva() {
    signaturePad1.clear();
}
function clearCanva2() {
    signaturePad2.clear();
}

document.getElementById("clear-button").addEventListener("click", clearCanva);
document.getElementById("clear-button2").addEventListener("click", clearCanva2);



// downloadButton.addEventListener('click', function () {
//   if (signaturePad.isEmpty()) {
//     alert('Por favor, assine antes de baixar.');
//   } else {
//     // Obtém a imagem da assinatura em formato de URL
//     var signatureImageURL = signaturePad.toDataURL();

//     // Cria um link temporário para fazer o download do arquivo
//     var link = document.createElement('a');
//     link.href = signatureImageURL;
//     link.download = 'assinatura.png'; // Nome do arquivo de download
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }
// });




