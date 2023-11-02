/* eslint-disable */
const responseContent =
  '<html>' +
  '<body>' +
  '<style>' +
  'body {text-align: center; background-color: #333; color: #eee;}' +
  '</style>' +
  '<h1>Gotham Imperial Hotel</h1>' +
  '<p>There seems to be a problem with your connection.</p>' +
  '<p>Come visit us at 1 응아아 Plaza, Gotham City for free WiFi.</p>' +
  '<button onclick="window.location.href = \'/\'">재요청</button>' +
  '</body>' +
  '</html>';

self.addEventListener('install', function (event) {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open('my-cache').then((cache) => {
      return cache.addAll(['/', '/index.html']);
    }),
  );
});

self.addEventListener('activate', function (event) {
  console.log('Service Worker activating.');
});

self.addEventListener('fetch', function (event) {
  // console.log('Fetch request for: ', event.request.url, event.request.mode);
});

self.addEventListener('fetch', (event) => {
  const request = new Request('/index.html');

  caches.open('my-cache').then((cache) => {
    cache.match(request).then((response) => {
      if (response) {
        // 캐시에서 자산을 찾았을 때의 처리
        console.log('캐시에서 찾음');
      } else {
        // 캐시에서 자산을 찾지 못했을 때의 처리
        console.log('캐시에서 찾지 못함');
      }
    });
  });
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).catch(function () {
      const options = {
        title: '오류 났다',
        body: '서비스 오프라인이다',
        icon: 'icon.png',
      };

      self.registration.showNotification(options.title, options);

      return new Response(responseContent, {
        headers: { 'Content-Type': 'text/html; charset=UTF-8' },
      });
    }),
  );
});

self.addEventListener('message', (event) => {
  console.log('서비스 워커에서 메시지 수신:', event.data);
  event.source.postMessage('안녕하세요! 서비스 워커에서 응답합니다.');
});

self.addEventListener('push', function (event) {
  const options = {
    title: '푸시 알림 제목',
    body: event.data.text(),
    icon: 'icon.png',
  };

  // 알림 권한 확인
  self.registration.pushManager.getSubscription().then(function (subscription) {
    self.registration.showNotification(options.title, options);
    // console.log(subscription);
    // if (subscription) {
    //   // 알림 권한이 부여된 경우
    // } else {
    //   // 알림 권한이 부여되지 않은 경우
    //   console.error("알림 권한이 부여되지 않았습니다.");
    // }
  });
});

self.skipWaiting();
self.registration.showNotification('알림 테스트', {
  body: '알림 테스트입니다.',
});

// console.log(self.registration, "self.registration");
