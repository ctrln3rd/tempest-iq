const CACHE_NAME = 'weather-rush-v1';
const IMAGE_CACHE_NAME = 'image-cache-v1'


const URLS_TO_CACHE = [ "/", "/weather", "/settings", "/offline", "/_next/static/"];
// Install event: Cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Fetch event: Serve from cache if available, else fetch from network
// Fetch event: Serve from cache when offline
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  event.respondWith(
    caches.match(url.pathname === '/weather' ? '/weather' : event.request).then(
      (cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => caches.match('/offline'));
    })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

  