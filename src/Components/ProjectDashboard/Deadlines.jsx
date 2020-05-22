/* eslint-disable react/display-name */
import React from "react";
import axios from "axios";

import {Menu, MenuItem, IconButton, Button, Box, CircularProgress, Paper} from '@material-ui/core';
import MaterialTable, { MTableToolbar, MTableActions } from "material-table";

import moment from 'moment';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeadlineTable from "./DeadlineComponents/DeadlineTable";

export default function Deadlines(props) {
    const [deadlines, setDeadlines] = React.useState([]);

    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        console.log(props);

        axios.get(`http://192.168.1.125:6969/getDeadlinesForProject?projectId=${props.id}`).then(res => {
            res.data.forEach(deadline => {
                setDeadlines(oldDeadlines => [...oldDeadlines, {
                    id: deadline.id,
                    title: deadline.name,
                    description: deadline.description,
                    date: moment(deadline.date).format("DD/MM/YYYY [at] HH:mm:ss")
                }]);
            });

            setLoading(false);
        });
    }, []);

    return (
        loading ? <Loader/> : <DeadlineTable deadlines={deadlines} id={props.id}/>
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