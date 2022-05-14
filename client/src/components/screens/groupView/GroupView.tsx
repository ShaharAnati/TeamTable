import React, {useEffect, useState} from 'react';
import {Button} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axios, {AxiosResponse} from "axios";
import {useParams} from "react-router";
import {Group} from "../../../../../server/models/Group";

const io = require("socket.io-client");
let socket;
//TODO: remove localhost
const connectionPort = 'localhost:3000/'

const GroupView: React.FC = (): JSX.Element => {

    const {id} = useParams();
    const [group, setGroup] = useState<Group>(null);

    function initWebsocket() {
        socket = io(connectionPort);
        socket.on('connected', () => {
            getGroup();
        })
        socket.on('updateClient', (data: Group) => {
            console.log("client new members: " + data.members);
        });
    }

    const getGroup = async (): Promise<void> => {
        const res: AxiosResponse<any> = await axios
            .get('http://localhost:3000/groups/get/' + id, {params: {id: id}});
        const group = res.data;
        const curUser = sessionStorage.getItem('user_email');
        socket.emit('joinGroup', id);
        if (!group.members.includes(curUser)) {
            group.members = [...group.members, curUser];
            setGroup(group);
            await axios.put('http://localhost:3000/groups/update/' + id, {params: {id: id}, group});
        }
    }

    useEffect(() => {
        initWebsocket();
    }, [connectionPort])

    useEffect(() => {
        /*getGroup();*/
    })

    return (
        <Button variant="outlined"
                size="medium"
                color="inherit"
                endIcon={<ContentCopyIcon/>}
                onClick={() => navigator.clipboard.writeText(window.location.href)}>
            {window.location.href}
        </Button>
    );
}

export default GroupView;
