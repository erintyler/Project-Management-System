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
    const [invoices, setInvoices] = React.useState([["Title", "Cost"]]);

    const classes = useStyles();
    const theme = useTheme();

    React.useEffect(() => {
        axios.get(`http://192.168.1.125:6969/getInvoicesForProject?projectId=${props.id}`).then(res => {
            console.log(res);
            res.data.forEach(invoice => {
                 setInvoices(oldInvoices => [...oldInvoices, [invoice.name, invoice.cost]]);
            });
        });
    }, [props.id]);


    console.log(invoices);

    return(
        <Paper className={classes.chart}>
            <Chart
                chartType="ColumnChart"
                data={invoices}
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