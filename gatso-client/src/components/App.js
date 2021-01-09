import './App.css';
import { useEffect } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Sidebar from './Sidebar';
import SignIn from './SignIn'
import SignUp from './SignUp'
import { connect } from "react-redux"
import { setLoginUser } from '../actions/postUser'
import { auth } from "../firebase/firebaseConfig"

function App({ setLoginUser }) {
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      console.log(authUser)
      if (authUser !== null) {
        setLoginUser(authUser);
      } else {
        setLoginUser(null);
      }
    });
  }, [setLoginUser]);
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
              <div>Hello World</div>
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
export default connect(mapStateToProps, { setLoginUser })(App);
