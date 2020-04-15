import React, { ReactNode, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { LOG_IN, SIGN_UP, LOG_OUT } from '../../graphql/Auth';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import useStyles from './AuthProviderStyles';
import { handleGeneralErrors } from '../../utils/ErrorHandler';
import { useHistory } from "react-router-dom";
import TopAlert from '../../components/ui/alerts/topAlert/TopAlert';

type Context = {
  currentUser: {
    id: Number,
    email: string,
    full_name: string,
    avatar: string,
    role: {
      type: string
    },
    token: string
  } | null,
  logInHandler: (email: string, password: string) => void,
  logOutHandler: () => void,
  signUpHandler: (fullname: string, email: string, password: string, passwordConfirmation: string) => void,
  updateCurrentUser: (newCurrentUser: Context['currentUser']) => void
}

const AuthContext = React.createContext<Context | null>(null);

type Props = {
  children: ReactNode
};

const AuthProvider = ({ children }: Props) => {

  // Services 

  const classes = useStyles();
  const history = useHistory();
  const [currentUser, setCurrentUser] = useState<Context['currentUser']>(null);
  const [logInMutation] = useMutation(LOG_IN);
  const [logOutMutation] = useMutation(LOG_OUT);
  const [signUpMutation] = useMutation(SIGN_UP);

  // State 

  const [errorText, setErrorText] = useState('');
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const logInHandler = (email: string, password: string) => {

    setLoading(true);

    logInMutation({
      variables: {
        email: email,
        password: password
      }
    })
      .then(({ data }) => {
        localStorage.setItem('currentUser', JSON.stringify(data.signIn));
        setLoading(false);
      })
      .catch(error => {
        setShowError(true);
        const errorMsg = handleErrors(error)
        setErrorText(errorMsg);
        setLoading(false);
      });
  };

  const logOutHandler = () => {

    setLoading(true);

    logOutMutation({ variables: {} })
      .then(({ data }) => {
        updateCurrentUser(null);
        history.push("/");
        setLoading(false);
      })
      .catch(error => {
        setShowError(true);
        const errorMsg = handleErrors(error)
        setErrorText(errorMsg);
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

    signUpMutation({ variables: { userDetails: userDetails } })
      .then((data) => {
        logInHandler(userDetails.email, userDetails.password);
      })
      .catch(error => {
        setShowError(true);
        const errorMsg = handleErrors(error)
        setErrorText(errorMsg);
        setLoading(false);
      });
  };

  const updateCurrentUser = (newCurrentUser: Context['currentUser']) => {
    setCurrentUser(newCurrentUser);
    if (newCurrentUser !== null) {
      localStorage.setItem('currentUser', JSON.stringify(newCurrentUser));
    } else {
      localStorage.removeItem('currentUser')
    }
  }

  const handleErrors = (error: any): string => {
    let message = '';
    switch (error.message) {
      case 'GraphQL error: email: has already been taken\n':
        message = 'This email is already registered';
        break;
      case 'GraphQL error: password does not match':
        message = 'Password does not match';
        break;
      case 'GraphQL error: not_found':
        message = 'Email not registered';
        break;
      default:
        message = handleGeneralErrors(error, updateCurrentUser);
        break;
    }

    return message;
  };

  if ((localStorage.getItem('currentUser') !== null && currentUser === null)
    || (localStorage.getItem('currentUser') === null && currentUser !== null)) {

    const localStorageUser = localStorage.getItem('currentUser');
    updateCurrentUser(localStorageUser ? JSON.parse(localStorageUser) : null);
  }

  if (showError) {
    setTimeout(() => setShowError(false), 5_000);
  }

  return (
    <AuthContext.Provider value={{ currentUser, logInHandler, logOutHandler, signUpHandler, updateCurrentUser }}>
      {children}
      {showError ? <TopAlert msg={errorText} type="error" /> : null}
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="secondary" size="10rem" />
      </Backdrop>
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }

  return context;
}

export { AuthProvider, useAuth };
