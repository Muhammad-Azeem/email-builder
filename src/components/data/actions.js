import {
    GENERAL_SETTINGS_REQUEST,
    ITEM_EDIT_REQUEST,
    ITEM_EDIT_UPDATE_REQUEST,
    ITEMS_REQUEST,
    ITEMS_UPDATE_REQUEST, PREVIEW_REQUEST, PREVIEW_UPDATE_REQUEST,
    UPDATE_GENERAL_SETTINGS_REQUEST
} from "../../common/constants";

export const isItemsRequest = (payload) => ({
    type: ITEMS_REQUEST,
    payload: payload
});

export const updateItemsRequest = (payload) => ({
    type: ITEMS_UPDATE_REQUEST,
    payload: payload
});

export const isEditItemRequest = (payload) => ({
    type: ITEM_EDIT_REQUEST,
    payload: payload
});

export const editItemRequest = (payload) => ({
    type: ITEM_EDIT_UPDATE_REQUEST,
    payload: payload
});

export const generalSettingsRequest = (payload) => ({
    type: GENERAL_SETTINGS_REQUEST,
    payload: payload
});

export const updateGeneralSettingsRequest = (payload) => ({
    type: UPDATE_GENERAL_SETTINGS_REQUEST,
    payload: payload
});

export const isPreviewRequest = (payload) => ({
    type: PREVIEW_REQUEST,
    payload: payload
});

export const previewRequest = (payload) => ({
    type: PREVIEW_UPDATE_REQUEST,
    payload: payload
});