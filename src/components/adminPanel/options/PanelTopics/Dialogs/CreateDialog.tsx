import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import useStyles from './DialogStyles';
import { useAuth } from '../../../../../providers/authProvider/AuthProvider';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_TOPIC } from '../../../../../graphql/Topic';
import { handleGeneralErrors } from '../../../../../utils/ErrorHandler';
import { Dialog, DialogTitle, Divider, Button } from '@material-ui/core';
import StringFormInput from '../../../../ui/stringFormInput/StringFormInput';
import AttachmentIcon from '@material-ui/icons/Attachment';

type CreateDialogProps = {
  show: boolean,
  setShow: React.Dispatch<React.SetStateAction<boolean>>,
  setShowAlert: Dispatch<SetStateAction<boolean>>,
  setAlertText: Dispatch<SetStateAction<string>>,
  setAlertType: React.Dispatch<React.SetStateAction<"error" | "success" | "info" | "warning" | undefined>>,
}

const CreateDialog = (props: CreateDialogProps) => {

  // Services

  const classes = useStyles();
  const { updateCurrentUser } = useAuth()!;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [triggerValidation, setTriggerValidation] = useState(false);
  const imageInput = useRef<HTMLInputElement>(null);

  const [createTopic] = useMutation(CREATE_TOPIC);

  // Functions 

  const checkTitle = async (title: string): Promise<string> => {
    let msg = '';

    if (title.length === 0) {
      msg = 'Required';
    } else if (title.length > 50) {
      msg = 'Title is too long';
    }

    return msg;
  }

  const checkDescription = async (description: string): Promise<string> => {
    let msg = '';

    if (description.length === 0) {
      msg = 'Required';
    } else if (description.length > 50) {
      msg = 'Description is too long';
    }

    return msg;
  }

  const checkImage = async (): Promise<string> => {
    return imageInput.current!.files?.length === 0 ? 'Must select an image' : '';
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
        executeCreate();
      }
    });
  }

  const executeCreate = () => {
    createTopic({
      variables: {
        topicDetails: {
          title: title,
          description: description,
          image: imageInput.current!.files![0]
        }
      }
    })
      .then(({ data }) => {
        setTitle('');
        setDescription('');
        imageInput.current!.value = '';
        props.setShow(false);
        props.setAlertType('success');
        props.setShowAlert(true);
        props.setAlertText('Topic created');
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
      checkDescription(description),
      checkImage()
    ]);

    setTriggerValidation(true);
    const result = results.every((value: string) => value.length === 0);

    if (!result && results.find((msg: string) => msg === 'Must select an image')) {
      props.setAlertType('error');
      props.setShowAlert(true);
      props.setAlertText('Must select an image');
    }

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
        Create Topic
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
        Create
      </Button>
    </Dialog >
  )
}

export default CreateDialog;