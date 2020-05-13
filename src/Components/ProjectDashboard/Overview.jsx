import React from "react";
import axios from "axios";
import { Grid, Typography } from "@material-ui/core";

export default function Overview(props) {
    return (
        <Grid container spacing={4}>
            <Grid container item spacing={4} md={6}>
                <Grid item md={12} xs={12}>
                    <Typography variant="h4">Graph Panel</Typography>
                </Grid>
                <Grid item md={12} xs={12}>
                    <Typography variant="h4">Members Panel</Typography>
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