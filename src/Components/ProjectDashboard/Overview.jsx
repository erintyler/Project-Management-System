import React from "react";
import axios from "axios";
import { List, Grid, Typography } from "@material-ui/core";

import BudgetChart from './OverviewComponents/BudgetChart';
import MembersList from './OverviewComponents/MembersList';
import DeadlineList from './OverviewComponents/DeadlineList';
import MeetingList from "./OverviewComponents/MeetingList";

export default function Overview(props) {

    return (
        <Grid container spacing={4}>
            <Grid container item spacing={4} md={6}>
                <Grid item sm={12} xs={12}>
                    <Typography variant="h4">Graph Panel</Typography>
                    <BudgetChart/>
                </Grid>
                <Grid item sm={12} xs={12}>
                    <Typography variant="h4">Members Panel</Typography>
                    <List>
                        <MembersList id={props.id}/>
                    </List>
                </Grid>
            </Grid>
            <Grid container item spacing={4} md={6}>
                <Grid item md={12} xs={12}>
                    <Typography variant="h4">Upcoming Deadlines</Typography>
                    <DeadlineList id={props.id}/>
                </Grid>
                <Grid item md={12} xs={12}>
                    <Typography variant="h4">Upcoming Meetings</Typography>
                    <MeetingList id={props.id}/>
                </Grid>
            </Grid>
        </Grid>
    )
}