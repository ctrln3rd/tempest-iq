const CACHE_NAME = 'weather-rush-v3'; // Incremented version for cache refresh
const STATIC_CACHE_NAME = 'static-cache-v3';
const URLS_TO_CACHE = ["/", "/weather", "/settings", "/offline"];

// Install event: Cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting(); // Activate new service worker immediately
});

// Fetch event: Handle API, Nominatim, and other requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // **Weather API (NetworkFirst)**
  if (url.pathname.startsWith('/api/weather')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => caches.match(event.request)) // Use cache if offline
    );
    return;
  }

  // **Nominatim Location Requests (NetworkFirst)**
  if (url.hostname.includes('nominatim.openstreetmap.org')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => caches.match(event.request)) // Use cache if offline
    );
    return;
  }

  // **Handle page navigation requests**
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(async () => {
          console.log('No internet, serving cached page');
          const cache = await caches.open(CACHE_NAME);
          return cache.match(url.pathname) || cache.match('/offline');
        })
    );
    return;
  }

  // **Handle static assets (_next/static, images, assets)**
  if (url.pathname.startsWith('/_next/static') || url.pathname.startsWith('/assets')) {
    event.respondWith(
      caches.open(STATIC_CACHE_NAME).then((cache) =>
        cache.match(event.request).then((cachedResponse) => {
          return cachedResponse || fetch(event.request).then((fetchedResponse) => {
            cache.put(event.request, fetchedResponse.clone());
            return fetchedResponse;
          });
        })
      )
    );
    return;
  }

  // **Default fallback: Try fetching, otherwise return cache**
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// Activate event: Clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim(); // Force clients to use updated service worker
});
