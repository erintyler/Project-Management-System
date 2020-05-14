import React, { useEffect } from 'react';
import {BrowserRouter as Router, Redirect, Switch, Route, useLocation, useHistory} from 'react-router-dom';

import {AppBar, Toolbar, Button, IconButton, Typography, Container, Grid, Snackbar, Menu, MenuItem} from '@material-ui/core/';

import {makeStyles, createMuiTheme, responsiveFontSizes, ThemeProvider} from '@material-ui/core/styles';

import MuiAlert from '@material-ui/lab/Alert';
import MenuIcon from '@material-ui/icons/Menu';

import LoginDialog from './Components/LoginDialog';
import YourProjects from './Components/HomePage/YourProjects';
import YourDeadlines from './Components/HomePage/YourDeadlines';
import YourMeetings from './Components/HomePage/YourMeetings';
import Project from './Components/ProjectDashboard/Project';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  offset: theme.mixins.toolbar,
}));

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function App(props) {

    const [openDialog, setOpenDialog] = React.useState(false);

    const [login, setLogin] = React.useState(false);
    const [loginSnack, setLoginSnack] = React.useState(false);

    const [menuAnchor, setMenuAnchor] = React.useState(null);

    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [projList, setProjList] = React.useState("");

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
            setLoginSnack(true);
        }
    }

    const handleLoginClose = () => {
        setLoginSnack(false);
    }

    const handleMenuClose = (event) => {
        console.log(event.target.id);

        if(event.target.id === "account") {
            //TODO: Open Account Menu
        } else if(event.target.id === "logout") {
            localStorage.clear();

            setLoginSnack(true);
            setLogin(false);
        }

        setMenuAnchor(null);
    }

    const classes = useStyles();

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
            <AppBar position='fixed'>
                <Toolbar>
                    <IconButton edge="start" color="inherit" className={classes.menuButton}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>Project Management System</Typography>

                    <Button color="inherit" onClick={handleClickOpen}>{login ? name : "Login"}</Button>
                    <Menu id="accountMenu" anchorOrigin={{vertical: 'top', horizontal: 'right'}} anchorEl={menuAnchor} keepMounted open={Boolean(menuAnchor)} onClose={handleMenuClose}>
                        <MenuItem id="account" onClick={handleMenuClose}>My Account</MenuItem>
                        <MenuItem id="logout" onClick={handleMenuClose}>Logout</MenuItem>
                    </Menu>

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

            <Snackbar open={loginSnack} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} autoHideDuration={6000} onClose={handleLoginClose}>
                <Alert onClose={handleLoginClose} severity="success">{(login ? "Logged In!" : "Logged Out!")}</Alert>
            </Snackbar>

            
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
        <ThemeProvider theme={theme}>
            <Typography variant="h1">Access Denied</Typography>
            <Typography variant="h3">You need to be logged in to use this application.</Typography>
        </ThemeProvider>
    )
}

const LoggedIn = (props) => {
    let location = useLocation();
    let history = useHistory();

    const [error, setError] = React.useState("");

    const handleErrorClose = () => {
        setError(null);
    }

    React.useEffect(() => {
        if(location.state !== undefined && location.state.error !== undefined) {
            console.error(location.state.error);
            setError(location.state.error);

            history.replace({
                pathname: '/dashboard',
                state: {}
            });
        } else {
            setError(null);
        }
    }, [])


    return (
        <React.Fragment>
            <Grid container spacing={4} align="center" justify="space-around">
                <Grid item xs={12}>
                    <ThemeProvider theme={theme}>
                        <Typography variant="h2">Hey, {props.name}!</Typography>
                    </ThemeProvider>
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

            <Snackbar open={Boolean(error)} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} autoHideDuration={6000} onClose={handleErrorClose}>
                <Alert onClose={handleErrorClose} severity="error">{error}</Alert>
            </Snackbar>
        </React.Fragment>

    )
}

export default App;