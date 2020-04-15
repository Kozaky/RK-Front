import React, { useState } from 'react';
import useStyles from './TopicsStyles';
import Topic from './topic/Topic';
import Lipassam from '../../assets/lipasam.jpeg';
import Tussam from '../../assets/tussam.png';
import UrbanPlanning from '../../assets/urbanPlanning.jpg';
import { Grid } from '@material-ui/core';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Drawer from '@material-ui/core/Drawer';
import Fab from '@material-ui/core/Fab';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import { Link } from "react-router-dom";
import { useRouteMatch } from 'react-router';

const Topics = () => {

  // Services
  
  const classes = useStyles();
  const match = useRouteMatch();
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const topics = [
    {
      avatar: Lipassam,
      header: 'Lipassam Complaint',
      subheader: 'February 28, 2020',
      image: Lipassam,
      imageTitle: 'Lipassam',
      shortDescription: 'Some streets are not clean all year round and they should be cared about.',
      numLikes: 100
    },
    {
      avatar: Tussam,
      header: 'Tussam Complaint',
      subheader: 'February 28, 2020',
      image: Tussam,
      imageTitle: 'Tussam',
      shortDescription: 'Tussam is not always punctual and it makes me arrive late to my job. I think that some improvements in Tussam\'s organization should be made in order to improve delays.',
      numLikes: 1500
    },
    {
      avatar: UrbanPlanning,
      header: 'Urban planning Complaint',
      subheader: 'February 28, 2020',
      image: UrbanPlanning,
      imageTitle: 'UrbanPlanning',
      shortDescription: 'The city major is allowing construction companies to build modern appartments in the historic city center. The city center should be preserved.',
      numLikes: 3200
    }
  ];

  const toggleDrawer = () => setIsOpenDrawer(!isOpenDrawer);

  return (
    <>
      <Grid container justify="center" alignItems="stretch"
        spacing={3} className={classes.root}>
        {topics.map(topic => (
          <Grid item className={classes.topicsRoot} xs>
            <Link to={`${match.url}/${1}`}>
              <Topic {...topic} />
            </Link>
          </Grid>
        ))}
        {topics.map(topic => (
          <Grid item className={classes.topicsRoot} xs>
            <Link to={`${match.url}/${1}`}>
              <Topic {...topic} />
            </Link>
          </Grid>
        ))}
      </Grid>
      <Drawer anchor="right" open={isOpenDrawer} onClose={toggleDrawer} className={classes.drawer}>
        <div
          className={classes.list}
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
        >
          <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
      <Fab aria-label="search" color="secondary" className={classes.searchButton} onClick={toggleDrawer}>
        <SearchIcon />
      </Fab>
      <Fab aria-label="add" color="secondary" className={classes.addButton}>
        <AddIcon />
      </Fab>
    </>
  );
}

export default Topics;
