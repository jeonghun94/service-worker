/* eslint-disable */
self.addEventListener('install', function (event) {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open('my-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/vite.svg',
        '/img/js-logo.png',
        '/offline.html',
        '/testVideo.mp4',
        '/img/icons/msapplication-icon-144x144.png',
      ]);
    }),
  );
});

const cacheResource = async (cache, resource) => {
  try {
    const response = await fetch(resource);
    await cache.put(resource, response.clone());
  } catch (error) {
    // 처리하거나 로깅할 수 있음
  }
};

self.addEventListener('fetch', async (event) => {
  const cache = await caches.open('my-cache');
  const cachedResponse = await cache.match(event.request);

  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await fetch(event.request);

  if (event.request.url.includes('/api')) {
    const data = await networkResponse.json();
    const cacheResponse = new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

    const url = new URL(event.request.url);
    const path = url.pathname + url.search;

    await cache.put(`api-data-${path}`, cacheResponse);

    for (const item of data) {
      if (item.contents) {
        for (const content of [
          ...(item.contents.videos || []),
          ...(item.contents.images || []),
          ...(item.contents.pdf || []),
        ]) {
          await cacheResource(cache, content);
        }
      }
    }

    return cacheResponse;
  } else {
    await cache.put(event.request, networkResponse.clone());
    return networkResponse;
  }
});

self.addEventListener('fetch', async (event) => {
  event.respondWith(
    caches.open('my-cache').then((cache) => {
      return cache.match(event.request).then((response) => {
        return response || fetch(event.request);
      });
    }),
  );

  const imageAudioVideoRegex =
    /\.(png|jpe?g|gif|svg|mp[34]|webm|ogg|wav|flac|aac|wma|m4a|opus|pdf)$/i;

  if (imageAudioVideoRegex.test(event.request.url)) {
    event.respondWith(
      caches.open('my-cache').then((cache) => {
        return cache.match(event.request.url).then((response) => {
          console.log(
            '캐싱된 이미지, 오디오, 비디오 파일 요청:',
            event.request.url,
          );
          return response;
        });
      }),
    );
  }
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
