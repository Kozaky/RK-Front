import React from 'react';
import useStyles from './TopicStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';

export type TopicProps = {
  avatar: string,
  header: string,
  subheader: string,
  image: string,
  imageTitle: string,
  shortDescription: string,
  numLikes: number
}

const Topics = (props: TopicProps) => {

  // Services
  
  const classes = useStyles();

  return (
    <>
      <Card className={classes.root}>
      <CardHeader
        avatar={ <Avatar aria-label="avatar" src={ props.avatar }/> }
        title={ props.header }
        subheader={ props.subheader }
      />
      <CardMedia
        className={ classes.media }
        image={ props.image }
        title={ props.imageTitle }
      />
      <CardContent>
        <Typography variant="body2" component="p">
                  { props.shortDescription }
                </Typography>
        </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="likes">
          <FavoriteIcon className={ classes.favoriteIcon }/>
        </IconButton>
        { props.numLikes }
      </CardActions>
    </Card>
    </>
  );
}

export default Topics;
