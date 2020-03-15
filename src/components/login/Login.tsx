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
import FormHelperText from '@material-ui/core/FormHelperText/FormHelperText';

type LogInProps = {
  setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>;
  hidden: boolean;
};

const LogIn = (props: LogInProps) => {

  // Services

  let theme = createMuiTheme();
  theme = responsiveFontSizes(theme);
  const classes = useStyles();
  const { logInHandler } = useAuth()!;

  // State
  
  const [email, setEmail] = useState('');
  const [emailErrorMsg, setEmailErrorMsg] = useState('');
  const [showEmailErrorMsg, setShowEmailErrorMsg] = useState(false);

  const [password, setPassword] = useState('');
  const [showPasswordErrorMsg, setShowPasswordErrorMsg] = useState(false);

  // Functions

  const checkEmail = async (email: string): Promise<string> => {
    let reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    let errorMsg = '';

    if (email.length === 0) {
      errorMsg = 'Required';
    } else if (!reg.test(email)) {
      errorMsg = 'Not a valid email';
    }

    return errorMsg;
  }

  const checkPassword = async(password: string): Promise<boolean> => password.length !== 0;

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    checkEmail(event.currentTarget.value).then(msg => {
      setEmailErrorMsg(msg);
    });
    setEmail(event.currentTarget.value);
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  }

  const handleSubmit = (event: React.FormEvent) => {
    const checkForm = async (): Promise<boolean> => {
  
      const results = await Promise.all([
        checkEmail(email),
        checkPassword(password)
      ]);
      
      const isValidEmail = results[0] === '';
      if (!isValidEmail) {
        setShowEmailErrorMsg(true);
      }

      const isValidPassword = results[1];
      if (!isValidPassword) {
        setShowPasswordErrorMsg(true);
      }

      return isValidEmail && isValidPassword;
    }

    event.preventDefault();
    checkForm().then((result: boolean) => {

      if (result) {
        logInHandler(email, password);
      }

    });
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
          <form className={classes.form}>
            <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField id="emailInput" label="Email" variant="filled"
                      className={classes.input}
                      value={email} onChange={handleEmailChange}/>
                    <FormHelperText id="email-error-text" 
                      hidden={!showEmailErrorMsg}
                      className={classes.text}
                    >
                      {emailErrorMsg}
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField id="passwordInput" label="Password" variant="filled" 
                      type="password" className={classes.input}
                      value={password} onChange={handlePasswordChange}/>
                    <FormHelperText id="email-error-text" 
                      hidden={!showPasswordErrorMsg}
                      className={classes.text}
                    >
                      Please introduce your password
                    </FormHelperText>
                  </Grid>
                </Grid>
              <Typography variant="caption" display="block" gutterBottom>
                Still do not have an account? 
                <Button size="small" color="secondary"
                  onClick={() => props.setShowSignUp(true)}>
                    Sign Up
                </Button>
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="medium" color="secondary" variant="outlined" 
                type="submit" onClick={handleSubmit} 
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
