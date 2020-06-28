import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      padding: 16,
      margin: 0,
    },
    reklamasRoot: {
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
    load: {
      textAlign: 'center',
      width: '100%',
      marginTop: theme.spacing(6)
    },
    loader: {
      textAlign: 'center',
      width: '100%'
    },
    drawer: {
      textAlign: 'center',
      '& div:nth-of-type(3)': {
        width: 400
      },
      [theme.breakpoints.down('xs')]: {
        '& div:nth-of-type(3)': {
          width: '100%'
        }
      }
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
    },
    linkDiv: {
      cursor: "pointer"
    }
  })
);