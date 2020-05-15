import React from "react";
import axios from "axios";

import {Avatar, ListItemAvatar, ListItem, ListItemText} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';

export default function MembersList(props) {
    const [members, setMembers] = React.useState([]);

    React.useEffect(() => {
        axios.get(`http://192.168.1.125:6969/getProjectUsers?projectId=${props.id}`).then(res => {
            setMembers(res.data.User);
            console.log(res);
        })
    }, [props]);

    if(members !== undefined) {
        return members.map((member) => {
            return (
                <ListItem key={member.email} button>
                    <ListItemAvatar>
                        <Avatar>
                            <PersonIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={`${member.firstName} ${member.lastName}`} />
                </ListItem>
            )
        })
    } else {
        return (
            <ListItem>
                <ListItemText primary="no found" />
            </ListItem>
        )
    }


}