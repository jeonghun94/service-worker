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

self.addEventListener('fetch', (event) => {
  if (
    event.request.url.endsWith('.png') ||
    event.request.url.endsWith('.jpg') ||
    event.request.url.endsWith('.jpeg') ||
    event.request.url.endsWith('.gif') ||
    event.request.url.endsWith('.svg') ||
    event.request.url.endsWith('.mp4') ||
    event.request.url.endsWith('.webm') ||
    event.request.url.endsWith('.ogg') ||
    event.request.url.endsWith('.mp3') ||
    event.request.url.endsWith('.wav') ||
    event.request.url.endsWith('.flac') ||
    event.request.url.endsWith('.aac') ||
    event.request.url.endsWith('.wma') ||
    event.request.url.endsWith('.m4a') ||
    event.request.url.endsWith('.opus')
  ) {
    event.respondWith(
      caches.open('my-cache').then((cache) => {
        console.log('해당 리소스를 반환합니다.');
        return cache.match(event.request.url).then((response) => response);
      }),
    );
  }
});

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
            console.log('캐싱 데이터 있을때');
            const myData = JSON.parse(data);
            event.source.postMessage(JSON.stringify(myData));
          });
        } else {
          console.log('캐싱 데이터 없을때');
          cache
            .match(`api-data-${event.data.cacheingUrl}`)
            .then(async (response) => {
              if (response) {
                await response.text().then((data) => {
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

self.skipWaiting();
