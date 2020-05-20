import React from "react";
import axios from "axios";

import {TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody} from '@material-ui/core';

import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
    table: {
        marginTop: 32,
    }
});
  

export default function DeadlineList(props) {
    const [deadlines, setDeadlines] = React.useState([]);

    const classes = useStyles();

    React.useEffect(() => {
        axios.get(`http://192.168.1.125:6969/getDeadlinesForProject?projectId=${props.id}`).then(res => {
            setDeadlines(res.data);
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
                    {deadlines.map(deadline => (
                        <TableRow key={deadline.id}>
                            <TableCell component="th" scope="row">{deadline.name}</TableCell>
                            <TableCell>{deadline.description}</TableCell>
                            <TableCell>{new Date(deadline.date).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(deadline.date).toLocaleTimeString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}