import React from "react";
import { Route, Switch } from "react-router-dom";
import Alert from "../layout/Alert";
import Login from "../auth/Login";
import Register from "../auth/Register";
import Dashboard from "../dashboard/Dashboard";
import PrivateRoute from "../private/PrivateRoute";
import CreateProfile from "../profileForms/CreateProfile";
import EditProfile from "../profileForms/EditProfile";
import WorkExperiences from "../profileForms/WorkExperiences";
import Education from "../profileForms/Education";
import Profiles from "../profiles/Profiles";
import Profile from "../profile/Profile";
import Posts from "../posts/Posts";
import Post from "../post/Post";
import NotFound from "../layout/NotFound";

const Routes = () => {
  return (
    <section className="container">
      <Alert />
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/profiles" component={Profiles} />
        <Route exact path="/profile/:userId" component={Profile} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/create-profile" component={CreateProfile} />
        <PrivateRoute exact path="/edit-profile" component={EditProfile} />
        <PrivateRoute
          exact
          path="/add-experience"
          component={WorkExperiences}
        />
        <PrivateRoute exact path="/add-education" component={Education} />
        <PrivateRoute exact path="/posts" component={Posts} />
        <PrivateRoute exact path="/posts/:postId" component={Post} />
        <Route component={NotFound} />
      </Switch>
    </section>
  );
};

export default Routes;
