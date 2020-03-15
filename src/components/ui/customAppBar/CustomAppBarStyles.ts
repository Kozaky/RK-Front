import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) => 
  createStyles({
    grow: { 
      flexGrow: 1
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
          width: 200,
      },
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
          display: 'flex',
      },
    },
    sectionMobile: {
      zIndex: theme.zIndex.drawer + 1,
      display: 'flex',
      [theme.breakpoints.up('md')]: {
          display: 'none',
      },
    }
  })
);
