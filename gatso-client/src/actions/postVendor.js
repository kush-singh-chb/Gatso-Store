const setVendor = () => (dispatch) => {
    dispatch({
        type: 'SET_VENDOR'
    })
}

const unSetVendor = () => (dispatch) => {
    dispatch({
        type: 'UNSET_VENDOR'
    })
}


export { setVendor, unSetVendor };
