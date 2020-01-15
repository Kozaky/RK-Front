import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

function Home() {
  return (
    <div>
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="center">
        <nav>
          <Typography align="center" variant="h1">
            Help your city to improve
          </Typography>
          <Typography
            align="center" variant="h5">
            Leave a complaint in our website and we will make sure to fix it
    		  </Typography>
        </nav>
      </Grid>
    </div>
  );
}

export default Home;
