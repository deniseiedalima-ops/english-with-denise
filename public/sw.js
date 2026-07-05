// Service Worker — Network First para tudo
// O app SEMPRE busca dados novos. Cache só é fallback offline.

const CACHE = 'ewd-v3';

self.addEventListener('install', e => {
  self.skipWaiting(); // Ativa imediatamente sem esperar
});

self.addEventListener('activate', e => {
  // Limpa caches antigos
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);

  // Ignora requests que não são do nosso domínio
  if (!url.origin.includes(self.location.origin) && !url.pathname.startsWith('/api')) return;

  // STRATEGY: Network First para tudo
  // Tenta rede → se falhar (offline), tenta cache → se não tiver, erro
  e.respondWith(
    fetch(request.clone())
      .then(response => {
        // Só cacheia responses OK de GET (não APIs)
        if (
          response.ok &&
          request.method === 'GET' &&
          !url.pathname.startsWith('/api/')
        ) {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
        }
        return response;
      })
      .catch(() => {
        // Offline: tenta cache
        return caches.match(request).then(cached => {
          if (cached) return cached;
          // Fallback para index.html em navegação
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Força reload em todos os clientes quando SW atualiza
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
