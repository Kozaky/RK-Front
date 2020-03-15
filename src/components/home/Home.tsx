import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import useStyles from './HomeStyles';
import Lipassam from '../../assets/lipasam.jpeg';
import Tussam from '../../assets/tussam.png';
import UrbanPlanning from '../../assets/urbanPlanning.jpg';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import { Link } from "react-router-dom";

const Home = () => {

  // Services
  
  let theme = createMuiTheme();
  theme = responsiveFontSizes(theme);
  const classes = useStyles();

  const images = [
    {
      url: Lipassam,
      title: 'Limpieza'
    },
    {
      url: Tussam,
      title: 'Transporte'
    },
    {
      url: UrbanPlanning,
      title: 'Urbanismo',
    },
  ];

  return (
    <>
      <ThemeProvider theme={theme}>
        <Grid container direction="row" justify="center" 
        alignItems="center" className={ classes.root }>
          <Grid item xs={ 1 }>
          </Grid>
          <Grid item xs={ 10 }>
            <Grid container direction="row" justify="center" 
            alignItems="center" className={ classes.topicRoot } spacing={3}>
              {images.map(image => (
                <Grid item xs={ 4 } className={ classes.topicRoot }>
                  <Link to="/topics">
                    <ButtonBase
                      focusRipple
                      key={image.title}
                      className={classes.image}
                      focusVisibleClassName={classes.focusVisible}
                      style={{
                        width: '100%'
                      }}
                    >
                    <span
                      className={classes.imageSrc}
                      style={{
                        backgroundImage: `url(${image.url})`,
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
                        {image.title}
                        <span className={classes.imageMarked} />
                      </Typography>
                    </span>
                    </ButtonBase>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={ 1 }>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
}

export default Home;
