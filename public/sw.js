/* eslint-disable */
self.addEventListener('install', async (event) => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open('my-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/vite.svg',
        '/img/icons/msapplication-icon-144x144.png',
        '/offline.html',
      ]);
    }),
  );
});
const BASE_URL = 'http://localhost:3000/';
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

const cacheResource = async (cache, resource) => {
  try {
    if (await isResourceCached(cache, resource)) return;
    const response = await fetch(resource);
    await cache.put(resource, response.clone());
  } catch (error) {
    console.log('리소스 캐싱 실패:', resource, error);
  }
};

const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const extractUrlsFromCss = (cssText) => {
  const urlRegex = /url\(["']?([^"')]+)["']?\)/gi;
  const matches = cssText.match(urlRegex);
  return matches ? matches.map((match) => match.replace(urlRegex, '$1')) : [];
};

const parseCss = async (src, parsingImportCss, isInculeScript) => {
  const response = await fetch(new URL(src, BASE_URL).toString());
  let cssText = await response.text();
  const urls = extractUrlsFromCss(cssText);

  if (parsingImportCss.length > 0) {
    parsingImportCss.forEach((item) => {
      cssText = cssText.replace(`@import url("${item.src}");`, item.text);
    });
  }

  await Promise.all(
    urls.map(async (url) => {
      try {
        const urlResponse = await fetch(url);
        const dataUrl = await blobToBase64(await urlResponse.blob());
        const fileExtension = url.split('.').pop().toLowerCase();

        switch (fileExtension) {
          case 'webp':
            cssText = cssText.replace(url, `data:image/webp;base64,${dataUrl}`);
            break;
          case 'woff':
            cssText = cssText.replace(
              url,
              `data:application/font-woff;base64,${dataUrl}`,
            );
            break;
          case 'woff2':
            cssText = cssText.replace(
              url,
              `data:application/font-woff2;base64,${dataUrl}`,
            );
            break;
          case 'png':
          case 'jpg':
            cssText = cssText.replace(url, `data:image/png;base64,${dataUrl}`);
            break;
          default:
            return `data:;base64,${dataUrl}`;
        }
      } catch (error) {
        console.error(`An error occurred for URL ${url}:`, error);
      }
    }),
  );

  return { src, text: isInculeScript ? cssText : `<style>${cssText}</style>` };
};

