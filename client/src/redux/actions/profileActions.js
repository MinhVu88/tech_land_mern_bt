import * as types from "../constants/profileConstants";
import axios from "axios";
import { alertActions } from "./alertActions";

const getCurrentProfile = () => async dispatch => {
  try {
    // no need to pass id or anything as the token that's
    // sent along with the get request contains the id in it
    const res = await axios.get("/api/profile/me");

    console.log("\nres.data (getCurrentProfile | profileActions) ->", res.data);

    dispatch({ type: types.GET_PROFILE, payload: res.data });
  } catch (error) {
    dispatch({
      type: types.PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

const getAllProfiles = () => async dispatch => {
  // when a user visits the profiles list page, the current profile page gets cleared out
  dispatch({ type: types.CLEAR_PROFILE });

  try {
    const res = await axios.get("/api/profile");

    console.log("\nres.data (getAllProfiles | profileActions) ->", res.data);

    dispatch({ type: types.GET_PROFILES, payload: res.data });
  } catch (error) {
    dispatch({
      type: types.PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

const getProfileById = userId => async dispatch => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);

    console.log("\nres.data (getProfileById | profileActions) ->", res.data);

    dispatch({ type: types.GET_PROFILE, payload: res.data });
  } catch (error) {
    dispatch({
      type: types.PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

const getGithubRepos = username => async dispatch => {
  try {
    const res = await axios.get(`/api/profile/github/${username}`);

    console.log("\nres.data (getGithubRepos | profileActions) ->", res.data);

    dispatch({ type: types.GET_REPOS, payload: res.data });
  } catch (error) {
    dispatch({
      type: types.PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

const createProfile = (formData, history, edit = false) => async dispatch => {
  try {
    const config = {
      headers: { "Content-Type": "application/json" }
    };

    const res = await axios.post("/api/profile", formData, config);

    console.log("\nres.data (createProfile | profileActions) ->", res.data);

    dispatch({ type: types.GET_PROFILE, payload: res.data });

    // if a new profile is created, user is redirected back to dashboard
    // otherwise, user stays on the create profile page
    // redirect in an action is different from redirect in a component
    // it's wrong to import & use the Redirect class from react-router-dom here
    if (edit === true) {
      history.push("/dashboard");

      dispatch(alertActions.setAlert("profile updated", "success"));
    } else {
      history.push("/dashboard");

      dispatch(alertActions.setAlert("profile created", "success"));
    }
  } catch (error) {
    dispatch({
      type: types.PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });

    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach(error =>
        dispatch(alertActions.setAlert(error.msg, "danger"))
      );
    }
  }
};

const addWorkExperiences = (formData, history) => async dispatch => {
  try {
    const config = {
      headers: { "Content-Type": "application/json" }
    };

    const res = await axios.put("/api/profile/experience", formData, config);

    console.log("\nres.data (addWorkExperience | profileActions) ->", res.data);

    dispatch({ type: types.UPDATE_PROFILE, payload: res.data });

    dispatch(
      alertActions.setAlert("work experiences added/updated", "success")
    );

    history.push("/dashboard");
  } catch (error) {
    dispatch({
      type: types.PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });

    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach(error =>
        dispatch(alertActions.setAlert(error.msg, "danger"))
      );
    }
  }
};

const deleteWorkExperiences = expId => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/experience/${expId}`);

    console.log(
      "\nres.data (deleteWorkExperiences | profileActions) ->",
      res.data
    );

    dispatch({ type: types.UPDATE_PROFILE, payload: res.data });

    dispatch(alertActions.setAlert("experience removed", "success"));
  } catch (error) {
    dispatch({
      type: types.PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

const addEducation = (formData, history) => async dispatch => {
  try {
    const config = {
      headers: { "Content-Type": "application/json" }
    };

    const res = await axios.put("/api/profile/edu", formData, config);

    console.log("\nres.data (addEducation | profileActions) ->", res.data);

    dispatch({ type: types.UPDATE_PROFILE, payload: res.data });

    dispatch(alertActions.setAlert("education added/updated", "success"));

    history.push("/dashboard");
  } catch (error) {
    dispatch({
      type: types.PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });

    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach(error =>
        dispatch(alertActions.setAlert(error.msg, "danger"))
      );
    }
  }
};

const deleteEdu = eduId => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/edu/${eduId}`);

    console.log("\nres.data (deleteEdu | profileActions) ->", res.data);

    dispatch({ type: types.UPDATE_PROFILE, payload: res.data });

    dispatch(alertActions.setAlert("education removed", "success"));
  } catch (error) {
    dispatch({
      type: types.PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

const deleteAccount = () => async dispatch => {
  if (window.confirm("Sure? This action is irreversible")) {
    try {
      const res = await axios.delete(`/api/profile`);

      console.log("\nres.data (deleteAccount | profileActions) ->", res.data);

      dispatch({ type: types.CLEAR_PROFILE });

      dispatch({ type: types.ACCOUNT_DELETED });

      dispatch(alertActions.setAlert("account deleted", "success"));
    } catch (error) {
      dispatch({
        type: types.PROFILE_ERROR,
        payload: {
          msg: error.response.statusText,
          status: error.response.status
        }
      });
    }
  }
};

export const profileActions = {
  getCurrentProfile,
  getAllProfiles,
  getProfileById,
  getGithubRepos,
  createProfile,
  addWorkExperiences,
  deleteWorkExperiences,
  addEducation,
  deleteEdu,
  deleteAccount
};
