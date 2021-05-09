import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 16,
      boxShadow: '4px 4px 4px 4px rgba(0,0,0,0.2),4px 4px 4px 4px rgba(0,0,0,0.14),4px 4px 4px 4px rgba(0,0,0,0.12)'
    },
    title: {
      textAlign: 'center',
      margin: theme.spacing(3)
    },
    content: {
      marginTop: theme.spacing(6),
      whiteSpace: 'pre-line'
    },
    actions: {
      padding: theme.spacing(3),
      flexDirection: 'row-reverse'
    },
    drawer: {
      textAlign: 'center',
      '& .MuiDrawer-paperAnchorRight': {
        width: 400
      },
      [theme.breakpoints.down('xs')]: {
        '& .MuiDrawer-paperAnchorRight': {
          width: '100%'
        }
      }
    },
    backButton: {
      position: 'fixed',
      bottom: theme.spacing(2),
      left: theme.spacing(2),
      height: '70px !important',
      width: '70px !important',
    }
  })
);