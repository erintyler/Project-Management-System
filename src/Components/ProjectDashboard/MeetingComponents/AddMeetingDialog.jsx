import React from 'react';
import axios from 'axios';

import {makeStyles} from '@material-ui/core/styles';

import {Button, TextField, Collapse} from '@material-ui/core';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid} from '@material-ui/core';

import {MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import {Alert, AlertTitle} from '@material-ui/lab'

const useStyles = makeStyles((theme) => ({
    bottom: {
        marginBottom: theme.spacing(1),
    },
    root: {
        flexGrow: 1,
    }
}));

export default function AddMeetingDialog(props) {
    const classes = useStyles();
    const {onClose, open} = props;

    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [selectedTime, setSelectedTime] = React.useState(new Date());

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
            //setEmail(event.target.value);
        } else if(event.target.id === "password") {
            console.log("Password Changed");
            //setPassword(event.target.value);
        }
    }

    const handleDateChange = (date) => {
        setSelectedDate(date);
    }

    const handleTimeChange = (time) => {
        setSelectedTime(time);
    }

    return(
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle id="loginTitle">Add Meeting</DialogTitle>
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
                <div className={classes.root}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <Grid container spacing={2} align="center" justify="space-around" className={classes.bottom}>
                            <Grid item xs={12} sm={12}>
                                <TextField autoFocus margin="dense" id="title" label="Meeting Title" type="string" fullWidth onChange={handleOnChange} />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField margin="dense" id="description" label="Meeting Description" type="string" fullWidth multiline onChange={handleOnChange} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <KeyboardDatePicker margin="normal" variant="inline" id="datePicker" label="Date" format="DD/MM/yyyy" value={selectedDate} fullWidth onChange={handleDateChange}/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <KeyboardTimePicker margin="normal" variant="inline" id="timePicker" label="Time" value={selectedTime} fullWidth onChange={handleTimeChange}/>
                            </Grid>
                        </Grid>
                    </MuiPickersUtilsProvider>
                </div>
                </DialogContent>

                <DialogActions>
                    <Button onClick={""} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={""} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}