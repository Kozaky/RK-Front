import React, { useEffect, useState } from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import useStyles from './HomeStyles';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import { handleGeneralErrors } from '../../utils/ErrorHandler';
import { useQuery } from '@apollo/react-hooks';
import { TOPICS } from '../../graphql/Topic';
import { useAuth } from '../../providers/authProvider/AuthProvider';
import TopAlert from '../ui/alerts/topAlert/TopAlert';

const Home = () => {

  // Services

  let theme = createMuiTheme();
  theme = responsiveFontSizes(theme);
  const classes = useStyles();
  const { updateCurrentUser } = useAuth()!;

  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState('');

  const { loading, error, data } = useQuery(TOPICS);

  useEffect(() => {

    if (error) {
      setShowAlert(true);
      setAlertText(handleGeneralErrors(error, updateCurrentUser));
    }

  }, [error]);

  if (loading) return null;

  const topics = () => {

    let topics = null;

    if (data) {
      topics = data.topics.map((topic: any) => (
        <Grid item className={classes.topicRoot} key={topic.id}>
          <Link to={`/topics/${topic.id}/reklamas`}>
            <ButtonBase
              focusRipple
              className={classes.image}
              focusVisibleClassName={classes.focusVisible}
              style={{
                width: '100%'
              }}
            >
              <span
                className={classes.imageSrc}
                style={{
                  backgroundImage: `url("data:image/png;base64, ${topic.image}")`,
                  borderRadius: '50%'
                }}
              />
              <span className={classes.imageBackdrop} />
              <span className={classes.imageButton}>
                <Typography
                  component="span"
                  variant="h5"
                  color="inherit"
                  className={classes.imageTitle}
                >
                  {topic.title}
                  <span className={classes.imageMarked} />
                </Typography>
              </span>
            </ButtonBase>
          </Link>
        </Grid>
      ));
    }

    return topics;
  }

  return (
    <>
      {showAlert ? <TopAlert msg={alertText} type="error" /> : null}
      <ThemeProvider theme={theme}>
        <Grid container direction="row" justify="center"
          alignItems="center" className={classes.root}>
          <Grid item xs={1}>
          </Grid>
          <Grid item xs={10}>
            <Grid container direction="row"
              justify="center" alignItems="center"
              className={classes.topicRoot} spacing={3}
            >
              {topics()}
            </Grid>
          </Grid>
          <Grid item xs={1}>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
}

export default Home;
