import React from 'react';

import {AppBar, Toolbar, Button, IconButton, Typography, Container, Grid} from '@material-ui/core/';
import {makeStyles, createMuiTheme, responsiveFontSizes, ThemeProvider} from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';

import LoginDialog from './LoginDialog';

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

let name = "Erin";

function App() {
    const [open, setOpen] = React.useState(false);
    const [login, setLogin] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleLogin = () => {
        if(login) {
            setLogin(false);
        } else {
            setLogin(true);
        }
    }

    const handleClose = () => {
        setOpen(false);
    }

    const classes = useStyles();

    return (
        <React.Fragment>
            <AppBar position='fixed'>
                <Toolbar>
                    <IconButton edge="start" color="inherit" className={classes.menuButton}>
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" className={classes.title}>PMS</Typography>

                    <Button color="inherit" onClick={handleClickOpen}>{login ? name : "Login"}</Button>
                    <LoginDialog open={open} onClose={handleClose} />
                </Toolbar>
            </AppBar>
            <div className={classes.offset} />
            <Container maxWidth="xl">
                <Button variant ="contained" color="primary" onClick={handleLogin}>Test Login Event</Button>
                {login ? <Allowed /> : <Denied />}
            </Container>
        </React.Fragment>
    );
}

const Denied = () => {
    return (
        <ThemeProvider theme={theme}>
            <Typography variant="h1">Access Denied</Typography>
            <Typography variant="h3">You need to be logged in to use this application.</Typography>
        </ThemeProvider>
    )
}

const Allowed = () => {
    return (
        <ThemeProvider theme={theme}>
            <Typography variant="h1">Welcome, {name}!</Typography>
        </ThemeProvider>
    )
}

export default App;