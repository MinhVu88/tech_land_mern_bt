import React from "react";
import { useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";

const LandingPage = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Tech Land</h1>
          <p className="lead">
            A close-knit community for developers & tech enthusiasts from all
            walks of life
          </p>
          <div className="buttons">
            <Link to="/register" className="btn btn-primary">
              Sign Up
            </Link>
            <Link to="/login" className="btn btn-light">
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
