const setLoginUser = (authUser) => (dispatch) => {
  dispatch({
    type: "SET_LOGIN",
    payload: authUser,
  });
};

export { setLoginUser };
