import React from "react";
import {Avatar, Badge, List, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";

import ImageIcon from "@mui/icons-material/Image";
import {Group} from "../../../../server/models/Group";

interface GroupMembersListProps {
    group: Group;
}

const GroupMembersList: React.FC<GroupMembersListProps> = (props): JSX.Element => {

    const { group } = props;

    return (
    <div style={{
        textAlign: "center",
        overflowY: "auto",
        margin: "10px 0",
        backgroundColor: "white",
        height: '35vh',
        minHeight: '240px',
        maxHeight: '300px',
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        paddingBottom: '30px'
    }}>
        <Typography color="inherit"
                    style={{ 
                        fontSize: "1.2rem", 
                        paddingTop: "8px",
                        fontWeight: 500}}>
            Table Members
        </Typography>
        <Divider variant={"middle"} />
        <div style={{
                overflow: 'scroll',
                height: '-webkit-fill-available',
            }}
        >
            {
            group
                ? group.members.sort((a,b) => +b.active - +a.active )
                .map((member) => {
                    return (
                        <List
                            key={member.username}
                            sx={{
                                width: "-webkit-fill-available",
                                maxWidth: 360,
                                bgcolor: "background.paper",
                                paddingBottom: 0,
                                paddingTop: 0
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
                                <ListItemText 
                                    primary={member.username} 
                                    secondary={
                                        group.creator === member.username &&  
                                        <Chip 
                                            sx={{
                                                fontSize: '0.7rem',
                                                height: '16px'
                                            }}
                                            label="admin" 
                                            variant="outlined" 
                                            size="small" 
                                        />
                                    } 
                                />
                            </ListItem>
                        </List>
                    );
                })
                : null
            }
        </div>
    </div>
    )
}

export default GroupMembersList;