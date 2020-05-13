import React from "react";
import axios from "axios";

import { Grid, Card, CardContent, CardActions, Typography, Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    forProj: {
        marginBottom: 12,
    }
})

function YourMeetings(props) {
    const [meetingList, setMeetingList] = React.useState([]);

    const classes = useStyles();

    React.useEffect(() => {
        axios
        .get(
            `http://localhost:6969/getUserMeetings?email=${localStorage.getItem("email")}`
        )
        .then((res) => {
            setMeetingList(res.data);

            console.log(meetingList);
        });
    }, [localStorage.getItem("email")]);

    return meetingList.map((meeting) => {
        const date = new Date(meeting.date).toLocaleDateString();
        const time = new Date(meeting.date).toLocaleTimeString();

        return (
            <Grid item key={meeting.id} md={3} xs={12}>
                <Card>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            On: {date} at {time}
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {meeting.name}
                        </Typography>
                        <Typography className={classes.forProj} color="textSecondary">
                            For Project: {meeting.Project.name}
                        </Typography>
                        <Typography variant="body2" component="p">
                            {meeting.description}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary">View Meeting</Button>
                    </CardActions>
                </Card>
            </Grid>
            
        );
    });
}

export default YourMeetings;
