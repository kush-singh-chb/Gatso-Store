import theme from "../theme"
import themeVendor from "../themeVendor"

export const themeReducer = (state = theme, action) => {
    switch (action.type) {
        case "SET_THEME_VENDOR":
            return state = themeVendor;
        case "SET_THEME_USER":
            return state = theme;
        default:
            return state;
    }
};

