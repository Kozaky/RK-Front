import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import MoreIcon from '@material-ui/icons/MoreVert';
import Link from '@material-ui/core/Link';
import useStyles from './CustomAppBarStyles';
import { useAuth } from '../../../providers/authProvider/AuthProvider';

const CustomAppBar = () => {

    //Services
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const { currentUser, logOutHandler } = useAuth()!;

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    function handleProfileMenuOpen(event: any) {
        setAnchorEl(event.currentTarget);
    }

    function handleMobileMenuClose() {
        setMobileMoreAnchorEl(null);
    }

    function handleMenuClose() {
        setAnchorEl(null);
        handleMobileMenuClose();
    }

    function handleMobileMenuOpen(event: any) {
        setMobileMoreAnchorEl(event.currentTarget);
    }

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
              <Link href="#" onClick={logOutHandler}>
                <Typography color="secondary" noWrap>
                  Log Out
                </Typography>
              </Link>
            </MenuItem>
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
            <MenuItem>
                <IconButton aria-label="Show new mails" color="inherit">
                    <Badge badgeContent={0} color="secondary">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    aria-label="Account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit">
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    const sectionDesktop = (
      <div className={classes.sectionDesktop}>
        <IconButton aria-label="Show new mails" color="inherit">
            <Badge badgeContent={0} color="secondary">
                <MailIcon />
            </Badge>
        </IconButton>
        <IconButton
            edge="end"
            aria-label="Account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit">
            <AccountCircle />
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
                    <Typography variant="h3" noWrap>
                        Reklama
                    </Typography>
                    <div className={classes.grow} />
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
