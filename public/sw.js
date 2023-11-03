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

self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).catch(function () {
      if (event.request.url.endsWith('/img/js-logo.png')) {
        // 이미지 요청인 경우 상대 경로를 수정하여 캐시에서 찾습니다.
        return caches.match('/public/img/js-logo.png');
      }
      return caches.match('/public/offline.html');
    }),
  );
});

// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     fetch(event.request).catch(function () {
//       return caches.match('/public/offline.html').then((res) => {
//         console.log(res, 'res');

//         return res;
//       });
//     }),
//   );
// });

self.addEventListener('message', (event) => {
  console.log('서비스 워커에서 메시지 수신:', event.data);
  event.source.postMessage('안녕하세요! 서비스 워커에서 응답합니다.');
});

self.skipWaiting();
