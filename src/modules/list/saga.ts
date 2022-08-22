import { takeEvery, put, call, select } from "redux-saga/effects";
import { JsonData, LOAD_DATA, selectClearedEntries, setContents, setDone, setDoneBatch, setLoaded } from "./slice";

type UnWrap<T> = T extends (...args: any[]) => Promise<infer U> ? U : never;

const LOCAL_STORAGE_KEY = 'hk-completion';

function* loadDataSaga() {
  try {
    const response: UnWrap<typeof fetch> = yield call(fetch, "./data.json");
    const data: JsonData = yield call([response, "json"]);

    yield put(setContents(data));

    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData !== null) {
      const entries = savedData.split(',');
      yield put(setDoneBatch({ entries }));
    }

    yield put(setLoaded(true));
  } catch (error) {
    console.error(error);
  }
}

function* saveDataSaga() {
  const clearedEntries: ReturnType<typeof selectClearedEntries>
    = yield select(selectClearedEntries);

  const serialized = clearedEntries.join(',');
  localStorage.setItem(LOCAL_STORAGE_KEY, serialized);
}

export function* listSaga() {
  yield takeEvery(LOAD_DATA, loadDataSaga);
  yield takeEvery(setDone.type, saveDataSaga);
}
