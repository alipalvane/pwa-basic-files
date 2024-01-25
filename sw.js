// ------- LIFECYCLE  -----------
//1. Install SW on Client's Browser
self.addEventListener("install", (event) => {
  console.log("server worker installed");
  self.skipWaiting();

  // install assets in cache of client's browser in first load page
  caches.open("pwa-cache").then((cache) => {
    //Added signle files in cache with "add" method
    // cache.add('./js/app.js')
    // cache.add('./style.css')

    //Added All files assets in cache with "addAll" method
    cache.addAll(["/", "./js/app.js", "./style.css"]);
    console.log("cache done for js and css files");
  });
});

//2. Activated SW on Client's Browser
self.addEventListener("activate", (event) => {
  console.log("server worker activated");
});
// ------- LIFECYCLE  -----------

// Get All Assets that linked to my project and runner per my filesystem
self.addEventListener("fetch", (e) => {
  console.log("fetch events: ", e.request);

  //if assets not exist in cache then get assets from backend
  //e.respondWith(fetch(e.request));

  //check if assets exist in cache retrun them if not exist then fetch that from server
  e.respondWith(
    caches.match(e.request).then((response) => {
      if (response) {
        return response;
      } else {
        return fetch(e.request);
      }
    })
  );
});
