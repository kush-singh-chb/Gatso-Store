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
import { setVendor, unSetVendor } from "../actions/postVendor";
import axios from "../axios"


function App({ setLoginUser, user, vendor, logoutUser, setVendor, unSetVendor }) {
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser !== null) {
        auth.currentUser.getIdTokenResult(true).then(response => {
          (response.claims.vendor != null && response.claims.vendor) ? setVendor() : unSetVendor()
          auth['back_id'] = response.claims.back_id != null ? response.claims.back_id : null;
          setLoginUser(authUser);
        })
      } else {
        logoutUser(null);
      }
    });
  }, [setLoginUser, logoutUser, setVendor, unSetVendor]);
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
          <Route path="/">
            {(user == null && !vendor) ?
              <Sidebar>
                <Home />
              </Sidebar> :
              <VendorDash>
                <p>This is a vendor Dashboard</p>
              </VendorDash>
            }
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
