if ("serviceWorker" in navigator) {
  const scriptContent = `
  const responseContent = "오프라인이야!!!!!!!!!!!";


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

self.skipWaiting();
// console.log(self.registration, "self.registration");

`;

  const blob = new Blob([scriptContent], { type: "application/javascript" });
  const blobURL = URL.createObjectURL(blob);

  navigator.serviceWorker
    .register(blobURL)
    .then(function (registration) {
      console.log("Service Worker connect succese", registration.scope);
    })
    .catch(function (err) {
      console.log("Service Worker connect fail", err);
    });
}
