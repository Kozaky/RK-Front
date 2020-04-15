import React, { Dispatch, SetStateAction } from 'react';
import useStyles from './DialogStyles';
import { useAuth } from '../../../../../providers/authProvider/AuthProvider';
import { useMutation } from '@apollo/react-hooks';
import { DELETE_TOPIC } from '../../../../../graphql/Reklama';
import { handleGeneralErrors } from '../../../../../utils/ErrorHandler';
import { Dialog, DialogTitle, Divider, List, ListItem, ListItemText } from '@material-ui/core';

type DeleteDialogProps = {
  show: boolean,
  setShow: React.Dispatch<React.SetStateAction<boolean>>,
  topicId: string | null,
  setShowAlert: Dispatch<SetStateAction<boolean>>,
  setAlertText: Dispatch<SetStateAction<string>>,
  setAlertType: React.Dispatch<React.SetStateAction<"error" | "success" | "info" | "warning" | undefined>>,
}

const DeleteDialog = (props: DeleteDialogProps) => {

  // Services

  const classes = useStyles();
  const { updateCurrentUser } = useAuth()!;
  const [deleteTopic] = useMutation(DELETE_TOPIC);

  // Functions

  const handleYes = () => {

    deleteTopic({
      variables: {
        id: Number.parseInt(props.topicId!)
      }
    })
      .then(({ data }) => {
        props.setShow(false);
        props.setAlertType('success');
        props.setShowAlert(true);
        props.setAlertText('Topic deleted');
      })
      .catch(error => {
        props.setAlertType('error');
        props.setShowAlert(true);
        props.setAlertText(handleGeneralErrors(error, updateCurrentUser));
      });
  }

  const handleNo = () => {
    props.setShow(false);
  }

  return (
    <Dialog onClose={() => props.setShow(false)}
      aria-labelledby="simple-dialog-title"
      open={props.show}
      className={classes.dialogDelete}
      fullWidth={true}
      maxWidth='xs'
    >
      <DialogTitle id="simple-dialog-title" color="secondary">
        Are you sure you want to delete this topic?
      </DialogTitle>
      <Divider />
      <List>
        <ListItem button onClick={handleNo}>
          <ListItemText primary="NO" />
        </ListItem>
        <ListItem button onClick={handleYes}>
          <ListItemText primary="YES" />
        </ListItem>
      </List>
    </Dialog >
  )
}

export default DeleteDialog;