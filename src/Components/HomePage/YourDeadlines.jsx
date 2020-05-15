import React from "react";
import axios from "axios";

import { Grid, Card, CardContent, CardActions, Typography, Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    forProj: {
        marginBottom: 12,
    }
})

function YourDeadlines(props) {
    const [deadlineList, setDeadlineList] = React.useState([]);

    const classes = useStyles();

    React.useEffect(() => {
        axios
        .get(
            `http://192.168.1.125:6969/getUserDeadlines?email=${localStorage.getItem("email")}`
        )
        .then((res) => {
            setDeadlineList(res.data);
        });
    }, [localStorage.getItem("email")]);

    if(deadlineList.length === 0) {
        return (
            <Grid item md={12} xs={12}>
                <Typography variant="h4" color="textSecondary">You have no upcoming deadlines.</Typography>
            </Grid>
        )
    }

    return deadlineList.map((deadline) => {
        const date = new Date(deadline.date).toLocaleDateString();
        const time = new Date(deadline.date).toLocaleTimeString();

        return (
            <Grid item key={deadline.id} md={3} xs={12}>
                <Card>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            Due: {date} at {time}
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {deadline.name}
                        </Typography>
                        <Typography className={classes.forProj} color="textSecondary">
                            For Project: {deadline.Project.name}
                        </Typography>
                        <Typography variant="body2" component="p">
                            {deadline.description}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary">View Deadline</Button>
                    </CardActions>
                </Card>
            </Grid>
            
        );
    });
}

export default YourDeadlines;
