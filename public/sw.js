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

// Fetch event: Handle navigation and static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        return fetch(event.request)
          .then((fetchedResponse) => {
            cache.put(event.request, fetchedResponse.clone());
            return fetchedResponse;
          })
          .catch(async () => {
            console.log('No internet, checking cache');
            // Ignore query parameters when matching cache
            const cacheMatch = await cache.match(url.pathname);
            return cacheMatch || cache.match('/offline');
          });
      })
    );
  } else {
    // Handle static assets (_next/static and other files)
    event.respondWith(
      caches.open(STATIC_CACHE_NAME).then(async (cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then((fetchedResponse) => {
            if (fetchedResponse.ok) {
              cache.put(event.request, fetchedResponse.clone());
            }
            return fetchedResponse;
          });
        });
      })
    );
  }
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
