/* eslint-disable */
self.addEventListener('install', function (event) {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open('my-cache').then((cache) => {
      return cache.addAll(['/', '/img/js-logo.png', '/offline.html']);
    }),
  );
});

self.addEventListener('activate', function (event) {
  console.log('Service Worker activating.');
});

self.addEventListener('fetch', function (event) {
  const url = new URL(event.request.url);
  event.respondWith(
    caches.open('my-cache').then((cache) => {
      return cache.match(url).then((response) => {
        if (response) {
          console.log('캐시에서 리소스 반환');
          console.log(response);
          return response; // 캐시에서 리소스 반환
        }
      });
    }),
  );
});

// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     caches.open('my-cache').then((cache) => {
//       return cache
//         .match(event.request.url)
//         .then((response) => (response ? response : ''));
//     }),
//   );
// });

self.addEventListener('fetch', function (event) {
  caches.open('my-cache').then((cache) => {
    cache.match(event.request).then((response) => {
      if (response) {
        return response;
      } else {
        return fetch(event.request).then((networkResponse) => {
          if (event.request.url.includes('/api')) {
            return networkResponse.json().then((data) => {
              const cacheResponse = new Response(JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
              });

              data.forEach((item) => {
                if (item.contents && item.contents.videos) {
                  item.contents.videos.forEach(async (video) => {
                    try {
                      const videoCacheResponse = await cache.match(video);
                      if (!videoCacheResponse) {
                        const videoResponse = await fetch(video);
                        cache.put(video, videoResponse);
                      }
                    } catch (error) {
                      console.error('비디오 캐싱 중 오류 발생:', error);
                    }
                  });
                }

                if (item.contents && item.contents.images) {
                  item.contents.images.forEach(async (image) => {
                    try {
                      const imageCacheResponse = await cache.match(image);
                      if (!imageCacheResponse) {
                        const imageResponse = await fetch(image);
                        cache.put(image, imageResponse);
                      }
                    } catch (error) {
                      console.error('이미지 캐싱 중 오류 발생:', error);
                    }
                  });
                }
              });

              const url = new URL(event.request.url);
              const path = url.pathname + url.search;

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
        if (response) {
          response.text().then((data) => {
            console.log('여기임?');
            const myData = JSON.parse(data);
            event.source.postMessage(JSON.stringify(myData));
          });
        } else {
          console.log('캐시에 데이터가 없습니다. 여기 들어온거에요');
          cache
            .match(`api-data-${event.data.cacheingUrl}`)
            .then(async (response) => {
              if (response) {
                response.text().then((data) => {
                  const myData = JSON.parse(data);

                  const testData = myData.filter(
                    (item) => item.courseCode === event.data.cacheingKey,
                  );

                  testData[0].contents.images.map(async (image, idx) => {
                    try {
                      await cache.match(`/${idx}.png`).then((response) => {
                        if (response) {
                          return response;
                        }
                      });
                    } catch (error) {
                      console.error('이미지 캐싱 중 오류 발생:', error);
                    }
                  });

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
