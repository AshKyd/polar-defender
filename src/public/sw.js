const CACHE_NAME = "polar-defender-v1";
const ASSETS = [
    "/",
    "/index.html",
    "/css/style.css",
    "/scripts/index.js",
    "/favicon.png",
    "/og-image.webp",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)),
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        }),
    );
});
