/* eslint-disable react/display-name */
import React from "react";
import axios from "axios";

import {Menu, MenuItem, IconButton, Button, Box, CircularProgress, Paper} from '@material-ui/core';
import MaterialTable, { MTableToolbar, MTableActions } from "material-table";

import MoreVertIcon from '@material-ui/icons/MoreVert';
import MeetingTable from "./MeetingComponents/MeetingTable";

export default function MeetingList(props) {
    const [meetings, setMeetings] = React.useState([]);

    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        console.log(props);

        axios.get(`http://192.168.1.125:6969/getMeetingsForProject?projectId=${props.id}`).then(res => {
            res.data.forEach(meeting => {
                setMeetings(oldMeetings => [...oldMeetings, {
                    id: meeting.id,
                    name: meeting.name,
                    description: meeting.description,
                    date: `${new Date(meeting.date).toLocaleDateString()} at ${new Date(meeting.date).toLocaleTimeString()}`,
                }]);
            });

            setLoading(false);
        });
    }, []);


    return (
        loading ? <Loader/> : <MeetingTable meetings={meetings}/>
    )
}

function Loader() {
    return(
        <Paper>
            <Box display="flex" justifyContent="center" alignItems="center" height="400px">
                <CircularProgress/>
            </Box>
        </Paper>
    )
}