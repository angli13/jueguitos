/* sw.js — caché para uso sin conexión. Sube CACHE al cambiar algún archivo. */
const CACHE = 'sanctum-rosarium-v1';
const FILES = [
  './',
  'index.html',
  'style.css',
  'manifest.webmanifest',
  'data/oraciones.js',
  'src/app.js',
  'assets/icon.svg',
  'assets/icon-192.png',
  'assets/icon-512.png',
  'assets/fonts/eb-garamond.woff2',
  'assets/fonts/eb-garamond-italic.woff2',
  'assets/fonts/unifraktur-maguntia.woff2',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Red primero (para recibir correcciones), caché si no hay conexión.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok && new URL(e.request.url).origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
