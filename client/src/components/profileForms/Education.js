import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { profileActions } from "../../redux/actions/profileActions";
import { Link, withRouter } from "react-router-dom";

const Education = ({ history }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
    from: "",
    to: "",
    current: false,
    description: ""
  });

  const [student, setStudent] = useState(false);

  const {
    school,
    degree,
    fieldOfStudy,
    from,
    to,
    current,
    description
  } = formData;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    dispatch(profileActions.addEducation(formData, history));
  };

  return (
    <>
      <h1 className="large text-primary">Add Your Education</h1>
      <p className="lead">
        <i className="fas fa-code-branch"></i> Add any school you have attended
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={e => handleSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="* School"
            name="school"
            required
            value={school}
            onChange={e => handleChange(e)}
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="* Degree"
            name="degree"
            required
            value={degree}
            onChange={e => handleChange(e)}
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Field of Study"
            name="fieldOfStudy"
            value={fieldOfStudy}
            onChange={e => handleChange(e)}
          />
        </div>

        <div className="form-group">
          <h4>From Date</h4>
          <input
            type="date"
            name="from"
            value={from}
            onChange={e => handleChange(e)}
          />
        </div>

        <div className="form-group">
          <p>
            <input
              type="checkbox"
              name="current"
              checked={current}
              value={current}
              onChange={e => {
                setFormData({ ...formData, current: !current });

                setStudent(!student);
              }}
            />{" "}
            Current School
          </p>
        </div>

        <div className="form-group">
          <h4>To Date</h4>
          <input
            type="date"
            name="to"
            value={to}
            onChange={e => handleChange(e)}
            disabled={student ? "disabled" : ""}
          />
        </div>

        <div className="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Curriculum Description"
            value={description}
            onChange={e => handleChange(e)}
          ></textarea>
        </div>

        <input type="submit" className="btn btn-primary my-1" />

        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </>
  );
};

export default withRouter(Education);
