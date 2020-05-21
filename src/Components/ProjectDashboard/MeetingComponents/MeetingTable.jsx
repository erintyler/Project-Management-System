/* eslint-disable react/display-name */
import React from "react";
import moment from 'moment';

import {Menu, MenuItem, IconButton, Button, Box, CircularProgress} from '@material-ui/core';
import MaterialTable, { MTableToolbar, MTableActions } from "material-table";

import {useSnackbar} from 'notistack';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import AddMeetingDialog from "./AddMeetingDialog";
import EditMeetingDialog from "./EditMeetingDialog";
import DeleteMeetingDialog from "./DeleteMeetingDialog";

export default function MeetingTable(props) {
    const [openAdd, setOpenAdd] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);

    const [optionsAnchor, setOptionsAnchor] = React.useState(null);

    const [meetings, setMeetings] = React.useState(props.meetings);
    const [selectedMeeting, setSelectedMeeting] = React.useState(null);

    const { enqueueSnackbar } = useSnackbar();

    const handleOptionsOpen = (target, rowData) => {
        setSelectedMeeting(rowData);
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

    const handleAddClose = (message, meetings, error) => {
        if(message !== undefined) {
            if(!error) {
                setOpenAdd(false);

                if(meetings !== undefined) {
                    setMeetings(oldMeetings => [...oldMeetings, meetings]);
                }
            }

            enqueueSnackbar(message, {variant : (error ? 'error' : 'success')});
        }
    }

    const handleEditClose = (message, newMeeting, error) => {
        if(message !== undefined) {
            if(!error) {
                setOpenEdit(false);

                var oldMeetings = meetings;
                var index = oldMeetings.indexOf(selectedMeeting);
    
                console.log(newMeeting);
    
                oldMeetings.splice(index, 1);
                oldMeetings.push(newMeeting);
    
                setMeetings(oldMeetings);
                setSelectedMeeting(null);
            }
            enqueueSnackbar(message, {variant : (error ? 'error' : 'success')});
        } else {
            setOpenEdit(false);
        }
    }

    const handleDeleteClose = (message, meeting, error) => {
        if(message !== undefined) {
            if(!error) {
                setOpenDelete(false);

                var oldMeetings = meetings;
                var index = oldMeetings.indexOf(selectedMeeting);

                oldMeetings.splice(index, 1);

                setMeetings(oldMeetings);
                setSelectedMeeting(null);
            }
            enqueueSnackbar(message, {variant : (error ? 'error' : 'success')});
        }
    }

    const sortDate = (a, b) => {
        const date1 = moment(a.date, "DD/MM/YYYY [at] HH:mm:ss");
        const date2 = moment(b.date, "DD/MM/YYYY [at] HH:mm:ss");

        return date1 - date2;
    }  

    return (
        <div>
            <AddMeetingDialog open={openAdd} onClose={handleAddClose} id={props.id}/>
            <EditMeetingDialog open={openEdit} onClose={handleEditClose} meeting={selectedMeeting}/>
            <DeleteMeetingDialog open={openDelete} onClose={handleDeleteClose} meeting={selectedMeeting}/>

            <MaterialTable
                title="Meetings"
                columns={[
                    { title: "Title", field: "title"},
                    { title: "Description", field: "description"},
                    { title: "Date/Time", field: "date", defaultSort: "asc", customSort: (a, b) => sortDate(a, b)}
                ]}
                data={meetings}
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