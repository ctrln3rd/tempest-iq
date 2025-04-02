const CACHE_NAME = 'weather-rush-v1'; // Incremented version for cache refresh
const STATIC_CACHE_NAME = 'static-cache-v1';
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
    event.respondWith(handleNetworkFirst(event.request));
    return;
  }

  // **Nominatim Location Requests (NetworkFirst)**
  if (url.hostname.includes('nominatim.openstreetmap.org')) {
    event.respondWith(handleNetworkFirst(event.request));
    return;
  }

  // **Handle page navigation requests**
  if (event.request.mode === 'navigate') {
    event.respondWith(handleNavigation(event));
    return;
  }

  // **Handle static assets (_next/static, images, assets)**
  if (url.pathname.startsWith('/_next/static') || url.pathname.startsWith('/assets')) {
    event.respondWith(handleCacheFirst(event.request, STATIC_CACHE_NAME));
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

// **Network First Strategy**
async function handleNetworkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone()); // Update cache
    return response;
  } catch (error) {
    return caches.match(request); // Use cache if offline
  }
}

// **Cache First Strategy for static assets**
async function handleCacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  const response = await fetch(request);
  cache.put(request, response.clone());
  return response;
}

// **Handle Navigation Requests**
async function handleNavigation(event) {
  try {
    const response = await fetch(event.request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(event.request, response.clone()); // Update cache
    return response;
  } catch (error) {
    console.log('Offline: Serving cached page');
    const cache = await caches.open(CACHE_NAME);
    return cache.match(new URL(event.request.url).pathname) || cache.match('/offline');
  }
}
