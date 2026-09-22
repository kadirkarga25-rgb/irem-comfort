/* İrem Comfort Service Worker — network first, never return an invalid response */
const CACHE_NAME = 'irem-comfort-pwa-v3';
const ASSETS_TO_CACHE = ['/', '/index.html', '/site.webmanifest', '/favicon.svg'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE).catch(() => {})));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/')) return;
  // PDFs/catalog assets must never be served from an old PWA cache.
  if (url.pathname.startsWith('/katalog-assets/') || url.pathname.endsWith('.pdf')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.ok && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {});
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (event.request.mode === 'navigate') {
          const shell = await caches.match('/index.html');
          if (shell) return shell;
        }
        return new Response('İrem Comfort bağlantısı geçici olarak kullanılamıyor.', {
          status: 503,
          headers: {'Content-Type': 'text/plain; charset=utf-8'}
        });
      })
  );
});

self.addEventListener('push', (event) => {
  let data = { title: 'İrem Comfort Bildirim', body: 'Yeni bir güncelleme mevcut!', url: '/' };
  if (event.data) { try { data = event.data.json(); } catch { data.body = event.data.text(); } }
  event.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [200, 100, 200, 100, 400],
    data: { url: data.url || '/' },
    tag: data.tag || 'irem-support-alert',
    renotify: true,
    actions: [{ action: 'open', title: 'İncele & Yanıtla' }, { action: 'close', title: 'Kapat' }]
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'close') return;
  const urlToOpen = event.notification.data?.url || '/';
  event.waitUntil(clients.matchAll({type:'window', includeUncontrolled:true}).then((windowClients) => {
    for (const client of windowClients) if (client.url.includes(self.location.origin) && 'focus' in client) return client.focus();
    return clients.openWindow ? clients.openWindow(urlToOpen) : undefined;
  }));
});
