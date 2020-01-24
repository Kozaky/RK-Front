import React, { useState } from 'react';
import LogIn from '../../logIn/LogIn';
import SignUp from '../../signUp/SignUp';
import Grid from '@material-ui/core/Grid';
import useStyles from './UnauthenticatedAppStyles';
import CustomAppBar from '../../ui/customAppBar/CustomAppBar';

const UnathenticatedApp = () => {

  // Services
  const classes = useStyles();

  // State
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <>
      <CustomAppBar />
      <Grid container direction="row" justify="center" 
      alignItems="center" className={ classes.root }>
        <Grid item xs={ 3 }>
        </Grid>
        <Grid item xs={ 6 }>
          <SignUp setShowSignUp={ setShowSignUp } hidden={ !showSignUp }/>
          <LogIn setShowSignUp={ setShowSignUp } hidden={ showSignUp }/>
        </Grid>
        <Grid item xs={ 3 }>
        </Grid>
      </Grid>
    </>
  );
}

export default UnathenticatedApp;