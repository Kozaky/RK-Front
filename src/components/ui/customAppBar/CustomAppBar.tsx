import React, { useRef, ChangeEvent, MouseEvent } from 'react';
import { useHistory } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MailIcon from '@material-ui/icons/Mail';
import MoreIcon from '@material-ui/icons/MoreVert';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from "react-router-dom";
import useStyles from './CustomAppBarStyles';
import { useAuth } from '../../../providers/authProvider/AuthProvider';
import { useMutation } from '@apollo/react-hooks';
import { UPLOAD_AVATAR } from '../../../graphql/User';
import { handleGeneralErrors } from '../../../utils/ErrorHandler';
import { Avatar } from '@material-ui/core';

const CustomAppBar = () => {

  //Services
  const classes = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const { currentUser, logOutHandler, updateCurrentUser } = useAuth()!;

  const src = currentUser !== null ?
    "data:image/png;base64, " + currentUser.avatar :
    "";
  const [avatarImg, setAvatarImg] = React.useState(src);

  const [uploadImage] = useMutation(UPLOAD_AVATAR);
  const avatarInput = useRef<HTMLInputElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  }

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  }

  const handleMobileMenuOpen = (event: any) => {
    setMobileMoreAnchorEl(event.currentTarget);
  }

  const showAvatarUploader = (event: MouseEvent) => {
    event.preventDefault();
    avatarInput.current!.click();
  }

  const uploadAvatarHanlder = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const userUpdateDetails = {
      id: Number(currentUser!.id),
      avatar: event.target.files?.item(0)!
    }

    uploadImage({ variables: { userUpdateDetails: userUpdateDetails } })
      .then(({ data }) => {
        currentUser!.avatar = data.updateUser.avatar;
        updateCurrentUser(currentUser);
        const src = "data:image/png;base64, " + currentUser!.avatar;
        setAvatarImg(src);
      })
      .catch(error => {
        handleGeneralErrors(error, history);
      });
  }

  const adminPanelLink = (
    <MenuItem onClick={handleMenuClose}>
      <RouterLink to="/adminPanel" className={classes.linkWithoutDecoration}>
        <Typography color="secondary" noWrap>
          Admin. Panel
        </Typography>
      </RouterLink>
    </MenuItem>
  );


  const menuId = 'custom-app-bar-desktop';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}>
      <MenuItem onClick={handleMenuClose}>
        <Link href="#" onClick={logOutHandler} className={classes.linkWithoutDecoration}>
          <Typography color="secondary" noWrap>
            Log Out
          </Typography>
        </Link>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Link href="#" onClick={showAvatarUploader} className={classes.linkWithoutDecoration}>
          <Typography color="secondary" noWrap>
            Change avatar
          </Typography>
        </Link>
      </MenuItem>
      {currentUser?.role.type === "ADMIN" ? adminPanelLink : null}
    </Menu>
  );

  const mobileMenuId = 'custom-app-bar-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="Account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit">
          <Badge badgeContent={0} color="secondary">
            <Avatar src={avatarImg}></Avatar>
          </Badge>
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const sectionDesktop = (
    <div className={classes.sectionDesktop}>
      <IconButton
        edge="end"
        aria-label="Account of current user"
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={handleProfileMenuOpen}
        color="inherit">
        <Badge badgeContent={0} color="secondary">
          <Avatar src={avatarImg}></Avatar>
        </Badge>
      </IconButton>
    </div>
  );

  const sectionMobile = (
    <div className={classes.sectionMobile}>
      <IconButton
        aria-label="Show more"
        aria-controls={mobileMenuId}
        aria-haspopup="true"
        onClick={handleMobileMenuOpen}
        color="inherit">
        <MoreIcon />
      </IconButton>
    </div>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <RouterLink to="/" className={classes.linkWithoutDecoration}>
            <Typography variant="h3" className={classes.logo} noWrap>
              Reklama
            </Typography>
          </RouterLink>
          <div className={classes.grow} />
          <input id="avatarInput"
            type="file"
            ref={avatarInput}
            style={{ display: 'none' }}
            accept=".png,.jpg,.jpeg"
            onChange={uploadAvatarHanlder}
          />
          {currentUser !== null ? sectionDesktop : null}
          {currentUser !== null ? sectionMobile : null}
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}

export default CustomAppBar;
