import React from "react";
import CustomAppBar from "../ui/customAppBar/CustomAppBar";
import Home from "../../components/home/Home";
import ScrollToTop from "../../utils/ScrollToTop";
import {
  Switch,
  Route,
  BrowserRouter
} from "react-router-dom";
import AdminPanel from '../adminPanel/AdminPanel';
import AuthorizedRoute from "../../utils/AuthorizedRoute";
import PanelUsers from "../adminPanel/options/PanelUsers";
import PanelTopics from "../adminPanel/options/PanelTopics/PanelTopics";
import ReklamaCreate from "../reklamas/reklama/create/ReklamaCreate";
import ReklamasView from "../reklamas/ReklamasView";

const AuthenticatedApp = () => {

  return (
    <>
      <BrowserRouter>
        <CustomAppBar />
        <ScrollToTop />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path={`/topics/:topicId/reklamas`}>
            <ReklamasView />
          </Route>
          <Route exact path="/reklamas/create">
            <ReklamaCreate />
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
      </BrowserRouter>
    </>
  );

}

export default AuthenticatedApp;
