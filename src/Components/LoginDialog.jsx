import React from 'react';
import axios from 'axios';

import {makeStyles} from '@material-ui/core/styles';

import {Button, TextField, Collapse} from '@material-ui/core';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid} from '@material-ui/core';

import {Alert, AlertTitle} from '@material-ui/lab'

const useStyles = makeStyles((theme) => ({
    bottom: {
        marginBottom: theme.spacing(1),
    },
}));

export default function LoginDialog(props) {
    const classes = useStyles();
    const {onClose, open} = props;

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const [error, openError] = React.useState(false);
    const [success, openSuccess] = React.useState(false);

    const handleClose = () => {
        onClose();
        openError(false);
        openSuccess(false);
    };

    const handleOnChange = event => {
        if(event.target.id === "username") {
            console.log("Username Changed");
            setEmail(event.target.value);
        } else if(event.target.id === "password") {
            console.log("Password Changed");
            setPassword(event.target.value);
        }
    }

    const handleLogin = () => {
        const form = { email, password }

        axios.post(`http://192.168.1.125:6969/login`, form, {headers: {'Content-Type': 'application/json'}}).then(res => {
            openSuccess(false);
            openError(false);

            onClose(res.data);
        }).catch(err => {
            console.error(err);

            openSuccess(false);
            openError(true);
            
        });
    }

    return(
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle id="loginTitle">Login</DialogTitle>
                <Collapse in={error}>
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        Unknown Username or Password
                    </Alert>
                </Collapse>

                <Collapse in={success}>
                    <Alert severity="success">
                        <AlertTitle>Success</AlertTitle>
                        Congrats you logged in! 🎂
                    </Alert>
                </Collapse>
                

                <DialogContent>
                <Grid container spacing={2} align="center" justify="space-around" className={classes.bottom}>
                    <Grid item xs={12}>
                        <TextField autoFocus margin="dense" id="username" label="Username" type="string" fullWidth onChange={handleOnChange} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField margin="dense" id="password" label="Password" type="password" fullWidth onChange={handleOnChange} />
                    </Grid>
                </Grid>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleLogin} color="primary">
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}