const cachedHTML = async (courseCode, updatedCourseCodes, htmls) => {
  const htmlCache = await caches.open('html-cache');
  const htmlCacheKeys = await htmlCache.keys();

  const keysToDelete = htmlCacheKeys.filter((key) => {
    const keyUrl = key.url;
    const keyCourseCode = keyUrl
      .substring(keyUrl.lastIndexOf('/') + 1)
      .split('-')[0];

    return !updatedCourseCodes.includes(keyCourseCode);
  });

  await Promise.all(keysToDelete.map((key) => htmlCache.delete(key)));

  for (let i = 0; i < htmls.length; i++) {
    const currentHTML = htmls[i];
    const networkResponse = await fetch(currentHTML);
    const currentHTMLText = await networkResponse.text();

    const scriptRegex =
      /<script(?:\s+type="text\/javascript")?\s+src=["'](.+?)["']\s*>/gi;

    const cssRegex =
      /<link\s+rel=["']stylesheet["']\s+(?:type=["']text\/css["']\s+)?href=["']([^"']+)["'][^>]*>/gi;

    const imgRegex = /<img\s+src=["']([^"']+)["']([^>]*)>/gi;

    const scriptPaths = extractResources(currentHTMLText, scriptRegex);
    const cssPaths = extractResources(currentHTMLText, cssRegex);
    const imgPaths = extractResources(currentHTMLText, imgRegex);

    const scriptResources = await Promise.all(
      scriptPaths.map(async (src) => {
        const response = await fetch(new URL(src, BASE_URL).toString());

        return {
          src,
          text: `<script>${await response.text()}</script>`,
        };
      }),
    );

    const getImporteCssPath = await Promise.all(
      cssPaths.map(async (src) => {
        const response = await fetch(new URL(src, BASE_URL).toString());
        let cssText = await response.text();
        let urls = extractUrlsFromCss(cssText);

        return urls.filter(
          (url) => url.split('.').pop().toLowerCase() === 'css',
        );
      }),
    );

    // 재귀적으로 import된 css 파일을 파싱
    const parsingImportCss = await Promise.all(
      getImporteCssPath.flat().map((src) => parseCss(src, [], true)),
    );

    const cssResources = await Promise.all(
      cssPaths.map((src) => parseCss(src, parsingImportCss)),
    );

    const imgResources = await Promise.all(
      imgPaths.map(async (src) => {
        const response = await fetch(new URL(src, BASE_URL).toString());
        const blob = await blobToBase64(await response.blob());
        return { src, blob };
      }),
    );

    const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const replaceResources = async (currentText, resources, type) => {
      let updatedText = currentText;

      for (const { src, text, blob } of resources) {
        let regexPattern = '';

        if (type === 'script') {
          regexPattern = `<script(?:\\s+type="text\\/javascript")?\\s+src=["']${escapeRegExp(
            src,
          )}["']\\s*>([\\s\\S]*?)<\\/script>`;
        } else if (type === 'style') {
          regexPattern = `<link\\s+rel=["']stylesheet["'](?:\\s+type=["'](text\\/css)?["'])?\\s+href=["']${escapeRegExp(
            src,
          )}["'][^>]*>`;
        } else if (type === 'img') {
          regexPattern = `<img\\s+src=["']${escapeRegExp(src)}["']([^>]*)>`;
        }

        const resourceRegex = new RegExp(regexPattern, 'gi');
        if (type !== 'img') {
          updatedText = updatedText.replace(
            resourceRegex,
            text.replace('-$&', '-$\\&'),
          );
        } else {
          updatedText = updatedText.replace(
            resourceRegex,
            (match, rest) => `<img src="data:image/png;base64,${blob}"${rest}>`,
          );
        }
      }

      return updatedText;
    };

    let updatedHTMLText = currentHTMLText;

    updatedHTMLText = await replaceResources(
      currentHTMLText,
      scriptResources,
      'script',
    );
    updatedHTMLText = await replaceResources(
      updatedHTMLText,
      cssResources,
      'style',
    );
    updatedHTMLText = await replaceResources(
      updatedHTMLText,
      imgResources,
      'img',
    );

    htmlCache.put(`${courseCode}-${i}`, new Response(updatedHTMLText), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  }
};

const getItemsAroundToday = (data) => {
  const today = new Date().toISOString().split('T')[0];
  const todayIndex = data.findIndex((item) => item.startDate === today);

  if (todayIndex === -1) {
    return [];
  }

  const start = Math.max(0, todayIndex - 1);
  const end = Math.min(data.length - 1, todayIndex + 1);

  if (todayIndex === 0) {
    return data.slice(todayIndex, end + 2);
  } else if (todayIndex === data.length - 1) {
    return data.slice(Math.max(0, todayIndex - 2), todayIndex + 1);
  } else {
    return data.slice(start, end + 1);
  }
};

const cacheClassData = async (cache, data) => {
  const updatedCourseCodes = [];
  const result = getItemsAroundToday(data);

  for (const { contents, courseCode } of result) {
    const { videos = [], images = [], pdf = [], htmls = [] } = contents;
    for (const content of [...videos, ...images, ...pdf]) {
      await cacheResource(cache, content);
    }

    if (htmls.length > 0) {
      updatedCourseCodes.push(courseCode);
      cachedHTML(courseCode, updatedCourseCodes, htmls);
    }
  }
};

const cacheApiData = async (cache, data, event) => {
  const cacheResponse = new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });

  const url = new URL(event.request.url);
  const path = url.pathname + url.search;
  await cache.put(`${path}`, cacheResponse);
};

const cacheDetailData = async (cache, data) => {
  const originPath = self.location.origin;

  for (const item of data) {
    const courseCode = item.courseCode;
    const courseUrl = `${originPath}/course/${courseCode}`;
    const response = await fetch(courseUrl);

    if (response.ok) await cache.put(courseUrl, response.clone());
  }
};

self.addEventListener('fetch', async (event) => {
  const cache = await caches.open('my-cache');
  const apiCache = await caches.open('api-cache');

  const networkResponse = await fetch(event.request);
  if (event.request.url.includes('/api')) {
    const data = await networkResponse.json();

    cacheApiData(apiCache, data, event);
    cacheDetailData(cache, data);
    cacheClassData(cache, data);
  } else {
    await cache.put(event.request, networkResponse.clone());
    return networkResponse;
  }
});

self.addEventListener('fetch', async (event) => {
  const imageAudioVideoRegex =
    /\.(png|jpe?g|gif|svg|mp[34]|webm|ogg|wav|flac|aac|wma|m4a|opus|pdf|html|xhtml)$/i;
  const isRegexMatched = imageAudioVideoRegex.test(event.request.url);

  event.respondWith(
    caches
      .open('my-cache')
      .then(
        async (cache) =>
          (await cache.match(
            isRegexMatched ? event.request.url : event.request,
          )) || fetch(event.request),
      ),
  );
});

self.addEventListener('message', async (event) => {
  const { type, url, courseCode } = event.data;

  if (type === 'html') {
    const cache = await caches.open('html-cache');
    const keys = await cache.keys();
    const filteredKeys = keys.filter((item) => item.url.includes(courseCode));
    const cachedData = await Promise.all(
      filteredKeys.map(async (item) => (await cache.match(item.url)).text()),
    );

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
