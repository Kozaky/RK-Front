import React, { Component } from "react";
import { Redirect, Link, Route, Switch, RouteComponentProps, RedirectProps, RouteProps } from 'react-router-dom';
import './App.css';
import {useAuth} from "./providers/AuthProvider";
import AuthenticatedApp from "./components/authentication/AuthenticatedApp";
import UnathenticatedApp from "./components/authentication/UnauthenticatedApp/UnauthenticatedApp";

function App() {
  
  const { data } = useAuth();

  return (   
    <>
       { data.user !== null ? <AuthenticatedApp/> : <UnathenticatedApp/> }
    </>
  );
}

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
