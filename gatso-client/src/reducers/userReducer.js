const initialState = {
    user: {}
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_LOGIN":
            return { ...state, user: action.payload }
        default:
            return state;
    }
};

