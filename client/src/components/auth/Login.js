import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { authActions } from "../../redux/actions/authActions";

const Login = () => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const [formData, setFormData] = useState({ email: "", password: "" });

  const { email, password } = formData;

  const handleChange = e => {
    console.log(e.target.name, ": ", e.target.value);

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    dispatch(authActions.logAuthUserIn(email, password));
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign Into Your Account
      </p>
      <form className="form" onSubmit={e => handleSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={e => handleChange(e)}
            required
          />
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

        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account yet? <Link to="/register">Sign Up</Link>
      </p>
    </>
  );
};

export default Login;
