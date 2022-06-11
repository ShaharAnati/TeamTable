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
        textAlign: "center",
        overflowY: "auto",
    }}>
        {group
            ? group.members.map((member) => {
                return (
                    <List
                        key={member.username}
                        sx={{
                            width: "-webkit-fill-available",
                            maxWidth: 360,
                            bgcolor: "background.paper"
                        }}
                    >
                        <ListItem>
                            <ListItemAvatar>
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                                sx={{
                                    "& .MuiBadge-badge": {
                                      border: "2px solid white",
                                      width: "14px",
                                      height: "14px",
                                      borderRadius: "50%",
                                      backgroundColor: member.active
                                        ? "#44b700"
                                        : "#e86f6f",
                                    }
                                  }}
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