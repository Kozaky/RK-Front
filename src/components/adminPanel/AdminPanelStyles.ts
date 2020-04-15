import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      padding: 16,
      margin: 0,
    },
    optionRoot: {
      '& a': {
        textDecoration: 'none',
        margin: 'auto',
        '&:focus, &:hover, &:visited, &:link, &:active': {
          textDecoration: 'none'
        }
      }
    },
    link: {
      minWidth: 300,
      maxWidth: 350,
      minHeight: 300,
      maxHeight: 350,
      display: 'block'
    },
    option: {
      minWidth: 300,
      maxWidth: 350,
      minHeight: 300,
      maxHeight: 350,
      backgroundColor: theme.palette.secondary.dark,
      textAlign: 'center',
      boxShadow: '4px 4px 4px 4px rgba(0,0,0,0.2),4px 4px 4px 4px rgba(0,0,0,0.14),4px 4px 4px 4px rgba(0,0,0,0.12)',
      '&:hover': {
        backgroundColor: theme.palette.secondary.light
      }
    },
    optionText: {
      margin: 'auto',
      color: 'white',
      fontWeight: 1000
    }
  })
);