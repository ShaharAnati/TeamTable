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
        socket.on("connected", () => {
            getGroup();
        });
        socket.on("updateClient", (data: Group) => {
            console.log("client new members: " + data.members);
            setGroup(data);
        });
    }

    const getGroup = async (): Promise<void> => {
        const res: AxiosResponse<any> = await axios.get(
            "http://localhost:3000/groups/get/" + id,
            { params: { id: id } }
        );
        const curGroup = res.data;
        const curUser = sessionStorage.getItem("user_email");
        socket.emit("joinGroup", id);
        setGroup(curGroup);
        if (!curGroup.members.includes(curUser)) {
            curGroup.members = [...curGroup.members, curUser];
            setGroup(curGroup);
            await axios.put("http://localhost:3000/groups/update/" + id, {
                params: { id: id },
                group: curGroup,
            });
        }
    };

    const handleFiltersChange = (newFilters: Filters) => {
        const updatedGroup = { ...group, filters: newFilters }
        setGroup(updatedGroup);
        socket.emit("groupUpdate", updatedGroup);

        // TODO move this logic to server
        axios.put("http://localhost:3000/groups/update/" + id, {
            params: { id: id },
            group: updatedGroup,
        });
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
            {group &&
                <FindRestaurants
                    filters={group.filters || {}}
                    onFiltersChange={handleFiltersChange}
                />}
        </div>
    );
};

export default GroupView;
