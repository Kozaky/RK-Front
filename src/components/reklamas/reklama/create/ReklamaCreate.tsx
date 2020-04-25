import React, { useState, useRef, useEffect } from 'react';
import useStyles from './ReklamaCreateStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import AttachmentIcon from '@material-ui/icons/Attachment';
import Divider from '@material-ui/core/Divider';
import { TextField, Button, Grid, CardHeader, Box } from '@material-ui/core';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../../../../utils/carouselOverrides.css";
import { Carousel } from 'react-responsive-carousel';
import CheckIcon from '@material-ui/icons/Check';
import TopAlert from '../../../ui/alerts/topAlert/TopAlert';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_REKLAMA } from '../../../../graphql/Reklama';
import { handleGeneralErrors } from '../../../../utils/ErrorHandler';
import { useAuth } from '../../../../providers/authProvider/AuthProvider';
import { useHistory } from 'react-router-dom';

const ReklamaCreate = () => {

  // Services

  const classes = useStyles();
  const { updateCurrentUser } = useAuth()!;
  const history = useHistory();

  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [content, setContent] = useState('');
  const [contentError, setContentError] = useState('');
  const imageInput = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<File[] | null>(null);
  const [imgs, setImgs] = useState<JSX.Element[] | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState('');

  const [createReklama] = useMutation(CREATE_REKLAMA);

  if (showAlert) {
    setTimeout(() => setShowAlert(false), 3_000);
  }

  useEffect(() => {
    getImages(images);
  }, [images]);

  // Functions

  const resetState = () => {
    setTitle('');
    setContent('');
    imageInput.current!.value = '';
    setImages(null);
    setImgs(null);
  }

  const checkTitle = async (title: string): Promise<string> => {
    let msg = '';

    if (title.length === 0) {
      msg = 'Required';
    } else if (title.length > 100) {
      msg = 'Title is too long';
    }

    return msg;
  }

  const checkContent = async (content: string): Promise<string> => {
    let msg = '';

    if (content.length === 0) {
      msg = 'Required';
    } else if (content.length > 3_000) {
      msg = 'Content is too long';
    }

    return msg;
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
    checkTitle(e.currentTarget.value).then(result => setTitleError(result));
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.currentTarget.value);
    checkContent(e.currentTarget.value).then(result => setContentError(result));
  }

  const handleImageClick = () => {
    imageInput.current!.click();
  }

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const files: File[] = [];
    for (let i = 0; i < e.target.files!.length; i++) {
      files.push(e.target.files![i]);
    }

    setImages(files);
  }

  const getImages = async (images: File[] | null) => {

    const promises = images?.map(file =>
      getBase64(file)
        .then(base64 => base64)
        .catch(error => console.log(error))
    );

    if (promises) {
      const base64s = await Promise.all(promises);

      const imgs = base64s.map((base64, i) => (
        <div key={i}>
          <img
            src={"" + base64}
            alt={`upload${i}`} height="100" width="100"
          />
        </div>
      ));

      setImgs(imgs);
    }
  }

  const getBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  const handleCreate = () => {
    checkForm().then(result => {
      if (result) {
        executeCreate();
      }
    });
  }

  const executeCreate = () => {

    let images: { image: File }[] = [];
    for (let i = 0; i < imageInput.current!.files!.length; i++) {
      images?.push({ image: imageInput.current!.files![i] });
    }

    createReklama({
      variables: {
        reklamaDetails: {
          title: title,
          content: content,
          images: images
        }
      }
    })
      .then(({ data }) => {
        resetState();
        history.push("/reklamas")
      })
      .catch(error => {
        setShowAlert(true);
        setAlertText(handleGeneralErrors(error, updateCurrentUser));
      });
  }

  const checkForm = async (): Promise<boolean> => {

    const results = await Promise.all([
      checkTitle(title).then(result => { setTitleError(result); return result; }),
      checkContent(content).then(result => { setContentError(result); return result }),
    ]);

    const result = results.every((value: string) => value.length === 0);

    return result;
  }

  return (
    <>
      {showAlert ? <TopAlert msg={alertText} type="error" /> : null}
      <Card className={classes.root}>
        <CardHeader
          title="Create Reklama"
          className={classes.header}
        />
        <CardContent className={classes.content}>
          <Grid container direction="row"
            justify="center"
            alignItems="stretch"
            spacing={3}>
            <Grid item xs>
              <Typography variant="h6">
                Conditions about information
              </Typography>
              <Typography className={classes.conditions}>
                <CheckIcon />
                Conditions about informationConditions about information
              </Typography>
              <Typography className={classes.conditions}>
                <CheckIcon />
                Conditions about informationConditions about information
              </Typography>
              <Typography className={classes.conditions}>
                <CheckIcon />
                Conditions about informationConditions about information
              </Typography>
            </Grid>
            <Grid item xs={1} className={classes.gridDivider}>
              <Divider orientation="vertical" className={classes.dividerDesktop} />
              <Divider className={classes.dividerMobile} />
            </Grid>
            <Grid item xs>
              <TextField
                id="titleInput"
                label="Title"
                defaultValue="Title"
                error={titleError !== ''}
                variant="outlined"
                className={classes.titleInput}
                helperText={titleError}
                onChange={handleTitleChange}
              />
              <TextField
                id="contentInput"
                label="Content"
                multiline
                rows={6}
                error={contentError !== ''}
                defaultValue="Description of your complaint"
                variant="outlined"
                className={classes.multiline}
                helperText={contentError}
                onChange={handleContentChange}
              />
              <Box component="div" className={classes.divImageButton}>
                <Button
                  variant="contained"
                  startIcon={<AttachmentIcon />}
                  onClick={handleImageClick}
                >
                  Images
                </Button>
              </Box>
              <input id="imageInput"
                type="file"
                ref={imageInput}
                style={{ display: 'none' }}
                onChange={handleImagesChange}
                accept=".png,.jpg,.jpeg"
                multiple
              />
              {images !== null && images!.length !== 0
                ?
                <Box component="div" className={classes.carousel}>
                  <Carousel showThumbs={false}>
                    {imgs}
                  </Carousel>
                </Box>
                : null
              }
              <Box component="div" className={classes.divCreateButton}>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.createButton}
                  onClick={handleCreate}
                >
                  Create
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}

export default ReklamaCreate;
