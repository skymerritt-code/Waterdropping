const CACHE_NAME = 'waterlog-v1';
const APP_SHELL = [
  './Waterdropping-Log.html',
  './sw.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Cache-first for OSM tiles
  if (url.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(cached =>
          cached || fetch(event.request).then(resp => { cache.put(event.request, resp.clone()); return resp; }).catch(()=>cached)
        )
      )
    );
    return;
  }

  // For other GET requests do network-first then fallback to cache
  if (event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request).then(response => {
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
        return response;
      }).catch(() => caches.match(event.request).then(res => res || caches.match('./Waterdropping-Log.html')))
    );
  }
});
