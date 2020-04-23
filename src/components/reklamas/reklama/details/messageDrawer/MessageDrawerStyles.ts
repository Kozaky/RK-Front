import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    load: {
      textAlign: 'center',
      width: '100%',
      marginTop: theme.spacing(6)
    },
    gridMessages: {
      height: '80%',
      overflow: 'auto',
      width: '100%',
      margin: 0
    },
    gridMessageInput: {
      height: '20%'
    },
    message: {
      marginBottom: theme.spacing(2),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      marginTop: theme.spacing(2),
      textAlign: 'left',
      width: '80%'
    },
    messageContent: {
      whiteSpace: 'pre-line'
    },
    cardHeader: {
      backgroundColor: 'aquamarine'
    },
    left: {
      textAlign: 'left'
    },
    right: {
      textAlign: 'right'
    },
    messageInput: {
      width: '100%',
    },
    sendButtonDiv: {
      textAlign: 'right',
      width: '90%',
      margin: 'auto'
    }
  })
);