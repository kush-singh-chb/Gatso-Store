export const userReducer = (state = {}, action) => {
    switch (action.type) {
        case "SET_LOGIN":
            return state = action.payload;
        case "LOGOUT":
            return state = null;
        default:
            return state;
    }
};

