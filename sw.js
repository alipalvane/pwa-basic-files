// ------- LIFECYCLE  -----------
//1. Install SW on Client's Browser
self.addEventListener('install', ()=>{
    console.log('server worker installed');
    self.skipWaiting();
})

//2. Activated SW on Client's Browser
self.addEventListener('activate', ()=>{
    console.log('server worker activated')
})
// ------- LIFECYCLE  -----------

// Get All Assets that linked to my project and runner per my filesystem
self.addEventListener('fetch',(e)=>{
    console.log('fetch events: ', e)
})

