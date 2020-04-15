import React from 'react';
import useStyles from './AdminPanelStyles';
import { Grid, Typography, Box } from '@material-ui/core';
import { useRouteMatch } from 'react-router';
import { Link } from "react-router-dom";

type OptionProps = {
  optionName: string
}

const AdminPanel = () => {

  // Services

  const classes = useStyles();
  const match = useRouteMatch();

  const Option = ({ optionName }: OptionProps) => (
    <Grid item className={classes.optionRoot} xs>
      <Link to={`${match.url}/${optionName}`} className={classes.link}>
        <Box
          display="flex"
          color="white"
          bgcolor="palevioletred"
          className={classes.option}
        >
          <Box m="auto">
            <Typography variant="h2"
              color="secondary" component="h2"
              className={classes.optionText}
            >
              {optionName.toUpperCase()}
            </Typography>
          </Box>
        </Box>
      </Link>
    </Grid>
  );

  return (
    <>
      <Grid container alignItems="flex-start" justify="flex-start" direction="row"
        spacing={3} className={classes.root}>
        <Option optionName="users" />
        <Option optionName="topics" />
      </Grid>
    </>
  );
}

export default AdminPanel;
