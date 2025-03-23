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

// Fetch event: Check cache before going to network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Handle navigation requests (full-page loads)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse; // ✅ Serve from cache if available
        }

        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200) return response;

            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(url.pathname, responseClone); // Cache the base page
            });

            return response;
          })
          .catch(() => caches.match('/offline')); // Fallback only if page isn't cached
      })
    );
    return;
  }

  // Serve cached responses for static assets or fetch from network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200) return response;

          const responseClone = response.clone();
          if (url.pathname.startsWith('/_next/static/')) {
            caches.open(STATIC_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }

          return response;
        })
        .catch(() => caches.match('/offline')); // Offline fallback only for missing static files
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
