const CACHE_NAME = "siapsiaga-v3.5-cache";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap",
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(ASSETS_TO_CACHE);
    }),
  );
});

// Activate Event (Cleanup old caches)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        }),
      );
    }),
  );
});

// Fetch Event (Network First for API, Cache First for Assets)
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/")) {
    // Network first for API calls
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request)),
    );
  } else {
    // Cache first for static assets
    event.respondWith(
      caches
        .match(event.request)
        .then((response) => response || fetch(event.request)),
    );
  }
});

// ============================================
// PUSH EVENT LISTENER (Untuk Web Push Notifikasi)
// ============================================
self.addEventListener('push', function (event) {
  if (event.data) {
    try {
      const data = event.data.json();
      const title = data.title || "SiapSiaga Peringatan Dini";
      
      const options = {
        body: data.body || "Ada update terbaru untuk area Anda.",
        icon: "/assets/icon-192x192.png",
        badge: "/assets/badge-72x72.png",
        dir: "ltr",
        vibrate: data.vibrate || [200, 100, 200, 100, 200, 100, 200],
        data: {
          url: data.url || "https://siapsiaga--dhatawaa.replit.app/"
        },
        requireInteraction: data.requireInteraction || false
      };
      
      event.waitUntil(self.registration.showNotification(title, options));
    } catch (e) {
      console.error("Error parsing push dataset:", e);
      // Fallback text
      event.waitUntil(
        self.registration.showNotification("SiapSiaga", {
          body: event.data.text(),
          icon: "/assets/icon-192x192.png"
        })
      );
    }
  }
});

// NOTIFICATION CLICK LISTENER
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  const urlToOpen = (event.notification.data && event.notification.data.url) 
    ? event.notification.data.url 
    : "https://siapsiaga--dhatawaa.replit.app/";
    
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Jika aplikasinya sudah terbuka
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      // Jika belum buka PWA, buka jendela baru
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
