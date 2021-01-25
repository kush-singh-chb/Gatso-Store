const setLoginUser = (authUser) => (dispatch) => {
  dispatch({
    type: "SET_LOGIN",
    payload: authUser,
  });
};

const logoutUser = () => (dispatch) => {
  dispatch({
    type: "LOGOUT"
  });
};

export { setLoginUser, logoutUser };
