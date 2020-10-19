import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from "./reducer";
import rootSaga from "./saga";


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();

const configureStore = composeEnhancers(
    applyMiddleware(sagaMiddleware),
)(createStore);

const createAppStore = () => {
    let store = configureStore(rootReducer);
    return {store};
};

export default createAppStore();

sagaMiddleware.run(rootSaga);