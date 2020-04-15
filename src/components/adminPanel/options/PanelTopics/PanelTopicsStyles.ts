import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 652,
      margin: 16,
      boxShadow: '4px 4px 4px 4px rgba(0,0,0,0.2),4px 4px 4px 4px rgba(0,0,0,0.14),4px 4px 4px 4px rgba(0,0,0,0.12)'
    },
    dialogDelete: {
      '& h2': {
        textAlign: 'center',
        color: theme.palette.secondary.main
      },
      '& ul > div > div > span': {
        textAlign: 'center'
      }
    },
    formInput: {
      margin: 16
    },
    dialogCreate: {
      '& h2': {
        textAlign: 'center',
        color: theme.palette.secondary.main
      }
    },
    addButton: {
      position: 'fixed',
      bottom: theme.spacing(2),
      left: 100,
      height: '70px !important',
      width: '70px !important',
    },
    createButton: {
      margin: 8
    },
    cancelButton: {
      margin: 8
    },
    imageButton: {
      width: '40%',
      margin: 16
    }
  })
);