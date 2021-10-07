import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { profileActions } from "../../redux/actions/profileActions";
import Spinner from "../layout/Spinner";
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from "./ProfileExperience";
import ProfileEdu from "./ProfileEdu";
import ProfileGithub from "./ProfileGithub";

const Profile = () => {
  const dispatch = useDispatch();

  const params = useParams();

  const profileUserId = params.userId;
  const currentProfile = useSelector(state => state.profile.profile);
  const profileLoading = useSelector(state => state.profile.loading);

  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const authLoading = useSelector(state => state.auth.loading);
  const authUserId = useSelector(state => state.auth.user._id);

  console.log(
    "\nauthUserId (GET api/profile/user/:userId | components/profile/Profile.js) ->",
    authUserId
  );

  useEffect(() => {
    const get_profile_by_id = async () =>
      await dispatch(profileActions.getProfileById(profileUserId));

    get_profile_by_id();
  }, [dispatch, profileUserId]);

  return (
    <>
      {currentProfile === null || profileLoading ? (
        <Spinner />
      ) : (
        <>
          <Link to="/profiles" className="btn btn-light">
            Back to profiles
          </Link>

          {isAuthenticated &&
            authLoading === false &&
            authUserId === profileUserId && (
              <Link to="/edit-profile" className="btn btn-dark">
                Edit Profile
              </Link>
            )}

          <div className="profile-grid my-1">
            <ProfileTop profile={currentProfile} />

            <ProfileAbout profile={currentProfile} />

            <div className="profile-exp bg-white p-2">
              <h2 className="text-primary">Work experiences</h2>
              {currentProfile.workExperience.length > 0 ? (
                <>
                  {currentProfile.workExperience.map((e, index) => (
                    <ProfileExperience key={index} experience={e} />
                  ))}
                </>
              ) : (
                <h4>Work experiences not found</h4>
              )}
            </div>

            <div className="profile-edu bg-white p-2">
              <h2 className="text-primary">Education</h2>
              {currentProfile.education.length > 0 ? (
                <>
                  {currentProfile.education.map((e, index) => (
                    <ProfileEdu key={index} edu={e} />
                  ))}
                </>
              ) : (
                <h4>Education not found</h4>
              )}
            </div>

            <div className="profile-github">
              <h2 className="text-primary my-1">
                <i className="fab fa-github"></i> Github Repos
              </h2>
              {currentProfile.githubUsername !== undefined ? (
                <ProfileGithub username={currentProfile.githubUsername} />
              ) : (
                <h4>Github repos not found</h4>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
