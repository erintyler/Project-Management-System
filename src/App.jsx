import React, { useEffect } from 'react';

import {AppBar, Toolbar, Button, IconButton, Typography, Container, Grid, Snackbar, Menu, MenuItem} from '@material-ui/core/';

import {makeStyles, createMuiTheme, responsiveFontSizes, ThemeProvider} from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';

import MenuIcon from '@material-ui/icons/Menu';

import LoginDialog from './Components/LoginDialog';
import YourProjects from './Components/YourProjects';
import YourDeadlines from './Components/YourDeadlines';

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

function App() {
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

    const handleMenuClose = () => {
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
                    <Typography variant="h6" className={classes.title}>PMS</Typography>

                    <Button color="inherit" onClick={handleClickOpen}>{login ? name : "Login"}</Button>
                    <Menu id="accountMenu" anchorOrigin={{vertical: 'top', horizontal: 'right'}} anchorEl={menuAnchor} keepMounted open={Boolean(menuAnchor)} onClose={handleMenuClose}>
                        <MenuItem onClose={handleMenuClose}>My Account</MenuItem>
                        <MenuItem onClose={handleMenuClose}>Logout</MenuItem>
                    </Menu>

                    <LoginDialog open={openDialog} onClose={handleClose} />
                </Toolbar>
            </AppBar>
            <div className={classes.offset} />
            <Container maxWidth="xl">
                {login ? <LoggedIn name={name} email={email}/> : <LoggedOut />}
            </Container>

            <Snackbar open={loginSnack} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} autoHideDuration={6000} onClose={handleLoginClose}>
                <Alert onClose={handleLoginClose} severity="success">Logged In!</Alert>
            </Snackbar>
        </React.Fragment>
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
    return (
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
            <Grid item xs={12}>
                <Typography variant="h3">Your Deadlines</Typography>
            </Grid>
            <YourDeadlines/>
        </Grid>
    )
}

export default App;