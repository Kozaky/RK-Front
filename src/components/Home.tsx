import React from 'react';
import './css/Home.css';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'

function Home() {
    return (
        <div className="Home">
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '90vh' }}>
                <nav>
                    <Typography className="Title" align="center" variant="h1">
                        Help your city to improve
                </Typography>
                    <Typography className="Subtitle" align="center" variant="h5">
                        Leave a complaint in our website and we will make sure to fix it
                </Typography>
                </nav>
            </Grid>
        </div>
    );
}

export default Home;