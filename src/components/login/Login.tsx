import React, { useState } from 'react';
import { useAuth } from '../../providers/authProvider/AuthProvider';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import useStyles from './LoginStyles';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import LockIcon from '@material-ui/icons/Lock';

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

  // Functions
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    loginHandler(email, password);
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <Card className={classes.card} hidden={ props.hidden } raised>
          <CardHeader 
            avatar={ <LockIcon /> }
            titleTypographyProps={{ variant:'h4' }}
            title="LOG IN"
          />
          <form className={ classes.form }>
            <CardContent>
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
              <Typography variant="caption" display="block" gutterBottom>
                Still do not have an account? 
                <Button size="small" color="secondary"
                  onClick={ () => props.setShowSignUp(true) }>
                    Sign Up
                </Button>
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="medium" color="secondary" variant="outlined" 
                type="submit" onClick={ handleSubmit } 
              >
                  Log In
              </Button>
            </CardActions>
          </form>
        </Card>
      </ThemeProvider>
    </>
  );
}

export default LogIn;
