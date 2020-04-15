import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) => 
  createStyles({
    grow: { 
      flexGrow: 1
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
          display: 'flex',
      },
    },
    linkWithoutDecoration: {
      textDecoration: 'none',
      '&:focus, &:hover, &:visited, &:link, &:active': {
        textDecoration: 'none'
      }
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
