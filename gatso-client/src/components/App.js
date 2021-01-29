import { useEffect, useState } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Sidebar from './Sidebar';
import SignIn from './SignIn'
import SignUp from './SignUp'
import { connect } from "react-redux"
import { setLoginUser, logoutUser } from '../actions/postUser'
import { auth } from "../firebase"
import Home from "./Home"

function App({ setLoginUser, logoutUser, user }) {
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      console.log(authUser)
      if (authUser !== null) {
        auth.currentUser.getIdTokenResult(true).then(response => {
          authUser["vendor"] = response.claims.vendor != null ? response.claims.vendor : false
          authUser["back_id"] = response.claims.back_id != null ? response.claims.back_id : null
          setLoginUser(authUser);
        })
      } else {
        logoutUser(null);
      }
    });
  }, [setLoginUser, logoutUser, auth.onAuthStateChanged]);
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/sign-up">
            <SignUp />
          </Route>
          <Route path="/sign-in">
            <SignIn />
          </Route>
          <Route path="/">
            {user != null && user.vendor &&
              <p>This is a vendor</p>
            }
            <Sidebar>

              <Home />
            </Sidebar>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
export default connect(mapStateToProps, { setLoginUser, logoutUser })(App);
