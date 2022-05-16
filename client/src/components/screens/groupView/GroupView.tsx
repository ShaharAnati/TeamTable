import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import axios, { AxiosResponse } from "axios";
import { useParams } from "react-router";
import { Group } from "../../../../../server/models/Group";
import ImageIcon from "@mui/icons-material/Image";
import { FindRestaurants } from "../findRestaurants/FindRestaurans";
import { Filters } from "src/types/Filters";

const io = require("socket.io-client");
let socket;
//TODO: remove localhost
const connectionPort = "localhost:3000/";

const GroupView: React.FC = (): JSX.Element => {
  const { id } = useParams();
  const [group, setGroup] = useState<Group>(null);

  function initWebsocket() {
    socket = io(connectionPort);

    const curUser = sessionStorage.getItem("user_email");
    socket.emit("joinGroup", { user: curUser, groupId: id });

    socket.on("groupData", (data: Group) => {
      setGroup(data);
    });
  }

  const handleFiltersChange = (newFilters: Filters) => {
    const updatedGroup = { ...group, filters: newFilters };
    setGroup(updatedGroup);
    socket.emit("filtersUpdate", updatedGroup);
  };

  useEffect(() => {
    initWebsocket();
  }, [connectionPort]);

  return (
    <div>
      <Button
        variant="outlined"
        size="medium"
        color="inherit"
        endIcon={<ContentCopyIcon />}
        onClick={() => navigator.clipboard.writeText(window.location.href)}
      >
        {window.location.href}
      </Button>
      {group
        ? group.members.map((member) => {
            return (
              <List
                key={member}
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
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
      {group && (
        <FindRestaurants
          filters={group.filters || {}}
          onFiltersChange={handleFiltersChange}
        />
      )}
    </div>
  );
};

export default GroupView;
