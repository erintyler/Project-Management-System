/* eslint-disable react/display-name */
import React from "react";

import {Menu, MenuItem, IconButton, Button, Box, CircularProgress} from '@material-ui/core';
import MaterialTable, { MTableToolbar, MTableActions } from "material-table";

import MoreVertIcon from '@material-ui/icons/MoreVert';

export default function MeetingTable(props) {
    const [optionsAnchor, setOptionsAnchor] = React.useState(null);

    const handleOptionsClose = () => {
        setOptionsAnchor(null);
    }

    return (
        <div>
            <MaterialTable
                title="Meetings"
                columns={[
                    { title: "Name", field: "name"},
                    { title: "Description", field: "description"},
                    { title: "Date/Time", field: "date"}
                ]}
                data={props.meetings}
                actions={[
                    {
                        icon: MoreVertIcon,
                        tooltip: 'Options',
                        onClick: (event, rowData) => setOptionsAnchor(event.currentTarget)
                    },
                    {
                        icon: 'add',
                        tooltip: 'Options',
                        onClick: (event, rowData) => alert(`TODO: add`),
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