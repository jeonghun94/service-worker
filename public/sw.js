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

self.addEventListener('fetch', function (event) {
  console.log('Fetch request for: ', event.request.url, event.request.mode);

  caches.open('my-cache').then((cache) => {
    cache.match(event.request).then((response) => {
      if (response) {
        return response;
      } else {
        return fetch(event.request).then((networkResponse) => {
          if (event.request.url.includes('/api')) {
            console.log('네트워크 응답 데이터:', networkResponse);
            return networkResponse.json().then((data) => {
              console.log('API 응답 데이터:', data);

              const cacheResponse = new Response(JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
              });
              const url = new URL(event.request.url);
              const path = url.pathname + url.search;
              console.log(path, '캐시 할 데이터유알엘');
              cache.put(`api-data-${path}`, cacheResponse);
            });
          } else {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }
        });
      }
    });
  });
});

self.addEventListener('message', (event) => {
  if (event.data.type === 'data') {
    caches.open('my-cache').then((cache) => {
      cache.match(`api-data-${event.data.url}`).then(async (response) => {
        console.log(event.data.url, '캐시 데이터 유알엘');
        console.log('캐시 데이터:', response);
        if (response) {
          response.text().then((data) => {
            const myData = JSON.parse(data);

            console.log('캐시 데이터:', myData);

            const testData = {
              courseName: '조정훈의 기초 수업',
              instructorName: '조정훈',
              courseCode: 'C101',
              courseDescription: '프로그래밍의 기초를 배우는 수업입니다.',
              courseSchedule: '월, 수, 금 10:00 AM - 12:00 PM',
              startDate: '2023-01-16',
              endDate: '2023-03-24',
              creationDate: '2023-01-10',
              courseThumbnail:
                'https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/70289684-e162-4336-f465-9976c78efe00/public',
            };

            myData.unshift(testData);

            event.source.postMessage(JSON.stringify(myData));
          });
        } else {
          cache
            .match(`api-data-${event.data.cacheingUrl}`)
            .then(async (response) => {
              if (response) {
                response.text().then((data) => {
                  const myData = JSON.parse(data);

                  const testData = myData.filter(
                    (item) => item.courseCode === event.data.cacheingKey,
                  );

                  event.source.postMessage(JSON.stringify(testData));
                });
              }
            });
        }
      });
    });
  }
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // 요청 URL이 '/경로'인 경우 캐시에서 응답을 찾고, 없으면 네트워크 요청을 실행
  if (requestUrl.pathname === '/') {
    event.respondWith(
      caches.match('/').then((response) => {
        return response || fetch(event.request);
      }),
    );
  }
});

self.skipWaiting();
