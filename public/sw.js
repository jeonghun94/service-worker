/* eslint-disable */
self.addEventListener('install', function (event) {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open('my-cache').then((cache) => {
      return cache.addAll(['/public/img/js-logo.png', '/public/offline.html']);
    }),
  );
});

self.addEventListener('activate', function (event) {
  console.log('Service Worker activating.');
});

self.addEventListener('fetch', function (event) {
  console.log('Fetch request for: ', event.request.url, event.request.mode);

  if (event.request.url.includes('/api/')) {
    console.log('api 요청');

    event.respondWith(
      // /api가 포함된 URL로 요청 보내기
      fetch(event.request)
        .then(function (response) {
          // JSON 형식으로 응답 데이터 파싱
          return response.json();
        })
        .then(function (data) {
          // 파싱된 JSON 데이터를 콘솔에 출력
          console.log('API 응답 데이터:', data);

          return caches.open('my-cache').then((cache) => {
            // 요청 URL을 기반으로 새로운 요청 객체 생성
            const cacheRequest = new Request(event.request.url);

            // 데이터를 캐시에 저장
            return cache.put(
              cacheRequest,
              new Response(JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
              }),
            );
          });
        })
        .catch(function (error) {
          console.log('API 요청 실패:', error);
        }),
    );
  }

  caches.open('my-cache').then((cache) => {
    cache.match(event.request).then((response) => {
      if (response) {
        return response;
      } else {
        return fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }
    });
  });
});

// self.addEventListener('fetch', function (event) {
//   console.log('Fetch request for: ', event.request.url, event.request.mode);
// });

// self.addEventListener('fetch', (event) => {
//   const request = new Request('/index.html');

//   caches.open('my-cache').then((cache) => {
//     cache.match(request).then((response) => {
//       if (response) {
//         console.log('캐시에서 찾음');
//       } else {
//         console.log('캐시에서 찾지 못함');
//       }
//     });
//   });
// });

// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     fetch(event.request).catch(function () {
//       if (event.request.url.endsWith('/img/js-logo.png')) {
//         // 이미지 요청인 경우 상대 경로를 수정하여 캐시에서 찾습니다.
//         return caches.match('/public/img/js-logo.png');
//       }
//       return caches.match('/public/offline.html');
//     }),
//   );
// });

// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     caches.match(event.request).then(function (response) {
//       // 캐시에 해당 요청에 대한 응답이 있는 경우, 해당 응답을 반환
//       console.log(event.request.url, 'event.request.url');
//       if (response) {
//         return response;
//       }

//       // 캐시에 없는 경우, 네트워크에서 요청을 수행하고 응답을 받아 캐시에 저장한 후 반환
//       // return fetch(event.request).then(function (networkResponse) {
//       //   // 캐시에 새로운 요청과 응답을 저장
//       //   caches.open('my-cache').then(function (cache) {
//       //     cache.put(event.request, networkResponse.clone());
//       //   });

//       //   return networkResponse;
//       // });

//       return fetch(event.request).then(function (networkResponse) {
//         // 여기에서 Response 객체를 직접 사용하고 복사(clone)하지 않습니다.
//         // 이미 사용된 Response를 반환합니다.
//         return networkResponse;
//       });
//     }),
//   );
// });

// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     fetch(event.request)
//       .then(function (response) {
//         if (event.request.method === 'GET') {
//           // Axios로 받아온 데이터를 캐시에 저장
//           console.log(response, 'response 받음');
//           caches.open('my-2-cache').then(function (cache) {
//             cache.put(event.request, response);
//           });
//         }
//         return response;
//       })
//       .catch(function () {
//         // 네트워크에서 데이터를 가져오지 못한 경우, 캐시에서 찾음
//         console.log('캐치문들어옴');

//         return caches.match(event.request);
//       }),
//   );
// });

const imagedelivery = (url) => {
  return `https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${url}/public`;
};

