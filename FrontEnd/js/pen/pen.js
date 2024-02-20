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