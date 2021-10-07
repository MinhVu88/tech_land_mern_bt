import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { profileActions } from "../../redux/actions/profileActions";
import Spinner from "../layout/Spinner";
import DashboardActions from "./DashboardActions";
import Edu from "./Edu";
import Experiences from "./Experiences";

const Dashboard = () => {
  const dispatch = useDispatch();

  const currentProfile = useSelector(state => state.profile.profile);
  const loading = useSelector(state => state.profile.loading);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    const get_current_profile = async () =>
      await dispatch(profileActions.getCurrentProfile());

    get_current_profile();
  }, [dispatch]);

  return loading && currentProfile === null ? (
    <Spinner />
  ) : (
    <>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"> Welcome {user && user.name}</i>
      </p>
      {currentProfile !== null ? (
        <>
          <DashboardActions />
          <Experiences />
          <Edu />
          <div className="my-2">
            <button
              className="btn btn-danger"
              onClick={() => dispatch(profileActions.deleteAccount())}
            >
              <i className="fas fa-user-minus"></i> Delete My Account
            </button>
          </div>
        </>
      ) : (
        <>
          <h4>
            Don't have a profile yet? Click the link below to create one for you
          </h4>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
          <h4>Or delete your account</h4>
          <div className="my-2">
            <button
              className="btn btn-danger"
              onClick={() => dispatch(profileActions.deleteAccount())}
            >
              <i className="fas fa-user-minus"></i> Delete My Account
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
