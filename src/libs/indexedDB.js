/* eslint-disable */
const tableName = 'indexedTable';
const dbName = 'indexedDB';
const version = 1000;
let request = null;
let db = null;

export const ctoolDBOpen = () => {
  if (!window.indexedDB) {
    console.log('현재 웹 브라우저는 indexedDB를 지원하지 않습니다.');
    return;
  }

  request = indexedDB.open(dbName, version);

  request.onupgradeneeded = (event) => {
    db = request.result;
    db.createObjectStore(tableName, { keyPath: 'id' });
  };

  request.onsuccess = (event) => {
    db = request.result;
    const transaction = db.transaction(tableName, 'readwrite');
    const objectStore = transaction.objectStore(tableName);
    objectStore.clear();
  };

  request.onerror = (event) => {
    console.error(event);
  };
};

export const ctoolTableReset = () => {
  db = request.result;
  const transaction = db.transaction(tableName, 'readwrite');
  const objectStore = transaction.objectStore(tableName);
  objectStore.clear();
};

export const ctoolInsert = (id, value) => {
  const obj = {
    id,
    value,
  };
  const transaction = db.transaction(tableName, 'readwrite');
  const objectStore = transaction.objectStore(tableName);
  objectStore.add(obj);
};

export const ctoolUpdate = (id, value) => {
  const obj = {
    id,
    value,
  };
  const transaction = db.transaction(tableName, 'readwrite');
  const objectStore = transaction.objectStore(tableName);
  objectStore.put(obj);
};

export const ctoolDelete = (key) => {
  if (key == null) return;
  const transaction = db.transaction(tableName, 'readwrite');
  const objectStore = transaction.objectStore(tableName);
  objectStore.delete(key);
};

export const ctoolSelect = (start = 0, end = 20) => {
  const transaction = db.transaction(tableName, 'readonly');
  const objectStore = transaction.objectStore(tableName);

  const key = null;
  const mCursor = objectStore.openCursor(key, 'next');

  let cursoridx = 0;
  const limitstart = start;
  const limitend = start + end;
  const resultValue = [];

  return new Promise((resolve, reject) => {
    mCursor.onsuccess = (event) => {
      const cursor = event.target.result;
      // check. 더이상 커서가 없으면 리턴
      if (!cursor) {
        return resolve(resultValue);
      }
      // check. 제한 갯수를 넘으면 리턴
      if (cursoridx >= limitend) {
        return resolve(resultValue);
      }
      // check. 정상 범위이면 커서 정보를 담기
      // 시작 포인트 아니면 패스
      if (cursoridx >= limitstart) {
        resultValue.push(cursor.value);
      }
      cursoridx++;
      cursor.continue();
    };
    mCursor.onerror = (event) => {
      reject(new Error('Cursor error: ' + event.target.errorCode));
    };
  });
};

export const ctoolSelectKey = (key) => {
  if (key == null) return;
  const transaction = db.transaction(tableName, 'readonly');
  const objectStore = transaction.objectStore(tableName);
  const rlt = [];
  const objStoreRequest = objectStore.get(key);
  objStoreRequest.onsuccess = (e) => {
    rlt.push(objStoreRequest.result);
  };
  return rlt;
};