self.addEventListener('message', (event) => {
  console.log('서비스 워커에서 메시지 수신:', event.data);
  if (event.data === 'data') {
    console.log('서비스 워커에서 데이터 전송');
    event.source.postMessage(
      JSON.stringify([
        {
          courseName: '조정훈의 프로그래밍 기초',
          instructorName: '김영수',
          courseCode: 'C101',
          courseDescription: '프로그래밍의 기초를 배우는 수업입니다.',
          courseSchedule: '월, 수, 금 10:00 AM - 12:00 PM',
          startDate: '2023-01-16',
          endDate: '2023-03-24',
          creationDate: '2023-01-10',
          courseThumbnail: imagedelivery(
            '70289684-e162-4336-f465-9976c78efe00',
          ),
        },
        {
          courseName: '웹 디자인 입문',
          instructorName: '이지은',
          courseCode: 'WD201',
          courseDescription: '웹 디자인의 기초를 배우는 수업입니다.',
          courseSchedule: '화, 목 2:00 PM - 4:00 PM',
          startDate: '2023-02-05',
          endDate: '2023-04-12',
          creationDate: '2023-01-20',
          courseThumbnail: imagedelivery(
            'f92dc5f6-e421-4d85-1310-6cddf408fe00',
          ),
        },
        {
          courseName: '데이터 분석 실무',
          instructorName: '박성준',
          courseCode: 'DA301',
          courseDescription: '실무에서 활용하는 데이터 분석 기술을 학습합니다.',
          courseSchedule: '수, 금 9:00 AM - 11:00 AM',
          startDate: '2023-03-10',
          endDate: '2023-05-18',
          creationDate: '2023-02-15',
          courseThumbnail: imagedelivery(
            'f92dc5f6-e421-4d85-1310-6cddf408fe00',
          ),
        },
        {
          courseName: '영어 회화 수업',
          instructorName: 'Sarah Johnson',
          courseCode: 'E101',
          courseDescription: '일상적인 영어 회화 능력을 향상시키는 수업입니다.',
          courseSchedule: '월, 수 4:00 PM - 6:00 PM',
          startDate: '2023-02-20',
          endDate: '2023-04-26',
          creationDate: '2023-01-30',
          courseThumbnail: imagedelivery(
            'f92dc5f6-e421-4d85-1310-6cddf408fe00',
          ),
        },
        {
          courseName: '금융 투자 전략',
          instructorName: '이재영',
          courseCode: 'FI401',
          courseDescription: '금융 시장에서의 투자 전략을 학습합니다.',
          courseSchedule: '화, 목 6:30 PM - 8:30 PM',
          startDate: '2023-03-15',
          endDate: '2023-05-23',
          creationDate: '2023-02-10',
          courseThumbnail: imagedelivery(
            'f92dc5f6-e421-4d85-1310-6cddf408fe00',
          ),
        },
        {
          courseName: '사진촬영 기술',
          instructorName: '박지원',
          courseCode: 'P201',
          courseDescription: '다양한 사진 촬영 기술을 익히는 수업입니다.',
          courseSchedule: '토, 일 10:00 AM - 12:00 PM',
          startDate: '2023-02-25',
          endDate: '2023-04-30',
          creationDate: '2023-02-01',
          courseThumbnail: imagedelivery(
            'f92dc5f6-e421-4d85-1310-6cddf408fe00',
          ),
        },
        {
          courseName: '요리 마스터 클래스',
          instructorName: '이지영',
          courseCode: 'CUL501',
          courseDescription: '세계 각국의 요리를 마스터하는 수업입니다.',
          courseSchedule: '목, 토 6:00 PM - 8:00 PM',
          startDate: '2023-03-05',
          endDate: '2023-05-13',
          creationDate: '2023-02-05',
          courseThumbnail: imagedelivery(
            'f92dc5f6-e421-4d85-1310-6cddf408fe00',
          ),
        },
        {
          courseName: '스포츠 마케팅',
          instructorName: '홍성민',
          courseCode: 'SM301',
          courseDescription: '스포츠 관련 마케팅 전략을 학습합니다.',
          courseSchedule: '수, 금 3:00 PM - 5:00 PM',
          startDate: '2023-02-10',
          endDate: '2023-04-18',
          creationDate: '2023-01-25',
          courseThumbnail: imagedelivery(
            'f92dc5f6-e421-4d85-1310-6cddf408fe00',
          ),
        },
        {
          courseName: '인공지능 기초',
          instructorName: '김재환',
          courseCode: 'AI201',
          courseDescription: '인공지능의 기초 이론과 응용을 다루는 수업입니다.',
          courseSchedule: '월, 수 1:30 PM - 3:30 PM',
          startDate: '2023-03-01',
          endDate: '2023-05-09',
          creationDate: '2023-02-03',
          courseThumbnail: imagedelivery(
            'f92dc5f6-e421-4d85-1310-6cddf408fe00',
          ),
        },
        {
          courseName: '영화 제작 기술',
          instructorName: '이미영',
          courseCode: 'FILM401',
          courseDescription: '영화 제작에 필요한 기술과 기법을 학습합니다.',
          courseSchedule: '토, 일 2:30 PM - 4:30 PM',
          startDate: '2023-03-08',
          endDate: '2023-05-14',
          creationDate: '2023-02-08',
          courseThumbnail: imagedelivery(
            'f92dc5f6-e421-4d85-1310-6cddf408fe00',
          ),
        },
      ]),
    );
  }
});

self.skipWaiting();
