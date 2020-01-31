import React from 'react';
import FormHelperText from '@material-ui/core/FormHelperText/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import useStyles from './StringFormInputStyles';

type StringFormInputProps = {
  errorMsg: string,
  field: string,
  value: string,
  setValue: React.Dispatch<React.SetStateAction<string>>,
  classes?: string
  type?: string
};

const StringFormInput = (props: StringFormInputProps) => {

  const classes = useStyles();

  return (
    <FormControl className={ props.classes } 
      error={ props.errorMsg.length !==0 }
    >
      <InputLabel htmlFor={ props.field }>{ props.field }</InputLabel>
      <Input id={ props.field } value={ props.value } type={ props.type }
        onChange={ (e) => props.setValue(e.currentTarget.value) } aria-describedby="fullNameInput-error-text"/>
      <FormHelperText id="fullNameInput-error-text" 
        hidden={ props.errorMsg.length === 0 }
        className={ classes.text }
      >
        { props.errorMsg }
      </FormHelperText>
    </FormControl>
  );
}

export default StringFormInput;