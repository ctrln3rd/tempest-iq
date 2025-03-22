const CACHE_NAME = 'weather-rush-v1';
const STATIC_CACHE_NAME = 'static-cache-v1';
const URLS_TO_CACHE = ["/", "/weather", "/settings", "/offline"];

// Install event: Cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Fetch event: Handle caching for pages and Next.js static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  event.respondWith(
    caches.match(url.origin + url.pathname) // Ignore query params for caching
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200) {
              return response;
            }

            const responseClone = response.clone();

            // Cache same-origin requests (including _next/static files)
            if (url.origin === location.origin) {
              if (url.pathname.startsWith('/_next/static/')) {
                caches.open(STATIC_CACHE_NAME).then((cache) => {
                  cache.put(event.request, responseClone);
                });
              } else {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(url.origin + url.pathname, responseClone);
                });
              }
            }

            return response;
          })
          .catch(() => caches.match('/offline')); // Offline fallback
      })
  );
});

// Activate event: Clean up old caches
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
});
