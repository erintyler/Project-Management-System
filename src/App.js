import React from 'react';

import {AppBar, Toolbar, Button, IconButton, Typography} from '@material-ui/core/';
import {makeStyles} from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

function App() {
  const classes = useStyles();

  return (
    <AppBar position='fixed'>
      <Toolbar>
        <IconButton edge="start" color="inherit" className={classes.menuButton}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>Project Management System</Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
}

export default App;