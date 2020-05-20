import React from "react";
import axios from "axios";

import {TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody} from '@material-ui/core';

import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
    table: {
        marginTop: 32,
    }
});

export default function MeetingList(props) {
    const [meetings, setMeetings] = React.useState([]);

    const classes = useStyles();

    React.useEffect(() => {
        axios.get(`http://192.168.1.125:6969/getMeetingsForProject?projectId=${props.id}`).then(res => {
            setMeetings(res.data);
            console.log(res);
        })
    }, [props]);

    return (
        <TableContainer component={Paper} className={classes.table}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {meetings.map(meeting => (
                        <TableRow key={meeting.id}>
                            <TableCell component="th" scope="row">{meeting.name}</TableCell>
                            <TableCell>{meeting.description}</TableCell>
                            <TableCell>{new Date(meeting.date).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(meeting.date).toLocaleTimeString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}