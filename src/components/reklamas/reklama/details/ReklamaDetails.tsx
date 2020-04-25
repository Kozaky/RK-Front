import React, { useEffect, useState } from 'react';
import useStyles from './ReklamaDetailsStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { useParams } from 'react-router-dom';
import ShareIcon from '@material-ui/icons/Share';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Chat from '@material-ui/icons/Chat';
import { useQuery } from '@apollo/react-hooks';
import { REKLAMA } from '../../../../graphql/Reklama';
import TopAlert from '../../../ui/alerts/topAlert/TopAlert';
import { handleGeneralErrors } from '../../../../utils/ErrorHandler';
import { useAuth } from '../../../../providers/authProvider/AuthProvider';
import { Box } from '@material-ui/core';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import MessagesDrawer from './messageDrawer/MessageDrawer';

const ReklamaDetails = () => {

  // Services

  const classes = useStyles();
  const { reklamaId } = useParams();
  const { updateCurrentUser } = useAuth()!;

  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const { loading, error, data } = useQuery(REKLAMA, {
    variables: {
      id: Number.parseInt(reklamaId!)
    }
  });

  useEffect(() => {

    if (error) {
      setShowAlert(true);

      setAlertText(handleErrors(error, updateCurrentUser));
    }

  }, [error]);


  // Functions

  const handleErrors = (error: any, updateCurrentUser: any) => {
    let errorMsg = '';

    switch (error.message) {
      case 'GraphQL error: not_found':
        errorMsg = "Reklama Not Found";
        break;
      default:
        errorMsg = handleGeneralErrors(error, updateCurrentUser);
        break;
    }

    return errorMsg
  }

  const toggleDrawer = () => {
    setIsOpenDrawer(!isOpenDrawer);
  }

  if (loading) return null;

  return (
    <>
      {showAlert ? <TopAlert msg={alertText} type="error" /> : null}
      {data ?
        <Card className={classes.root}>
          <Typography variant="h2" color="secondary" className={classes.title}>
            {data.reklama.title}
          </Typography>
          <CardHeader
            avatar={<Avatar aria-label="avatar" src={`data:image/png;base64,${data.reklama.user.avatar}`} />}
            title={data.reklama.user.fullName}
            subheader={new Date(data.reklama.insertedAt).toLocaleString()}
          />
          <CardContent>
            <Box component="div">
              <Carousel showThumbs={false}>
                {data.reklama.images.map((image: any) => (
                  <div key={image.id}>
                    <img
                      src={`data:image/png;base64,${image.image}`}
                      alt={image.name}
                    />
                  </div>
                ))}
              </Carousel>
            </Box>
            <Typography variant="body1" className={classes.content}>
              {data.reklama.content}
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
            <IconButton aria-label="share" onClick={toggleDrawer}>
              <Chat />
            </IconButton>
          </CardActions>
          <MessagesDrawer
            anchor="right"
            open={isOpenDrawer}
            onClose={toggleDrawer}
            setShowAlert={setShowAlert}
            setAlertText={setAlertText}
            className={classes.drawer}
          />
        </Card>
        : null
      }
    </>
  );
}

export default ReklamaDetails;
