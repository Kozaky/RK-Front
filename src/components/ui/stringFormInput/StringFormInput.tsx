import React from 'react';
import FormHelperText from '@material-ui/core/FormHelperText/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';

type StringFormInputProps = {
  errorMsg: string,
  field: string,
  value: string,
  setValue: React.Dispatch<React.SetStateAction<string>>,
  classes?: string
  type?: string
};

const StringFormInput = (props: StringFormInputProps) => {

  return (
    <FormControl className={ props.classes } 
      error={ props.errorMsg.length !==0 }
    >
      <InputLabel htmlFor="fullNameInput">{ props.field }</InputLabel>
      <Input id="fullNameInput" value={ props.value } type={ props.type }
        onChange={ (e) => props.setValue(e.currentTarget.value) } aria-describedby="fullNameInput-error-text"/>
      <FormHelperText id="fullNameInput-error-text" 
        hidden={ props.errorMsg.length === 0 }
      >
        { props.errorMsg }
      </FormHelperText>
    </FormControl>
  );
}

export default StringFormInput;