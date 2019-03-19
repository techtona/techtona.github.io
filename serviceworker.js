var CACHE_NAME = 'latihan-pwa-cache-v1';

var urlsToCache = [
    '/',
    '/js/main.js',
    '/js/jquery.min.js',
    '/css/main.css',
    '/images/ugm.png',
    '/manifest.json',
    '/fallback.json'
];

// install cache on browser
self.addEventListener('install', function (event) {
    // do install
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                // cek apakah cache sudah terinstall
                console.log("service worker do install..");
                return cache.addAll(urlsToCache);
            }
        )
    )
});

// aktivasi sw
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                // jika sudah ada cache dgn versi beda maka di hapus
                cacheNames.filter(function (cacheName) {
                    return cacheName !== CACHE_NAME;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

// fetch cache
self.addEventListener('fetch', function (event) {
    var request = event.request;
    var url = new URL(request.url);

    /*
    * menggunakan data local cache
    * */
    if (url.origin === location.origin){
        event.respondWith(
            caches.match(request).then(function (response) {
                // jika ada data di cache maka tampilkan data cache, jika tidak maka petch request
                return response || fetch(request);
            })
        )
    } else{
        // internet API
        event.respondWith(
            caches.open('mahasiswa-cache-v1').then(function (cache) {
                return fetch(request).then(function (liveRequest) {
                    cache.put(request, liveRequest.clone());
                    // save cache to mahasiswa-cache-v1
                    return liveRequest;
                }).catch(function () {
                    return caches.match(request).then(function (response) {
                        if (response) return response;
                        return caches.match('/fallback.json');
                    })
                })
            })
        )
    }

    // event.respondWith(
    //     caches.match(event.request).then(function (response) {
    //         console.log(response);
    //         if (response){
    //             return response;
    //         }
    //         return fetch(event.request);
    //     })
    // )
});

self.addEventListener('notificationclick', function (n) {
   var notification = n.notification;
   var primaryKey = notification.data.primaryKey;
   var action = n.action;
   var url = notification.data.url;

   console.log('Notification : ' , url);
   if (action === 'close'){
       notification.close();
   } else{
       clients.openWindow(url);
       notification.close();
   }
});

self.addEventListener('sync', function(event) {
    if (event.tag === 'myFirstSync') {
        event.waitUntil();
    }
});