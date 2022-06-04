import {
  Tooltip,
  AvatarGroup,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Box,
  Badge,
} from "@mui/material";
import React from "react";
import { colors } from "src/helpers/member-colors";

type Props = {
  members?: {
    username: string;
    active: boolean;
  }[];
  max?: number;
};

function Participants({ members, max = 5 }: Props) {
  const fullList = (
    <List dense>
      {members?.map((member, i) => (
        <ListItem key={member.username} disableGutters>
          <ListItemAvatar>
            <Avatar
              sx={{
                bgcolor: colors[i],
                width: 28,
                height: 28,
                fontSize: "14px",
              }}
            >
              {member.username.substring(0, 2).toLocaleUpperCase()}
            </Avatar>
          </ListItemAvatar>
          <ListItemText>{member.username}</ListItemText>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box>
      <Tooltip
        title={fullList}
        placement="bottom-start"
        sx={{
          "&.MuiTooltip-tooltip": {
            backgroundColor: "white",
            color: "rgba(0, 0, 0, 0.87)",
          },
        }}
      >
        <AvatarGroup max={max}>
          {members?.map((member, i) => {
            return (
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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
                <Avatar sx={{ bgcolor: colors[i] }}>
                  {member.username.substring(0, 2).toLocaleUpperCase()}
                </Avatar>
              </Badge>
            );
          })}
        </AvatarGroup>
      </Tooltip>
    </Box>
  );
}

export default Participants;
