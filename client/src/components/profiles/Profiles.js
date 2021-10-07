import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { profileActions } from "../../redux/actions/profileActions";
import Spinner from "../layout/Spinner";
import ProfileItem from "./ProfileItem";

const Profiles = () => {
  const dispatch = useDispatch();

  const profiles = useSelector(state => state.profile.profiles);
  const loading = useSelector(state => state.profile.loading);

  useEffect(() => {
    const get_profiles = async () =>
      await dispatch(profileActions.getAllProfiles());

    get_profiles();
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <h1 className="large text-primary">Developers</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop"></i> Browse & connect with
            developers
          </p>
          <div className="profiles">
            {profiles.length > 0 ? (
              profiles.map(p => <ProfileItem key={p._id} profile={p} />)
            ) : (
              <h4>Profiles Not Found</h4>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Profiles;
