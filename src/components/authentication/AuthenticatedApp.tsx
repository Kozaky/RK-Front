import React from "react";
import CustomAppBar from "../ui/customAppBar/CustomAppBar";
import Home from "../../components/home/Home";
import Reklamas from "../reklamas/Reklamas";
import ReklamaDetails from "../reklamas/reklama/details/ReklamaDetails";
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
            <Reklamas />
          </Route>
          <Route exact path="/reklamas/create">
            <ReklamaCreate />
          </Route>
          <Route exact path={`/reklamas/:reklamaId`}>
            <ReklamaDetails />
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
