export const vendorReducer = (state = false, action) => {
    switch (action.type) {
        case "SET_VENDOR":
            return state = true;
        case "LOGOUT":
            return state = false;
        default:
            return state;
    }
};

