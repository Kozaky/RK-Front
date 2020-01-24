import React, { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import useStyles from './SignUpStyles';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import StringFormInput from '../ui/stringFormInput/StringFormInput';
import CreateIcon from '@material-ui/icons/Create';
import IconButton from '@material-ui/core/IconButton';

type SignUpProps = {
  setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>;
  hidden: boolean;
};

const SignUp = (props: SignUpProps) => {

  // Services
  let theme = createMuiTheme();
  theme = responsiveFontSizes(theme);
  const classes = useStyles();
  const { loginHandler } = useAuth();

  // State
  const [fullName, setFullName] = useState('');
  const [fullNameErrorMsg, setFullNameErrorMsg] = useState('');

  const [email, setEmail] = useState('');
  const [emailErrorMsg, setEmailErrorMsg] = useState('');

  const [password, setPassword] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordErrorMsg, setConfirmPasswordErrorMsg] = useState('');

  const [showSpinner, setShowSpinner] = useState(false);

  // Functions

  // Check fullName whenever it changes
  React.useEffect(() => {
    const checkFullName = async () => {
      let errorMsg = '';

      if (fullName.length === 0) {
        errorMsg = 'Required';
      } else if (fullName.length < 8) {
        errorMsg = 'The full name must be 8 characters long';
      }

      return errorMsg;    
    }

    checkFullName().then(errorMsg => setFullNameErrorMsg(errorMsg));
  }, [fullName]);

  // Check email whenever it changes
  React.useEffect(() => {
    const checkEmail = async () => {
      let reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      let errorMsg = '';

      if (email.length === 0) {
        errorMsg = 'Required';
      } else if (!reg.test(email)) {
        errorMsg = 'Not a valid email';
      }

      return errorMsg;
    }

    checkEmail().then(errorMsg => setEmailErrorMsg(errorMsg));
  }, [email]);

  // Check password whenever it changes
  React.useEffect(() => {
    const checkPassword = async () => {
      let errorMsg = '';

      if (password.length === 0) {
        errorMsg = 'Required';
      } else if (password.length < 9) {
        errorMsg = 'Minimum 9 characters';
      }

      return errorMsg;
    }

    checkPassword().then(errorMsg => setPasswordErrorMsg(errorMsg));
  }, [password]);

  // Check confirmPassword whenever it changes
  React.useEffect(() => {
    const checkConfirmPassword = async () => {
      let errorMsg = '';

      if (confirmPassword.length === 0) {
        errorMsg = 'Required';
      } else if (confirmPassword !== password) {
        errorMsg = 'Confirm Password does not match';
      }

      return errorMsg;
    }

    checkConfirmPassword().then(errorMsg => setConfirmPasswordErrorMsg(errorMsg));
  }, [confirmPassword]);

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
          <CardHeader 
            avatar={ <CreateIcon /> }
            titleTypographyProps={{ variant:'h4' }}
            title="SIGN UP"
          />
          <CardContent>
            <form className={ classes.form }>
              <Grid container>
                <Grid item xs={ 12 }>
                  <StringFormInput 
                    field="Full Name"
                    value={ fullName }
                    setValue={ setFullName }
                    errorMsg={ fullNameErrorMsg }
                    classes={ classes.form_control }
                  />
                </Grid>
                <Grid item xs={ 12 }>
                  <StringFormInput 
                    field="Email"
                    value={ email }
                    setValue={ setEmail }
                    errorMsg={ emailErrorMsg }
                    classes={ classes.form_control }
                  />
                </Grid>
                <Grid item xs={ 12 }>
                  <StringFormInput 
                    field="Password"
                    value={ password }
                    setValue={ setPassword }
                    errorMsg={ passwordErrorMsg }
                    type="password"
                    classes={ classes.form_control }
                  />
                </Grid>
                <Grid item xs={ 12 }>
                  <StringFormInput 
                    field="Confirm Password"
                    value={ confirmPassword }
                    setValue={ setConfirmPassword }
                    errorMsg={ confirmPasswordErrorMsg }
                    type="password"
                    classes={ classes.form_control }
                  />
                </Grid>
              </Grid>
            </form>
            <Typography variant="caption" display="block" gutterBottom>
              Already have an account? 
              <Button size="small" color="secondary"
                onClick={ () => props.setShowSignUp(false) }
              >
                Log In
              </Button>
            </Typography>
            <Backdrop className={classes.backdrop} open={ showSpinner }>
              <CircularProgress color="secondary" size="10rem" />
            </Backdrop>
          </CardContent>
          <CardActions>
            <Button size="medium" color="secondary" 
              variant="outlined" onClick={ handleSubmit }
            >
              Sign Up
            </Button>
          </CardActions>
        </Card>
      </ThemeProvider>
    </>
  );
};

export default SignUp;