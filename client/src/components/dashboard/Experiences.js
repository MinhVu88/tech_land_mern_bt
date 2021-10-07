import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Moment from "react-moment";
import { profileActions } from "../../redux/actions/profileActions";

const Experiences = () => {
  const dispatch = useDispatch();

  const currentProfile = useSelector(state => state.profile.profile);

  const experiences = currentProfile.workExperience.map(e => (
    <tr key={e._id}>
      <td>{e.company}</td>
      <td className="hide-sm">{e.title}</td>
      <td className="hide-sm">{e.location}</td>
      <td>
        <Moment format="YYYY/MM/DD">{e.form}</Moment> -{" "}
        {e.to === null ? " Now" : <Moment format="YYYY/MM/DD">{e.to}</Moment>}
      </td>
      <td>
        <button
          className="btn btn-danger"
          onClick={() => dispatch(profileActions.deleteWorkExperiences(e._id))}
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <>
      <h2 className="my-2">Work Experiences</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Company</th>
            <th className="hide-sm">Title</th>
            <th className="hide-sm">Location</th>
            <th className="hide-sm">Years</th>
            <th />
          </tr>
        </thead>
        <tbody>{experiences}</tbody>
      </table>
    </>
  );
};

export default Experiences;
