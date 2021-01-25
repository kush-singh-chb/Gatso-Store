import { useEffect } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Sidebar from './Sidebar';
import SignIn from './SignIn'
import SignUp from './SignUp'
import { connect } from "react-redux"
import { setLoginUser, logoutUser } from '../actions/postUser'
import { auth } from "../firebase"
import Home from "./Home"

function App({ setLoginUser, logoutUser }) {
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser !== null) {
        setLoginUser(authUser);
      } else {
        logoutUser(null);
      }
    });
  }, [setLoginUser, logoutUser]);
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
