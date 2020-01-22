import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    form: {
      padding: '12px 0px 12px 0px'
    },
    form_control: {
      width: '100%'
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    card: {
      maxWidth: '500px',
      margin: 'auto'
    }
  })
);
