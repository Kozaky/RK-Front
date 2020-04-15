import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 652,
      margin: 16,
      boxShadow: '4px 4px 4px 4px rgba(0,0,0,0.2),4px 4px 4px 4px rgba(0,0,0,0.14),4px 4px 4px 4px rgba(0,0,0,0.12)'
    },
    dialogUpdate: {
      '& h2': {
        textAlign: 'center',
        color: theme.palette.secondary.main
      },
      '& div:nth-of-type(3) > div': {
        width: 300
      },
      '& span': {
        textAlign: 'center'
      }
    }
  })
);