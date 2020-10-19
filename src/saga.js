import {all} from "redux-saga/effects";
import itemsSaga from "./components/data/saga";

export default function* rootSaga() {
    yield all([
        itemsSaga()
    ]);
}