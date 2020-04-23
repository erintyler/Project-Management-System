import React from 'react';

import {makeStyles} from '@material-ui/core/styles';

import {Button, TextField, Typography, useRadioGroup} from '@material-ui/core';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    field: {
        marginRight: theme.spacing(1),
    },
}));

export default function LoginDialog(props) {
    const classes = useStyles();
    const {onClose, open} = props;

    const handleClose = () => {
        onClose();
    };

    return(
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle id="loginTitle">Login</DialogTitle>

                <DialogContent>
                    <TextField autoFocus margin="dense" id="username" label="Username" type="string" className={classes.field} />
                    <TextField margin="dense" id="password" label="Password" type="password" />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}