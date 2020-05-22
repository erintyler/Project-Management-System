import React from "react";
import axios from "axios";

import {Box, CircularProgress, Paper, makeStyles, useTheme} from '@material-ui/core';

import {Chart} from 'react-google-charts';

const useStyles = makeStyles({
    chart: {
        marginTop: 32,
    }
});

export default function BudgetChart(props) {
    const classes = useStyles();
    const theme = useTheme();

    return(
        <Paper className={classes.chart}>
            <Chart
                chartType="BarChart"
                data={[["Age", "Weight"], [4, 5.5], [8, 12]]}
                loader={<ChartLoader/>}
                options={{
                    legend: "none",
                    colors: [theme.palette.primary.main],
                    backgroundColor: "#424242",
                    hAxis: {
                        textStyle:{color: "#fff"}
                    },
                    vAxis: {
                        textStyle: {color: "#fff"}
                    }
                }}
                width="100%"
                height="400px"
            />
        </Paper>
    );
}

function ChartLoader() {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="400px">
            <CircularProgress/>
        </Box>
    );
}