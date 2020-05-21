import React from 'react';
import axios from 'axios';

import {makeStyles} from '@material-ui/core/styles';

import {Button, TextField, Collapse} from '@material-ui/core';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid} from '@material-ui/core';

import {MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker} from '@material-ui/pickers';

import {Alert, AlertTitle} from '@material-ui/lab'

const useStyles = makeStyles((theme) => ({
    bottom: {
        marginBottom: theme.spacing(1),
    },
    root: {
        flexGrow: 1,
    }
}));

export default function DeleteMeetingDialog(props) {
    const classes = useStyles();
    const {onClose, open, meeting} = props;

    const [id, setId] = React.useState(null);
    const [title, setTitle] = React.useState("");

    React.useEffect(() => {
        if(meeting !== null && meeting !== undefined) {
            setId(meeting.id);
            setTitle(meeting.title);

            console.log(meeting);
        }
    }, [meeting]);

    const handleClose = () => {
        onClose();
    };

    const handleSubmit = () => {
        const response = deleteMeeting(meeting);

        const setMessage = (response) => {
            console.log(response);
            
            onClose(`${response.description} ${title}`, response.meeting, response.error);
        }

        if(response != null && typeof response.then === 'function') {
            response.then(res => {
                setMessage(res)
            });
        } else {
            setMessage(response);
        }
    }

    const deleteMeeting = (meeting) => {
        if(!meeting.id) {
            return {
                error: true,
                description: "Invalid ID Provided"
            } 
        } else {
            return axios.get(`http://192.168.1.125:6969/removeMeeting?id=${id}`).then(res => {
                return {
                    error: res.data.error,
                    description: res.data.message
                }
            }).catch(err => {
                console.log(err.response);

                return {
                    error: true,
                    description: `${err.response.status} ${err.response.statusText} : ${err.response.data.message}`
                }
            });
        }
    }

    return(
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle id="loginTitle">Delete Meeting</DialogTitle>
                <DialogContent>
                    <div className={classes.root}>
                        <DialogContentText>
                            Are you sure you want to delete {title}
                        </DialogContentText>
                    </div>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}