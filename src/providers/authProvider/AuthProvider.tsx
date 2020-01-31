import React, { ReactNode, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { LOGIN, SIGNUP } from '../../graphql/mutations/Auth';
import CustomModal from '../../components/ui/customModal/CustomModal';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import useStyles from './AuthProviderStyles';

const AuthContext = React.createContext({
  data: { user: null, messages: null },
  loginHandler: (email: string, password: string) => {},
  signupHandler: (fullname: string, email: string, password: string, passwordConfirmation: string) => {}
});

type Props = {
  children: ReactNode
};

const AuthProvider = ({ children } : Props) => {

  // Services 

  const classes = useStyles();
  const [loginMutation] = useMutation(LOGIN);
  const [signupMutation] = useMutation(SIGNUP);

  // State 
  
  const [modalText, setModalText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // code for pre-loading token or any other user information

 //if (weAreStillWaitingToGetUserData) {
 //  return <FullPageSpinner />
 //}
 
  // data should be filled with information about the user and session data
  let data = { user: null, messages: null };

  const loginHandler = (email: string, password: string) => {
    
    setLoading(true);

    loginMutation( { variables: { 
      email: email, 
      password: password
    }})
    .then((data) => {
      // TODO: implementation of storing user in localstorage
      console.log(data);
      setLoading(false);
    })
    .catch(error => { 
      console.log(error);
      setShowModal(true);
      setModalText('Error with connection');
      setLoading(false);
    });

  };

  const signupHandler = (fullname: string, email: string, password: string,
    passwordConfirmation: string) => {

      setLoading(true);

      const userDetails = {
        fullName: fullname,
        email: email,
        password: password,
        passwordConfirmation: passwordConfirmation
      }

      signupMutation( {variables: { userDetails: userDetails }})
      .then((data) => {
        console.log(data);
        setLoading(false);
      })
      .catch(error => {
        setShowModal(true);
        setModalText('Error with connection');
        setLoading(false);
      });
  }

  return (
    <AuthContext.Provider value={{ data, loginHandler, signupHandler }}>
      { children }
      <CustomModal title="Message" text={ modalText } show={ showModal } setShow={ setShowModal }/>
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
