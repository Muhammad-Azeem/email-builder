import {combineReducers} from "redux";
import itemsReducer from "./components/data/reducer";

const appReducer = combineReducers({
        items: itemsReducer
});

const rootReducer = (state, action) => {
    return appReducer(state, action);
};

export default rootReducer;