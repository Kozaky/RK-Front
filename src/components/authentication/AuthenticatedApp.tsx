import React from "react";
import CustomAppBar from "../ui/customAppBar/CustomAppBar";
import Home from "../../components/home/Home";
import Topics from "../../components/topics/Topics";
import TopicDetails from "../../components/topics/topic/details/TopicDetails";
import ScrollToTop from "../../utils/ScrollToTop";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import AdminPanel from '../adminPanel/AdminPanel';
import AuthorizedRoute from "../../utils/AuthorizedRoute";
import PanelUsers from "../adminPanel/options/PanelUsers";
import PanelTopics from "../adminPanel/options/PanelTopics/PanelTopics";

const AuthenticatedApp = () => {

  return (
    <>
      <Router>
        <CustomAppBar />
        <ScrollToTop />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/topics">
            <Topics />
          </Route>
          <Route exact path={`/topics/:topicId`}>
            <TopicDetails />
          </Route>
          <AuthorizedRoute exact path="/adminPanel" authorization="ADMIN">
            <AdminPanel />
          </AuthorizedRoute>
          <AuthorizedRoute exact path="/adminPanel/users" authorization="ADMIN">
            <PanelUsers />
          </AuthorizedRoute>
          <AuthorizedRoute exact path="/adminPanel/topics" authorization="ADMIN">
            <PanelTopics />
          </AuthorizedRoute>
          <Route path="*">
            <Home />
          </Route>
        </Switch>
      </Router>
    </>
  );

}

export default AuthenticatedApp;
