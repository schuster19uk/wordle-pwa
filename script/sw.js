self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('wordle-cache').then(cache => {
      return cache.addAll([
        '/index.html',
        '/style.css',
        '/script.js',
        '/dictionaries/updated-wordlist.json',
        '/manifest.json',
        '/images/icon-192x192.png',
        '/images/icon-512x512.png',
      ]);
    }).catch(error => {
      console.error('Failed to install service worker:', error);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request).catch(error => {
        console.error('Fetch failed:', error);
        return caches.match('/offline.html');  // Provide fallback for offline scenarios
      });
    })
  );
});