import React from "react";
import {Avatar, Badge, List, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import {Group} from "../../../../server/models/Group";

interface GroupMembersListProps {
    group: Group;
}

const GroupMembersList: React.FC<GroupMembersListProps> = (props): JSX.Element => {

    const { group } = props;

    return (<div style={{
        height: "45vh",
        textAlign: "center"
    }}>
        {group
            ? group.members.map((member) => {
                return (
                    <List
                        key={member.username}
                        sx={{
                            width: "-webkit-fill-available",
                            maxWidth: 360,
                            bgcolor: "background.paper",
                            height: "35vh",
                            overflowY: "auto"
                        }}
                    >
                        <ListItem>
                            <ListItemAvatar>
                            <Badge
                                color={member.active? 'success' : 'error'}
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                            >
                                <Avatar>
                                    <ImageIcon />
                                </Avatar>
                            </Badge>
                            </ListItemAvatar>
                            <ListItemText primary={member.username} />
                        </ListItem>
                    </List>
                );
            })
            : null}
    </div>)
}

export default GroupMembersList;