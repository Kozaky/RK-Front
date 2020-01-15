import React, {useState} from 'react';
import { useAuth } from '../../providers/AuthProvider';
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import useStyles from './LoginStyles';

const Login = () => {

  const classes = useStyles();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);
  const { loginHandler } = useAuth();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>)=> {
    setPassword(event.currentTarget.value);
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setShowSpinner(true);
    loginHandler(email, password);
    setTimeout(() => setShowSpinner(false), 3000);
  }

  return (
    <>
      <form className={ classes.form }>
        <Grid container spacing={3}>
          <Grid item xs={ 12 }>
            <TextField error id="emailInput" label="Email" variant="filled"
              className={ classes.input }
              value={ email } onChange={ handleEmailChange }/>
          </Grid>
          <Grid item xs={ 12 }>
            <TextField id="passwordInput" label="Password" variant="filled" type="password"
              className={ classes.input }
              value={ password } onChange={ handlePasswordChange }/>
          </Grid>
          <Grid item xs={ 12 }>
            <Button variant="outlined" onClick={ handleSubmit }>Log In</Button>
          </Grid>
        </Grid>
      </form>
      <Backdrop className={classes.backdrop} open={ showSpinner }>
        <CircularProgress color="secondary" size="10rem" />
      </Backdrop>
    </>
  );
}

export default Login;
