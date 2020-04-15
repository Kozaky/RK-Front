import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    alert: {
      zIndex: 100,
      position: 'absolute',
      width: `calc(100% - ${theme.spacing(1) * 2}px)`,
      padding: theme.spacing(1),
      top: 54,
      [theme.breakpoints.up('sm')]: {
        top: 64
      },
    }
  })
);