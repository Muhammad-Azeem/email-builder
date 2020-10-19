import {
    ITEM_EDIT_UPDATE_REQUEST,
    ITEMS_UPDATE_REQUEST, PREVIEW_UPDATE_REQUEST,
    UPDATE_GENERAL_SETTINGS_REQUEST
} from "../../common/constants";
import {combineReducers} from "redux";

const items = (state = null, action) => {
    const {type, payload} = action;
    switch (type)
    {
        case ITEMS_UPDATE_REQUEST:
            return payload;
        default:
            return state;
    }
};

const editItem = (state = null, action) => {
    const {type, payload} = action;
    switch (type)
    {
        case ITEM_EDIT_UPDATE_REQUEST:
            return payload;
        default:
            return state;
    }
};

const updateGeneralSettings = (state = null, action) => {
    const {type, payload} = action;
    switch (type)
    {
        case UPDATE_GENERAL_SETTINGS_REQUEST:
            return payload;
        default:
            return state;
    }
};

const previewPage = (state = null, action) => {
    const {type, payload} = action;
    switch (type)
    {
        case PREVIEW_UPDATE_REQUEST:
            return payload;
        default:
            return state;
    }
};

const itemsReducer = combineReducers({
    data: items,
    edit: editItem,
    generalSettings: updateGeneralSettings,
    preview: previewPage,
});

export default itemsReducer;