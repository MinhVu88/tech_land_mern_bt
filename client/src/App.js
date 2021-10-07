import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import "./App.css";
import store from "./redux/store";
import LandingPage from "./components/layout/LandingPage";
import Navbar from "./components/layout/Navbar";
import setAuthToken from "./utils/setAuthToken";
import { authActions } from "./redux/actions/authActions";
import Routes from "./components/routes/Routes";

if (localStorage.getItem("token")) {
  setAuthToken(localStorage.getItem("token"));
}

const App = () => {
  useEffect(() => {
    const load_user = async () => await store.dispatch(authActions.loadUser());

    load_user();
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route component={Routes} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
