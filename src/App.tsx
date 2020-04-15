import React from "react";
import './App.css';
import { useAuth } from "./providers/authProvider/AuthProvider";
import AuthenticatedApp from "./components/authentication/AuthenticatedApp";
import UnathenticatedApp from "./components/authentication/UnauthenticatedApp/UnauthenticatedApp";

function App() {

  const { currentUser } = useAuth()!;

  return (
    <>
      {currentUser !== null ? <AuthenticatedApp /> : <UnathenticatedApp />}
    </>
  );
}

export default App;
