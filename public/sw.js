const responseContent =
  "<html>" +
  "<body>" +
  "<style>" +
  "body {text-align: center; background-color: #333; color: #eee;}" +
  "</style>" +
  "<h1>Gotham Imperial Hotel</h1>" +
  "<p>There seems to be a problem with your connection.</p>" +
  "<p>Come visit us at 1 Imperial Plaza, Gotham City for free WiFi.</p>" +
  "</body>" +
  "</html>";

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((cachedResponse) => {
//       console.log("fetch", cachedResponse);
//       if (cachedResponse) {
//         // 캐시에서 리소스를 찾았을 경우, 해당 리소스를 반환
//         return cachedResponse;
//       }

//       // 캐시에 해당 리소스가 없을 경우, 네트워크 요청을 수행
//       return fetch(event.request);
//     })
//   );
// });

self.addEventListener("install", function (event) {
  console.log("Service Worker installing.");

  event.waitUntil(
    // 캐시를 열고 원하는 리소스를 캐싱합니다.
    caches.open("my-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        // 다른 파일 및 리소스 추가
      ]);
    })
  );
});

self.addEventListener("activate", function (event) {
  console.log("Service Worker activating.");
});

self.addEventListener("fetch", function (event) {
  // console.log("Fetch request for: ", event.request.url, event.request.mode);
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    fetch(event.request).catch(function () {
      const options = {
        title: "오류 났다",
        body: "서비스 오프라인이다",
        icon: "icon.png",
      };

      self.registration.showNotification(options.title, options);

      return new Response(responseContent, {
        headers: { "Content-Type": "text/html" },
      });
    })
  );
});

self.addEventListener("message", (event) => {
  console.log("서비스 워커에서 메시지 수신:", event.data);
  event.source.postMessage("안녕하세요! 서비스 워커에서 응답합니다.");
});

self.addEventListener("push", function (event) {
  const options = {
    title: "푸시 알림 제목",
    body: event.data.text(),
    icon: "icon.png",
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

self.skipWaiting(() => {
  console.log("skipWaiting");
  console.log(self.registration);
});

// console.log(self.registration, "self.registration");
