if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then((registration) => {
      console.log('Service Worker connect succese', registration.scope);
    })
    .catch((err) => {
      console.log('Service Worker connect fail', err);
    });
}
