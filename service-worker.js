// Nome do cache para armazenar recursos estáticos
const CACHE_NAME = 'my-pwa-cache-v1';

// Lista de recursos a serem armazenados em cache
const cacheUrls = [
  '/',
  '/index.html',
  // Adicione aqui outros recursos estáticos que deseja armazenar em cache
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(cacheUrls);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercepta as solicitações e serve os recursos em cache, se disponíveis
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Se o recurso estiver em cache, retorne-o
        if (response) {
          return response;
        }

        // Caso contrário, faça uma solicitação de rede para o recurso
        return fetch(event.request);
      })
  );
});
