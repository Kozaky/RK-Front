import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 345,
      height: '100%',
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxShadow: '4px 4px 4px 4px rgba(0,0,0,0.2),4px 4px 4px 4px rgba(0,0,0,0.14),4px 4px 4px 4px rgba(0,0,0,0.12)'
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    favoriteIcon: {
      color: '#f50057'
    },
    linkDiv: {
      cursor: "pointer"
    },
    dialogDelete: {
    }
  })
);