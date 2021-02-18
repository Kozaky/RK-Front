import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 16,
      backgroundColor: 'ghostwhite',
      boxShadow: '4px 4px 4px 4px rgba(0,0,0,0.2),4px 4px 4px 4px rgba(0,0,0,0.14),4px 4px 4px 4px rgba(0,0,0,0.12)'
    },
    header: {
      textAlign: 'center',
      color: theme.palette.secondary.main,
      '& span': {
        fontSize: 'xxx-large',
        fontWeight: 700,
      }
    },
    conditions: {
      color: '#606060',
      '& svg': {
        color: 'green'
      }
    },
    title: {
      marginTop: theme.spacing(3),
      fontWeight: 700
    },
    content: {
      textAlign: 'center',
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3)
    },
    titleInput: {
      marginBottom: theme.spacing(6),
      marginTop: theme.spacing(3),
      width: '100%'
    },
    divImageButton: {
      textAlign: 'left'
    },
    dividerDesktop: {
      height: '100%',
      margin: 'auto',
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      }
    },
    dividerMobile: {
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      }
    },
    gridDivider: {
      minWidth: '100%',
      [theme.breakpoints.up('sm')]: {
        minWidth: 'inherit',
      }
    },
    carousel: {
      marginTop: theme.spacing(3),
      '& img': {
        objectFit: 'cover'
      }
    },
    multiline: {
      width: '100%',
      marginBottom: theme.spacing(6)
    },
    createButton: {
      marginTop: theme.spacing(4)
    },
    divCreateButton: {
      textAlign: 'right'
    }
  })
);