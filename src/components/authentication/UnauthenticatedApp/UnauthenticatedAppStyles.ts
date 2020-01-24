import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Door from '../../../assets/university_door.jpeg';

export default makeStyles((theme: Theme) =>
  createStyles({
      root: {
        backgroundImage: `url(${Door})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundColor: 'black',
        padding: '16px',
        height: 'calc(100% - 56px)',
        [theme.breakpoints.up('sm')]: {
          height: 'calc(100% - 64px)'
        },
        '& hr': {
          margin: 'auto',
          textAlign: 'center',
          backgroundColor: '#FFFF'
        }
      },
      div_divider: {
        padding: '0px 20px 0px 20px',
        height: 'auto',
        [theme.breakpoints.up('sm')]: {
          padding: '20px 0px 20px 0px',
          height: '100%'
        }
      },
      sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        }
      },
      sectionMobile: {
          display: 'flex',
          [theme.breakpoints.up('sm')]: {
              display: 'none',
          }
      }
    })
  );