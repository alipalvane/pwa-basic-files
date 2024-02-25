//UTILS
const limitCache = (key, size) => {
  caches.open(key).then((cahce) => {
    cahce.keys().then((keys) => {
      //if assets biggerthan our size then remove other assets from first level
      if (keys.length > size) {
        //recursive function call 'limitCache' is in own function again
        cahce.delete(keys[0]).then(limitCache(key, size));
      }
    });
  });
};

//SERVICE WORKER
const cacheVersion = 2;
const activeCaches = {
  "pwa-static-cache": `pwa-static-${cacheVersion}V`,
  "pwa-dynamic-cache": `pwa-dynamic-${cacheVersion}V`,
};
// ------- LIFECYCLE  -----------
//1. Install SW on Client's Browser
self.addEventListener("install", (event) => {
  console.log("server worker installed");
  self.skipWaiting();

  event.waitUntil(
    // install assets in cache of client's browser in first load page
    caches.open(activeCaches["pwa-static-cache"]).then((cache) => {
      //Added signle files in cache with "add" method
      // cache.add('./js/app.js')
      // cache.add('./style.css')

      //if i want dont run next evenet we use "waitUntil" method

      //Added All files assets in cache with "addAll" method
      cache.addAll(["/", "/fallback.html", "./js/app.js", "./style.css"]);
      console.log("cache done for js and css files");
    })
  );
});

//2. Activated SW on Client's Browser
self.addEventListener("activate", (event) => {
  console.log("server worker activated");

  //Remove Extra and old caches from client's browser when we add new cache in app
  const activeCacheNames = Object.values(activeCaches);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.forEach((cacheName) => {
          if (!activeCacheNames.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
// ------- LIFECYCLE  -----------

// Get All Assets that linked to my project and runner per my filesystem
self.addEventListener("fetch", (e) => {
  const urls = ["https://fakestoreapi.com/products?limit=4"];
  //get api data always from network but other assets from cache and then server
  if (urls.includes(e.requset.url)) {
    return e.respondWith(
      fetch(e.request).then((res) => {
        return res;
      })
    );
  } else {
    //if assets not exist in cache then get assets from backend
    //e.respondWith(fetch(e.request));

    //check if assets exist in cache retrun them if not exist then fetch that from server
    //1- CACHE STRATEGY: First Cache , Second Network
    e.respondWith(
      // 1- First load data from cache
      caches.match(e.request).then((response) => {
        if (response) {
          return response;
        } else {
          //2- Second load data from network server
          // add dynamic assetes to cache like dynamic files as cdns or something else from other servers
          return fetch(e.request)
            .then((serverRes) => {
              return caches
                .open(activeCaches["pwa-dynamic-cache"])
                .then((cache) => {
                  cache.put(e.request, serverRes.clone());
                  //limitCache(activeCaches["pwa-dynamic-cache"], 3)
                  return serverRes;
                });
            })
            .catch((err) => {
              //if user was offline (even server) and user want see other pages that not cached then show fallback.html page
              return caches.match("/fallback.html");
            });
        }
      })
    );
  }

  //2- CACHE STRATEGY: only network
  //e.respondWith(fetch(e.request));

  //3- CACHE STRATEGY: only cache
  //e.respondWith(caches.match(e.request))

  //4- CACHE STRATEGY: First Network, Second Cache
  // return e.respondWith(
  //   fetch(e.request)
  //     .then((response) => {
  //       return caches.open(activeCaches["pwa-dynamic-cache"]).then((cache) => {
  //         cache.put(e.request.url, response.clone());
  //         return response;
  //       });
  //     })
  //     .catch((err) => {
  //       return caches.match(e.request.url);
  //     })
  // );
});

// Background Sync Manager for get data in offline mode and set when user online
// Excute this function accord all sw register in app.js like "add-newn-course"
self.addEventListener("sync", (event) => {
  if (event.tag === "add-new-course") {
    //post course
    createNewCourse();
  } else if (event.tag === "reomve-course") {
    //delete course
  }
});

function createNewCourse() {
  console.log("create course successfully");
}
