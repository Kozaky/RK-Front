import React, { ReactNode, useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { LOG_IN, SIGN_UP, LOG_OUT } from '../../graphql/mutations/Auth';
import { Alert } from '@material-ui/lab';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import useStyles from './AuthProviderStyles';
import { getGeneralErrorMsg } from '../../utils/ErrorHandler';
import { useHistory } from "react-router-dom";

type Context = {
  currentUser: {
    email: string,
    full_name: string,
    role: {
      type: string
    },
    token: string
  } | null,
  logInHandler: (email: string, password: string) => void,
  logOutHandler: () => void,
  signUpHandler: (fullname: string, email: string, password: string, passwordConfirmation: string) => void
}

const AuthContext = React.createContext<Context | null>(null);

type Props = {
  children: ReactNode
};

const AuthProvider = ({ children } : Props) => {

  // Services 

  const classes = useStyles();
  const history = useHistory();
  const [logInMutation] = useMutation(LOG_IN);
  const [logOutMutation] = useMutation(LOG_OUT);
  const [signUpMutation] = useMutation(SIGN_UP);

  // State 
  
  const [errorText, setErrorText] = useState('');
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => { window.removeEventListener('storage', localStorageUpdated) }
  });

  const localStorageUpdated = () => {
    if (localStorage.getItem('currentUser') === null) {
      currentUser = null;
    } else {
      currentUser = localStorage.getItem('currentUser');
    }
  }
  window.addEventListener('storage', localStorageUpdated);

  let currentUser = null;
  if (localStorage.getItem('currentUser') !== null) {
    currentUser = JSON.parse(localStorage.getItem('currentUser')!);
  }

  const logInHandler = (email: string, password: string) => {
    
    setLoading(true);

    logInMutation( { variables: { 
      email: email, 
      password: password
    }})
    .then(({ data }) => {
      localStorage.setItem('currentUser', JSON.stringify(data.signIn));
      setLoading(false);
    })
    .catch(error => { 
      setShowError(true);
      setErrorText(getErrorMsg(error));
      setLoading(false);
    });
  };

  const logOutHandler = () => {
    
    setLoading(true);

    logOutMutation( { variables: {} })
    .then(({ data }) => {
      history.push("/");
      localStorage.removeItem('currentUser');
      setLoading(false);
    })
    .catch(error => { 

      if (error.message === 'GraphQL error: Not authenticated') {
        history.push("/");
        localStorage.removeItem('currentUser');
      } else {
        setShowError(true);
        setErrorText(getErrorMsg(error));
      }

      setLoading(false);
    });
  };

  const signUpHandler = (fullname: string, email: string, password: string,
    passwordConfirmation: string) => {

      setLoading(true);

      const userDetails = {
        fullName: fullname,
        email: email,
        password: password,
        passwordConfirmation: passwordConfirmation
      }

      signUpMutation( {variables: { userDetails: userDetails }})
      .then((data) => {
        logInHandler(userDetails.email, userDetails.password);
      })
      .catch(error => {
        setShowError(true);
        setErrorText(getErrorMsg(error));
        setLoading(false);
      });
  };

  const getErrorMsg = (error: any): string => {
    let message = '';
    switch (error.message) {
      case 'GraphQL error: email: has already been taken\n':
        message = 'This email is already registered';
        break;
      case 'GraphQL error: invalid password':
        message = 'Password does not match';
        break;
      case 'GraphQL error: User not found':
        message = 'Email not registered';
        break;
      default: 
        message = getGeneralErrorMsg(error);
        break;
    }

    return message;
  }; 

  if (showError) {
    setTimeout(() => setShowError(false), 5_000);
  }

  let errorBox = (
    <div className={ classes.alert }>
      <Alert variant="filled" severity="error">
        { errorText }
      </Alert>
    </div>
  );

  return (
    <AuthContext.Provider value={{ currentUser, logInHandler, logOutHandler, signUpHandler }}>
      { children }
      { showError ? errorBox : null}
      <Backdrop className={classes.backdrop} open={ loading }>
        <CircularProgress color="secondary" size="10rem" />
      </Backdrop>
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
