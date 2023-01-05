
self.addEventListener("install", (e) => {
  alert("am inside install");
  e.waitUntil(
    caches.open("note-store").then((cache) =>
        cache.addAll([
          "/",
          "/note-app", 
          "/static/style.css",
          "/static/index.js",
          "https://cdn.jsdelivr.net/npm/underscore@1.13.6/underscore-umd-min.js",
        ])
      )
  );
});


self.addEventListener("fetch", (e) => {
  alert(e.request.url);
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
