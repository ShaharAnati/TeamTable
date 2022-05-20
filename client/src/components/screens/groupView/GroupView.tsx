import React, {useEffect, useState} from "react";
import {Button, Container, Grid,} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {useParams} from "react-router";
import {Group} from "../../../../../server/models/Group";
import {Filters} from "src/types/Filters";
import GroupMembersList from "../../GroupMembersList/GroupMembersList";
import TagFilters from "../findRestaurants/TagFilters";
import DateTimeFilter from "../findRestaurants/DateTimeFilter";
import {AllRestaurants} from "../findRestaurants/restaurants/allRestaurants";
import "./GroupView.css";

const io = require("socket.io-client");
let socket;
//TODO: remove localhost
const connectionPort = "localhost:3000/";

const GroupView: React.FC = (): JSX.Element => {
    const {id} = useParams();
    const [group, setGroup] = useState<Group>(null);

    function initWebsocket() {
        socket = io(connectionPort);

        const curUser = sessionStorage.getItem("user_email");
        socket.emit("joinGroup", {user: curUser, groupId: id});

        socket.on("groupData", (data: Group) => {
            setGroup(data);
            console.log(data)
        });
    }

    const handleFiltersChange = (newFilters: Filters) => {
        const updatedGroup = {...group, filters: newFilters};
        setGroup(updatedGroup);
        socket.emit("filtersUpdate", updatedGroup);
    };

    useEffect(() => {
        initWebsocket();
    }, [connectionPort]);

    return (
        <Container maxWidth={"xl"} style={{marginTop: "1%"}}>
            <Grid container spacing={5}>
                <Grid item xs={4}>
                    <Button
                        variant="outlined"
                        size="medium"
                        color="inherit"
                        endIcon={<ContentCopyIcon/>}
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                        className="CopyToClipboardButton">
                        {window.location.href}
                        <span className="ContentCopyIcon">
              <ContentCopyIcon style={{backgroundColor: "white"}}/>
          </span>
                    </Button>
                    <GroupMembersList group={group}></GroupMembersList>
                    <div>
                        {group && (
                            <TagFilters
                                filters={group.filters || {}}
                                selectedTags={group.filters.tags}
                                onFiltersChange={handleFiltersChange}
                            />
                        )}
                    </div>
                </Grid>
                <Grid item xs={8}>
                    {group && (
                        <div>
                            <div style={{display: "flex", flexDirection: "row-reverse", marginRight: "2%"}}>
                            <DateTimeFilter filters={group.filters}
                                            onFiltersChange={handleFiltersChange}
                            />
                            </div>
                            <AllRestaurants filters={group.filters || {}}/>
                        </div>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default GroupView;
