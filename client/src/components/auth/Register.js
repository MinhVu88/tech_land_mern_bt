import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { alertActions } from "../../redux/actions/alertActions";
import { authActions } from "../../redux/actions/authActions";

const Register = () => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });

  const { name, email, password, password2 } = formData;

  const handleChange = e => {
    console.log(e.target.name, ": ", e.target.value);

    // js objects with square brackets: https://javascript.info/object
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (password !== password2) {
      dispatch(alertActions.setAlert("Passwords do not match", "danger"));
    } else {
      //   const newUser = { name, email, password };
      //   try {
      //     const config = { headers: { "Content-Type": "application/json" } };
      //     const body = JSON.stringify(newUser);
      //     const res = await axios.post("/api/users", body, config);
      //     console.log(res.data);
      //   } catch (error) {
      //     console.error(error.response.data);
      //   }

      dispatch(authActions.registerUser({ name, email, password }));
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={e => handleSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={e => handleChange(e)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={e => handleChange(e)}
            required
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={e => handleChange(e)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
            value={password2}
            onChange={e => handleChange(e)}
            required
          />
        </div>

        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </>
  );
};

export default Register;
