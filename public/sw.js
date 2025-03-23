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

// Fetch event: Serve cached pages first
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[SW] Serving cached page:', event.request.url);
          return cachedResponse; // ✅ Serve cached page first
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
          .catch(async () => {
            console.log('[SW] Page not found in cache, serving /offline');
            return caches.match('/offline'); // Only fallback if not cached
          });
      })
    );
    return;
  }

  // Handle static assets caching
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
        .catch(() => caches.match('/offline')); // Fallback for missing static assets
    })
  );
});

// Activate event: Clean old caches
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
