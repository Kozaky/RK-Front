import React, { useState } from 'react';
import FormHelperText from '@material-ui/core/FormHelperText/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import useStyles from './StringFormInputStyles';

type StringFormInputProps = {
  field: string,
  value: string,
  setValue: React.Dispatch<React.SetStateAction<string>>,
  checkValue: (value: string) => Promise<string>,
  triggerCheckValue: boolean,
  classes?: string
  type?: string
};

const StringFormInput = (props: StringFormInputProps) => {

  // Services

  const classes = useStyles();

  // State

  const [errorMsg, setErrorMsg] = useState('');

  // Functions

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.checkValue(e.currentTarget.value).then((errorMsg: string) => setErrorMsg(errorMsg));
    props.setValue(e.currentTarget.value);
  }

  // Logic

  if (props.triggerCheckValue) {
    props.checkValue(props.value).then((errorMsg: string) => setErrorMsg(errorMsg));
  }

  return (
    <FormControl className={ props.classes } 
      error={ errorMsg.length !==0 }
    >
      <InputLabel htmlFor={ props.field }>{ props.field }</InputLabel>
      <Input id={ props.field } value={ props.value } type={ props.type }
        onChange={ handleChange } aria-describedby="StringFormInput-error-text"/>
      <FormHelperText id="StringFormInput-error-text" 
        hidden={ errorMsg.length === 0 }
        className={ classes.text }
      >
        { errorMsg }
      </FormHelperText>
    </FormControl>
  );
}

export default StringFormInput;