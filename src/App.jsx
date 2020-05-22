import React, { useEffect } from 'react';
import axios from 'axios';

import {BrowserRouter as Router, Redirect, Switch, Route, useLocation, useHistory} from 'react-router-dom';

import {AppBar, Toolbar, Button, IconButton, Typography, Container, Grid, Menu, MenuItem, useMediaQuery} from '@material-ui/core/';
import {useSnackbar} from 'notistack';

import {makeStyles, createMuiTheme, responsiveFontSizes, ThemeProvider} from '@material-ui/core/styles';

import MuiAlert from '@material-ui/lab/Alert';
import MenuIcon from '@material-ui/icons/Menu';

import LoginDialog from './Components/LoginDialog';
import YourProjects from './Components/HomePage/YourProjects';
import YourDeadlines from './Components/HomePage/YourDeadlines';
import YourMeetings from './Components/HomePage/YourMeetings';
import Project from './Components/ProjectDashboard/Project';
import { useTheme } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  title: {
    [theme.breakpoints.down('xs')]: {
        maxWidth: 85,
    },
    [theme.breakpoints.up('sm')]: {
        maxWidth: 200,
    },
    display: 'flex',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  offset: theme.mixins.toolbar,

  welcomeMessage: {
      marginTop: theme.spacing(2),
  }
}));

function App(props) {
    const [openDialog, setOpenDialog] = React.useState(false);

    const [login, setLogin] = React.useState(false);

    const [menuAnchor, setMenuAnchor] = React.useState(null);

    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");

    const { enqueueSnackbar } = useSnackbar();

    const theme = useTheme();
    const useSmallLogo = useMediaQuery(theme.breakpoints.down('xs'));

    const classes = useStyles();

    axios.interceptors.response.use((res) => {
        return Promise.resolve(res);
    }, (err) => {
        if(!err.response) {
            enqueueSnackbar(`Could not connect to API`, {variant: 'error'});
        }
        return Promise.reject(err);
    })

    const handleClickOpen = (event) => {
        if(!login){
            setOpenDialog(true);
        } else{
            setMenuAnchor(event.currentTarget);
        }
        
    }

    const handleClose = (value) => {
        setOpenDialog(false);

        if(typeof value !== 'undefined'){
            setName(`${value.firstName} ${value.lastName}`);
            setEmail(`${value.email}`);

            localStorage.setItem('email', value.email);
            localStorage.setItem('name', `${value.firstName} ${value.lastName}`);

            setLogin(true);
            
            enqueueSnackbar('Logged In', {variant: 'success'});
        }
    }

    const handleMenuClose = (event) => {
        setMenuAnchor(null);

        if(event.target.id === "account") {
            //TODO: Open Account Menu
        } else if(event.target.id === "logout") {
            localStorage.clear();

            setLogin(false);
            enqueueSnackbar('Logged Out', {variant: 'success'});
        }
    }

    useEffect(() => {
        if(localStorage.getItem('email') && localStorage.getItem('name')) {
            console.log("oh wow its stored");
            setName(localStorage.getItem('name'));
            setEmail(localStorage.getItem('email'));
    
            setLogin(true);
        }
    }, [])

    return (
        <React.Fragment>
            <span>{`(min-width:600px) matches: ${useSmallLogo}`}</span>;

            <AppBar position='fixed' color='primary'>
                <Toolbar>
                    <Grid justify="space-between" container alignItems="center">
                        <Grid item>
                            <Grid item container>
                                <IconButton edge="start" color="inherit" className={classes.menuButton}>
                                    <MenuIcon/>
                                </IconButton>
                                <img src={(useSmallLogo ? require("./Resources/bumonochromesmall.svg") : require("./Resources/bumonochrome.svg"))} className={classes.title}/>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button color="inherit" onClick={handleClickOpen}>{login ? name : "Login"}</Button>
                            
                            <Menu id="accountMenu" anchorOrigin={{vertical: 'top', horizontal: 'right'}} anchorEl={menuAnchor} keepMounted open={Boolean(menuAnchor)} onClose={handleMenuClose}>
                                <MenuItem id="account" onClick={handleMenuClose}>My Account</MenuItem>
                                <MenuItem id="logout" onClick={handleMenuClose}>Logout</MenuItem>
                            </Menu>
                        </Grid>
                    </Grid>

                    <LoginDialog open={openDialog} onClose={handleClose} />
                </Toolbar>
            </AppBar>

            <div className={classes.offset} />
            
            <Container maxWidth="xl">
                <Router>
                    <Switch>
                        <Redirect from="/" exact to="/dashboard" />
                        <Route path='/dashboard'>
                            {login ? <LoggedIn name={name} email={email}/> : <LoggedOut />}
                        </Route>
                        <Route path='/project/:id'>
                            <Project />
                        </Route>
                        <Route component={NotFound} />
                    </Switch>
                </Router>
            </Container>

            
        </React.Fragment>
    );
}

const NotFound = () => {
    const location = useLocation();

    return(
        <Redirect to={{
            pathname: "/dashboard",
            state: { error: `Page ${location.pathname} does not exist`}
        }}/>
    );
}

const LoggedOut = () => {
    return (
        <React.Fragment>
            <Typography variant="h1">Access Denied</Typography>
            <Typography variant="h3">You need to be logged in to use this application.</Typography>

            <ErrorMessage/>
        </React.Fragment>

    )
}

const LoggedIn = (props) => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Grid container spacing={4} align="center" justify="space-around">
                <Grid item xs={12}>
                    <Typography variant="h2" className={classes.welcomeMessage}>Hey, {props.name}!</Typography>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h3">Your Projects</Typography>
                </Grid>
                <YourProjects/>

                <Grid item xs={12}>
                    <Typography variant="h3">Your Meetings</Typography>
                </Grid>
                <YourMeetings/>

                <Grid item xs={12}>
                    <Typography variant="h3">Your Deadlines</Typography>
                </Grid>
                <YourDeadlines/>
            </Grid>

            <ErrorMessage />

        </React.Fragment>

    )
}

const ErrorMessage = (props) => {
    let location = useLocation();
    let history = useHistory();

    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        if(location.state !== undefined && location.state.error !== undefined) {
            console.error(location.state.error);
            
            enqueueSnackbar(location.state.error, {variant: 'error'});

            history.replace({
                pathname: '/dashboard',
                state: {}
            });
        }
    }, []);

    return null;
}

export default App;