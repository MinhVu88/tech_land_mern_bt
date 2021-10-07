import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { profileActions } from "../../redux/actions/profileActions";
import Spinner from "../layout/Spinner";

const ProfileGithub = ({ username }) => {
  const dispatch = useDispatch();

  const repos = useSelector(state => state.profile.repos);

  console.log(
    "\nrepos (GET api/profile/github/:username | components/profile/ProfileGithub.js) ->",
    repos
  );

  useEffect(() => {
    const get_repos = async () =>
      await dispatch(profileActions.getGithubRepos(username));

    get_repos();
  }, [dispatch, username]);

  return (
    <>
      {repos === null ? (
        <Spinner />
      ) : (
        repos.map(repo => (
          <div className="repo bg-white p-1 my-1" key={repo.id}>
            <div>
              <h4>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repo.name}
                </a>
              </h4>
              <p>{repo.description}</p>
            </div>
            <div>
              <ul>
                <li className="badge badge-primary">
                  Stars: {repo.stargazers_count}
                </li>
                <li className="badge badge-dark">
                  Watchers: {repo.watchers_count}
                </li>
                <li className="badge badge-light">Forks: {repo.forks_count}</li>
              </ul>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default ProfileGithub;
