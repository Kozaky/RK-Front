import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
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