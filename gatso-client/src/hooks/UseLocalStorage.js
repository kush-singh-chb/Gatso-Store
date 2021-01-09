import { createStore, applyMiddleware, compose } from "redux";
import rootReducers from "../reducers/combineReducers";
import throttle from "lodash/throttle";
import thunk from "redux-thunk";
const middleware = [thunk];

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem("state");
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("state", serializedState);
    } catch (err) {
        console.warn(err.message);
    }
};
const persistedState = loadState();
const store = createStore(
    rootReducers,
    persistedState,
    compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);
store.subscribe(
    throttle(() => {
        saveState({
            user: store.getState().user,
        });
    }, 1000)
);
export default store;
