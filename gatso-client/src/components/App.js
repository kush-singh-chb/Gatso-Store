import { useEffect } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Sidebar from './Sidebar';
import SignIn from './SignIn'
import SignUp from './SignUp'
import { connect } from "react-redux"
import { setLoginUser, logoutUser } from '../actions/postUser'
import { auth } from "../firebase"
import Home from "./Home"
import VendorDash from './VendorDash'
import VendorSignUp from './VendorSignup'
import VendorSignIn from './VendorSignIn'
import { setVendor, unSetVendor } from "../actions/postVendor";


function App({ setLoginUser, user, vendor, logoutUser, setVendor, unSetVendor }) {
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser !== null) {
        auth.currentUser.getIdTokenResult(true).then(response => {
          (response.claims.vendor != undefined && response.claims.vendor) ? setVendor() : unSetVendor()
          auth['back_id'] = response.claims.back_id != null ? response.claims.back_id : null;
          setLoginUser(authUser);
        })
      } else {
        logoutUser(null);
      }
    });
  }, [setLoginUser, logoutUser, setVendor, unSetVendor]);

  let component = null
  if (user == null) {
    component = <Sidebar>
      <Home />
    </Sidebar>
  } else if ((user != null && !vendor)) {
    component = <Sidebar>
      <Home />
    </Sidebar>
  } else {
    component = <VendorDash>
      <p>This is vendor Dashboard</p>
    </VendorDash>
  }

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
          <Route path="/vendor-signup">
            <VendorSignUp />
          </Route>
          <Route path="/vendor-signin">
            <VendorSignIn />
          </Route>
          <Route path="/">
            {component}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    vendor: state.vendor
  };
};
export default connect(mapStateToProps, { setLoginUser, logoutUser, unSetVendor, setVendor })(App);
