const CACHE_NAME = 'frosttrack-v1';

const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/reset.css',
  '/css/variables.css',
  '/css/layout.css',
  '/css/components.css',
  '/css/animations.css',
  '/js/app.js',
  '/js/store.js',
  '/js/utils.js',
  '/js/defaults.js',
  '/js/claude.js',
  '/js/settings.js',
  '/js/tabs/home.js',
  '/js/tabs/inventory.js',
  '/js/tabs/add.js',
  '/js/tabs/shopping.js',
  '/js/tabs/meals.js',
  '/js/components/bottomSheet.js',
  '/js/components/toast.js',
  '/js/components/swipeReveal.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Add each file individually so one failure doesn't abort the whole install
      return Promise.allSettled(APP_SHELL.map(url => cache.add(url)));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Never intercept Anthropic API calls
  if (event.request.url.includes('anthropic.com')) return;
  // Never intercept non-GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache successful responses from same origin and Google Fonts
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
