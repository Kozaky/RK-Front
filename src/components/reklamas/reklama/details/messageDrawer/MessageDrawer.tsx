import React, { useEffect, useState, useRef, Dispatch, SetStateAction } from 'react';
import useStyles from './MessageDrawerStyles';
import { MESSAGES, CREATE_MESSAGE } from '../../../../../graphql/Message';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Box, Drawer, DrawerProps, Grid, TextField, CardHeader, Card, CardContent, Typography, Avatar, IconButton } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../../../providers/authProvider/AuthProvider';
import { handleGeneralErrors } from '../../../../../utils/ErrorHandler';

type MessagesDrawerProps = {
  setShowAlert: Dispatch<SetStateAction<boolean>>,
  setAlertText: Dispatch<SetStateAction<string>>,
  reklamaId: number,
} & DrawerProps

const MessagesDrawer = ({ setShowAlert, setAlertText, reklamaId, ...rest }: MessagesDrawerProps) => {

  const classes = useStyles();
  const { updateCurrentUser, currentUser } = useAuth()!;

  const doScrollDown = useRef<Boolean>(true);
  const messagesGrid = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState('');
  const [messageError, setMessageError] = useState('');

  const [createMessage] = useMutation(CREATE_MESSAGE);
  const { loading, error, data, refetch } = useQuery(MESSAGES, {
    variables: {
      id: reklamaId
    }
  });

  useEffect(() => {

    if (error) {
      setShowAlert(true);
      setAlertText(handleGeneralErrors(error, updateCurrentUser));
    }

  }, [error]);

  useEffect(() => {

    const scrollMessagesDown = () => {
      window.requestAnimationFrame(() => {
        if (messagesGrid.current) {

          const hight = messagesGrid.current!.scrollHeight;
          messagesGrid.current.scrollTo(0, hight);

          doScrollDown.current = false;
        }
      });
    }

    if (doScrollDown.current) {
      scrollMessagesDown()
    }
  });

  if (loading) return null;

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    checkMessage(e.target.value);
    setMessage(e.target.value);
  }

  const sendMessage = () => {

    if (checkMessage(message)) {
      createMessage({
        variables: {
          messageDetails: {
            reklamaId: reklamaId,
            content: message
          }
        }
      })
        .then(() => {
          setMessage('');
          doScrollDown.current = true;
          refetch();
        })
        .catch(error => {
          setShowAlert(true);
          setAlertText(handleGeneralErrors(error, updateCurrentUser));
        });
    }
  }

  const checkMessage = (message: string) => {
    let valid = true;

    if (message.length > 3_000) {
      valid = false;
      setMessageError('Message too long');
    } else if (message.length === 0) {
      valid = false;
      setMessageError('Message must not be empty');
    } else {
      setMessageError('');
    }

    return valid;
  }

  return (
    <Drawer {...rest}>
      <Grid container alignItems="flex-end" justify="center"
        className={classes.gridMessages} ref={messagesGrid}>
        <Grid item xs>
          {data ? data.reklama.messages.map((message: any) => (
            <Box key={message.id} display="flex" flexDirection={currentUser!.id === message.user.id ? 'row-reverse' : 'row'}>
              <Card className={classes.message}>
                <CardHeader
                  avatar={<Avatar aria-label="avatar" src={`data:image/png;base64,${message.user.avatar}`} />}
                  title={message.user.fullName}
                  subheader={new Date(message.insertedAt).toLocaleString()}
                  className={classes.cardHeader}
                />
                <CardContent>
                  <Typography variant="body2" component="p" className={classes.messageContent}>
                    {message.content}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))
            : null
          }
        </Grid>
      </Grid>
      <Grid container alignItems="flex-end" justify="center"
        className={classes.gridMessageInput}>
        <Grid item xs>
          <Box className={classes.sendButtonDiv}>
            <TextField
              id="messageInput"
              label="Message"
              multiline
              rows={3}
              variant="outlined"
              error={messageError !== ''}
              helperText={messageError}
              value={message}
              onChange={handleMessageChange}
              className={classes.messageInput}
            />
            <IconButton aria-label="share" color="secondary" onClick={sendMessage}>
              <SendIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Drawer >
  );
}

export default MessagesDrawer;