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

// Fetch event: Preserve query parameters when serving cached pages
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Handle navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[SW] Serving cached page:', event.request.url);
          return cachedResponse; // ✅ Serve cached page from cache
        }
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200) return response;
            const responseClone = response.clone();
            caches.open('weather-rush-v1').then((cache) => {
              cache.put(event.request, responseClone); // ✅ Dynamically cache pages
            });
            return response;
          })
          .catch(() => {
            console.log('[SW] Page not found in cache, serving /offline');
            return caches.match('/offline'); // 🔥 Fixes infinite redirect issue
          });
      })
    );
    return;
  }

  // Handle static assets (_next/static and other files)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200) return response;
          const responseClone = response.clone();
          if (url.pathname.startsWith('/_next/static/')) {
            caches.open('static-cache-v1').then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          console.log(`[SW] Asset not found in cache: ${event.request.url}`);
          return caches.match('/offline');
        });
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
