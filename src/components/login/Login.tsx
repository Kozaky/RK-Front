import React, { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import useStyles from './LoginStyles';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';

type LogInProps = {
  setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>;
  hidden: boolean;
};

const LogIn = (props: LogInProps) => {

  // Services
  let theme = createMuiTheme();
  theme = responsiveFontSizes(theme);
  const classes = useStyles();
  const { loginHandler } = useAuth();

  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);

  // Functions
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      <ThemeProvider theme={theme}>
        <Card className={classes.card} hidden={ props.hidden } raised>
          <CardContent>
            <Typography variant="h3" gutterBottom>
              LOG IN
            </Typography>
            <form className={ classes.form }>
              <Grid container spacing={3}>
                <Grid item xs={ 12 }>
                  <TextField id="emailInput" label="Email" variant="filled"
                    className={ classes.input }
                    value={ email } onChange={ handleEmailChange }/>
                </Grid>
                <Grid item xs={ 12 }>
                  <TextField id="passwordInput" label="Password" variant="filled" 
                    type="password" className={ classes.input }
                    value={ password } onChange={ handlePasswordChange }/>
                </Grid>
              </Grid>
            </form>
            <Typography variant="caption" display="block" gutterBottom>
              Still do not have an account? 
              <Button size="small" color="secondary"
                onClick={ () => props.setShowSignUp(true) }>
                  Sign Up
              </Button>
            </Typography>
            <Backdrop className={classes.backdrop} open={ showSpinner }>
              <CircularProgress color="secondary" size="10rem" />
            </Backdrop>
          </CardContent>
          <CardActions>
            <Button size="small" color="secondary" variant="outlined" 
              onClick={ handleSubmit }>
                Log In
            </Button>
          </CardActions>
        </Card>
      </ThemeProvider>
    </>
  );
}

export default LogIn;
