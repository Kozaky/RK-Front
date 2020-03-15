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

const AuthenticatedApp = () => {

  return (
    <>
      <CustomAppBar/>
      <Router>
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
            <Route path="*">
              <Home />
            </Route>
          </Switch>
      </Router>
    </>
  );

}

export default AuthenticatedApp;
