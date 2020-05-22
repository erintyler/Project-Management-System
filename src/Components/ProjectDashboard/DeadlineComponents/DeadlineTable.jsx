/* eslint-disable react/display-name */
import React from "react";
import moment from 'moment';

import {Menu, MenuItem, IconButton, Button, Box, CircularProgress} from '@material-ui/core';
import MaterialTable, { MTableToolbar, MTableActions } from "material-table";

import {useSnackbar} from 'notistack';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import AddDeadlineDialog from "./AddDeadlineDialog";
import EditDeadlineDialog from "./EditDeadlineDialog";
import DeleteDeadlineDialog from "./DeleteDeadlineDialog";

export default function DeadlineTable(props) {
    const [openAdd, setOpenAdd] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);

    const [optionsAnchor, setOptionsAnchor] = React.useState(null);

    const [deadlines, setDeadlines] = React.useState(props.deadlines);
    const [selectedDeadline, setSelectedDeadline] = React.useState(null);

    const { enqueueSnackbar } = useSnackbar();

    const handleOptionsOpen = (target, rowData) => {
        setSelectedDeadline(rowData);
        setOptionsAnchor(target);
    }

    const handleOptionsClose = (event) => {
        if(event.target.id === "edit") {
            setOpenEdit(true);
        } else if(event.target.id === "delete") {
            setOpenDelete(true);
        }

        setOptionsAnchor(null);
    }

    const handleAddOpen = () => {
        setOpenAdd(true);
    }

    const handleAddClose = (message, deadlines, error) => {
        if(message !== undefined) {
            if(!error) {
                setOpenAdd(false);

                if(deadlines !== undefined) {
                    setDeadlines(oldDeadlines => [...oldDeadlines, deadlines]);
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

                var oldDeadlines = deadlines;
                var index = oldDeadlines.indexOf(selectedDeadline);
    
                console.log(newDeadline);
    
                oldDeadlines.splice(index, 1);
                oldDeadlines.push(newDeadline);
    
                setDeadlines(oldDeadlines);
                setSelectedDeadline(null);
            }
            enqueueSnackbar(message, {variant : (error ? 'error' : 'success')});
        } else {
            setOpenEdit(false);
        }
    }

    const handleDeleteClose = (message, error) => {
        if(message !== undefined) {
            if(!error) {
                var oldDeadlines = deadlines;
                var index = oldDeadlines.indexOf(selectedDeadline);

                oldDeadlines.splice(index, 1);

                setDeadlines(oldDeadlines);
            }
            enqueueSnackbar(message, {variant : (error ? 'error' : 'success')});
        }

        setOpenDelete(false);
        setSelectedDeadline(null);
    }

    const sortDate = (a, b) => {
        const date1 = moment(a.date, "DD/MM/YYYY [at] HH:mm:ss");
        const date2 = moment(b.date, "DD/MM/YYYY [at] HH:mm:ss");

        return date1 - date2;
    }  

    return (
        <div>
            <AddDeadlineDialog open={openAdd} onClose={handleAddClose} id={props.id}/>
            <EditDeadlineDialog open={openEdit} onClose={handleEditClose} deadline={selectedDeadline}/>
            <DeleteDeadlineDialog open={openDelete} onClose={handleDeleteClose} deadline={selectedDeadline}/>

            <MaterialTable
                title="Deadlines"
                columns={[
                    { title: "Title", field: "title"},
                    { title: "Description", field: "description"},
                    { title: "Date/Time", field: "date", defaultSort: "asc", customSort: (a, b) => sortDate(a, b)}
                ]}
                data={deadlines}
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
                <MenuItem id="edit" onClick={handleOptionsClose}>Edit</MenuItem>
                <MenuItem id="delete" onClick={handleOptionsClose}>Delete</MenuItem>
            </Menu>
        </div>   
    )
}