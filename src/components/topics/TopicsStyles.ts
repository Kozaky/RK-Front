import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      padding: 16,
      margin: 0,
    },
    topicsRoot: {
      minWidth: 300,
      maxWidth: 350,
      textAlign: 'center',
      '& a': {
        textDecoration: 'none',
        '&:focus, &:hover, &:visited, &:link, &:active': {
          textDecoration: 'none'
        }
      }
    },
    drawer: {
    },
    list: {
      width: 350,
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      }
    },
    searchButton: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      height: '70px !important',
      width: '70px !important',
    },
    addButton: {
      position: 'fixed',
      bottom: theme.spacing(2),
      left: theme.spacing(2),
      height: '70px !important',
      width: '70px !important',
    }
  })
);