/* eslint-disable react/display-name */
import React from "react";
import axios from "axios";
import NumberFormat from 'react-number-format';

import {Menu, MenuItem, IconButton, Button, Box, CircularProgress, Paper} from '@material-ui/core';
import MaterialTable, { MTableToolbar, MTableActions } from "material-table";

import moment from 'moment';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import InvoiceTable from "./InvoiceComponents/InvoiceTable";
import UploadInvoiceDialog from "./InvoiceComponents/UploadInvoiceDialog";

export default function Invoices(props) {
    const [invoices, setInvoices] = React.useState([]);

    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        console.log(props);

        axios.get(`http://192.168.1.125:6969/getInvoicesForProject?projectId=${props.id}`).then(res => {
            res.data.forEach(invoice => {
                setInvoices(oldInvoices => [...oldInvoices, {
                    id: invoice.id,
                    title: invoice.name,
                    cost: (<NumberFormat value={invoice.cost} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} prefix={'£'} />),
                    date: moment(invoice.date).format("DD/MM/YYYY"),
                    origFile: invoice.origFileName,
                    storedFile: invoice.storedFileName
                }]);
            });

            setLoading(false);
        });
    }, []);

    return (
        <React.Fragment>
            {loading ? <Loader/> : <InvoiceTable invoices={invoices} id={props.id}/>}
        </React.Fragment>
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