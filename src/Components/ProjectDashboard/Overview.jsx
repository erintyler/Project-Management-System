import React from "react";
import axios from "axios";
import { List, Grid, Typography, CircularProgress, Box } from "@material-ui/core";

import {Chart} from 'react-google-charts';

import MembersList from './OverviewComponents/MembersList';

export default function Overview(props) {
    return (
        <Grid container spacing={4}>
            <Grid container item spacing={4} md={6}>
                <Grid item sm={12} xs={12}>
                    <Typography variant="h4">Graph Panel</Typography>
                    <div className={"my-pretty-chart-container"}>
                        <Chart
                        chartType="BarChart"
                        data={[["Age", "Weight"], [4, 5.5], [8, 12]]}
                        loader={<ChartLoader/>}
                        options={{legend: "none"}}
                        width="100%"
                        height="400px"
                        legendToggle
                        />
                    </div>
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
                </Grid>
                <Grid item md={12} xs={12}>
                    <Typography variant="h4">Upcoming Meetings</Typography>
                </Grid>
            </Grid>
        </Grid>
    )
}

function ChartLoader() {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="400px">
            <CircularProgress/>
        </Box>
    );
}