import React from 'react';
import useStyles from './TopicDetailsStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { useParams } from 'react-router-dom';
import SpanishSquare from '../../../../assets/spanishSquare.jpg';
import Divider from '@material-ui/core/Divider';
import ShareIcon from '@material-ui/icons/Share';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Chat from '@material-ui/icons/Chat';

type RouteParams = {
  id: string
}

const TopicDetails = () => {

  //TODO: load data for topic with id match.id

  // Services

  const classes = useStyles();
  const params = useParams<RouteParams>();

  return (
    <>
      <Card className={classes.root}>
        <CardMedia
          className={classes.media}
          image={SpanishSquare}
          title="Spanish Square"
        />
        <CardHeader
          avatar={<Avatar aria-label="avatar" src={SpanishSquare} />}
          title="Dana Andriienko"
          subheader="6 March 2020"
        />
        <Divider variant="middle" />
        <CardContent>
          <Typography align="center" gutterBottom variant="h3" className={classes.title}>
            Long queue in the Inmigration Office
          </Typography>
          <Typography align="justify" variant="body1" color="textSecondary" component="p" className={classes.paragraph}>
            Huge computer screens line a dark, windowless control room in Corvallis, Oregon, where engineers at the company Nuscale Power hope to define the next wave of nuclear energy. Glowing icons fill the screens, representing the power output of 12 miniature nuclear reactors. Together, these small modular reactors would generate about the same amount of power as one of the conventional nuclear plants that currently dot the United States – producing enough electricity to power 540,000 homes. On the glowing screens, a palm tree indicates which of the dozen units is on “island mode”, allowing a single reactor to run disconnected from the grid in case of an emergency.
          </Typography>
          <Typography align="justify" variant="body1" color="textSecondary" component="p" className={classes.paragraph}>
            This control room is just a mock-up, and the reactors depicted on the computer screens do not, in fact, exist. Yet Nuscale has invested more than $900m (£685m) in the development of small modular reactor (SMR) technology, which the company says represents the next generation of nuclear power plants. Nuscale is working on a full-scale prototype and says it is on track to break ground on its first nuclear power plant – a 720-megawatt project for a utility in Idaho – within two years. The US Nuclear Regulatory Commission has just completed the fourth phase of review of Nuscale’s design, the first SMR certification the commission has reviewed. The company expect final approval by the end of 2020. The US Department of Energy has already invested $317m (£241m) in the research and development of Nuscale’s SMR project.
          </Typography>
          <Typography align="justify" variant="body1" color="textSecondary" component="p" className={classes.paragraph}>
            Nuscale is not alone in developing miniature reactors. In Russia, the government has launched a floating 70MW reactor in the Arctic Ocean. China announced plans in 2016 to build its own state-funded floating SMR design. Three Canadian provinces – Ontario, New Brunswick, and Saskatchewan – have signed a memorandum to look into the development and deployment of small modular reactors. And the Rolls-Royce Consortium in the UK is working on the development of a 440MW SMR.
          </Typography>
        </CardContent>
        <CardActions disableSpacing className={classes.actions}>
          <IconButton aria-label="likes">
            <FavoriteIcon />
          </IconButton>
          8
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <IconButton aria-label="share">
            <Chat />
          </IconButton>
        </CardActions>
      </Card>
    </>
  );
}

export default TopicDetails;
