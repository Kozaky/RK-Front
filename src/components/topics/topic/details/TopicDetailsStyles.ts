import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 16,
      boxShadow: '4px 4px 4px 4px rgba(0,0,0,0.2),4px 4px 4px 4px rgba(0,0,0,0.14),4px 4px 4px 4px rgba(0,0,0,0.12)'
    },
    media: {
      height: 350
    },
    title: {
      margin: theme.spacing(3)
    },
    paragraph: {
      marginTop: theme.spacing(2),
      paddingLeft: theme.spacing(7),
      paddingRight: theme.spacing(7)
    },
    actions: {
      padding: theme.spacing(3)
    }
  })
);