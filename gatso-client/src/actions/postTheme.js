const setThemeVendor = () => (dispatch) => {
    dispatch({
        type: 'SET_THEME_VENDOR'
    })
}

const setThemeUser = () => (dispatch) => {
    dispatch({
        type: 'SET_THEME_USER'
    })
}


export { setThemeVendor, setThemeUser };