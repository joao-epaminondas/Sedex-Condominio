        const videoElement = document.getElementById('camera');
        const flipButton = document.getElementById('flipButton');

        const captureButton = document.getElementById('capturar');
        const canvas = document.getElementById('canvas');
        const imagem = document.getElementById('imagem');

        function listarFontesDeVideo() {
  return new Promise((resolve, reject) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      reject(new Error('API enumerateDevices não suportada neste navegador'));
      return;
    }

    navigator.mediaDevices
      .enumerateDevices()
      .then(devices => {
        const fontesDeVideo = devices.filter(device => device.kind === 'videoinput');
        resolve(fontesDeVideo);
      })
      .catch(error => {
        reject(error);
      });
  });
}

let isFlipped = false;

flipButton.addEventListener('click', function() {
    isFlipped = !isFlipped;
    if (isFlipped) {
        videoElement.style.transform = "scaleX(-1)";
    } else {
        videoElement.style.transform = "scaleX(1)";
    }
});

// Função para acessar a câmera com base na fonte de vídeo desejada
function acessarCamera(fonteDeVideoId) {
  navigator.mediaDevices
    .getUserMedia({ video: { deviceId: fonteDeVideoId } })
    .then(stream => {
      const videoElement = document.getElementById('camera'); // Substitua 'camera' pelo ID do elemento de vídeo em seu HTML
      videoElement.srcObject = stream;
      
    })
    .catch(error => {
      console.error('Erro ao acessar a câmera: ', error);
    });
}

// Listar as fontes de vídeo disponíveis
// 1 = Camera traseira
// 0 = Camera Frontal
// 0 = PC


listarFontesDeVideo()
  .then(fontesDeVideo => {
    // Escolha a fonte de vídeo desejada (pode ser a câmera traseira)
    if (fontesDeVideo.length > 0) {
      const fonteDesejada = fontesDeVideo[0]; // Você pode escolher outra fonte de vídeo aqui
      acessarCamera(fonteDesejada.deviceId);
    } else {
      console.error('Nenhuma fonte de vídeo disponível.');
    }
  })
  .catch(error => {
    console.error('Erro ao listar as fontes de vídeo: ', error);
  });

        // Capturar foto quando o botão é clicado
        captureButton.addEventListener('click', function () {
            const context = canvas.getContext('2d');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            context.translate(canvas.width, 0);
            context.scale(-1, 1);         
            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

            // Exibir a imagem capturada
            imagem.src = canvas.toDataURL('image/webp'); // Você pode escolher o formato da imagem
            imagem.style.display = 'block';
        });