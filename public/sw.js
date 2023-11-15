/* eslint-disable */
self.addEventListener('install', async (event) => {
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

const isResourceCached = async (cache, resource) => {
  const cachedResponse = await cache.match(resource);
  return !!cachedResponse;
};

const extractResources = (htmlText, regex) => {
  const resources = [];
  let match;
  while ((match = regex.exec(htmlText)) !== null) {
    resources.push(match[1]);
  }
  return resources;
};

const fetchAndCacheResource = async (cache, resource) => {
  const baseUrl = 'http://localhost:3000/';
  try {
    const resourceUrl = new URL(resource, baseUrl).toString();
    const response = await fetch(resourceUrl);

    await cache.put(resourceUrl, response.clone());
  } catch (error) {
    console.error(`${resource} 캐싱 실패:`, error);
  }
};

async function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

const cacheResource = async (cache, resource) => {
  try {
    if (await isResourceCached(cache, resource)) {
      return;
    }

    const response = await fetch(resource);
    await cache.put(resource, response.clone());
  } catch (error) {
    console.log('리소스 캐싱 실패:', resource, error);
  }
};

const cachedHTML = async (courseCode, htmls) => {
  const htmlCache = await caches.open('html-cache');

  for (let i = 0; i < htmls.length; i++) {
    const html = htmls[i];
    const networkResponse = await fetch(html);
    const htmlText = await networkResponse.text();

    const scriptRegex = /<script\s+src=["'](.+?)["']\s*>/gi;
    const cssRegex =
      /<link\s+rel=["']stylesheet["']\s+href=["']([^"']+)["'][^>]*>/gi;
    const imgRegex = /<img\s+src=["']([^"']+)["'][^>]*>/gi;

    const scriptPaths = extractResources(htmlText, scriptRegex);
    const cssPaths = extractResources(htmlText, cssRegex);
    const imgPaths = extractResources(htmlText, imgRegex);
    const baseUrl = 'http://localhost:3000/';

    const [scriptText, cssText, imgBlob] = await Promise.all([
      fetch(new URL(scriptPaths[0], baseUrl).toString()).then(
        (scriptResponse) => scriptResponse.text(),
      ),
      fetch(new URL(cssPaths[0], baseUrl).toString()).then((cssResponse) =>
        cssResponse.text(),
      ),
      fetch(new URL(imgPaths[0], baseUrl).toString()).then((imgResponse) =>
        imgResponse.blob(),
      ),
    ]);

    // 가져온 데이터로 HTML 리소스를 대체합니다.
    const updatedHtml = htmlText
      .replace(
        /<script\s+src=["'].+?["']\s*><\/script>/i,
        `<script>${scriptText}</script>`,
      )
      .replace(
        /<link\s+rel=["']stylesheet["']\s+href=["']([^"']+)["'][^>]*>/gi,
        `<style>${cssText}</style>`,
      )
      .replace(
        /<img\s+src=["']([^"']+)["'][^>]*>/gi,
        `<img src="data:image/png;base64,${await blobToBase64(imgBlob)}">`,
      );

    htmlCache.put(`${courseCode}-${i}`, new Response(updatedHtml), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  }
};

self.addEventListener('fetch', async (event) => {
  const cache = await caches.open('my-cache');
  const apiCache = await caches.open('api-cache');
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

    await apiCache.put(`${path}`, cacheResponse);

    for (const item of data) {
      if (item.contents) {
        for (const content of [
          ...(item.contents.videos || []),
          ...(item.contents.images || []),
          ...(item.contents.pdf || []),
        ]) {
          await cacheResource(cache, content);
        }

        cachedHTML(item.courseCode, item.contents.htmls || []);
      }
    }

    return cacheResponse;
  } else {
    await cache.put(event.request, networkResponse.clone());
    return networkResponse;
  }
});

self.addEventListener('fetch', async (event) => {
  const imageAudioVideoRegex =
    /\.(png|jpe?g|gif|svg|mp[34]|webm|ogg|wav|flac|aac|wma|m4a|opus|pdf|html)$/i;

  if (imageAudioVideoRegex.test(event.request.url)) {
    event.respondWith(
      caches.open('my-cache').then(async (cache) => {
        const response = await cache.match(event.request.url);
        console.log(
          '캐싱된 이미지, 오디오, 비디오 파일 요청:',
          event.request.url,
        );
        return response;
      }),
    );
  } else {
    event.respondWith(
      caches.open('my-cache').then((cache) => {
        return cache.match(event.request).then((response) => {
          return response || fetch(event.request);
        });
      }),
    );
  }
});

self.addEventListener('message', async (event) => {
  const { type, url, courseCode } = event.data;

  if (type === 'html') {
    const cache = await caches.open('html-cache');
    const response = await cache.match(courseCode);
    const cachedData = (await response.text()).toString();
    event.source.postMessage(JSON.stringify({ type: 'html', cachedData }));
  }

  if (type === 'data') {
    const apiCache = await caches.open('api-cache');
    const response = await apiCache.match(url);
    const data = await response.text();
    const cachedData = courseCode
      ? JSON.parse(data).filter((item) => item.courseCode === courseCode)
      : JSON.parse(data);

    event.source.postMessage(
      JSON.stringify({
        type,
        cachedData,
      }),
    );
  }
});

self.skipWaiting();
