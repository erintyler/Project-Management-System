import React from 'react';
import axios from 'axios';

import {makeStyles} from '@material-ui/core/styles';

import {Button, TextField, Collapse} from '@material-ui/core';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid} from '@material-ui/core';

import {MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker} from '@material-ui/pickers';

//Moment for standard usage (otherwise there are errors)
import moment from 'moment';
//Moment for the Date Time Picker
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
    const [selectedDate, setSelectedDate] = React.useState(moment());
    const [selectedTime, setSelectedTime] = React.useState(moment());

    const handleClose = () => {
        onClose();
    };

    const handleOnChange = event => {
        if(event.target.id === "title") {
            console.log("Title Changed");
            setTitle(event.target.value);
        } else if(event.target.id === "description") {
            console.log("Description Changed");
            setDescription(event.target.value);
        }
    }

    const handleDateChange = (date) => {
        setSelectedDate(date);
    }

    const handleTimeChange = (time) => {
        setSelectedTime(time);
    }

    const handleSubmit = () => {
        const newMeeting = {title, description, selectedDate, selectedTime}
        const response = createMeetings(newMeeting);

        const setMessage = (response) => {
            onClose(response.description, response.meeting, response.error);
        }

        if(response != null && typeof response.then === 'function') {
            response.then(res => {
                setMessage(res)
            });
        } else {
            setMessage(response);
        }
    }

    const createMeetings = (meeting) => {
        if(!meeting.title) {
            return {
                error: true,
                description: "No Title Provided"
            }
        } else if(!meeting.description) {
            return {
                error: true,
                description: "No Description Provided"
            }
        } else if(!meeting.selectedDate) {
            return {
                error: true,
                description: "No Date Provided"
            }
        } else if(!meeting.selectedDate.isValid()) {
            return {
                error: true,
                description: "Date is not valid"
            }
        } else if(!meeting.selectedTime) {
            return {
                error: true,
                description: "No Time Provided"
            }
        } else if(!meeting.selectedTime.isValid()) {
            return {
                error: true,
                description: "Time is not valid"
            }
        } else {
            const title = meeting.title;
            const description = meeting.description;
            const date = moment(`${meeting.selectedDate.format("L")} ${meeting.selectedTime.format("LT")}`).toDate();
            const projectId = props.id;

            const form = {title, description, date, projectId}

            return axios.post('http://192.168.1.125:6969/addMeeting', form, {headers: {'Content-Type': 'application/json'}}).then(res => {
                form.id = res.data.meetingId;
                form.date = `${new Date(date).toLocaleDateString()} at ${new Date(date).toLocaleTimeString()}`

                return {
                    error: false,
                    meeting: form,
                    description: res.data.message
                }
            }).catch(err => {
                console.log(err.response);

                return {
                    error: true,
                    meeting: form,
                    description: `${err.response.status} ${err.response.statusText} : ${err.response.data.message}`
                }
            });
        }
    }

    return(
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle id="loginTitle">Add Meeting</DialogTitle>
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
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}