import {put, takeEvery, all} from 'redux-saga/effects';
import {editItemRequest, previewRequest, updateGeneralSettingsRequest, updateItemsRequest} from "./actions";
import {
    EXPORT_PAGE_REQUEST,
    GENERAL_SETTINGS_REQUEST,
    ITEM_EDIT_REQUEST,
    ITEMS_REQUEST, PREVIEW_REQUEST,
} from "../../common/constants";

function* items(action) {
    yield put(updateItemsRequest(action.payload));
}

function* edit(action) {
    yield put(editItemRequest(action.payload));
}

function* updateGeneralSettings(action) {
    yield put(updateGeneralSettingsRequest(action.payload));
}

function* updatePreview(action) {
    yield put(previewRequest(action.payload));
}

function* actionWatcher() {
    yield all([
        takeEvery(ITEMS_REQUEST, items),
        takeEvery(ITEM_EDIT_REQUEST, edit),
        takeEvery(GENERAL_SETTINGS_REQUEST, updateGeneralSettings),
        takeEvery(PREVIEW_REQUEST, updatePreview),
    ])
}

export default function* itemsSaga() {
    yield all([
        actionWatcher(),
    ]);
}