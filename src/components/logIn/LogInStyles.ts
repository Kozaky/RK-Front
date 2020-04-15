import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    form: {
      padding: '12px 0px 12px 0px'
    },
    input: {
      width: '100%'
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    card: {
      maxWidth: '500px',
      margin: 'auto'
    },
    text: {
      color: '#f44336 !important'
    }
  })
);
