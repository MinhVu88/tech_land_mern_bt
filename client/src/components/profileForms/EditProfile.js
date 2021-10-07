import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { profileActions } from "../../redux/actions/profileActions";

const EditProfile = ({ history }) => {
  const dispatch = useDispatch();

  // the current profile is used to pre-fill the form & loading's the condition of useEffect
  const currentProfile = useSelector(state => state.profile.profile);
  const loading = useSelector(state => state.profile.loading);

  const [formData, setFormData] = useState({
    company: "",
    website: "",
    location: "",
    status: "",
    skills: "",
    githubUsername: "",
    bio: "",
    twitter: "",
    facebook: "",
    linkedin: "",
    youtube: "",
    instagram: ""
  });

  const [socialLinks, setSocialLinks] = useState(false);

  const {
    company,
    website,
    location,
    bio,
    status,
    skills,
    githubUsername,
    twitter,
    facebook,
    linkedin,
    youtube,
    instagram
  } = formData;

  useEffect(() => {
    const get_current_profile = async () =>
      await dispatch(profileActions.getCurrentProfile());

    get_current_profile();

    /*
    - As soon as the component renders/re-renders based on loading's value & 
      getCurrentProfile() is called

    - The current profile is immediately checked to see if the data's still being loaded 
      & no profile has been fetched successfully yet

    - If that's the case, an empty string is assigned to a property of the formData object

    - If the loading's done & profile's fetched, the data's assigned to the property
      & thus, formData is filled with the current profile data then
    */
    setFormData({
      company: loading || !currentProfile.company ? "" : currentProfile.company,
      website: loading || !currentProfile.website ? "" : currentProfile.website,
      location:
        loading || !currentProfile.location ? "" : currentProfile.location,
      status: loading || !currentProfile.status ? "" : currentProfile.status,
      skills:
        loading || !currentProfile.skills
          ? ""
          : currentProfile.skills.join(","),
      githubUsername:
        loading || !currentProfile.githubUsername
          ? ""
          : currentProfile.githubUsername,
      bio: loading || !currentProfile.bio ? "" : currentProfile.bio,
      twitter:
        loading || !currentProfile.social ? "" : currentProfile.social.twitter,
      facebook:
        loading || !currentProfile.social ? "" : currentProfile.social.facebook,
      linkedin:
        loading || !currentProfile.social ? "" : currentProfile.social.linkedin,
      youtube:
        loading || !currentProfile.social ? "" : currentProfile.social.youtube,
      instagram:
        loading || !currentProfile.social ? "" : currentProfile.social.instagram
    });
  }, [loading]);

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();

    dispatch(profileActions.createProfile(formData, history, true));
  };

  return (
    <>
      <h1 className="large text-primary">Create Your Profile</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Let's get some information to make your
        profile stand out
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={e => handleSubmit(e)}>
        <div className="form-group">
          <select name="status" value={status} onChange={e => handleChange(e)}>
            <option value="0">* Select Professional Status</option>
            <option value="Developer">Developer</option>
            <option value="Junior Developer">Junior Developer</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Manager">Manager</option>
            <option value="Student or Learning">Student or Learning</option>
            <option value="Instructor">Instructor or Teacher</option>
            <option value="Intern">Intern</option>
            <option value="Other">Other</option>
          </select>
          <small className="form-text">
            Give us an idea of where you are at in your career
          </small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Company"
            name="company"
            value={company}
            onChange={e => handleChange(e)}
          />
          <small className="form-text">
            Could be your own company or one you work for
          </small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Website"
            name="website"
            value={website}
            onChange={e => handleChange(e)}
          />
          <small className="form-text">
            Could be your own or a company website
          </small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={location}
            onChange={e => handleChange(e)}
          />
          <small className="form-text">
            City & state suggested (eg. Boston, MA)
          </small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="* Skills"
            name="skills"
            value={skills}
            onChange={e => handleChange(e)}
          />
          <small className="form-text">
            Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
          </small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Github Username"
            name="githubUsername"
            value={githubUsername}
            onChange={e => handleChange(e)}
          />
          <small className="form-text">
            If you want your latest repos and a Github link, include your
            username
          </small>
        </div>

        <div className="form-group">
          <textarea
            placeholder="A short bio of yourself"
            name="bio"
            value={bio}
            onChange={e => handleChange(e)}
          ></textarea>
          <small className="form-text">Tell us a little about yourself</small>
        </div>

        <div className="my-2">
          <button
            type="button"
            className="btn btn-light"
            onClick={() => setSocialLinks(!socialLinks)}
          >
            Add Social Network Links
          </button>
          <span>Optional</span>
        </div>

        {socialLinks && (
          <>
            <div className="form-group social-input">
              <i className="fab fa-twitter fa-2x"></i>
              <input
                type="text"
                placeholder="Twitter URL"
                name="twitter"
                value={twitter}
                onChange={e => handleChange(e)}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-facebook fa-2x"></i>
              <input
                type="text"
                placeholder="Facebook URL"
                name="facebook"
                value={facebook}
                onChange={e => handleChange(e)}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-youtube fa-2x"></i>
              <input
                type="text"
                placeholder="YouTube URL"
                name="youtube"
                value={youtube}
                onChange={e => handleChange(e)}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-linkedin fa-2x"></i>
              <input
                type="text"
                placeholder="Linkedin URL"
                name="linkedin"
                value={linkedin}
                onChange={e => handleChange(e)}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-instagram fa-2x"></i>
              <input
                type="text"
                placeholder="Instagram URL"
                name="instagram"
                value={instagram}
                onChange={e => handleChange(e)}
              />
            </div>
          </>
        )}

        <input type="submit" className="btn btn-primary my-1" />

        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </>
  );
};

export default withRouter(EditProfile);
