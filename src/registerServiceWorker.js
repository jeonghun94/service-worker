if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(function (registration) {
      console.log("Service Worker connect succese", registration.scope);
    })
    .catch(function (err) {
      console.log("Service Worker connect fail", err);
    });
}
