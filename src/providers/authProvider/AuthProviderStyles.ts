import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    alert: {
      position: "fixed",
      width: `calc(100% - ${theme.spacing(1) * 2}px)`,
      padding: theme.spacing(1),
      top: 48,
      [theme.breakpoints.up('sm')]: {
        top: 64
      },
    }
  })
);