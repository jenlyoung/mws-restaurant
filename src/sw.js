
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('testcache').then(function(cache){
            return cache.addAll([
                "/",
                "/js/index.bundle.js",
                "/js/register.js",
                "/js/restaurant.bundle.js",
                "/index.html",
                "/restaurant.html"
                ]);
        })
    );
});


self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    console.log(requestUrl.origin, location.origin);

    if (requestUrl.origin === location.origin){
        if (requestUrl.pathname ==='/restaurant.html'){
            event.respondWith(caches.match('/restaurant.html'));
            return;
        }
    }
    //caching individual images and map
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request).then(fr=>{
                    return caches.open("testcache").then(c=>{
                        c.put(event.request, fr.clone());
                        return fr;
                    })
                });
            })
            .catch(reason => {
            console.log(reason);
        })
    );
});