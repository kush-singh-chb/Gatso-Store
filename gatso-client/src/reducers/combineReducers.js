import { userReducer } from "../reducers/userReducer";
import { combineReducers } from "redux";
import { vendorReducer } from "./vendorReducer";
import { themeReducer } from "./themeReducer";

// The key of this object will be the name of the store
const rootReducers = combineReducers({
    user: userReducer,
    vendor: vendorReducer,
    theme: themeReducer,
});

export default rootReducers;