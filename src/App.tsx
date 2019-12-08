import React, { Component } from "react";
import { Redirect, Link, Route, Switch, RouteComponentProps, RedirectProps, RouteProps } from 'react-router-dom';
import './App.css';
import Home from "./components/Home";
import Login, { fakeAuth } from "./components/Login";
import CustomAppBar from './components/CustomAppBar';

class App extends Component {
  render() {
    return (
      <div>
        <CustomAppBar></CustomAppBar>
        < div className="root" >
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    );
  }
}

//Private router function
const PrivateRoute = ({ component, ...rest }: RouteProps) => {
  return (
    <Route
      {...rest}
      render={props => fakeAuth.isAuthenticated === true ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: "/login", state: { from: props.location } }} />)}
    />
  );
};

//Admin component
const Admin = ({ match }: RouteComponentProps<string>) => {
  return (
    <div>
      {" "}
      <h2> Welcome admin </h2>
    </div>
  );
};

export default App;