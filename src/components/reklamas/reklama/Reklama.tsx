import React, { Dispatch, SetStateAction, useState } from 'react';
import useStyles from './ReklamaStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { Link } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import DeleteIcon from '@material-ui/icons/Delete';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import { DELETE_REKLAMA } from '../../../graphql/Reklama';
import { Dialog, DialogActions, DialogTitle } from '@material-ui/core';
import { useMutation } from '@apollo/react-hooks';
import { handleGeneralErrors } from '../../../utils/ErrorHandler';
import Button from '@material-ui/core/Button';
import { useAuth } from '../../../providers/authProvider/AuthProvider';
import Chip from '@material-ui/core/Chip';

export type ReklamaProps = {
  id: number
  avatar: string,
  header: string,
  subheader: string,
  image: string,
  imageTitle: string,
  shortDescription: string,
  numLikes: number,
  userEmail: string,
  locationName: string,
  edit: boolean,
  delete: boolean,
  showDetails: (reklamaId: number) => void,
  deleteReklama: (reklamaId: number) => void,
  setShowAlert: Dispatch<SetStateAction<boolean>>,
  setAlertText: Dispatch<SetStateAction<string>>
}

const Reklama = (props: ReklamaProps) => {

  // Services

  const classes = useStyles();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Functions

  const handleDelete = () => {
    setShowDeleteDialog(true);
  }

  return (
    <>
      <DialogDelete
        show={showDeleteDialog}
        setShow={setShowDeleteDialog}
        reklamaId={props.id}
        setShowAlert={props.setShowAlert}
        setAlertText={props.setAlertText}
        deleteReklama={props.deleteReklama}
      />
      <Card className={classes.root}>
        <div onClick={() => props.showDetails(props.id)} className={classes.linkDiv}>
          <CardHeader
            title={props.header}
            subheader={props.subheader}
          />
          <CardMedia
            className={classes.media}
            image={`data:image/png;base64,${props.image}`}
            title={props.imageTitle}
          />
          <CardContent>
            <Typography variant="body2" component="p">
              {props.shortDescription}
            </Typography>
          </CardContent>
        </div>
        <CardActions disableSpacing>
          {props.edit ?
            <Link to={`/reklamas/edit/${props.id}`}>
              <IconButton aria-label="likes">
                <BorderColorIcon className={classes.favoriteIcon} />
              </IconButton>
            </Link> : null
          }
          {props.delete ?
            <IconButton aria-label="likes" onClick={handleDelete}>
              <DeleteIcon className={classes.favoriteIcon} />
            </IconButton> : null
          }
          <Chip label={props.locationName} />
        </CardActions>
      </Card>
    </>
  );
}

type CustomDialogProps = {
  reklamaId: number,
  show: boolean
  setShow: React.Dispatch<React.SetStateAction<boolean>>,
  setShowAlert: Dispatch<SetStateAction<boolean>>,
  setAlertText: Dispatch<SetStateAction<string>>,
  deleteReklama: (reklamaId: number) => void
}

const DialogDelete = (props: CustomDialogProps) => {

  const classes = useStyles();
  const { updateCurrentUser } = useAuth()!;

  const [deleteReklama] = useMutation(DELETE_REKLAMA);

  const handleDeleteReklama = () => {

    deleteReklama({
      variables: {
        id: props.reklamaId
      }
    })
      .then(({ data }) => {
        props.setShow(false);
        props.deleteReklama(props.reklamaId);
      })
      .catch(error => {
        props.setShow(false);
        props.setShowAlert(true);
        props.setAlertText(handleGeneralErrors(error, updateCurrentUser));
      });
  }

  return (
    <Dialog onClose={() => props.setShow(false)}
      aria-labelledby="simple-dialog-title"
      open={props.show}
      className={classes.dialogDelete}
    >
      <DialogTitle id="simple-dialog-title" color="secondary">Do you want to delete this Reklama?</DialogTitle>
      <DialogActions>
        <Button onClick={() => handleDeleteReklama()} color="secondary">
          YES
        </Button>
        <Button onClick={() => props.setShow(false)} color="secondary">
          NO
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Reklama;


