const APP_PREFIX = 'FoodFest-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    "./index.html",
    "./events.html",
    "./tickets.html",
    "./schedule.html",
    "./assets/css/style.css",
    "./assets/css/bootstrap.css",
    "./assets/css/tickets.css",
    "./dist/app.bundle.js",
    "./dist/events.bundle.js",
    "./dist/tickets.bundle.js",
    "./dist/schedule.bundle.js"
];

// Install the service worker
self.addEventListener('install', function (evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Your files ' + CACHE_NAME + ' were pre-cached successfully!');
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    // self.skipWaiting();
});

// Activate the service worker and remove old data from the cache
self.addEventListener('activate', function (evt) {
    evt.waitUntil(
        caches.keys().then(keyList => {
            let cacheKeeplist = keyList.filter(key => {
                return key.indexOf(APP_PREFIX);
            });
            cacheKeeplist.push(CACHE_NAME);

            return Promise.all(
                keyList.map(key, i => {
                    if (cacheKeeplist.indexOf(key) === -1) {
                        console.log('Removing old cache data' + keyList[i]);
                        return caches.delete(key[i]);
                    }
                })
            );
        })
    );

    // self.clients.claim();
});

// Intercept fetch requests
self.addEventListener('fetch', function (evt) {
    console.log('fetch request : ' + evt.request.url);
    evt.respondWith(
        caches.match(evt.request).then(request => {
            if (request) { // if cache is available, respond with cache
                console.log('responding with cache : ' + evt.request.url);
                return request;
            } else { // if there are no cache, try fetching request
                console.log('file is not cached, fetching : ' + evt.request.url);
                return fetch(evt.request);
            }

            // You can omit if/else for console.log & put one line below like this too.
            // return request || fetch(e.request)
        })
    );
});
