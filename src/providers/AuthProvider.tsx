import React, { ReactNode } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { LOGIN } from '../graphql/mutations/Login';

const AuthContext = React.createContext({
  data: { user: null, messages: null },
  loginHandler: (email: string, password: string) => {}
});

type Props = {
  children: ReactNode
};

const AuthProvider = ({ children } : Props) => {
  // code for pre-loading token or any other user information

 //if (weAreStillWaitingToGetUserData) {
 //  return <FullPageSpinner />
 //}
 
  // data should be filled with information about the user and session data
  let data = { user: null, messages: null };
  const [ loginMutation ] = useMutation(LOGIN);

  const loginHandler = (email: string, password: string) => {
    
    loginMutation( { variables: { 
      email: email, 
      password: password
    }}).then((data) => {
      // TODO: implementation of storing user in localstorage
      console.log(data);
    }).catch(err => console.log('Ha habido un error con el login: ' + err))

  };

  children = children !== null ? children : undefined;

  return (
    <AuthContext.Provider value={{ data, loginHandler }}>
      { children }
    </AuthContext.Provider>
  ); 
}

function useAuth() {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  
  return context;
}

export {AuthProvider, useAuth};
