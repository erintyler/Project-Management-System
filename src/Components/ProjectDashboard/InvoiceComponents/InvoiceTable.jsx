/* eslint-disable react/display-name */
import React from "react";
import moment from 'moment';
import axios from "axios";
import {saveAs} from 'file-saver';

import {Menu, MenuItem, IconButton, Button, Box, CircularProgress} from '@material-ui/core';
import MaterialTable, { MTableToolbar, MTableActions } from "material-table";

import {useSnackbar} from 'notistack';

import MoreVertIcon from '@material-ui/icons/MoreVert';

//import EditDeadlineDialog from "./EditDeadlineDialog";
//import DeleteDeadlineDialog from "./DeleteDeadlineDialog";
import UploadInvoiceDialog from "./UploadInvoiceDialog";

export default function InvoiceTable(props) {
    const [openAdd, setOpenAdd] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);

    const [optionsAnchor, setOptionsAnchor] = React.useState(null);

    const [invoices, setInvoices] = React.useState(props.invoices);
    const [selectedInvoice, setSelectedInvoice] = React.useState(null);

    const { enqueueSnackbar } = useSnackbar();

    const getFile = () => {
        axios.get(`http://192.168.1.125:6969/getInvoiceFile/${selectedInvoice.id}`, {responseType: 'blob'}).then(res => {
            saveAs(res.data, selectedInvoice.origFile);
        })
    }

    const handleOptionsOpen = (target, rowData) => {
        setSelectedInvoice(rowData);
        setOptionsAnchor(target);
    }

    const handleOptionsClose = (event) => {
        if(event.target.id === "edit") {
            setOpenEdit(true);
        } else if(event.target.id === "delete") {
            setOpenDelete(true);
        } else if(event.target.id === "download") {
            getFile();
        }

        setOptionsAnchor(null);
    }

    const handleAddOpen = () => {
        setOpenAdd(true);
    }

    const handleAddClose = (message, invoice, error) => {
        if(message !== undefined) {
            if(!error) {
                setOpenAdd(false);

                if(invoice !== undefined) {
                    setInvoices(oldInvoices => [...oldInvoices, invoice]);
                }
            }
            enqueueSnackbar(message, {variant : (error ? 'error' : 'success')});
        } else {
            setOpenAdd(false);
        }
    }

    const handleEditClose = (message, newDeadline, error) => {
        if(message !== undefined) {
            if(!error) {
                setOpenEdit(false);

                var oldDeadlines = invoices;
                var index = oldDeadlines.indexOf(selectedInvoice);
    
                console.log(newDeadline);
    
                oldDeadlines.splice(index, 1);
                oldDeadlines.push(newDeadline);
    
                setInvoices(oldDeadlines);
                setSelectedInvoice(null);
            }
            enqueueSnackbar(message, {variant : (error ? 'error' : 'success')});
        } else {
            setOpenEdit(false);
        }
    }

    const handleDeleteClose = (message, error) => {
        if(message !== undefined) {
            if(!error) {
                var oldDeadlines = invoices;
                var index = oldDeadlines.indexOf(selectedInvoice);

                oldDeadlines.splice(index, 1);

                setInvoices(oldDeadlines);
            }
            enqueueSnackbar(message, {variant : (error ? 'error' : 'success')});
        }

        setOpenDelete(false);
        setSelectedInvoice(null);
    }

    const sortDate = (a, b) => {
        const date1 = moment(a.date, "DD/MM/YYYY [at] HH:mm:ss");
        const date2 = moment(b.date, "DD/MM/YYYY [at] HH:mm:ss");

        return date1 - date2;
    }  

    return (
        <div>
            <UploadInvoiceDialog open={openAdd} onClose={handleAddClose} id={props.id}/>

            <MaterialTable
                title="Invoices"
                columns={[
                    { title: "Title", field: "title"},
                    { title: "Invoice Amount", field: "cost"},
                    { title: "Date", field: "date", defaultSort: "asc", customSort: (a, b) => sortDate(a, b)},
                    { title: "Original File", field: "origFile"},
                    { title: "Stored File", field: "storedFile"},
                ]}
                data={invoices}
                actions={[
                    {
                        icon: MoreVertIcon,
                        tooltip: 'Options',
                        onClick: (event, rowData) => handleOptionsOpen(event.currentTarget, rowData)
                    },
                    {
                        icon: 'add',
                        tooltip: 'Options',
                        onClick: (event, rowData) => handleAddOpen(),
                        isFreeAction: true
                    }
                ]}
                options={{
                    actionsColumnIndex: -1,
                    pageSize: 10,
                    thirdSortClick: false,
                }}
            />

            <Menu id="accountMenu" anchorOrigin={{vertical: 'top', horizontal: 'left'}} anchorEl={optionsAnchor} keepMounted open={Boolean(optionsAnchor)} onClose={handleOptionsClose}>
                <MenuItem id="download" onClick={handleOptionsClose}>Download Invoice</MenuItem>
                <MenuItem id="edit" onClick={handleOptionsClose}>Edit</MenuItem>
                <MenuItem id="delete" onClick={handleOptionsClose}>Delete</MenuItem>
            </Menu>
        </div>   
    )
}