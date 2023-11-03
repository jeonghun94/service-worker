/* eslint-disable */

let db = null;
let request = null;
const dbName = 'ctoolIndexedDB'; // db명
const version = 1000;
const tableName = 'ctoolWebRtc';

/**
 * open indexedDB
 */
export const ctoolDBOpen = () => {
  // check. support web browser

  if (!window.indexedDB) {
    console.log('현재 웹 브라우저는 indexedDB를 지원하지 않습니다.');
    return;
  }

  // IDBOpenDBRequest
  request = indexedDB.open(dbName, version);
  const names = [
    { id: '4', value: 'a' },
    { id: '2', value: 'b' },
    { id: '3', value: 'c' },
  ];
  request.onupgradeneeded = (event) => {
    db = request.result;
    const key = 'id';

    const store = db.createObjectStore(tableName, { keyPath: key });
    // const obj = {
    // 	[key]: "1",
    // 	value: "name"
    // };
    //store.put(obj);

    for (const name of names) {
      // const request = store.add(name);
    }
  };
  request.onsuccess = (event) => {
    db = request.result;
    // IDBTransaction
    const transaction = db.transaction(tableName, 'readwrite');
    // IDBObjectStore
    const objectStore = transaction.objectStore(tableName);
    // clear
    objectStore.clear();
  };

  request.onerror = (event) => {
    console.error(event);
  };
};

/**
 * delete all indexedDB table
 */
export const ctoolTableReset = () => {
  db = request.result;
  // IDBTransaction
  const transaction = db.transaction(tableName, 'readwrite');
  // IDBObjectStore
  const objectStore = transaction.objectStore(tableName);
  objectStore.clear();
};

/**
 * insert indexedDB table row
 */
export const ctoolInsert = (key, value) => {
  const transaction = db.transaction(tableName, 'readwrite');
  // IDBObjectStore
  const objectStore = transaction.objectStore(tableName);

  const obj = {
    id: key,
    value: value,
  };

  console.log(obj);

  const request2 = objectStore.add(obj);
  request2.onsuccess = (event) => {};

  const d = objectStore.get(key);

  const select1 = ctoolSelect().then((data) => {});
};

/**
 * update indexedDB table row
 */
export const ctoolUpdate = (key, value) => {
  const transaction = db.transaction(tableName, 'readwrite');
  const objectStore = transaction.objectStore(tableName);
  const obj = {
    id: key,
    value: value,
  };
  const request2 = objectStore.put(obj);
};

/**
 * delete indexedDB table row
 */
export const ctoolDelete = (key) => {
  if (key == null) return;
  const transaction = db.transaction(tableName, 'readwrite');
  const objectStore = transaction.objectStore(tableName);
  objectStore.delete(key);
};

/**
 * select indexedDB table rows
 * set promise
 */
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

/**
 * select indexedDB table row by Key
 */
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
