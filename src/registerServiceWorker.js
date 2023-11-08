if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then((registration) => {
      console.log('Service Worker connect succese', registration.scope);
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'activated') {
            // 새로운 서비스 워커가 활성화되면 페이지 리로드
            window.location.reload();
          }
        });
      });
    })
    .catch((err) => {
      console.log('Service Worker connect fail', err);
    });
}
