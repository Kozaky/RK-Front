import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 0,
      width: '100%',
    },
    container: {
      height: 600,
    },
    loader: {
      display: 'block',
      marginTop: 8,
      marginLeft: 8
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
    drawerTitle: {
      padding: 16,
      fontWeight: 700
    },
    gridRoot: {
      width: '100%',
      padding: 16,
      margin: 0,
    },
    input: {
      minWidth: 200,
      width: '100%'
    },
    filterButton: {
      minWidth: 150,
      margin: 8
    },
    searchButton: {
      position: 'fixed',
      bottom: theme.spacing(2),
      left: theme.spacing(2),
      height: '70px !important',
      width: '70px !important',
    }
  })
);