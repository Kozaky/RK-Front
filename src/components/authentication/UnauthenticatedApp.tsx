import React, {Component} from 'react';
import CustomAppBar from '../../components/ui/CustomAppBar';
import Login from '../../components/login/Login';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.up('sm')]: {
        height: 'calc(100% - 64px)'
      },
      [theme.breakpoints.down('sm')]: {
        height: 'calc(100% - 56px)'
      },
      '& hr': {
        margin: 'auto',
        textAlign: 'center'
      }
    },
    div_divider: {
      padding: '20px 0px 20px 0px',
      height: '100%'
    }
  }),
);

const UnathenticatedApp = () => {

  const classes = useStyles();

  return (
    <>
      <CustomAppBar />
      <Grid container direction="row" justify="center" 
        alignItems="center" className={ classes.root }>
        <Grid item xs={ 5 }>
          <Login />
        </Grid>
        <Grid item xs={ 2 } className={ classes.div_divider }>
          <Divider orientation="vertical" />
        </Grid>
        <Grid item xs={ 5 }>
          <Login />
        </Grid>
      </Grid>
    </>
  );
}

export default UnathenticatedApp;
