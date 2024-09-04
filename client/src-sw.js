const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST); // Injection point

// Name: page-cache
// Only 0 (opaque response) & 200 (OK) are cached
// Automatically removes cached entires after they expire (in a month)
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200], 
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

// Known as "warming the cache" Ensured important resources are cached as soon as the service worker is installed
// We only want to pre cache `index.html` and `/'
// Ensures application is available offline as soon as possible
// When these urls are requested the service worker will check the cached version if available.
// Improves load time and provides offline access to the web app.
warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

// Defines a routing rule for the service worker
// Takes a predicate function that checks the mode of the request
// request.mode: how the request will interact with the browser's HTTP cache.
// request.mode === 'navigate': For navigation requests like the user clicking a link or typing an url.
// If the request is a navigation request then the route will be applied.
registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching
registerRoute();
