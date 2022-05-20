import React from "react";
import {Avatar, List, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
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
                        key={member}
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
                                <Avatar>
                                    <ImageIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={member} />
                        </ListItem>
                    </List>
                );
            })
            : null}
    </div>)
}

export default GroupMembersList;