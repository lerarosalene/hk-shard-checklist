import createSagaMiddleware from "redux-saga";
import { fork } from "redux-saga/effects";
import { configureStore } from "@reduxjs/toolkit";
import { list } from "modules/list/slice";
import { listSaga } from "modules/list/saga";

const saga = createSagaMiddleware();

export const store = configureStore({
  reducer: { list },
  middleware: [saga],
});

function* rootSaga() {
  yield fork(listSaga);
}

saga.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
