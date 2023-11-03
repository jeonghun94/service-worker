/* eslint-disable */

self.addEventListener('install', function (event) {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open('my-cache').then((cache) => {
      return cache.addAll(['/public/img/js-logo.png', '/public/offline.html']);
    }),
  );
});

self.addEventListener('activate', function (event) {
  console.log('Service Worker activating.');
});

// self.addEventListener('fetch', function (event) {
//   console.log('Fetch request for: ', event.request.url, event.request.mode);
// });

// self.addEventListener('fetch', (event) => {
//   const request = new Request('/index.html');

//   caches.open('my-cache').then((cache) => {
//     cache.match(request).then((response) => {
//       if (response) {
//         console.log('캐시에서 찾음');
//       } else {
//         console.log('캐시에서 찾지 못함');
//       }
//     });
//   });
// });

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((request) => {
      console.log('[Service Worker] Fetching resource: ' + event.request.url);
      return (
        request ||
        fetch(event.request)
          .then(async (response) => {
            const cache = await caches.open('my-cache');
            console.log(
              '[Service Worker] Caching new resource: ' + event.request.url,
            );
            cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => {
            console.log('offline');
            if (event.request.url.endsWith('/img/js-logo.png')) {
              return caches.match('/public/img/js-logo.png');
            }
            return caches.match('/public/offline.html');
          })
      );
    }),
  );
});

self.addEventListener('message', (event) => {
  console.log('서비스 워커에서 메시지 수신:', event.data);
  event.source.postMessage('안녕하세요! 서비스 워커에서 응답합니다.');
});

self.skipWaiting();
