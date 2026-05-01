const CACHE_NAME = 'frosttrack-v8';

// Rarely-changing assets safe to pre-cache on install
const STATIC_SHELL = [
  '/manifest.json',
];

// Always fetch fresh from network — HTML, JS, and all CSS
// (CSS is included here to prevent stale stylesheet bugs)
const NETWORK_FIRST = [
  '/index.html',
  '/',
  '/js/bundle.js',
  '/sw.js',
  '/css/reset.css',
  '/css/variables.css',
  '/css/layout.css',
  '/css/components.css',
  '/css/animations.css',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(STATIC_SHELL.map(url => cache.add(url)));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then(clients => clients.forEach(c => c.postMessage({ type: 'SW_UPDATED' })))
  );
});

self.addEventListener('fetch', event => {
  // Never intercept Anthropic or Firebase API calls
  if (event.request.url.includes('anthropic.com')) return;
  if (event.request.url.includes('firestore.googleapis.com')) return;
  if (event.request.url.includes('firebase')) return;
  // Never intercept non-GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const path = url.pathname;

  // Network-first for HTML, JS, and CSS — always get the latest code
  const isNetworkFirst = NETWORK_FIRST.some(p => path === p || path.endsWith('/bundle.js') || path.endsWith('.css'));
  if (isNetworkFirst) {
    event.respondWith(
      fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match(event.request)) // fall back to cache if offline
    );
    return;
  }

  // Cache-first for everything else (CSS, fonts, icons)
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (
          response.ok &&
          (event.request.url.startsWith(self.location.origin) ||
           event.request.url.includes('fonts.googleapis.com') ||
           event.request.url.includes('fonts.gstatic.com'))
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
