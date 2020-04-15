import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
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
    }
  })
);