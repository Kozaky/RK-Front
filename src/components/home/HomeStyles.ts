import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import SpanishSquare from '../../assets/spanishSquare.jpg';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundImage: `url(${SpanishSquare})`,
      boxShadow: 'inset 0 0 0 1000px rgba(0,0,0,.7)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundColor: 'black',
      padding: '16px',
      height: 'calc(100% - 48px)',
      [theme.breakpoints.up('sm')]: {
        height: 'calc(100% - 64px)'
      },
    },
    topics: {
      width: '100%',
    },
    topicRoot: {
      minWidth: 250,
      textAlign: 'center'
    },
    image: {
      position: 'relative',
      height: 250,
      maxWidth: 250,
      [theme.breakpoints.down('xs')]: {
        height: 200,
        maxWidth: 200
      },
      '&:hover, &$focusVisible': {
        zIndex: 1,
        '& $imageBackdrop': {
          opacity: 0.10,
        },
        '& $imageMarked': {
          opacity: 0,
        },
        '& $imageTitle': {
          border: '4px solid currentColor',
        },
      },
    },
    focusVisible: {},
    imageButton: {
      color: theme.palette.common.white,
    },
    imageSrc: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundSize: 'cover',
      backgroundPosition: 'center 40%',
    },
    imageBackdrop: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: theme.palette.common.black,
      borderRadius: '50%',
      opacity: 0.4,
      transition: theme.transitions.create('opacity'),
    },
    imageTitle: {
      position: 'relative',
      overflow: 'initial',
      padding: '15% 3% 15%',
      fontWeight: 1000
    },
    imageMarked: {
      height: 3,
      width: 18,
      backgroundColor: theme.palette.common.white,
      position: 'absolute',
      bottom: -2,
      left: 'calc(50% - 9px)',
      transition: theme.transitions.create('opacity'),
    }
  })
);