import {useEffect, useState} from "react"
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
import vendorTheme from '../themeVendor'
import { setVendor, unSetVendor } from "../actions/postVendor";
import { setThemeUser, setThemeVendor } from "../actions/postTheme";
import { ThemeProvider } from "@material-ui/core";


function App({ setLoginUser, user, vendor, theme, logoutUser, setVendor, unSetVendor, setThemeVendor, setThemeUser }) {

  const [component, setComponent] = useState(null)

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser !== null) {
        auth.currentUser.getIdTokenResult().then(response => {
          (response.claims.vendor !== undefined && response.claims.vendor) ? setVendor() : unSetVendor()
          if (response.claims.vendor !== undefined && response.claims.vendor) {
            setThemeVendor()
          } else {
            setThemeUser()
          }
          authUser['back_id'] = response.claims.back_id != null ? response.claims.back_id : null;
          setLoginUser(authUser);
          if(response.claims.vendor !== undefined && response.claims.vendor){
            setComponent(<VendorDash/>)
          }
        })
      } else {
        logoutUser(null);
        setComponent((<Sidebar>
          <Home />
        </Sidebar>))
      }
    });
  }, [setLoginUser, logoutUser, setVendor, unSetVendor, setThemeUser, setThemeVendor,setComponent]);





  return (
    <ThemeProvider theme={theme}>
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
              <ThemeProvider theme={vendorTheme}>
                <VendorSignUp />
              </ThemeProvider>
            </Route>
            <Route path="/vendor-signin">
              <ThemeProvider theme={vendorTheme}>
                <VendorSignIn />
              </ThemeProvider>
            </Route>
            <Route path="/">
              {component}
            </Route>
          </Switch>
        </div>
      </Router>
    </ThemeProvider>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    vendor: state.vendor,
    theme: state.theme
  };
};
export default connect(mapStateToProps, { setLoginUser, logoutUser, unSetVendor, setVendor, setThemeVendor, setThemeUser })(App);
