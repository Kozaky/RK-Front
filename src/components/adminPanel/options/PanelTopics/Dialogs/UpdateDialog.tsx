import React, { Dispatch, SetStateAction, useState, useRef, useEffect } from 'react';
import useStyles from './DialogStyles';
import { useAuth } from '../../../../../providers/authProvider/AuthProvider';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { UPDATE_TOPIC, TOPIC } from '../../../../../graphql/Reklama';
import { handleGeneralErrors } from '../../../../../utils/ErrorHandler';
import { Dialog, DialogTitle, Divider, Button } from '@material-ui/core';
import StringFormInput from '../../../../ui/stringFormInput/StringFormInput';
import AttachmentIcon from '@material-ui/icons/Attachment';

type UpdateDialogProps = {
  show: boolean,
  setShow: React.Dispatch<React.SetStateAction<boolean>>,
  setShowAlert: Dispatch<SetStateAction<boolean>>,
  setAlertText: Dispatch<SetStateAction<string>>,
  setAlertType: React.Dispatch<React.SetStateAction<"error" | "success" | "info" | "warning" | undefined>>,
  topicId: string | null
}

const UpdateDialog = (props: UpdateDialogProps) => {

  // Services
  const classes = useStyles();
  const { updateCurrentUser } = useAuth()!;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [triggerValidation, setTriggerValidation] = useState(false);
  const imageInput = useRef<HTMLInputElement>(null);
  const runQuery = useRef(false);

  const [updateTopic] = useMutation(UPDATE_TOPIC);
  const { loading, error, data } = useQuery(TOPIC, {
    variables: { id: Number.parseInt(props.topicId!) },
    fetchPolicy: 'no-cache',
    skip: !runQuery.current || !props.show
  });

  useEffect(() => {

    if (props.show === false) {
      runQuery.current = true;
    }

    if (error) {
      props.setAlertType('error');
      props.setShowAlert(true);
      props.setAlertText(handleGeneralErrors(error, updateCurrentUser));
    }

  }, [props.show, error])

  if (loading) return null;
  if (error) return null;

  if (data) {
    setTitle(data.topic.title);
    setDescription(data.topic.description);
    runQuery.current = false;
  }

  // Functions

  const checkTitle = async (title: string): Promise<string> => {
    let msg = '';

    if (title.length === 0) {
      msg = 'Required';
    } else if (title.length > 255) {
      msg = 'Title is too long';
    }

    return msg;
  }

  const checkDescription = async (description: string): Promise<string> => {
    let msg = '';

    if (description.length === 0) {
      msg = 'Required';
    } else if (description.length > 255) {
      msg = 'Description is too long';
    }

    return msg;
  }

  const handleImage = () => {
    imageInput.current!.click();
  }

  const handleCancel = () => {
    props.setShow(false);
  }

  const handleCreate = () => {
    checkForm().then(result => {
      if (result) {
        executeUpdate();
      }
    });
  }

  const executeUpdate = () => {

    let updateTopicDetails: { [index: string]: any } = {
      id: Number.parseInt(props.topicId!),
      title: title,
      description: description
    };

    if (imageInput.current!.files!.length !== 0) {
      updateTopicDetails['image'] = imageInput.current!.files![0];
    }

    updateTopic({
      variables: {
        updateTopicDetails: updateTopicDetails
      }
    })
      .then(({ data }) => {
        props.setShow(false);
        props.setAlertType('success');
        props.setShowAlert(true);
        props.setAlertText('Topic updated');
      })
      .catch(error => {
        props.setAlertType('error');
        props.setShowAlert(true);
        props.setAlertText(handleGeneralErrors(error, updateCurrentUser));
      });
  }

  const checkForm = async (): Promise<boolean> => {

    const results = await Promise.all([
      checkTitle(title),
      checkDescription(description)
    ]);

    setTriggerValidation(true);
    const result = results.every((value: string) => value.length === 0);
    setTriggerValidation(false);

    return result;
  }

  return (
    <Dialog onClose={() => props.setShow(false)}
      aria-labelledby="simple-dialog-title"
      open={props.show}
      className={classes.dialogCreate}
      fullWidth={true}
      maxWidth='xs'
    >
      <DialogTitle id="simple-dialog-title" color="secondary">
        Update Topic
      </DialogTitle>
      <Divider />
      <StringFormInput
        field="Title"
        value={title}
        setValue={setTitle}
        checkValue={checkTitle}
        triggerCheckValue={triggerValidation}
        classes={classes.formInput}
      />
      <StringFormInput
        field="Description"
        value={description}
        setValue={setDescription}
        checkValue={checkDescription}
        triggerCheckValue={triggerValidation}
        classes={classes.formInput}
      />
      <input id="imageInput"
        type="file"
        ref={imageInput}
        style={{ display: 'none' }}
        accept="image/png;image/jpg;image/jpeg"
      />
      <Button
        variant="contained"
        color="secondary"
        startIcon={<AttachmentIcon />}
        className={classes.imageButton}
        onClick={handleImage}
      >
        Image
      </Button>
      <Button
        variant="contained"
        onClick={handleCancel}
        className={classes.cancelButton}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        color="secondary"
        className={classes.createButton}
        onClick={handleCreate}
      >
        Update
      </Button>
    </Dialog >
  )
}

export default UpdateDialog;