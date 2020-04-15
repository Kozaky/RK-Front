import React from 'react';
import useStyles from './TopAlertStyles';
import { Alert } from '@material-ui/lab';


export type TopAlertProps = {
  msg: string,
  type: "error" | "success" | "info" | "warning" | undefined
}
const TopAlert = (props: TopAlertProps) => {
  const classes = useStyles();

  return (
    <div className={classes.alert}>
      <Alert variant="filled" severity={props.type}>
        {props.msg}
      </Alert>
    </div>
  );
}

export default TopAlert;