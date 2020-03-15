import React, { useState } from 'react';
import { useAuth } from '../../providers/authProvider/AuthProvider';
import Grid from '@material-ui/core/Grid';
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

type SignUpProps = {
  setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>;
  hidden: boolean;
};

const SignUp = (props: SignUpProps) => {

  // Services

  let theme = createMuiTheme();
  theme = responsiveFontSizes(theme);
  const classes = useStyles();
  const { signUpHandler } = useAuth()!;

  // State

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [triggerCheckValue, setTriggerCheckValue] = useState(false);

  // Functions

  const checkFullName = async (fullName: string): Promise<string> => {
    let errorMsg = '';

    if (fullName.length === 0) {
      errorMsg = 'Required';
    } else if (fullName.length < 8) {
      errorMsg = 'The full name must be 8 characters long';
    }

    return errorMsg;    
  }

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

  const checkPassword = async (password: string): Promise<string> => {
    let errorMsg = '';

    if (password.length === 0) {
      errorMsg = 'Required';
    } else if (password.length < 9) {
      errorMsg = 'Minimum 9 characters';
    }

    return errorMsg;
  }

  const checkConfirmPassword = async (confirmPassword: string): Promise<string> => {
    let errorMsg = '';

    if (confirmPassword.length === 0) {
      errorMsg = 'Required';
    } else if (confirmPassword !== password) {
      errorMsg = 'Confirm Password does not match';
    }

    return errorMsg;
  }

  const handleSubmit = (event: React.FormEvent) => {

    const checkForm = async (): Promise<boolean> => {
  
      const results = await Promise.all([
        checkEmail(email),
        checkFullName(fullName),
        checkConfirmPassword(confirmPassword),
        checkPassword(password)
      ]);
      
      setTriggerCheckValue(true);
      const result = results.every((value:string) => value.length === 0);
      setTriggerCheckValue(false);

      return result;
    }

    event.preventDefault();

    checkForm().then((result:boolean) => {

      if (result) {
        signUpHandler(fullName, email, password, confirmPassword);
      } 

    });
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
          <form className={ classes.form }>
            <CardContent>
                <Grid container spacing={ 2 }>
                  <Grid item xs={ 12 }>
                    <StringFormInput 
                      field="Full Name"
                      value={ fullName }
                      setValue={ setFullName }
                      checkValue={ checkFullName }
                      triggerCheckValue={ triggerCheckValue }
                      classes={ classes.form_control }
                    />
                  </Grid>
                  <Grid item xs={ 12 }>
                    <StringFormInput 
                      field="Email"
                      value={ email }
                      setValue={ setEmail }
                      checkValue={ checkEmail }
                      triggerCheckValue={ triggerCheckValue }
                      classes={ classes.form_control }
                    />
                  </Grid>
                  <Grid item xs={ 12 }>
                    <StringFormInput 
                      field="Password"
                      value={ password }
                      setValue={ setPassword }
                      checkValue={ checkPassword }
                      triggerCheckValue={ triggerCheckValue }
                      type="password"
                      classes={ classes.form_control }
                    />
                  </Grid>
                  <Grid item xs={ 12 }>
                    <StringFormInput 
                      field="Confirm Password"
                      value={ confirmPassword }
                      setValue={ setConfirmPassword }
                      checkValue={ checkConfirmPassword }
                      triggerCheckValue={ triggerCheckValue }
                      type="password"
                      classes={ classes.form_control }
                    />
                  </Grid>
                </Grid>
              <Typography variant="caption" display="block" gutterBottom>
                Already have an account? 
                <Button size="small" color="secondary"
                  onClick={ () => props.setShowSignUp(false) }
                >
                  Log In
                </Button>
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="medium" color="secondary" type="submit"
                variant="outlined" onClick={ handleSubmit }
              >
                Sign Up
              </Button>
            </CardActions>
          </form>
        </Card>
      </ThemeProvider>
    </>
  );
};

export default SignUp;