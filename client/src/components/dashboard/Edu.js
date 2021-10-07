import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Moment from "react-moment";
import { profileActions } from "../../redux/actions/profileActions";

const Edu = () => {
  const dispatch = useDispatch();

  const currentProfile = useSelector(state => state.profile.profile);

  const edu = currentProfile.education.map(e => (
    <tr key={e._id}>
      <td>{e.school}</td>
      <td className="hide-sm">{e.degree}</td>
      <td className="hide-sm">{e.fieldOfStudy}</td>
      <td>
        <Moment format="YYYY/MM/DD">{e.form}</Moment> -{" "}
        {e.to === null ? " Now" : <Moment format="YYYY/MM/DD">{e.to}</Moment>}
      </td>
      <td>
        <button
          className="btn btn-danger"
          onClick={() => dispatch(profileActions.deleteEdu(e._id))}
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <>
      <h2 className="my-2">Education</h2>
      <table className="table">
        <thead>
          <tr>
            <th>School</th>
            <th className="hide-sm">Degree</th>
            <th className="hide-sm">Field of Study</th>
            <th className="hide-sm">Years</th>
            <th />
          </tr>
        </thead>
        <tbody>{edu}</tbody>
      </table>
    </>
  );
};

export default Edu;
