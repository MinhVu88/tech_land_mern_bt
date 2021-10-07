import axios from "axios";
import * as types from "../constants/authConstants";
import { CLEAR_PROFILE } from "../constants/profileConstants";
import { alertActions } from "./alertActions";
import setAuthToken from "../../utils/setAuthToken";

const registerUser = ({ name, email, password }) => async dispatch => {
  const config = {
    headers: { "Content-Type": "application/json" }
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post("/api/users", body, config);

    console.log("\nres.data (registerUser | authActions) ->", res.data);

    dispatch({ type: types.REGISTER_SUCCESS, payload: res.data });

    dispatch(loadUser());
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach(error =>
        dispatch(alertActions.setAlert(error.msg, "danger"))
      );
    }

    dispatch({ type: types.REGISTER_FAIL });
  }
};

const loadUser = () => async dispatch => {
  if (localStorage.getItem("token")) {
    setAuthToken(localStorage.getItem("token"));
  }

  try {
    const res = await axios.get("/api/auth");

    console.log("\nres.data (loadUser | authActions) ->", res.data);

    dispatch({ type: types.USER_LOADED, payload: res.data });
  } catch (error) {
    dispatch({ type: types.AUTH_ERROR });
  }
};

const logAuthUserIn = (email, password) => async dispatch => {
  const config = {
    headers: { "Content-Type": "application/json" }
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/api/auth", body, config);

    console.log("\nres.data (logAuthUserIn | authActions) ->", res.data);

    dispatch({ type: types.LOGIN_SUCCESS, payload: res.data });

    dispatch(loadUser());
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach(error =>
        dispatch(alertActions.setAlert(error.msg, "danger"))
      );
    }

    dispatch({ type: types.LOGIN_FAIL });
  }
};

const logout = () => dispatch => {
  // clear auth user profile after logging out
  dispatch({ type: CLEAR_PROFILE });

  dispatch({ type: types.LOGOUT });
};

export const authActions = { registerUser, loadUser, logAuthUserIn, logout };
